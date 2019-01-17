const fs = require('fs')
const defaultIgnores = [
  '/node_modules',
  '/dist',
  '.git',
  '.idea',
  '.vscode',
  '.DS_Store',
  '/build'
]
const charSet = {
  'node': '├── ',
  'pipe': '│   ',
  'last': '└── ',
  'indent': '    '
}
let ignores = []
let rootPath
let result = []

function render(filename, level) {
  if (level === 1) return charSet.node + filename
  const indents = Array(level - 1).fill().join(charSet.indent)
  return charSet.pipe + indents + charSet.last + filename
}

function ignoerHandler() {
  const gitignore = rootPath + '/.gitignore'
  try {
    fs.accessSync('etc/passwd', fs.constants.R_OK | fs.constants.W_OK);
    return fs.readFileSync(gitignore, 'utf-8').split('\n').filter(Boolean).filter((item) => (!/^#/g.test(item)))
  } catch (err) {
    return defaultIgnores
  }
}

function init(path) {
  rootPath = path
  ignores = ignoerHandler()
}

function sort(path, array) {
  let files = []
  let dirs = []
  array.forEach((filename) => {
    const stats = fs.statSync(path + '/' + filename)
    if (ignores.includes(filename)) return
    if (stats.isFile()) {
      files.push(filename)
      return
    }
    if (ignores.includes('/' + filename)) return
    dirs.push(filename)
  })
  return dirs.concat(files)
}

function drawJson(path, level = 1) {
  const files = sort(path, fs.readdirSync(path))
  files.forEach((filename) => {
    const stats = fs.statSync(path + '/' + filename)
    if (stats.isFile()) {
      result.push(render(filename, level))
      return
    }
    result.push(render(filename, level))
    drawJson(path + '/' + filename, level + 1)
  })
  return result.join('\n') + '\n'
}

function drawTree(path) {
  init(path)
  return drawJson(path, level = 1)
}

function exportTree(data, fileName, filePath) {
  init(filePath)
  fs.writeFile(`${filePath}/${fileName}.md`, data, function (error) {
    if (error) throw error
  })
}

module.exports = {
  drawTree,
  exportTree
}
