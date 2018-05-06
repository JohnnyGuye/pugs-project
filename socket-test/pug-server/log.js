let ANSI = Object.freeze({
  RESET: "\u001B[0m",
  RED: "\u001B[31m",
  GREEN: "\u001B[32m",
  CYAN: "\u001B[36m",
  YELLOW: "\u001B[33m",
  BLUE: "\u001B[34m",
  PURPLE: "\u001B[35m",
  WHITE: "\u001B[37m",
})

let log = (msg, color, hideDate) => {
  let m = ""
  if(!hideDate)
    m += `${color}${(new Date()).toLocaleString()} ${ANSI.RESET}`
  m += msg
  console.log(m)
}

module.exports = {

  ANSI: ANSI,

  log: (msg, hideDate) => {
    log(msg, ANSI.CYAN, hideDate)
  },

  good: (msg, hideDate) => {
    log(msg, ANSI.GREEN, hideDate)
  },

  warn: (msg, hideDate) => {
    log(msg, ANSI.YELLOW, hideDate)
  },

  err: (msg, hideDate) => {
    log(msg, ANSI.RED, hideDate)
  }

}
