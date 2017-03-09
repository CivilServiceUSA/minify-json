![Civil Services Logo](https://cdn.civil.services/common/github-logo.png "Civil Services Logo")

Minify JSON
===

 [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](https://raw.githubusercontent.com/CivilServiceUSA/minify-json/master/LICENSE) [![GitHub contributors](https://img.shields.io/github/contributors/CivilServiceUSA/minify-json.svg)](https://github.com/CivilServiceUSA/minify-json/graphs/contributors)

__Civil Services__ is a collection of tools that make it possible for citizens to be a part of what is happening in their Local, State & Federal Governments.


Install
---

```bash
npm install minify-json -g
```

Usage
---

__IMPORTANT:__  This tool will replace the contents of each file with a minified version of the files original contents.

#### Minify a single file:

```bash
minify-json /path/to/my-file.json
minify-json /path/to/my-map.geojson
```

#### Minify files in a directory:

```bash
minify-json /path/to/directory
```