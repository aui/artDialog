var angular = require('angular');
require('../../../src/angular/index');

var app = angular.module('app', ['artDialog']);

angular.bootstrap(document.body, ['app']);