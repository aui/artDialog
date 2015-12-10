/* global require */

'use strict';

require('../css/ui-dialog.css');

var $ = require('jquery');
var directive = require('./directive');
var id = 0;


var dialogTpl =
    '<div class="ui-dialog">' +
    '<div class="ui-dialog-header"></div>' +
    '<div class="ui-dialog-body"></div>' +
    '<div class="ui-dialog-footer"></div>' +
    '</div>';

var titleTpl = '<div class="ui-dialog-title" id="{{$titleId}}" ng-transclude></div>';
var closeTpl = '<button type="button" class="ui-dialog-close"><span aria-hidden="true">&times;</span></button>';
var contentTpl = '<div class="ui-dialog-content" id="{{$contentId}}" ng-transclude></div>';
var statusbarTpl = '<span class="ui-dialog-statusbar" ng-transclude></span>';
var buttonsTpl = '<span class="ui-dialog-buttons" ng-transclude></span>';

directive('dialog', {
    template: '<div class="ui-popup" aria-labelledby="{{$titleId}}" aria-describedby="{{$contentId}}" ng-transclude></div>',
    link: function(scope, elem, attrs, superheroCtrl) {

        var dialog = $(dialogTpl);

        id ++;
        scope.$titleId = 'ui-dialog-title-' + id;
        scope.$contentId = 'ui-dialog-content-' + id;

        var childDirective = function(name) {
            var prefix = 'dialog';
            var e = prefix + '-' + name;
            var e2 = prefix + '\\:' + name;
            var a = '[' + e + ']';
            var a2 = '[' + e2 + ']';
            var c = '.ui-' + prefix + '-' + name;

            return elem.find([e, e2, a, a2, c].join(','));
        };

        var childElem = function(name) {
            return dialog.find('.ui-dialog-' + name);
        };

        var closeNode = $(attrs.close ? closeTpl : '');
        var titleNode = childDirective('title');
        var contentNode = childDirective('content');
        var statusbarNode = childDirective('statusbar');
        var buttonsNode = childDirective('buttons');


        childElem('header').append(closeNode).append(titleNode);
        childElem('body').append(contentNode);
        childElem('footer').append(statusbarNode).append(buttonsNode);


        if (!closeNode[0] && !titleNode[0]) {
            childElem('header').remove();
        }

        if (!statusbarNode[0] && !buttonsNode[0]) {
            childElem('footer').remove();
        }


        closeNode.click(function () {
            superheroCtrl.$close();
            scope.$apply();
        });


        elem.append(dialog);

    }
})

.childDirective('dialogTitle', {
        template: titleTpl
    })
    // .childDirective('dialogClose', {
    //     template: closeTpl
    // })
    .childDirective('dialogContent', {
        template: contentTpl
    })
    .childDirective('dialogStatusbar', {
        template: statusbarTpl
    })
    .childDirective('dialogButtons', {
        template: buttonsTpl
    });