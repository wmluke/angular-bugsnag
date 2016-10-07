/**! 
 * @license angular-bugsnag v0.2.1
 * Copyright (c) 2013 Luke Bunselmeyer <wmlukeb@gmail.com>. https://github.com/wmluke/angular-bugsnag
 * License: MIT
 */
(function () {
    'use strict';

    var _bugsnag;

    angular.module('angular-bugsnag', [])
        .config(['$provide', function ($provide) {
            $provide.provider({
                bugsnag: function () {

                    // if a script blocker blocks the bugsnag library Bugsnag will be undefined at this point, so we initialize it to an object
                    // with methods that do nothing but are declared and won't throw errors later by the angular-bugsnag
                    // module calling them
                    var Bugsnag = window.Bugsnag || {
                        notifyException: function () {},
                        notify: function () {},
                        noConflict: function () {}
                    };

                    _bugsnag = Bugsnag;
                    var _self = this;
                    var _beforeNotify;

                    this.noConflict = function () {
                        _bugsnag = Bugsnag.noConflict();
                        return _self;
                    };

                    this.apiKey = function (apiKey) {
                        _bugsnag.apiKey = apiKey;
                        return _self;
                    };

                    this.releaseStage = function (releaseStage) {
                        _bugsnag.releaseStage = releaseStage;
                        return _self;
                    };

                    this.notifyReleaseStages = function (notifyReleaseStages) {
                        _bugsnag.notifyReleaseStages = notifyReleaseStages;
                        return _self;
                    };

                    this.appVersion = function (appVersion) {
                        _bugsnag.appVersion = appVersion;
                        return _self;
                    };

                    this.user = function (user) {
                        _bugsnag.user = user;
                        return _self;
                    };

                    this.projectRoot = function (projectRoot) {
                        _bugsnag.projectRoot = projectRoot;
                        return _self;
                    };

                    this.endpoint = function (endpoint) {
                        _bugsnag.endpoint = endpoint;
                        return _self;
                    };

                    this.metaData = function (metaData) {
                        _bugsnag.metaData = metaData;
                        return _self;
                    };

                    this.autoNotify = function (autoNotify) {
                        _bugsnag.autoNotify = autoNotify;
                        return _self;
                    };

                    this.beforeNotify = function (beforeNotify) {
                        _beforeNotify = beforeNotify;
                        return _self;
                    };

                    this._testRequest = function (testRequest) {
                        _bugsnag.testRequest = testRequest;
                        return _self;
                    };

                    this.$get = ['$injector', function ($injector) {
                        if (_beforeNotify) {
                            _bugsnag.beforeNotify = angular.isString(_beforeNotify) ? $injector.get(_beforeNotify) : $injector.invoke(_beforeNotify);
                        }
                        return _bugsnag;
                    }];

                },
                $exceptionHandler: function () {
                    this.$get = ['$log', 'bugsnag', function ($log, bugsnag) {
                        return function (exception, cause) {
                            $log.error.apply($log, arguments);
                            try {
                                bugsnag.fixContext();
                                if (angular.isString(exception)) {
                                    bugsnag.notify(exception);
                                } else {
                                    bugsnag.notifyException(exception);
                                }
                            } catch (e) {
                                $log.error(e);
                            }
                        };
                    }];
                }
            });
        }])
        .run(['bugsnag', '$location', '$rootScope', function (bugsnag, $location, $rootScope) {
            // Set the context from $location.url().  We cannot do this above b/c injecting $location creates a circular dependency.
            bugsnag.fixContext = function () {
                bugsnag.context = $location.url();
            };
            // refresh the rate-limit
            $rootScope.$on('$locationChangeSuccess', bugsnag.refresh || angular.noop);
        }]);
}());
