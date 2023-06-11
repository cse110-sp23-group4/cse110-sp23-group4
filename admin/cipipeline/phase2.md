# CI/CD Pipeline Phase 2

## Currently Implemented

### JS Hint
- Used to check code quality
- Notes:
  - In the [yml](../../.github/workflows/linter.yml), there is a config file that is written by `echo` (lines 13-17) that specify two options:
    - `esversion = 8`: this says that our JS code is written to follow [ECMAScript 8](https://en.wikipedia.org/wiki/ECMAScript#:~:text=ECMAScript%20(%2F%CB%88%C9%9Bkm,prototype%2Dbased%2C%20functional%2C%20imperative)). ECMAScript is a JavaScript standard to ensure the interoperability of web pages across different web browsers.
    - `"loopfunc": true`: this surpresses the error of using global variables like `window`
    - The `grep` line ensures JSHint excludes the JS files in ./8-ball/ and ./__test__/

### JS Docs
- Wrote a custom GitHub action using the help of Malcolm
- On push to `main`, JSDocs runs on our repo and generates HTML files. The website auto deploys and the link is in [README](../../README.md)

### HTML/CSS Validation
- Used to check HTML/CSS and ensure we pass validation
- Used [this](https://github.com/marketplace/actions/html5-validator) GitHub Action by GitHub users *Cyb3r-Jak3*, *ptmkenny*, *khusika*, and *JakeVdub*
- Notes:
  - CSS validation is true, error logs are currently only printed in the GitHub action

### Testing Workflow
- Wrote a custom GitHub action to run our testing suite on push to any branch
- Runs all tests written in [test](../../source/__tests__/) using `npm run test`
- Config file is written so that deployment is consistent on local and remote machines