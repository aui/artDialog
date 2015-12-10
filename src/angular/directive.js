/* global require,module */

'use strict';

var angular = require('angular');
var Popup = require('../lib/popup');
var namespace = angular.module('artDialog', []);


function directive(name, options) {
    return namespace.directive(name, function() {

        var directive = {
            template: options.template,
            restrict: 'AE',
            transclude: true,
            replace: true,
            scope: {

                'ngIf': '=',
                'ngShow': '=',
                'ngHide': '=',

                'close': '&',

                // 吸附到指定 ID 元素
                'for': '@',

                // 对齐方式，配合 for
                'align': '@',

                // 是否固定定位（跟随滚动条）
                'fixed': '@',

                // 是否是模态浮层
                'modal': '@',

                // 显示持续时间
                'duration': '@'

            },
            controller: ['$scope', '$window', function($scope, $window) {
                this.$close = function() {
                    $window.clearTimeout($scope.$$time);
                    $scope.close();
                    $scope.$apply();
                };

                this.$duration = function(duration) {
                    $window.clearTimeout($scope.$$time);
                    $scope.$$time = $window.setTimeout(function() {
                        $scope.close();
                        $scope.$apply();
                    }, duration);
                };

            }],
            link: function(scope, elem, attrs, superheroCtrl) {

                var $ = angular.element;
                var popup = new Popup(elem[0]);


                // 要映射的字段
                var map = {
                    'for': 'anchor'
                };

                // 要转换的数据类型
                var type = {
                    'for': 'String@id',
                    'anchor': 'String@id',
                    'fixed': 'Boolean',
                    'modal': 'Boolean'
                };



                var parse = {

                    'String@id': function(value) {
                        return value ? document.getElementById(value) : null;
                    },

                    'Boolean': function(value) {
                        return typeof value === 'string';
                    }
                };


                // 设置属性

                Object.keys(type).forEach(function(key) {
                    var value = attrs[key];

                    if (typeof value === 'undefined') {
                        return;
                    }

                    if (map[key]) {
                        key = map[key];
                    }

                    if (type[key]) {
                        value = parse[type[key]](value);
                    }

                    popup[key] = value;
                });


                // 通过模型控制对话框显示与隐藏

                if (attrs.ngIf) scope.$watch('ngIf', toggle);
                if (attrs.ngShow) scope.$watch('ngShow', toggle);
                if (attrs.ngHide) scope.$watch('ngHide', toggle);


                function toggle(v) {

                    if (typeof v === 'undefined') {
                        return;
                    }

                    var value = true;

                    switch (attrs) {
                        case 'ngIf':
                            value = scope.ngIf;
                            break;
                        case 'ngShow':
                            value = scope.ngShow;
                            break;
                        case 'ngHide':
                            value = !scope.ngHide;
                            break;
                    }

                    if (value) {
                        popup.show(popup.anchor);

                        if (attrs.duration) {
                            superheroCtrl.$duration(Number(attrs.duration));
                        }

                    } else {
                        popup.close();
                    }

                }


                // ESC 快捷键关闭浮层
                function esc(event) {

                    var target = event.target;
                    var nodeName = target.nodeName;
                    var rinput = /^input|textarea$/i;
                    var isBlur = Popup.current === popup;
                    var isInput = rinput.test(nodeName) && target.type !== 'button';
                    var keyCode = event.keyCode;

                    // 避免输入状态中 ESC 误操作关闭
                    if (!isBlur || isInput) {
                        return;
                    }

                    if (keyCode === 27) {
                        superheroCtrl.$close();
                    }
                }


                $(document).on('keydown', esc);


                (options.link || function() {}).apply(this, arguments);


                // ng 销毁事件控制对话框关闭
                // 控制器销毁或者 ng-if="false" 都可能触发此
                // scope.$on('$destroy', callback) >> 这种方式对 ngAnimate 支持不好
                elem.one('$destroy', function() {
                    $(document).off('keydown', esc);
                    popup.close().remove();
                });



            }
        };


        angular.extend(directive.scope, options.scope);


        return directive;
    });
}

directive.module = namespace;

module.exports = directive;