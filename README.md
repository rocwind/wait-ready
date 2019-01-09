# wait-ready [![npm](https://img.shields.io/npm/v/wait-ready.svg?style=flat-square)](https://www.npmjs.com/package/wait-ready) [![npm downloads](https://img.shields.io/npm/dm/wait-ready.svg)](https://www.npmjs.com/package/wait-ready)

a utility for executing actions after some async tasks complete

## Install
`npm i --save wait-ready`

## Usage
```
// es6
import { beginWait } from 'wait-ready'
// node.js
const { beginWait } = require('wait-ready');

const { wait, setReady } = beginWait();
// wait for the ready status
wait().then(() => {
    // do some thing on ready
})

// update ready status when async tasks complete
setReady();
```

