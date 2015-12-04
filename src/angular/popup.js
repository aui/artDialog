require('../css/ui-popup.css');

var $ = require('jquery');
var directive = require('./directive');

directive('popup', {
    template: '<div class="ui-popup" ng-transclude></div>'
});