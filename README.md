# wait-ready
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

