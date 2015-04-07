# angular-bugsnag

Angular wrapper for [Bugsnag](https://github.com/bugsnag/bugsnag-js).

[![Build Status](https://travis-ci.org/wmluke/angular-bugsnag.svg)](https://travis-ci.org/wmluke/angular-bugsnag)
[![Coverage Status](https://coveralls.io/repos/wmluke/angular-bugsnag/badge.png)](https://coveralls.io/r/wmluke/angular-bugsnag)

Specifically, `angular-bugsnag` does the following...

* Provides `bugsnagProvider` to configure the `bugsnag` client and also to inject `bugsnag` as needed
* Overrides the default angular `$exceptionHandler` to send uncaught exceptions to Bugsnag

## Installation

Download [angular-bugsnag.js](https://raw.githubusercontent.com/wmluke/angular-bugsnag/master/dist/angular-bugsnag.js) or install with bower.

```bash
$ bower install angular-bugsnag --save
```

Load the `angular-bugsnag` module into your app...

```javascript
angular.module('app', ['angular-bugsnag'])
```

## `bugsnagProvider` configuration

The `bugsnagProvider` has pretty much the same [configuration](https://github.com/bugsnag/bugsnag-js#configuration) options as `bugsnag`.  

The main difference is that `bugsnagProvider` uses chainable setter methods instead of properties.

### `noConflict`
Call `noConflict()` **before** other settings to remove `bugsnag` from `window`.

### `apiKey`

### `releaseStage`

### `notifyReleaseStages`

### `appVersion`

### `user`

### `projectRoot`

### `endpoint`

### `metaData`

### `autoNotify`

### `beforeNotify`

Takes an angular `providerFunction` or service name that should return a [beforeNotify](https://github.com/bugsnag/bugsnag-js#beforenotify) callback used by `bugsnag`.

#### Examples

Log notifications with `$log`:

```js
bugsnagProvider
    .beforeNotify(['$log', function ($log) {
       return function (error, metaData) {
           $log.debug(error.name);
           return true;
       };
    }])
```

`beforeNotify` can also take a service name defined elsewhere:

```js

module
    .factory('bugsnagNotificationInterceptor', ['$log', function ($log) {
        return function (error, metaData) {
            $log.debug(error.name);
            return true;
        };
    }])

bugsnagProvider
    .beforeNotify('bugsnagNotificationInterceptor')
```

### Example Usage

```javascript
angular.module('demo-app', ['angular-bugsnag'])
    .config(['bugsnagProvider', function (bugsnagProvider) {
        bugsnagProvider
            .noConflict()
            .apiKey('[replace me]')
            .releaseStage('development')
            .user({
                id: 123,
                name: 'Jon Doe',
                email: 'jon.doe@gmail.com'

            })
            .appVersion('0.1.0')
            .beforeNotify(['$log', function ($log) {
                return function (error, metaData) {
                    $log.debug(error.name);
                    return true;
                };
            }]);
    }])
    .controller('MainCtrl', ['$rootScope', 'bugsnag', function ($scope, bugsnag) {

        this.throwError = function (err) {
            throw err;
        };

        this.notifyError = function (err) {
            bugsnag.notify(err);
        };

        this.brokenUndefined = function () {
            $scope.foo.bar();
        };

    }]);
```

## Contributing

PR's are welcome.  Just make sure the tests pass.

```bash
$ make
$ gulp test
```

Additionally, use `gulp serve` or `gulp watch` to run the test app. Just insert a Bugsnag API Key [here](https://github.com/wmluke/angular-bugsnag/blob/master/test/app/scripts/app.js#L8-8).  Remember, don't commit your key!

## License
MIT
