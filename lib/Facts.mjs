import * as __ from './collections.mjs'
import Arguments from './Arguments.mjs'

export const LETTERS_IN_WORD = 5

export default class Facts {
  knownLetters = __.arrayOf(LETTERS_IN_WORD, null)
  knownNonLetters = __.arrayOf(LETTERS_IN_WORD, () => new Set())
  usedLetters = new Set()
  unusedLetters = new Set()

  parse(input) {
    const compounds = this.#compounds(input)
    if (compounds.length === 0) {
      console.log(`Can't understand '${input}'`)
      Arguments.printFactUsage(false)
      return
    }
    this.#interpret(compounds)
  }

  #compounds(input) {
    const n = LETTERS_IN_WORD
    const pattern = [
      '^[A-Z]+',                                    // used without +
      '(?:^|(?<=[A-Z]))\\+[A-Z]+',                  // used with +
      '(?:^|(?<=[A-Z]))-[A-Z]+',                    // unused
      `(?:^|(?<=[A-Z]))\\+?[1-${n}][A-Z](?![A-Z])`, // known
      `(?:^|(?<=[A-Z]))-[1-${n}][A-Z]+`             // unknown
    ].join('|')
    input = input.toUpperCase()
    if (!new RegExp(`^(?:${pattern})+$`).test(input)) {
      return []
    }
    const matches = input.matchAll(new RegExp(pattern, 'g'))
    return Array.from(matches).map(match => match[0])
  }

  #interpret(compounds) {
    compounds.forEach(fact => {
      let [verb, positionString, letters] =
        fact.match(/([+\-]?)(\d?)([A-Z]+)/).slice(1, 4)
      const position =
        positionString === '' ? null : Number(positionString) - 1
      letters = Array.from(letters)
      this.#_interpret(verb, position, letters)
    })
  }

  #_interpret(verb, position, letters) {
    if (verb === '' || verb === '+') {
      if (position === null) {
        this.#addAll(this.usedLetters, letters)
        this.#deleteAll(this.unusedLetters, letters)
      } else {
        this.knownLetters[position] = letters[0]
        this.knownNonLetters[position].delete(letters[0])
        this.#deleteAll(this.usedLetters, letters) // still true, but no longer helpful
        this.#deleteAll(this.unusedLetters, letters)
      }
    } else { // verb === '-'
      if (position === null) {
        this.#addAll(this.unusedLetters, letters)
        this.#removeFromKnownLetters(letters)
        this.#removeFromKnownNonLetters(letters) // still true, but no longer helpful
        this.#deleteAll(this.usedLetters, letters)
      } else {
        letters.forEach(letter => this.knownNonLetters[position].add(letter))
        this.knownLetters[position] = null
        this.#addAll(this.usedLetters, letters)
        this.#deleteAll(this.unusedLetters, letters)
      }
    }
  }

  #removeFromKnownLetters(letters) {
    letters.forEach(letter => {
      const index = this.knownLetters.indexOf(letter)
      if (index !== -1) {
        this.knownLetters[index] = null
      }
    })
  }

  #removeFromKnownNonLetters(letters) {
    letters.forEach(letter => {
      this.knownNonLetters.forEach(set => set.delete(letter))
    })
  }

  #addAll(set, elements) {
    elements.forEach(element => set.add(element))
  }

  #deleteAll(set, elements) {
    elements.forEach(element => set.delete(element))
  }

  unknownIndexes() {
    return __.arrayOf(LETTERS_IN_WORD, (i) => i).
      filter(i => this.knownLetters[i] === null).reverse()
  }

}
