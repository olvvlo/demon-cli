#!/usr/bin/env node

const package = require('../package.json')
const program = require('commander')
const chalk = require('chalk')
const slog = require('single-line-log').stdout
const DirectoryTree = require('./tree')
const path = process.cwd()
const tree = new DirectoryTree(path)

let flag = false
const now = Date.now()

function scanning() {
  if (flag) {
    console.log(chalk.green(`Scanning files finished , Time ${(Date.now() - now) / 1000} s\n`))
    return
  }
  slog(chalk.green(`Start scanning files: ${(Date.now() - now) / 1000} s\n\n`))
  setTimeout(function () {
    scanning()
  }, 1000)
}

program
  .version(package.version || '1.0.0', '-v, --version')
  .description('A commandline tool to generate project directory structure tree')
  .option('-p, --print', 'print a directory tree in console')
  .option('-e, --export [fileName]', 'export a [fileName].md')
  .parse(process.argv)

if (program.print) {
  scanning()
  ;(async function () {
    await console.log(tree.drawTree())
    flag = true
  })()
}

if (program.export) {
  scanning()
  ;(async function () {
    await tree.exportTree(program.export = 'demon', path)
    flag = true
  })()
}
