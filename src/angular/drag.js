/* global require */
// TODO 控制器销毁的时候要卸载 document 或 window 的事件

'use strict';

var Drag = require('../lib/drag');
var directive = require('./directive');

directive.module
    .directive('drag', function() {
        return {
            restrict: 'A',
            controller: function() {
                this.$destroyDrag = function() {
                    this.$drag.destroy();
                    delete this.$drag;
                }.bind(this);
            },
            link: function(scope, elem, attrs, superheroCtrl) {
                superheroCtrl.$drag = new Drag(elem[0]);
                superheroCtrl.$element = elem[0];
            }
        };
    })
    .directive('dragHandle', function() {
        return {
            require: '^drag',
            restrict: 'A',
            link: function(scope, elem, attrs, superheroCtrl) {
                superheroCtrl.$destroyDrag();
                elem.on(Drag.START, function(event) {
                    new Drag(superheroCtrl.$element, event);
                    event.preventDefault();
                });
            }
        };
    });