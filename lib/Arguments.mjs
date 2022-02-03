export default class Arguments {
  interactive = false
  discountFinalS = true
  suggestWords = true

  constructor() {
    const processArgs = process.argv.slice(2, process.argv.length)
    while (processArgs.length > 0 && processArgs[0].startsWith('--')) {
      switch (processArgs[0]) {
        case '--help':
          this.#printUsageAndExit(0)
          break
        case '--interactive':
          this.interactive = true
          break
        case '--no-discount-final-s':
          this.discountFinalS = false
          break
        case '--no-suggest-words':
          this.suggestWords = false
          break
        default:
          console.error(`Can't understand argument ${processArgs[0]}`)
          this.#printUsageAndExit(1)
      }
      processArgs.shift()
    }
    this.compounds = processArgs
  }

  #printUsageAndExit(exitStatus) {
    const message = `
Usage: beadle [option]... [compound-fact]...

Options
--help                  Print this help instead of running normally
--interactive           Repeatedly prompt for more (compound) facts 
--no-discount-final-s   Don't compensate crudely for the overrepresentation, in
                          typical word lists, of words ending in S  
--no-suggest-words      Don't suggest words
`.trimStart()
    const asError = exitStatus !== 0
    Arguments.#print(message, asError)
    Arguments.printFactUsage(asError)
    process.exit(exitStatus)
  }

  static printFactUsage(asError) {
    const message = `
A compound fact is a concatenation of one or more facts.
A fact is one of
· [+]x  = the letter is in the word
          (Wordle never says this, but it's useful for experimenting)
· -x    = the letter is not in the word
· [+]#x = the letter is at position #
· -#x   = the letter is not at position # (but is in the word)
where x is a letter (in either case) and # is a digit from 1 to 5.
`.trim()
    this.#print(message, asError)
  }

  static #print(message, asError) {
    if (asError) {
      console.error(message)
    } else {
      console.log(message)
    }
  }

}
