import Arguments from './Arguments.mjs'
import Facts from './Facts.mjs'
import Suggestions from './Suggestions.mjs'
import Console from './Console.mjs'

export default class Beadle {
  #args = new Arguments()
  #facts = new Facts()
  #suggestions = new Suggestions(this.#args, this.#facts)
  #console = new Console()

  async run() {
    this.#args.compounds.forEach(compound => this.#facts.parse(compound))
    this.#suggestions.print()
    if (this.#args.interactive) {
      while (true) {
        const input = await this.#console.input()
        this.#facts.parse(input)
        this.#suggestions.print()
      }
    }
  }

}
