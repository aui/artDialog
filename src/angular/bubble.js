/* global require */

'use strict';

require('../css/ui-bubble.css');

var $ = require('jquery');
var directive = require('./directive');

directive('bubble', {
    template:
        '<div class="ui-popup">' +
            '<div class="ui-bubble">' +
                '<div ng-transclude class="ui-bubble-content"></div>' +
            '</div>' +
        '</div>',
    link: function(scope, elem, attrs, superheroCtrl) {

        var events = 'mousedown touchstart';

        function click(event) {
            if (!$.contains(elem[0], event.target)) {
                superheroCtrl.$close();
                scope.$apply();
            }
        }

        $(document).on(events, click);

        elem.on('$destroy', function() {
            $(document).off(events, click);
        });

    }
});