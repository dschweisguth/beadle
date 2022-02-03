# beadle
Helps you beat Wordle.

## Install
```
> git clone https://github.com/dschweisguth/beadle
> nvm install
> npm install -g yarn
> yarn
> echo DEFAULT_WORD_LIST=(path to a word list of your choice) > .env
> npm install -g # or just symlink bin/index.mjs to 'beadle' in your PATH
```

## Run
```
> beadle --help
Usage: beadle [option]... [compound-fact]...

Options
--help                  Print this help instead of running normally
--interactive           Repeatedly prompt for more (compound) facts 
--no-discount-final-s   Don't compensate crudely for the overrepresentation, in
                          typical word lists, of words ending in S  
--no-suggest-words      Don't suggest words

A compound fact is a concatenation of one or more facts.
A fact is one of
· [+]x  = the letter is in the word
          (Wordle never says this, but it's useful for experimenting)
· -x    = the letter is not in the word
· [+]#x = the letter is at position #
· -#x   = the letter is not at position # (but is in the word)
where x is a letter (in either case) and # is a digit from 1 to 5.
```
