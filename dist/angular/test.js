webpackJsonp([0,1],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var angular = __webpack_require__(1);
	__webpack_require__(2);

	var app = angular.module('app', ['artDialog']);

	angular.bootstrap(document.body, ['app']);

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = angular;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(3);
	__webpack_require__(11);
	__webpack_require__(14);
	__webpack_require__(17);
	module.exports = {};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* global require */

	'use strict';

	__webpack_require__(4);

	var directive = __webpack_require__(9);

	directive('popup', {
	    template: '<div class="ui-popup" ng-transclude></div>'
	});

/***/ },
/* 4 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */
/***/ function(module, exports) {

	module.exports = jQuery;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/* global require,module */

	'use strict';

	var angular = __webpack_require__(1);
	var Popup = __webpack_require__(10);
	var namespace = angular.module('artDialog', []);


	function directive(name, options) {
	    namespace.directive(name, function() {

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
	                'modal': '@'

	            },
	            controller: ['$scope', function($scope) {
	                    this.$close = function() {
	                        $scope.close();
	                    };
	                }
	            ],
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
	                        scope.$apply();
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

	    var child = {
	        childDirective: function(subName, subOptions) {
	            namespace.directive(subName, function() {
	                return angular.extend({
	                    require: '^' + name,
	                    restrict: 'AE',
	                    transclude: true,
	                    replace: true,
	                    template: ''
	                }, subOptions);
	            });

	            return child;
	        }
	    };

	    return child;
	}

	directive.module = namespace;

	module.exports = directive;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*!
	 * PopupJS - 0.2.1
	 * https://github.com/aui/popupjs
	 * (c) 2014-2015 TangBin
	 *
	 * This is licensed under the GNU LGPL, version 2.1 or later.
	 * For details, see: http://www.gnu.org/licenses/lgpl-2.1.html
	 */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

	var $ = __webpack_require__(8);

	var _count = 0;


	/**
	 * @param   {HTMLElement}
	 */
	function Popup (node) {

	    this.destroyed = false;
	    this.__ng = !!node;


	    this.__popup = $(node || '<div />')
	    /*使用 <dialog /> 元素可能导致 z-index 永远置顶的问题(chrome)*/
	    .css({
	        //outline: 0,
	        position: 'absolute'/*,

	        left: 0,
	        top: 0,
	        bottom: 'auto',
	        right: 'auto',
	        margin: 0,
	        padding: 0,
	        border: '0 none',
	        background: 'transparent'
	        */
	    })
	    .attr('tabindex', '-1')
	    .appendTo('body');


	    if (!this.__ng) {
	        this.__popup.hide();
	    }


	    // 使用 HTMLElement 作为外部接口使用，而不是 jquery 对象
	    // 统一的接口利于未来 Popup 移植到其他 DOM 库中
	    this.node = this.__popup[0];

	    _count ++;
	}


	$.extend(Popup.prototype, {

	    /**
	     * 初始化完毕事件，在 show()、showModal() 执行
	     * @name Popup.prototype.onshow
	     * @event
	     */

	    /**
	     * 关闭事件，在 close() 执行
	     * @name Popup.prototype.onclose
	     * @event
	     */

	    /**
	     * 销毁前事件，在 remove() 前执行
	     * @name Popup.prototype.onbeforeremove
	     * @event
	     */

	    /**
	     * 销毁事件，在 remove() 执行
	     * @name Popup.prototype.onremove
	     * @event
	     */

	    /**
	     * 重置事件，在 reset() 执行
	     * @name Popup.prototype.onreset
	     * @event
	     */

	    /**
	     * 焦点事件，在 foucs() 执行
	     * @name Popup.prototype.onfocus
	     * @event
	     */

	    /**
	     * 失焦事件，在 blur() 执行
	     * @name Popup.prototype.onblur
	     * @event
	     */

	    /** 浮层 DOM 素节点[*] */
	    node: null,

	    /** 是否开启固定定位[*] */
	    fixed: false,

	    /** 判断是否删除[*] */
	    destroyed: true,

	    /** 判断是否显示 */
	    open: false,

	    /** close 返回值 */
	    returnValue: '',

	    /** 是否自动聚焦 */
	    autofocus: true,

	    /** 对齐方式[*] */
	    align: 'bottom left',

	    /** CSS 类名 */
	    className: 'ui-popup',

	    /**
	     * 显示浮层
	     * @param   {HTMLElement, Event}  指定位置（可选）
	     */
	    show: function (anchor) {

	        if (this.destroyed) {
	            return this;
	        }

	        var popup = this.__popup;

	        this.__activeElement = this.__getActive();

	        this.open = true;
	        this.anchor = anchor;


	        popup
	        .addClass(this.className)
	        .addClass(this.__name('show'))
	        .attr('role', this.modal ? 'alertdialog' : 'dialog');


	        // 模态浮层的遮罩
	        if (this.modal) {

	            popup.addClass(this.__name('modal'));

	            // 让焦点限制在浮层内
	            $(document).on('focusin', $.proxy(this.focus, this));
	        }


	        if (!this.__ng) {
	            popup.show();
	        }


	        $(window).on('resize', $.proxy(this.reset, this));

	        this.reset().focus();
	        this.__dispatchEvent('show');

	        return this;
	    },


	    /** 显示模态浮层。参数参见 show() */
	    showModal: function () {
	        this.modal = true;
	        return this.show.apply(this, arguments);
	    },


	    /** 关闭浮层 */
	    close: function (result) {

	        if (!this.destroyed && this.open) {

	            if (result !== undefined) {
	                this.returnValue = result;
	            }

	            this.__popup.removeClass(this.__name('show'));
	            this.__popup.removeClass(this.__name('modal'))

	            if (!this.__ng) {
	                this.__popup.hide();
	            }

	            this.open = false;
	            this.blur();// 恢复焦点，照顾键盘操作的用户
	            this.__dispatchEvent('close');

	            $(document).off('focusin', $.proxy(this.focus, this));
	            $(window).off('resize', this.reset);
	        }

	        return this;
	    },


	    /** 销毁浮层 */
	    remove: function () {

	        if (this.destroyed) {
	            return this;
	        }


	        this.__dispatchEvent('beforeremove');


	        if (this.open) {
	            this.close();
	        }


	        if (Popup.current === this) {
	            Popup.current = null;
	        }


	        // 从 DOM 中移除节点
	        this.__popup.remove();


	        this.__dispatchEvent('remove');

	        for (var i in this) {
	            delete this[i];
	        }

	        return this;
	    },


	    /** 重置位置 */
	    reset: function () {

	        if (!this.open) {
	            return;
	        }

	        var anchor = this.anchor;

	        if (typeof anchor === 'string') {
	            anchor = this.anchor = $(anchor)[0];
	        }

	        this.__popup.css('position', this.fixed ? 'fixed' : 'absolute');

	        if (anchor) {
	            this.__anchor(anchor);
	        } else {
	            this.__center();
	        }

	        this.__dispatchEvent('reset');

	        return this;
	    },


	    /** 让浮层获取焦点 */
	    focus: function () {

	        var node = this.node;
	        var popup = this.__popup;
	        var current = Popup.current;
	        var index = this.zIndex = Popup.zIndex ++;

	        if (current && current !== this) {
	            current.blur(false);
	        }

	        // 检查焦点是否在浮层里面
	        if (!$.contains(node, this.__getActive())) {
	            var autofocus = popup.find('[autofocus]')[0];

	            if (!this._autofocus && autofocus) {
	                this._autofocus = true;
	            } else {
	                autofocus = node;
	            }

	            this.__focus(autofocus);
	        }

	        // 设置叠加高度
	        popup.css('zIndex', index);

	        Popup.current = this;
	        popup.addClass(this.__name('focus'));

	        this.__dispatchEvent('focus');

	        return this;
	    },


	    /** 让浮层失去焦点。将焦点退还给之前的元素，照顾视力障碍用户 */
	    blur: function () {

	        var activeElement = this.__activeElement;
	        var isBlur = arguments[0];


	        if (isBlur !== false) {
	            this.__focus(activeElement);
	        }

	        this._autofocus = false;
	        this.__popup.removeClass(this.__name('focus'));
	        this.__dispatchEvent('blur');

	        return this;
	    },


	    /**
	     * 添加事件
	     * @param   {String}    事件类型
	     * @param   {Function}  监听函数
	     */
	    addEventListener: function (type, callback) {
	        this.__getEventListener(type).push(callback);
	        return this;
	    },


	    /**
	     * 删除事件
	     * @param   {String}    事件类型
	     * @param   {Function}  监听函数
	     */
	    removeEventListener: function (type, callback) {
	        var listeners = this.__getEventListener(type);
	        for (var i = 0; i < listeners.length; i ++) {
	            if (callback === listeners[i]) {
	                listeners.splice(i--, 1);
	            }
	        }
	        return this;
	    },


	    __name: function (name) {
	        return this.className + '-' + name;
	    },


	    // 获取事件缓存
	    __getEventListener: function (type) {
	        var listener = this.__listener;
	        if (!listener) {
	            listener = this.__listener = {};
	        }
	        if (!listener[type]) {
	            listener[type] = [];
	        }
	        return listener[type];
	    },


	    // 派发事件
	    __dispatchEvent: function (type) {
	        var listeners = this.__getEventListener(type);

	        if (this['on' + type]) {
	            this['on' + type]();
	        }

	        for (var i = 0; i < listeners.length; i ++) {
	            listeners[i].call(this);
	        }
	    },


	    // 对元素安全聚焦
	    __focus: function (elem) {
	        // 防止 iframe 跨域无权限报错
	        // 防止 IE 不可见元素报错
	        try {
	            // ie11 bug: iframe 页面点击会跳到顶部
	            if (this.autofocus && !/^iframe$/i.test(elem.nodeName)) {
	                elem.focus();
	            }
	        } catch (e) {}
	    },


	    // 获取当前焦点的元素
	    __getActive: function () {
	        try {// try: ie8~9, iframe #26
	            var activeElement = document.activeElement;
	            var contentDocument = activeElement.contentDocument;
	            var elem = contentDocument && contentDocument.activeElement || activeElement;
	            return elem;
	        } catch (e) {}
	    },


	    // 居中浮层
	    __center: function () {

	        var popup = this.__popup;
	        var $window = $(window);
	        var $document = $(document);
	        var fixed = this.fixed;
	        var dl = fixed ? 0 : $document.scrollLeft();
	        var dt = fixed ? 0 : $document.scrollTop();
	        var ww = $window.width();
	        var wh = $window.height();
	        var ow = popup.width();
	        var oh = popup.height();
	        var left = (ww - ow) / 2 + dl;
	        var top = (wh - oh) * 382 / 1000 + dt;// 黄金比例
	        var style = popup[0].style;


	        style.left = Math.max(parseInt(left), dl) + 'px';
	        style.top = Math.max(parseInt(top), dt) + 'px';
	    },


	    // 指定位置 @param    {HTMLElement, Event}  anchor
	    __anchor: function (anchor) {

	        var $elem = anchor.parentNode && $(anchor);
	        var popup = this.__popup;


	        if (this.__anchorSkin) {
	            popup.removeClass(this.__anchorSkin);
	        }


	        // 隐藏元素不可用
	        if ($elem) {
	            var o = $elem.offset();
	            if (o.left * o.top < 0) {
	                return this.__center();
	            }
	        }

	        var that = this;
	        var fixed = this.fixed;

	        var $window = $(window);
	        var $document = $(document);
	        var winWidth = $window.width();
	        var winHeight = $window.height();
	        var docLeft =  $document.scrollLeft();
	        var docTop = $document.scrollTop();


	        var popupWidth = popup.width();
	        var popupHeight = popup.height();
	        var width = $elem ? $elem.outerWidth() : 0;
	        var height = $elem ? $elem.outerHeight() : 0;
	        var offset = this.__offset(anchor);
	        var x = offset.left;
	        var y = offset.top;
	        var left =  fixed ? x - docLeft : x;
	        var top = fixed ? y - docTop : y;


	        var minLeft = fixed ? 0 : docLeft;
	        var minTop = fixed ? 0 : docTop;
	        var maxLeft = minLeft + winWidth - popupWidth;
	        var maxTop = minTop + winHeight - popupHeight;


	        var css = {};
	        var align = this.align.split(' ');
	        var className = this.__name('');
	        var reverse = {top: 'bottom', bottom: 'top', left: 'right', right: 'left'};
	        var name = {top: 'top', bottom: 'top', left: 'left', right: 'left'};


	        var temp = [{
	            top: top - popupHeight,
	            bottom: top + height,
	            left: left - popupWidth,
	            right: left + width
	        }, {
	            top: top,
	            bottom: top - popupHeight + height,
	            left: left,
	            right: left - popupWidth + width
	        }];


	        var center = {
	            left: left + width / 2 - popupWidth / 2,
	            top: top + height / 2 - popupHeight / 2
	        };


	        var range = {
	            left: [minLeft, maxLeft],
	            top: [minTop, maxTop]
	        };


	        // 超出可视区域重新适应位置
	        $.each(align, function (i, val) {

	            // 超出右或下边界：使用左或者上边对齐
	            if (temp[i][val] > range[name[val]][1]) {
	                val = align[i] = reverse[val];
	            }

	            // 超出左或右边界：使用右或者下边对齐
	            if (temp[i][val] < range[name[val]][0]) {
	                align[i] = reverse[val];
	            }

	        });


	        // 一个参数的情况
	        if (!align[1]) {
	            name[align[1]] = name[align[0]] === 'left' ? 'top' : 'left';
	            temp[1][align[1]] = center[name[align[1]]];
	        }


	        // 添加 anchor 的 css
	        className += align.join('-') + ' ' + this.__name('anchor');

	        that.__anchorSkin = className;


	        if ($elem) {
	            popup.addClass(className);
	        }


	        css[name[align[0]]] = parseInt(temp[0][align[0]]);
	        css[name[align[1]]] = parseInt(temp[1][align[1]]);
	        popup.css(css);

	    },


	    // 获取元素相对于页面的位置（不支持 iframe 内的元素）
	    __offset: function (anchor) {

	        var isNode = !!anchor.parentNode;
	        var offset = isNode ? $(anchor).offset() : {
	            left: anchor.pageX,
	            top: anchor.pageY
	        };

	        return offset;
	    }

	});


	/** 当前叠加高度 */
	Popup.zIndex = 1024;


	/** 顶层浮层的实例 */
	Popup.current = null;


	return Popup;

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	// 更新记录
	// 取消对 iframe 支持
	// follow > anchor
	// fixed 支持多次设置
	// 删除遮罩层
	// 支持传入 elem

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/* global require */

	'use strict';

	__webpack_require__(12);

	var $ = __webpack_require__(8);
	var directive = __webpack_require__(9);

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

/***/ },
/* 12 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 13 */,
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/* global require */

	'use strict';

	__webpack_require__(15);

	var $ = __webpack_require__(8);
	var directive = __webpack_require__(9);
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

	        var closeNode = $(closeTpl);
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

/***/ },
/* 15 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 16 */,
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/* global require */

	'use strict';

	var Drag = __webpack_require__(18);
	var directive = __webpack_require__(9);

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

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*!
	 * drag.js
	 * Date: 2015-06-28
	 * https://github.com/aui/artDialog
	 * (c) 2014-2015 TangBin
	 *
	 * This is licensed under the GNU LGPL, version 2.1 or later.
	 * For details, see: http://www.gnu.org/licenses/lgpl-2.1.html
	 */
	/* global define */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require) {

	    'use strict';

	    var $ = __webpack_require__(8);


	    var $window = $(window);
	    var $document = $(document);
	    var isTouch = 'createTouch' in document;
	    var html = document.documentElement;
	    var isIE6 = !('minWidth' in html.style);
	    var isLosecapture = !isIE6 && 'onlosecapture' in html;
	    var isSetCapture = 'setCapture' in html;

	    function noop() {}

	    function preventDefault() {
	        return false;
	    }

	    var eventTypes = {
	        start: isTouch ? 'touchstart' : 'mousedown',
	        move: isTouch ? 'touchmove' : 'mousemove',
	        end: isTouch ? 'touchend' : 'mouseup'
	    };

	    var touchId = 0;
	    var getEvent = isTouch ? function(event, touchId) {
	        return (event.touches || event.originalEvent.touches)[touchId];
	    } : function(event) {
	        return event;
	    };


	    var supports = (function() {
	        var div = document.createElement('div');
	        var vendors = 'Khtml Ms O Moz Webkit'.split(' ');
	        var len = vendors.length;

	        return function(prop) {
	            if (prop in div.style) {
	                return prop;
	            }

	            prop = prop.replace(/^[a-z]/, function(val) {
	                return val.toUpperCase();
	            });

	            while (len--) {
	                if (vendors[len] + prop in div.style) {
	                    return vendors[len] + prop;
	                }
	            }

	            return null;
	        };
	    })();


	    var transform = supports('transform');



	    /**
	     * 拖拽事件类，解决浏览器兼容问题
	     * @constructor
	     */
	    function Drag(elem, event, GPU) {

	        if (elem) {
	            return new Drag.create(elem, event, GPU);
	        }

	        this.start = $.proxy(this.start, this);
	        this.move = $.proxy(this.move, this);
	        this.end = $.proxy(this.end, this);
	    }

	    Drag.prototype = {

	        constructor: Drag,

	        start: function(event) {

	            this.touchId = touchId;
	            event = getEvent(event, touchId);
	            touchId++;

	            this.target = $(event.target);

	            $document
	                .on('selectstart', preventDefault)
	                .on('dblclick', this.end);

	            if (isLosecapture) {
	                this.target.on('losecapture', this.end);
	            } else {
	                $window.on('blur', this.end);
	            }

	            if (isSetCapture) {
	                this.target[0].setCapture();
	            }

	            $document
	                .on(eventTypes.move, this.move)
	                .on(eventTypes.end, this.end);

	            this.onstart(event);
	            return false;
	        },

	        move: function(event) {
	            event = getEvent(event, this.touchId);
	            this.onmove(event);
	            return false;
	        },

	        end: function(event) {
	            this.touchId = touchId;
	            event = getEvent(event, touchId);
	            touchId--;

	            $document
	                .off('selectstart', preventDefault)
	                .off('dblclick', this.end);

	            if (isLosecapture) {
	                this.target.off('losecapture', this.end);
	            } else {
	                $window.off('blur', this.end);
	            }

	            if (isSetCapture) {
	                this.target[0].releaseCapture();
	            }

	            $document
	                .off(eventTypes.move, this.move)
	                .off(eventTypes.end, this.end);

	            this.onend(event);
	            return false;
	        }

	    };



	    /**
	     * @constructor
	     * @param   {HTMLElement}   被拖拽的元素
	     * @param   {Event}         触发拖拽的事件对象。若无则监听 elem 的按下事件启动
	     */

	    Drag.create = function(elem, event, GPU) {

	        var $elem = $(elem);
	        var drag = this;
	        var dragEvent = new Drag();

	        var x, y, minX, minY, maxX, maxY, startLeft, startTop, clientX, clientY;

	        if (typeof GPU === 'undefined') {
	            GPU = !!transform;
	        }

	        this.GPU = GPU;

	        dragEvent.onstart = function(event) {
	            var $wrap = elem.parentNode.nodeName === 'BODY' ?
	                $document : $elem.offsetParent();

	            var isFixed = $elem.css('position') === 'fixed';
	            var position = $elem.position();
	            var ww = $window.width();
	            var wh = $window.height();
	            var dl = $wrap.scrollLeft();
	            var dt = $wrap.scrollTop();
	            var dw = $wrap.width();
	            var dh = $wrap.height();
	            var w = $elem.outerWidth();
	            var h = $elem.outerHeight();
	            var l = position.left;
	            var t = position.top;

	            if (drag.GPU) {
	                minX = isFixed ? -l : -l - dl;
	                minY = isFixed ? -t : -t - dt;
	                maxX = isFixed ? ww - w - l : dw - w - l;
	                maxY = isFixed ? wh - h - t : dh - h - t;
	                x = 0;
	                y = 0;
	                startLeft = l;
	                startTop = t;
	            } else {
	                minX = 0;
	                minY = 0;
	                maxX = isFixed ? ww - w + minX : dw - w;
	                maxY = isFixed ? wh - h + minY : dh - h;
	                x = startLeft = l;
	                y = startTop = t;
	            }


	            clientX = event.clientX;
	            clientY = event.clientY;

	            drag.onstart(event);
	        };


	        dragEvent.onmove = function(event) {

	            var style = elem.style;

	            if (drag.GPU) {
	                x = event.clientX - clientX;
	                y = event.clientY - clientY;
	            } else {
	                x = event.clientX - clientX + startLeft;
	                y = event.clientY - clientY + startTop;
	            }

	            x = Math.max(minX, Math.min(maxX, x));
	            y = Math.max(minY, Math.min(maxY, y));


	            // 使用 GPU 加速
	            if (drag.GPU) {
	                style[transform] = 'translate3d(' + x + 'px, ' + y + 'px, 0px)';
	                // 使用传统的方式
	            } else {
	                style.left = x + 'px';
	                style.top = y + 'px';
	            }


	            drag.onmove(event);
	        };


	        dragEvent.onend = function(event) {
	            var style = elem.style;


	            if (drag.GPU) {
	                style[transform] = '';
	                style.left = x + startLeft + 'px';
	                style.top = y + startTop + 'px';
	            } else {
	                style.left = x + 'px';
	                style.top = y + 'px';
	            }

	            drag.onend(event);
	        };


	        if (event) {
	            // TODO onstart 事件此时可能还没注册
	            dragEvent.start(event);
	        } else {
	            $elem.on(Drag.START, dragEvent.start);
	            this.destroy = function() {
	                $elem.off(Drag.START, dragEvent.start);
	            };
	        }
	    };


	    Drag.START = eventTypes.start;
	    Drag.MOVE = eventTypes.move;
	    Drag.END = eventTypes.end;


	    Drag.create.prototype = {
	        constructor: Drag.create,
	        onstart: noop,
	        onmove: noop,
	        onend: noop,
	        destroy: noop,
	    };


	    return Drag;

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }
]);