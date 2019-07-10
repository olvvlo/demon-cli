# demon-cli

A commandline tool to generate project directory structure tree

### Install

```
npm install demon-cli -g
```

### Features

```js
├── src
│   └── index.js
│   └── utils.js
├── .gitignore
├── README.md
├── demon.md
├── package.json
```

### Usage

```js
Usage: demon [options]

A commandline tool to generate project directory structure tree

Options:
  -v, --version            output the version number
  -p, --print              print a directory tree in console
  -e, --export [fileName]  export a [fileName].md
  -h, --help               output usage information
```

### Ignore

If you want to ignore some files, you can add `.gitignore` file into the root project directory.

### License
MIT
