# wait-ready [![npm](https://img.shields.io/npm/v/wait-ready.svg?style=flat-square)](https://www.npmjs.com/package/wait-ready) [![npm downloads](https://img.shields.io/npm/dm/wait-ready.svg)](https://www.npmjs.com/package/wait-ready) [![build status](https://travis-ci.org/rocwind/wait-ready.svg)](https://travis-ci.org/rocwind/wait-ready)


a promise based utility for perform actions after async tasks finished

## Install
`npm i --save wait-ready`

## Usage
```
// ES6 import
import { wait } from 'wait-ready'
// CommonJS require
const { wait } = require('wait-ready');

const { afterReady, setReady } = wait();
// wait for the ready status to perform some actions
afterReady().then(() => {
    // pending actions ...
})

// update ready status when and trigger the pending actions
setReady();
```

