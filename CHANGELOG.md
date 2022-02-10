# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.6.0](https://github.com/rocwind/wait-ready/compare/v0.5.6...v0.6.0) (2022-02-10)


### ⚠ BREAKING CHANGES

* setFailed only accepts Error for reason, exported types are simplified

### Features

* add getFailReason to wait return ([8ff1c59](https://github.com/rocwind/wait-ready/commit/8ff1c593fb7f9dcf1af85ac906596b2c80cfc4aa))

### [0.5.6](https://github.com/rocwind/wait-ready/compare/v0.5.5...v0.5.6) (2021-11-02)


### Bug Fixes

* **deps:** update jest, ts-jest to v27 ([2329823](https://github.com/rocwind/wait-ready/commit/2329823bc4d4dd45f1e69dec29ec81575c77f5e9))
* use never but not unknown for generic function arguments type in withReady() ([a060ddd](https://github.com/rocwind/wait-ready/commit/a060dddf52986ff3a6147ada7189946c22b74f96))

### [0.5.5](https://github.com/rocwind/wait-ready/compare/v0.5.4...v0.5.5) (2021-04-12)


### Bug Fixes

* export waitFor() in index ([082d37c](https://github.com/rocwind/wait-ready/commit/082d37c53f2eee89344d963cf31831982db25535))

### [0.5.4](https://github.com/rocwind/wait-ready/compare/v0.5.3...v0.5.4) (2021-04-11)


### Features

* add waitFor() for polling check ready status ([3fc5e2d](https://github.com/rocwind/wait-ready/commit/3fc5e2d6dbbb3a19f7e1d817e74d455679d36e6d))

### [0.5.3](https://github.com/rocwind/wait-ready/compare/v0.5.2...v0.5.3) (2021-03-29)


### Bug Fixes

* add babel plugin to rollup to ensure es5 format foor bundle.js ([154b5bb](https://github.com/rocwind/wait-ready/commit/154b5bb44905e55b951f5eacc7759a0297bd7e4e))

### [0.5.2](https://github.com/rocwind/wait-ready/compare/v0.5.1...v0.5.2) (2021-03-10)


### Features

* add withReady() ([425c48d](https://github.com/rocwind/wait-ready/commit/425c48d7cfde5e3c9d9d298f4db59bc64e3b8cc9))

### [0.5.1](https://github.com/rocwind/wait-ready/compare/v0.5.0...v0.5.1) (2021-01-29)


### Features

* support set a name for waiting task ([0ce972b](https://github.com/rocwind/wait-ready/commit/0ce972bb004dfde09d95223b69081812a9fe4f83))

## [0.5.0](https://github.com/rocwind/wait-ready/compare/v0.4.0...v0.5.0) (2020-03-14)


### ⚠ BREAKING CHANGES

* method/type names are changed: beginWait() -> wait(); wait() -> afterReady()

### Features

* use generic type for result value ([f7a938c](https://github.com/rocwind/wait-ready/commit/f7a938cfcacdc5fcce00f908db9e31efd079826e))
