#!/usr/bin/env node
const package = require('../package.json')
const program = require('commander')
const {
  drawTree,
  exportTree
} = require('./utils')
const path = process.cwd()

program
  .version(package.version || '1.0.0', '-v, --version')
  .description('A commandline tool to generate project directory structure tree')
  .option('-p, --print', 'Print a directory tree in console')
  .option('-e, --export [fileName]', 'Export a [fileName].md')
  .parse(process.argv)

if (program.print) {
  console.log(drawTree(path))
}

if (program.export) {
  exportTree(drawTree(path), program.export = 'demon', path)
}
