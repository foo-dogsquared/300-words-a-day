# Coding style
The coding style resembles a bit of [AirBNB JavaScript style guide](https://github.com/airbnb/javascript) but with some minor twists here and there. If you've seen some code that does not comply with the style guide that was about to be set, just shoot me an email at `foo.dogsquared-at-gmail-dot-com`.

Anyways, the style guide!

## Client-side JavaScript
Variables that have the elements as their value must have their names in all-caps. This also applies with app constants (variables that are found all over the source code).

```js
// app constants
const APP_CONFIGURATION_SETTING_STRING = "app_configuration_setting";
const APP_AUTOSYNC_SETTING = "app_autosync";
const APP_OBJECT = {app_name: "dogs are cool"};

// element node variables
const ELEMENT_NODE = document.querySelector(".dog-button");
const CREATED_ELEMENT_NODE = document.createElement("div");
const ELEMENT_NODE_NEXT_SIBLING = ELEMENT_NODE.nextElementSibling;
```

## General JavaScript code
### Variable naming
The main naming convention is with [snake_case](https://en.wikipedia.org/wiki/Snake_case) &mdash; variables, function names, and parameters are set after this standard. 

```js
// variables
const hello_world = "Hello World!";

// function names and parameter names
function return_boolean_value(boolean_parameter) {
    return Boolean(boolean);
}
```

### Conditional statements
One-liners in if-else statements can have its block missing its curly braces (`{}`):

```js
if (CONDITION)
    do_something();

do_something_else();
```
