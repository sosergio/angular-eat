# angular-eat #

Angular Eat (Enhanced Angular Tools) is a simple, easy-to-use library for dealing with forms and inputs in a angular app.

> Please note at the moment is still under development. If you want to keep track of the updates, check on this page inside the features list.

## Features ##

* Validation with ng-messages
* Groups of inputs are easy to write in a single tag 
* Tested on Chrome

## Usage ##
Include angular-eat.js in your JavaScript bundle or add it to your HTML page like this:
```html
<script type='application/javascript' src='/path/to/angular-eat.js'></script>
```

Then reference the script in your app like this:
```javascript
angular.module("myapp", ["angular-eat"]);
```

Then simply use it as a directive in your html like this:
```html
<eat-group>
    <label>Name</label>
    <input type='text' minlength="2" required ng-model="vm.user.name"/>
    <eat-help>{{Your fullname}}</eat-help>
    <eat-messages />
</eat-group>
```

or with the "fast" mode:
```html
<eat-group-fast 
    input='email' 
    ng-model="vm.user.email" 
    label='{{vm.user.emailLabel}}' 
    help='Optional, we are not spamming, promise!'>
</eat-group-fast>
```

## Todo ##
- add examples
- write a proper readme.md
- add some grunt tasks (less, injector, minify, watch)
- write unit test (chai, mocha, sinon)
- write e2e test (protractor)
- create bower package (upload to bower... how?)
- add comments in javascript
Features:
- add support for select/options
- add eat-group-required if input is required
- add localizer as a pluggable external service
- add buffet: internation mobile phone
- add buffet: country selector
- add buffet: quick address (via google maps)
- add buffet: money money money
