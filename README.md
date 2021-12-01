# meta-signature-util

This project is to provide Meta Network with the Authorization Utilities.

## Installation

Using [NPM.js](https://www.npmjs.com/package/@metaio/meta-signature-util):

```bash
npm install @metaio/meta-signature-util
```

Using [Yarn](https://yarnpkg.com/en/package/@metaio/meta-signature-util):

```bash
yarn add @metaio/meta-signature-util
```



## Usage

Import the modules from the `@metaio/meta-signature-util` library, and use the `generate()` method to generate metadata with a signature and the `verify()` method to validate. TypeScript is supported.

```typescript
// import functions and modules
import { generateSeed, generateKeys, authorDigestSign } from '@metaio/meta-signature-util';

// generate keys and signature metadata
const seed = generateSeed();
const testKeys = generateKeys(seed)
const metadata = authorDigestSign.generate(
  testKeys,
  'server_domain',
  'the_digest',
);

// verify the signature
console.log(authorDigestSign.verify(metadata));
```

Please [check our documentation](https://meta-signature-util.vercel.app/) to learn more about the modules.

## Contributing

We welcome any PR or issue. Thank you for contributing to this project!

### Add a new module

To add a new module, please clone [this repository from GitHub](https://github.com/Meta-Network/meta-signature-util), and copy a module from the `src/modules` directory.

Implement your `generate` and `verify` functions, and add the module to the `modules` dictionary. Remember the directory name should be the same as the type name in your metadata.

Then write a test for your module. And update the version in the `package.json` file.

### Add a test case

We're using [Jest](https://jestjs.io/) for testing. Please add your test file to the `test` directory. Name your test file the same as the module, like `meta-network-grids-server-sign.test.ts`.

Make sure all the tests pass before you commit.

## Motivation

![web2_step1](https://user-images.githubusercontent.com/68253563/140607346-f720a48b-9611-43b0-8d11-1073b7cab531.png)
![web2_step2](https://user-images.githubusercontent.com/68253563/140607347-e8c62bd2-105f-41a0-bba4-c7a9a8dd8804.png)
![we are doing](https://user-images.githubusercontent.com/68253563/140607345-c73bce68-9d2c-412d-ae1b-f2d0a2c19dcd.png)

We provide the signature tools needed for the steps in the figure.

