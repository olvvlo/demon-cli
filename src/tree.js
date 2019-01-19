const fs = require('fs')
const chalk = require('chalk')
const {
  ignoreToArray
} = require('./utils')
const defaultIgnores = [
  '/node_modules',
  '/dist',
  '.git',
  '.idea',
  '.vscode',
  '.DS_Store',
  '/build'
]
const defaultCharSet = {
  'node': '├── ',
  'pipe': '│   ',
  'last': '└── ',
  'indent': '    '
}

class DirectoryTree {
  constructor(path, charSet) {
    this.path = path
    this.charSet = charSet || defaultCharSet
    this.ignores = ignoreToArray(this.path) || defaultIgnores
    this.result = []
    this.export = false
    this.temp = ''
  }

  render(filename, level) {
    const color = (text) => {
      if (this.export) return text
      return level % 2 ? chalk.yellow(text) : chalk.red(text)
    }
    if (level === 1) return color(this.charSet.node + filename)
    const indents = Array(level - 1).fill().join(this.charSet.indent)
    return (this.export ? this.charSet.pipe : chalk.yellow(this.charSet.pipe)) + indents + color(this.charSet.last + filename)
  }

  sort(path, array) {
    let files = []
    let dirs = []
    array.forEach((filename) => {
      const stats = fs.statSync(path + '/' + filename)
      if (this.ignores.includes(filename)) return
      if (stats.isFile()) {
        files.push(filename)
        return
      }
      if (this.ignores.includes('/' + filename)) return
      dirs.push(filename)
    })
    return dirs.concat(files)
  }

  drawJson(path, level = 1) {
    const files = this.sort(path, fs.readdirSync(path))
    files.forEach((filename) => {
      const stats = fs.statSync(path + '/' + filename)
      if (stats.isFile()) {
        this.result.push(this.render(filename, level))
        return
      }
      this.result.push(this.render(filename, level))
      this.drawJson(path + '/' + filename, level + 1)
    })
  }

  drawTemp() {
    this.drawJson(this.path)
    this.temp = this.result.join('\n') + '\n'
  }

  drawTree() {
    this.drawTemp()
    return this.temp
  }

  exportTree(fileName, filePath) {
    this.export = true
    this.drawTemp()
    fs.writeFile(`${filePath}/${fileName}.md`, this.temp, function (error) {
      if (error) throw error
    })
  }

}

module.exports = DirectoryTree
