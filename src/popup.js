/*!
 * popupjs
 * Date: 2013-12-15
 * https://github.com/aui/popupjs
 * (c) 2009-2013 TangBin, http://www.planeArt.cn
 *
 * This is licensed under the GNU LGPL, version 2.1 or later.
 * For details, see: http://www.gnu.org/licenses/lgpl-2.1.html
 */
define(function (require) {

var $ = require('jquery');

var _count = 0;
var _isIE6 = !('minWidth' in $('html')[0].style);
var _isFixed = !_isIE6;


function Popup () {

    this.destroyed = false;


    this.__popup = $('<div />')
    .attr({
        tabindex: '-1'
    })
    .css({
        display: 'none',
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 'auto',
        right: 'auto',
        margin: 0,
        padding: 0,
        outline: 0,
        border: '0 none',
        background: 'transparent'
    })
    .html(this.innerHTML)
    .appendTo('body');


    this.__backdrop = $('<div />');


    // 使用 HTMLElement 作为外部接口使用，而不是 jquery 对象
    // 统一的接口利于未来 Popup 移植到其他 DOM 库中
    this.node = this.__popup[0];
    this.backdrop = this.__backdrop[0];

    _count ++;

    Popup.oncreate(this);
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

    /** 浮层 DOM 素节点 */
    node: null,

    /** 遮罩 DOM 节点 */
    backdrop: null,

    /** 是否开启固定定位 */
    fixed: false,

    /** 判断对话框是否删除 */
    destroyed: true,

    /** 判断对话框是否显示 */
    open: false,

    /** close 返回值 */
    returnValue: '',

    /** 是否自动聚焦 */
    autofocus: true,

    /** 对齐方式 */
    align: 'bottom left',

    /** 设置遮罩背景颜色 */
    backdropBackground: '#000',

    /** 设置遮罩透明度 */
    backdropOpacity: 0.7,

    /** 内部的 HTML 字符串 */
    innerHTML: '',

    /** 类名 */
    className: 'ui-popup',

    /**
     * 显示浮层
     * @param   {HTMLElement, Event}  指定位置（可选）
     */
    show: function (anchor) {

        if (this.destroyed) {
            return this;
        }

        var that = this;
        var popup = this.__popup;

        this.__activeElement = this.__getActive();

        this.open = true;
        this.follow = anchor;

        popup
        .addClass(this.className + '-show')
        .attr('role', this.modal ? 'alertdialog' : 'dialog')
        .css('position', this.fixed ? 'fixed' : 'absolute')
        .show();

        this.__backdrop.show();


        if (!this.__ready) {

            if (this.modal) {
                this.__lock();
            }


            if (!popup.html()) {
                popup.html(this.innerHTML);
            }


            if (!_isIE6) {
                $(window).on('resize', this.__onresize = function () {
                    that.reset();
                });
            }


            this.__ready = true;
        }

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
            
            this.__popup.hide().removeClass(this.className + '-show');
            this.__backdrop.hide();
            this.open = false;
            this.blur();
            this.__dispatchEvent('close');
        }
    
        return this;
    },


    /** 销毁浮层 */
    remove: function () {

        if (this.destroyed) {
            return this;
        }

        this.__dispatchEvent('beforeremove');
        
        if (Popup.current === this) {
            Popup.current = null;
        }
        
        this.__unlock();
        this.__popup.remove();
        this.__backdrop.remove();


        // 恢复焦点，照顾键盘操作的用户
        this.blur();

        if (!_isIE6) {
            $(window).off('resize', this.__onresize);
        }

        this.__dispatchEvent('remove');

        for (var i in this) {
            delete this[i];
        }

        return this;
    },


    /** 手动刷新位置 */
    reset: function () {

        var elem = this.follow;

        if (elem) {
            this.__follow(elem);
        } else {
            this.__center();
        }

        this.__dispatchEvent('reset');

        return this;
    },


    /** 让浮层获取焦点 */
    focus: function () {

        var node = this.node;
        var current = Popup.current;

        if (current && current !== this) {
            current.blur(false);
        }

        // 检查焦点是否在浮层里面
        if (!$.contains(node, this.__getActive())) {
            var autofocus = this.__popup.find('[autofocus]')[0];

            if (!this._autofocus && autofocus) {
                this._autofocus = true;
            } else {
                autofocus = node;
            }

            this.__focus(autofocus);
        }

        Popup.current = this;
        this.__popup.addClass(this.className + '-focus');
        this.__zIndex();
        this.__dispatchEvent('focus');

        return this;
    },


    /** 让浮层失去焦点。将焦点退还给之前的元素，照顾视力障碍用户 */
    blur: function () {

        var activeElement = this.__activeElement;
        var isBlur = arguments[0];

        // ie11 bug: iframe 页面点击会跳到顶部
        if (isBlur !== false && activeElement && !/^iframe$/i.test(activeElement.nodeName)) {
            this.__focus(activeElement);
        }

        this._autofocus = false;
        this.__popup.removeClass(this.className + '-focus');
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
            if (this.autofocus) {
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


    // 置顶浮层
    __zIndex: function () {
    
        var index = Popup.zIndex ++;
        
        // 设置叠加高度
        this.__popup.css('zIndex', index);
        this.__backdrop.css('zIndex', index - 1);
        this.zIndex = index;
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

        if (this.__followSkin !== undefined) {
            popup.removeClass(this.__followSkin);
        }
    },
    
    
    // 指定位置 @param    {HTMLElement, Event}  anchor
    __follow: function (anchor) {
        
        var $elem = anchor.parentNode && $(anchor);
        

        // 隐藏元素不可用
        if ($elem) {
            var o = $elem.offset();
            if (o.left * o.top < 0) {
                return this.__center();
            }
        }
        
        var that = this;
        var fixed = this.fixed;
        var popup = this.__popup;


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
        var className = this.className + '-';
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

        className += align.join('-');


        if (this.__followSkin !== undefined) {
            popup.removeClass(this.__followSkin);
        }
        that.__followSkin = className;


        if ($elem) {
            popup.addClass(className);
        }

        
        css[name[align[0]]] = parseInt(temp[0][align[0]]);
        css[name[align[1]]] = parseInt(temp[1][align[1]]);
        popup.css(css);

    },


    // 获取元素相对于页面的位置（包括iframe内的元素）
    // 暂时不支持两层以上的 iframe 套嵌
    __offset: function (anchor) {

        var isNode = anchor.parentNode;
        var offset = isNode ? $(anchor).offset() : {
            left: anchor.pageX,
            top: anchor.pageY
        };


        anchor = isNode ? anchor : anchor.target;
        var ownerDocument = anchor.ownerDocument;
        var defaultView = ownerDocument.defaultView || ownerDocument.parentWindow;
        
        if (defaultView == window) {// IE <= 8 只能使用两个等于号
            return offset;
        }

        // {Element Ifarme}
        var frameElement = defaultView.frameElement;
        var $ownerDocument = $(ownerDocument);
        var docLeft =  $ownerDocument.scrollLeft();
        var docTop = $ownerDocument.scrollTop();
        var frameOffset = $(frameElement).offset();
        var frameLeft = frameOffset.left;
        var frameTop = frameOffset.top;
        
        return {
            left: offset.left + frameLeft - docLeft,
            top: offset.top + frameTop - docTop
        };
    },
    
    
    // 设置屏锁遮罩
    __lock: function () {

        var that = this;
        var popup = this.__popup;
        var backdrop = this.__backdrop;
        var backdropCss = {
            position: 'fixed',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            userSelect: 'none',
            opacity: 0,
            background: this.backdropBackground
        };


        popup.addClass(this.className + '-modal');
        

        // 避免遮罩不能盖住上一次的对话框
        // 如果当前对话框是上一个对话框创建，点击的那一瞬间它会增长 zIndex 值
        Popup.zIndex = Popup.zIndex + 2;
        this.__zIndex();


        if (!_isFixed) {
            $.extend(backdropCss, {
                position: 'absolute',
                width: $(window).width() + 'px',
                height: $(document).height() + 'px'
            });
        }


        backdrop
        .css(backdropCss)
        .animate({opacity: this.backdropOpacity}, 150)
        .insertAfter(popup)
        // 锁住模态对话框的 tab 简单办法
        // 甚至可以避免焦点落入对话框外的 iframe 中
        .attr({tabindex: '0'})
        .on('focus', function () {
            that.focus();
        });

    },
    

    // 卸载屏锁遮罩
    __unlock: function () {

        if (this.modal) {
            this.__popup.removeClass(this.className + '-modal');
            this.__backdrop.remove();
            delete this.modal;
        }
    }
    
});


/** 当前叠加高度 */
Popup.zIndex = 1024;


/** 顶层浮层的实例 */
Popup.current = null;


Popup.oncreate = $.noop;


return Popup;

});
