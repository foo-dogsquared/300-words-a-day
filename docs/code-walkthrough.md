# Documentation
For future references:
- Node v11.3.0
- npm 6.4.1

This app mainly uses [Express](https://expressjs.com/), [Pug](https://pugjs.org/), and [Sass](https://sass-lang.com/). The only installation required is through the `npm install`.

## Overview of the source code
- `js_build` &mdash; this is where client-side JavaScript files are placed before they are fully made into a big [IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE)
- `final_js_build` &mdash; this is simply the client-side JavaScript files from `js_build` that is made into an IIFE
- `assets` &mdash; Well, the directory of the assets such as images, fonts, and non-script files
- `docs` &mdash; contains the documentations of the project
- `public` &mdash; This is the build directory, it resembles the final product when being build
- `test` &mdash; The test files &ndash; I tried my best, alright. 😶
- `src` &mdash; Where source code is mostly stored. This contains the server configurations, constants that is used everywhere on the code, styling of the pages, page templates, the client-side JavaScript files, and the service worker scripts.

The build scripts can be found on [`package.json`](./package.json) and since they are in the `package.json` file, mostly you have to build with `npm` (unless other package managers can execute scripts inside of it, IDK about the other Node package managers, honestly).

The main commands that you'll most likely to keep in mind is:

- `build`
- `start`
- `watch`

Though, if you're in a development environment and want to update the client-side files efficiently, you have to execute the following scripts alongside the main build scripts:

- `js:watch`
- `scss:watch`
- `sw:watch`

One-time build scripts are also available and in fact what makes these watch scripts so if you want a quick update, just run their one-time build scripts counterpart:

- `js:build`
- `scss:build`
- `sw:build`

Anyways, if you're interested with the client-side JavaScript which is located at [`~/src/client`](../src/client/). Note that you have to combine them. There are specifically two client-side JavaScripts files that is being used by this app (aside from the libraries).

- [`~/js_build/client_app.js`](../js_build/client_app.js) which is made from all of the files at [`~/src/client`](../src/client/) except for [`~/src/client/render_notes.js`](../src/client/render_notes.js)
- [`~/js_build/render_notes.js`](../js_build/render_notes.js) which is made from the app constants at [`~/src/client/constants.js`](../src/client/constants.js) and [`~/src/client/render_notes.js`](../src/client/render_notes.js)

Since they are client-side JavaScript apps, you have to compile them in certain order which its clues was already provided from the `js:build` npm script from [`~/package.json`](../package.json). Basically, the order for the [`~/js_build/client_app.js`](../js_build/client_app.js) is this (from top to bottom):

- [`~/src/client/constants.js`](../src/client/constants.js)
- [`~/src/client/date.js`](../src/client/date.js)
- [`~/src/client/keyboard_events.js`](../src/client/keyboard_events.js)
- [`~/src/client/notes.js`](../src/client/notes.js)

The [`~/src/client/render_notes.js`](../src/client/render_notes.js) is simply made with the constants, first then the rendering notes JS file.
