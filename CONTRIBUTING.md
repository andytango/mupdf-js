# Contributing to this project

## How to contribute

1. Fork this repository on GitHub
2. Create a named feature branch (like `add_component_x`)
3. Write your change
4. Write tests for your change
5. Run the tests, ensuring they all pass
6. Submit a Pull Request using GitHub

You should test your changes using both the test suite and manually
in a node and browser environment.

If your change extends or changes the public API, you should also update
the documentation.

# Building this package

## Prerequisites

- [Node.js](https://nodejs.org/en/) (>= 16.18.0)
- [yarn](https://yarnpkg.com/en/) (>= 1.22.19)
- [Docker](https://www.docker.com/) (>= 20.10.17)

## Build

You simply need to run the following npm script to build the package:

```bash
yarn build
```

This is a shorthand for the following commands:

```bash
yarn build:prep # downloads the MuPDF source code to the local tmp directory
yarn build:wasm # builds the WASM library using Docker and emscripten
yarn build:tsc # builds the TypeScript wrapper
yarn build:cp # copies the MuPDF type declarations to the dist folder
```

## Test

You can run the tests using the following npm script:

```bash
yarn test
```

Or you can run the tests in watch mode:

```bash
yarn test:watch
```
