(function () {
    'use strict';

    angular.module('demo-app', ['angular-bugsnag'])
        .config(['bugsnagProvider', function (bugsnagProvider) {
            bugsnagProvider
                //.noConflict()
                .apiKey('[replace me]')
                .releaseStage('development')
                .user({
                    id: 123,
                    name: 'Jon Doe',
                    email: 'jon.doe@gmail.com'

                })
                .appVersion('0.1.0');
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


        }])

}());
