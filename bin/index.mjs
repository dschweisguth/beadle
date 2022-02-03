#!/usr/bin/env node
import '../lib/chdirToProjectRoot.mjs'
import Beadle from '../lib/Beadle.mjs'
await new Beadle().run()
