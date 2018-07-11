# fuzzer

A (probably pointless) proof of concept to see if I can use the Typescript AST to see what it is that functions want, and then use it to property test them.

To try, clone the repo then run `yarn install` followed by `yarn start './'` to have it parse the current folder and start extracting function signatures etc.
