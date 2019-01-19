const fs = require('fs')
 
function ignoreToArray (path) {
  const gitignore = path + '/.gitignore'
  try {
    fs.accessSync(gitignore, fs.constants.R_OK | fs.constants.W_OK)
    return fs.readFileSync(gitignore, 'utf-8').split('\n').filter(Boolean).filter((item) => (!/^#/g.test(item)))
  } catch (error) {
    
  }
}

module.exports = {
  ignoreToArray
}
