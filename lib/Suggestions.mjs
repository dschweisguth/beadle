import * as __ from './collections.mjs'
import { LETTERS_IN_WORD } from './Facts.mjs'
import DEFAULT_STARTING_WORDS from './defaultStartingWords.mjs'

export default class Suggestions {
  #args
  #facts
  #startingWords

  constructor(args, facts) {
    this.#args = args
    this.#facts = facts
    this.#startingWords = DEFAULT_STARTING_WORDS
  }

  print() {
    this.#printKnown()
    const words = this.#words()
    this.#printList('Letters', this.#availableLetters(words))
    this.#printList('Digraphs', this.#availableDigraphs(words))
    if (this.#args.suggestWords) {
      this.#printList('Words', this.#sortedByLetterFrequency(words))
    }
  }

  // TODO if there are as many used + available letters as unknown spaces,
  //   show them in the unknown spaces, e.g. 'beadle -2r-4t-oae -1s-3i-4r5t'
  // TODO if a letter is used and can only be in one space, show it as such
  #printKnown() {
    let line = 'Known:    '
    line += __.arrayOf(LETTERS_IN_WORD, i => {
      if (this.#facts.knownLetters[i] !== null) {
        return this.#facts.knownLetters[i]
      } else if (this.#facts.knownNonLetters[i].size > 0) {
        const letters = Array.from(this.#facts.knownNonLetters[i])
        return `(${letters.sort().join('').toLowerCase()})`
      } else {
        return '?'
      }
    }).join('')
    if (this.#facts.usedLetters.size > 0) {
      line += "; "
      if (this.#facts.knownLetters.some(letter => letter !== null)) {
        line += "also "
      }
      line += "has " + Array.from(this.#facts.usedLetters).join(', ')
    }
    if (this.#facts.unusedLetters.size > 0) {
      line +=
        "; doesn't have " + Array.from(this.#facts.unusedLetters).join(', ')
    }
    console.log(line)
  }

  #words() {
    const regexpString = __.arrayOf(LETTERS_IN_WORD, i => {
      if (this.#facts.knownLetters[i] !== null) {
        return this.#facts.knownLetters[i]
      } else if (this.#facts.knownNonLetters[i].size > 0) {
        return `[^${Array.from(this.#facts.knownNonLetters[i]).join('')}]`
      } else {
        return '.'
      }
    }).join('')
    const regexp = new RegExp(regexpString)
    const usedLetters = Array.from(this.#facts.usedLetters)
    const unusedLetters = Array.from(this.#facts.unusedLetters)
    return this.#startingWords.filter(word =>
      regexp.test(word) &&
      usedLetters.every(letter => word.includes(letter)) &&
      unusedLetters.every(letter => !word.includes(letter)))
  }

  #availableLetters(words) {
    return this.#sortedByValue(this.#letterCounts(words)).
      filter(letter => !this.#facts.knownLetters.includes(letter) &&
        !this.#facts.usedLetters.has(letter))
  }

  #letterCounts(words) {
    const counts = new Map()
    words.forEach(word => {
      for (const letter of word) {
        this.#incrementValue(counts, letter)
      }
    })
    let sCount = counts.get('S')
    if (sCount !== undefined && sCount > 0) {
      counts.set('S', this.#discount(sCount))
    }
    return counts
  }

  #availableDigraphs(words) {
    const counts = new Map()
    words.forEach(word => {
      for (let i = 0; i < word.length - 1; i++) {
        const digraph = word.substring(i, i + 2)
        this.#incrementValue(counts, digraph)
      }
    })
    for (const entry of counts.entries()) {
      let [digraph, count] = entry
      if (digraph.endsWith('S')) {
        counts.set(digraph, this.#discount(count))
      }
    }
    return this.#sortedByValue(counts)
  }

  #incrementValue(map, key) {
    map.set(key, (map.get(key) || 0) + 1)
  }

  #sortedByValue(map) {
    return Array.from(map).
      sort((a, b) => b[1] - a[1]).
      map(entry => entry[0])
  }

  #sortedByLetterFrequency(words) {
    const unknownIndexes = this.#facts.unknownIndexes()
    const unknownLetterCounts = __.arrayOf(LETTERS_IN_WORD, () => new Map())
    words.forEach(word => {
      unknownIndexes.forEach(
        i => this.#incrementValue(unknownLetterCounts[i], word[i]))
    })
    return words.
      map(word => {
        let frequency = 1
        const alreadyPresentLetters = new Set()
        unknownIndexes.forEach(i => {
          const letter = word[i]
          frequency *= alreadyPresentLetters.has(letter)
            ? 1
            : unknownLetterCounts[i].get(letter)
          if (i === 4 && letter === 'S') {
            frequency = this.#discount(frequency)
          }
          alreadyPresentLetters.add(letter)
        })
        return [word, frequency]
      }).
      sort((a, b) => b[1] - a[1]).
      map(([word, frequency]) => word)
  }

  #discount(frequency) {
    if (this.#args.discountFinalS) {
      frequency = Math.trunc((frequency + 3)/4)
    }
    return frequency
  }

  #printList(label, list) {
    const preambleLength = 10
    const colon = ':'
    const space = ' '
    const ellipsis = '…'
    const visibleElementCount =
      list.length > 0
        ? Math.trunc((80 - preambleLength - ellipsis.length) /
          (list[0].length + space.length))
        : 0
    console.log(
      label + colon +
      (' '.repeat(preambleLength - label.length - colon.length)) +
      list.slice(0, visibleElementCount).join(' ') +
      (list.length > visibleElementCount ? ellipsis : ''))
  }

}
