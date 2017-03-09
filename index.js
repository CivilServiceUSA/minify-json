#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var input = process.argv;
var data = input[2];
var Promise = require('bluebird')
var queue = [];

/**
 * Print Help
 */
var printUsage = function () {
  console.warn('Usages:');
  console.warn('minify-json /path/to/my-file.json');
  console.warn('minify-json /path/to/directory');
};

/**
 * Loop Through Directory of Files
 * @param currentDirPath
 * @param callback
 */
var walk = function(currentDirPath, callback) {
  fs.readdirSync(currentDirPath).forEach(function(name) {
    var filePath = path.join(currentDirPath, name);
    var stat = fs.statSync(filePath);
    if (stat.isFile()) {
      callback(filePath, stat);
    } else if (stat.isDirectory()) {
      walk(filePath, callback);
    }
  });
};

/**
 * Compress File
 * @param filename
 * @param resolve
 * @param reject
 */
var compress = function (filename, resolve, reject) {
  // Make sure this is a JSON file
  if (filename.substr(-8) === '.geojson' || filename.substr(-5) === '.json'){
    // Open file with UTF8 Encoding
    fs.readFile(filename, 'utf8', function (err, text) {
      if (err) {
        console.error('× [ERROR] unable to read ' + filename);
        console.error(err.message);
        reject();
        return;
      }

      // Parse JSON file
      var json = JSON.parse(text);

      // Check for Valid JSON Object
      if (typeof json === 'object') {
        // Convert JSON to String
        var minified = JSON.stringify(json);

        // Truncate JSON file
        fs.truncate(filename, 0, function() {

          // Overwrite JSON file
          fs.writeFile(filename, minified, function (err) {
            if (err) {
              console.error('✓ [ERROR] Unable to Save JSON ' + err);
              reject();
            } else {
              console.log('✓ Compressed: ' + filename);
              resolve();
            }
          });
        });
      } else {
        console.error('× [ERROR] Invalid JSON File');
        reject();
      }
    });
  } else {
    // Skip non JSON files
    console.warn('× [NOTICE] Skipping: ' + filename);
    resolve();
  }
};

/**
 * Minify JSON
 * @param data
 */
var minifyJSON = function (data) {
  if (data) {
    // get Stats on data
    var stats = fs.lstatSync(data);

    // Check if a directory was provided
    if (stats.isDirectory()) {
      walk(data, function(path){
        queue.push(function() {
          return new Promise(function(resolve, reject) {
            compress(path, resolve, reject);
          });
        });
      });

      Promise.each(queue, function(queue_item) {
        return queue_item();
      });
    } else {
      // only a single file was passed, so lets just compress it
      return new Promise(function(resolve, reject) {
        compress(data, resolve, reject);
      });
    }
  }
};

/**
 * Check if we have data & that it is either a file of directory
 */
if (data) {
  // Make sure provided data exists
  if (fs.existsSync(data)) {
    minifyJSON(data);
  } else {
    console.error('× [ERROR] Invalid Path Provided');
  }
} else {
  printUsage();
}

module.exports = minifyJSON;
