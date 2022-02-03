import 'dotenv/config'
import * as fs from 'fs'
import * as readline from 'readline'
import { LETTERS_IN_WORD } from './Facts.mjs'

const DEFAULT_STARTING_WORDS = await (async () => {
  const words = []
  const reader =
    readline.createInterface(
      fs.createReadStream(process.env.DEFAULT_WORD_LIST))
  for await (const word of reader) {
    if (word.length !== LETTERS_IN_WORD) {
      continue
    }
    words.push(word)
  }
  return words
})()
export default DEFAULT_STARTING_WORDS
