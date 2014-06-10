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

## Example Usage

```javascript
angular.module('demo-app', ['angular-bugsnag'])
    .config(['bugsnagProvider', function (bugsnagProvider) {
        bugsnagProvider
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

## License
MIT
