/* global require */

'use strict';

require('../css/ui-popup.css');

var directive = require('./directive');

directive('popup', {
    template: '<div class="ui-popup" ng-transclude></div>'
});