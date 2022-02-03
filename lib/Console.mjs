import * as readline from 'readline'

export default class Console {
  #_reader = null

  get #reader() {
    if (this.#_reader == null) {
      this.#_reader = readline.createInterface(process.stdin, process.stdout)
      // Print a newline before exiting so the next line of terminal output
      // (typically a shell prompt) will be on its own line
      this.#_reader.on('close', () => console.log())
    }
    return this.#_reader
  }

  async input(reader) {
    return new Promise((resolve, reject) => {
      this.#reader.question('> ', input => resolve(input))
    })
  }

}
