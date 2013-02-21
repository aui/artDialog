/*!
* artDialog 5.0.3
* Date: 2013-02-20
* https://github.com/aui/artDialog
* (c) 2009-2013 TangBin, http://www.planeArt.cn
*
* This is licensed under the GNU LGPL, version 2.1 or later.
* For details, see: http://creativecommons.org/licenses/LGPL/2.1/
*/


;(function ($, window, undefined) {

// artDialog 只支持 xhtml 1.0 或者以上的 DOCTYPE 声明
if (document.compatMode === 'BackCompat') {
    throw new Error('artDialog: Document types require more than xhtml1.0');
};

var _singleton,
    _count = 0,
    _activeElement = document.activeElement,
    _root = $(document.getElementsByTagName('html')[0]),
    _expando = 'artDialog' + (+ new Date),
    _isIE6 = window.VBArray && !window.XMLHttpRequest,
    _isMobile = 'createTouch' in document && !('onmousemove' in document)
        || /(iPhone|iPad|iPod)/i.test(navigator.userAgent),
    _isFixed = !_isIE6 && !_isMobile;

    
var artDialog = function (config, ok, cancel) {

    config = config || {};
    
    if (typeof config === 'string' || config.nodeType === 1) {
    
        config = {content: config, fixed: !_isMobile};
    };
    
    
    var api, defaults = artDialog.defaults;
    var elem = config.follow = this.nodeType === 1 && this || config.follow;
        
    
    // 合并默认配置
    for (var i in defaults) {
        if (config[i] === undefined) {
            config[i] = defaults[i];
        };
    };

    
    config.id = elem && elem[_expando + 'follow'] || config.id || _expando + _count;
    api = artDialog.list[config.id];
    
    
    
    if (api) {
        if (elem) {
            api.follow(elem)
        };
        api.zIndex().focus();
        _activeElement = document.activeElement;
        return api;
    };
    
    
    
    // 目前主流移动设备对fixed支持不好，禁用此特性
    if (!_isFixed) {
        config.fixed = false;
    };
    
    // !$.isArray(config.button)
    if (!config.button || !config.button.push) {
        config.button = [];
    };
    
    
    // 确定按钮
    if (ok !== undefined) {
        config.ok = ok;
    };
    
    if (config.ok) {
        config.button.push({
            id: 'ok',
            value: config.okValue,
            callback: config.ok,
            focus: true
        });
    };
    
    
    // 取消按钮
    if (cancel !== undefined) {
        config.cancel = cancel;
    };
    
    if (config.cancel) {
        config.button.push({
            id: 'cancel',
            value: config.cancelValue,
            callback: config.cancel
        });
    };
    
    // 更新 zIndex 全局配置
    artDialog.defaults.zIndex = config.zIndex;
    
    _count ++;

    return artDialog.list[config.id] = _singleton ?
        _singleton.constructor(config) : new artDialog.fn.constructor(config);
};

artDialog.version = '5.0.3';

artDialog.fn = artDialog.prototype = {
    
    /** @inner */
    constructor: function (config) {
        var dom;

        _activeElement = document.activeElement;
        
        this.closed = false;
        this.config = config;
        this.dom = dom = this.dom || this._innerHTML(config);
        
        config.skin && dom.wrap.addClass(config.skin);
        
        dom.wrap.css('position', config.fixed ? 'fixed' : 'absolute');
        dom.close[config.cancel === false ? 'hide' : 'show']();
        dom.content.css('padding', config.padding);
        
        this.button.apply(this, config.button);
        
        this.title(config.title)
        .content(config.content)
        .size(config.width, config.height)
        .time(config.time);
        
        this._reset();
        
        this.zIndex();
        config.lock && this.lock();
        
        this._addEvent();
        this[config.visible ? 'visible' : 'hidden']().focus();
        
        _singleton = null;
        
        config.initialize && config.initialize.call(this);
        
        return this;
    },
    
    
    /**
    * 设置内容
    * @param    {String, HTMLElement, Object}   内容 (可选)
    */
    content: function (message) {
    
        var prev, next, parent, display,
            that = this,
            $content = this.dom.content,
            content = $content[0];
        
        
        if (this._elemBack) {
            this._elemBack();
            delete this._elemBack;
        };
        
        
        if (typeof message === 'string') {
        
            $content.html(message);
        } else
        
        if (message && message.nodeType === 1) {
        
            // 让传入的元素在对话框关闭后可以返回到原来的地方
            display = message.style.display;
            prev = message.previousSibling;
            next = message.nextSibling;
            parent = message.parentNode;
            
            this._elemBack = function () {
                if (prev && prev.parentNode) {
                    prev.parentNode.insertBefore(message, prev.nextSibling);
                } else if (next && next.parentNode) {
                    next.parentNode.insertBefore(message, next);
                } else if (parent) {
                    parent.appendChild(message);
                };
                message.style.display = display;
                that._elemBack = null;
            };
            
            $content.html('');
            content.appendChild(message);
            $(message).show();
            
        };
        
        this._reset();
        
        return this;
    },
    
    
    /**
    * 设置标题
    * @param    {String, Boolean}   标题内容. 为 false 则隐藏标题栏
    */
    title: function (content) {
    
        var dom = this.dom,
            outer = dom.outer,
            $title = dom.title,
            className = 'd-state-noTitle';
        
        if (content === false) {
            $title.hide().html('');
            outer.addClass(className);
        } else {
            $title.show().html(content);
            outer.removeClass(className);
        };
        
        return this;
    },
    

    /** @inner 位置居中 */
    position: function () {
    
        var dom = this.dom,
            wrap = dom.wrap[0],
            $window = dom.window,
            $document = dom.document,
            fixed = this.config.fixed,
            dl = fixed ? 0 : $document.scrollLeft(),
            dt = fixed ? 0 : $document.scrollTop(),
            ww = $window.width(),
            wh = $window.height(),
            ow = wrap.offsetWidth,
            oh = wrap.offsetHeight,
            left = (ww - ow) / 2 + dl,
            top = (wh - oh) * 382 / 1000 + dt,// 黄金比例
            style = wrap.style;

        style.left = Math.max(parseInt(left), dl) + 'px';
        style.top = Math.max(parseInt(top), dt) + 'px';

        if (this._follow) {
            this._follow.removeAttribute(_expando + 'follow');
            this._follow = null;
        }
        
        return this;
    },
    
    
    /**
    *   尺寸
    *   @param  {Number, String}    宽度
    *   @param  {Number, String}    高度
    */
    size: function (width, height) {
    
        var style = this.dom.main[0].style;
        
        if (typeof width === 'number') {
            width = width + 'px';
        };
        
        if (typeof height === 'number') {
            height = height + 'px';
        };
            
        style.width = width;
        style.height = height;
        
        return this;
    },
    
    
    /**
    * 跟随元素
    * @param    {HTMLElement}
    */
    follow: function (elem) {
    
        var $elem = $(elem),
            config = this.config;
        
        
        // 隐藏元素不可用
        if (!elem || !elem.offsetWidth && !elem.offsetHeight) {
        
            return this.position(this._left, this._top);
        };
        
        var fixed = config.fixed,
            expando = _expando + 'follow',
            dom = this.dom,
            $window = dom.window,
            $document = dom.document,
            
            winWidth = $window.width(),
            winHeight = $window.height(),
            docLeft =  $document.scrollLeft(),
            docTop = $document.scrollTop(),
            offset = $elem.offset(),
            
            width = elem.offsetWidth,
            height = elem.offsetHeight,
            left = fixed ? offset.left - docLeft : offset.left,
            top = fixed ? offset.top - docTop : offset.top,
            
            wrap = this.dom.wrap[0],
            style = wrap.style,
            wrapWidth = wrap.offsetWidth,
            wrapHeight = wrap.offsetHeight,
            setLeft = left - (wrapWidth - width) / 2,
            setTop = top + height,
            
            dl = fixed ? 0 : docLeft,
            dt = fixed ? 0 : docTop;
            
            
        setLeft = setLeft < dl ? left :
        (setLeft + wrapWidth > winWidth) && (left - wrapWidth > dl)
        ? left - wrapWidth + width
        : setLeft;

        
        setTop = (setTop + wrapHeight > winHeight + dt)
        && (top - wrapHeight > dt)
        ? top - wrapHeight
        : setTop;
        
        
        style.left = parseInt(setLeft) + 'px';
        style.top = parseInt(setTop) + 'px';
        
        
        this._follow && this._follow.removeAttribute(expando);
        this._follow = elem;
        elem[expando] = config.id;
        
        return this;
    },
    
    
    /**
    * 自定义按钮
    * @example
        button({
            value: 'login',
            callback: function () {},
            disabled: false,
            focus: true
        }, .., ..)
    */
    button: function () {
    
        var dom = this.dom,
            $buttons = dom.buttons,
            elem = $buttons[0],
            strongButton = 'd-state-highlight',
            listeners = this._listeners = this._listeners || {},
            ags = [].slice.call(arguments);
            
        var i = 0, val, value, id, isNewButton, button;
        
        for (; i < ags.length; i ++) {
            
            val = ags[i];
            
            value = val.value;
            id = val.id || value;
            isNewButton = !listeners[id];
            button = !isNewButton ? listeners[id].elem : document.createElement('input');
            
            button.type = 'button';
            button.className = 'd-button';
                    
            if (!listeners[id]) {
                listeners[id] = {};
            };
            
            if (value) {
                button.value = value;
            };
            
            if (val.width) {
                button.style.width = val.width;
            };
            
            if (val.callback) {
                listeners[id].callback = val.callback;
            };
            
            if (val.focus) {
                this._focus && this._focus.removeClass(strongButton);
                this._focus = $(button).addClass(strongButton);
                this.focus();
            };
            
            button[_expando + 'callback'] = id;
            button.disabled = !!val.disabled;
            

            if (isNewButton) {
                listeners[id].elem = button;
                elem.appendChild(button);
            };
        };
        
        $buttons[0].style.display = ags.length ? '' : 'none';
        
        return this;
    },
    
    
    /** 显示对话框 */
    visible: function () {
        //this.dom.wrap.show();
        this.dom.wrap.css('visibility', 'visible');
        this.dom.outer.addClass('d-state-visible');
        
        if (this._isLock) {
            this._lockMask.show();
        };
        
        return this;
    },
    
    
    /** 隐藏对话框 */
    hidden: function () {
        //this.dom.wrap.hide();
        this.dom.wrap.css('visibility', 'hidden');
        this.dom.outer.removeClass('d-state-visible');
        
        if (this._isLock) {
            this._lockMask.hide();
        };
        
        return this;
    },
    
    
    /** 关闭对话框 */
    close: function () {
    
        if (this.closed) {
            return this;
        };
    
        var dom = this.dom,
            $wrap = dom.wrap,
            list = artDialog.list,
            beforeunload = this.config.beforeunload;
        
        if (beforeunload && beforeunload.call(this) === false) {
            return this;
        };
        
        
        if (artDialog.focus === this) {
            artDialog.focus = null;
        };
        
        
        if (this._follow) {
            this._follow.removeAttribute(_expando + 'follow');
        }
        
        
        if (this._elemBack) {
            this._elemBack();
        };
        
        
        
        this.time();
        this.unlock();
        this._removeEvent();
        delete list[this.config.id];

        
        if (_singleton) {
        
            $wrap.remove();
        
        // 使用单例模式
        } else {
        
            _singleton = this;
            
            dom.title.html('');
            dom.content.html('');
            dom.buttons.html('');
            
            $wrap[0].className = $wrap[0].style.cssText = '';
            dom.outer[0].className = 'd-outer';
            
            $wrap.css({
                left: 0,
                top: 0,
                position: _isFixed ? 'fixed' : 'absolute'
            });
            
            for (var i in this) {
                if (this.hasOwnProperty(i) && i !== 'dom') {
                    delete this[i];
                };
            };
            
            this.hidden();
            
        };

        // 恢复焦点，照顾键盘操作的用户
        if (_activeElement) {
            _activeElement.focus();
        }
        
        this.closed = true;
        return this;
    },
    
    
    /**
    * 定时关闭
    * @param    {Number}    单位毫秒, 无参数则停止计时器
    */
    time: function (time) {
    
        var that = this,
            timer = this._timer;
            
        timer && clearTimeout(timer);
        
        if (time) {
            this._timer = setTimeout(function(){
                that._click('cancel');
            }, time);
        };
        
        
        return this;
    },
    
    /** @inner 设置焦点 */
    focus: function () {

        if (this.config.focus) {
            //setTimeout(function () {
                try {
                    var elem = this._focus && this._focus[0] || this.dom.close[0];
                    elem && elem.focus();
                // IE对不可见元素设置焦点会报错
                } catch (e) {};
            //}, 0);
        };
        
        return this;
    },
    
    
    /** 置顶对话框 */
    zIndex: function () {
    
        var dom = this.dom,
            top = artDialog.focus,
            index = artDialog.defaults.zIndex ++;
        
        // 设置叠加高度
        dom.wrap.css('zIndex', index);
        this._lockMask && this._lockMask.css('zIndex', index - 1);
        
        // 设置最高层的样式
        top && top.dom.outer.removeClass('d-state-focus');
        artDialog.focus = this;
        dom.outer.addClass('d-state-focus');
        
        return this;
    },
    
    
    /** 设置屏锁 */
    lock: function () {
    
        if (this._isLock) {
            return this;
        };
        
        var that = this,
            config = this.config,
            dom = this.dom,
            div = document.createElement('div'),
            $div = $(div),
            index = artDialog.defaults.zIndex - 1;
        
        this.zIndex();
        dom.outer.addClass('d-state-lock');
            
        $div.css({
            zIndex: index,
            position: 'fixed',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden'
        }).addClass('d-mask');
        
        if (!_isFixed) {
            $div.css({
                position: 'absolute',
                width: $(window).width() + 'px',
                height: $(document).height() + 'px'
            });
        };
        
            
        $div.bind('dblclick', function () {
            that._click('cancel');
        });
        
        document.body.appendChild(div);
        
        this._lockMask = $div;
        this._isLock = true;
        
        return this;
    },
    
    
    /** 解开屏锁 */
    unlock: function () {

        if (!this._isLock) {
            return this;
        };
        
        this._lockMask.unbind();
        this._lockMask.hide();
        this._lockMask.remove();
        
        this.dom.outer.removeClass('d-state-lock');
        this._isLock = false;

        return this;
    },
    
    
    // 获取元素
    _innerHTML: function (data) {
    
        var body = document.body;
        
        if (!body) {
            throw new Error('artDialog: "documents.body" not ready');
        };
        
        var wrap = document.createElement('div');
            
        wrap.style.cssText = 'position:absolute;left:0;top:0';

        wrap.innerHTML = artDialog._templates
        .replace(/{([^}]+)}/g, function ($0, $1) {
            var value = data[$1];
            return typeof value === 'string' ? value : '';
        });

        body.insertBefore(wrap, body.firstChild);
        
        var name,
            i = 0,
            dom = {},
            els = wrap.getElementsByTagName('*'),
            elsLen = els.length;
            
        for (; i < elsLen; i ++) {
            name = els[i].className.split('d-')[1];
            if (name) {
                dom[name] = $(els[i]);
            };
        };
        
        dom.window = $(window);
        dom.document = $(document);
        dom.wrap = $(wrap);
        
        return dom;
    },
    
    
    // 按钮回调函数触发
    _click: function (id) {
    
        var fn = this._listeners[id] && this._listeners[id].callback;
            
        return typeof fn !== 'function' || fn.call(this) !== false ?
            this.close() : this;
    },
    
    
    // 重置位置
    _reset: function () {
        var elem = this.config.follow || this._follow;
        elem ? this.follow(elem) : this.position();
    },
    
    
    // 事件代理
    _addEvent: function () {
    
        var that = this,
            dom = this.dom;
        
        
        // 监听点击
        dom.wrap
        .bind('click', function (event) {
        
            var target = event.target, callbackID;
            
            // IE BUG
            if (target.disabled) {
                return false;
            };
            
            if (target === dom.close[0]) {
                that._click('cancel');
                return false;
            } else {
                callbackID = target[_expando + 'callback'];
                callbackID && that._click(callbackID);
            };
            
        })
        .bind('mousedown', function () {
            that.zIndex();
        });
        
    },
    
    
    // 卸载事件代理
    _removeEvent: function () {
        this.dom.wrap.unbind();
    }
    
};

artDialog.fn.constructor.prototype = artDialog.fn;



$.fn.dialog = $.fn.artDialog = function () {
    var config = arguments;
    this[this.live ? 'live' : 'bind']('click', function () {
        artDialog.apply(this, config);
        return false;
    });
    return this;
};



/** 最顶层的对话框API */
artDialog.focus = null;



/**
* 根据 ID 获取某对话框 API
* @param    {String}    对话框 ID
* @return   {Object}    对话框 API (实例)
*/
artDialog.get = function (id) {
    return id === undefined
    ? artDialog.list
    : artDialog.list[id];
};

artDialog.list = {};



// 全局快捷键
$(document).bind('keydown', function (event) {
    var target = event.target,
        nodeName = target.nodeName,
        rinput = /^input|textarea$/i,
        api = artDialog.focus,
        keyCode = event.keyCode;

    if (!api || !api.config.esc || rinput.test(nodeName) && target.type !== 'button') {
        return;
    };
    
    // ESC
    keyCode === 27 && api._click('cancel');
});


// 锁屏限制tab
function focusin (event) {
    var api = artDialog.focus;
    if (api && api._isLock && !api.dom.wrap[0].contains(event.target)) {
        event.stopPropagation();
        api.focus();
    }
}

if ($.fn.live) {
    $('body').live('focus', focusin);
}/* else if (document.addEventListener) {
    document.addEventListener('focus', focusin, true);
}*/



// 浏览器窗口改变后重置对话框位置
$(window).bind('resize', function () {
    var dialogs = artDialog.list;
    for (var id in dialogs) {
        dialogs[id]._reset();
    };
});



// XHTML 模板
// 使用 uglifyjs 压缩能够预先处理"+"号合并字符串
// @see http://marijnhaverbeke.nl/uglifyjs
artDialog._templates = 
'<div class="d-outer" role="dialog" tabindex="-1" aria-labelledby="d-title-{id}" aria-describedby="d-content-{id}">'
+   '<table class="d-border">'
+       '<tbody>'
+           '<tr>'
+               '<td class="d-nw"></td>'
+               '<td class="d-n"></td>'
+               '<td class="d-ne"></td>'
+           '</tr>'
+           '<tr>'
+               '<td class="d-w"></td>'
+               '<td class="d-c">'
+                   '<div class="d-inner">'
+                   '<table class="d-dialog">'
+                       '<tbody>'
+                           '<tr>'
+                               '<td class="d-header">'
+                                   '<div class="d-titleBar">'
+                                       '<div id="d-title-{id}" class="d-title"></div>'
+                                       '<a class="d-close" href="javascript:;">×</a>'
+                                   '</div>'
+                               '</td>'
+                           '</tr>'
+                           '<tr>'
+                               '<td class="d-main">'
+                                   '<div id="d-content-{id}" class="d-content"></div>'
+                               '</td>'
+                           '</tr>'
+                           '<tr>'
+                               '<td class="d-footer">'
+                                   '<div class="d-buttons"></div>'
+                               '</td>'
+                           '</tr>'
+                       '</tbody>'
+                   '</table>'
+                   '</div>'
+               '</td>'
+               '<td class="d-e"></td>'
+           '</tr>'
+           '<tr>'
+               '<td class="d-sw"></td>'
+               '<td class="d-s"></td>'
+               '<td class="d-se"></td>'
+           '</tr>'
+       '</tbody>'
+   '</table>'
+'</div>';



/**
 * 默认配置
 */
artDialog.defaults = {

    // 消息内容
    content: '<div class="d-loading"><span>loading..</span></div>',
    
    // 标题
    title: 'message',
    
    // 自定义按钮
    button: null,
    
    // 确定按钮回调函数
    ok: null,
    
    // 取消按钮回调函数
    cancel: null,
    
    // 对话框初始化后执行的函数
    initialize: null,
    
    // 对话框关闭前执行的函数
    beforeunload: null,
    
    // 确定按钮文本
    okValue: 'ok',
    
    // 取消按钮文本
    cancelValue: 'cancel',
    
    // 内容宽度
    width: 'auto',
    
    // 内容高度
    height: 'auto',
    
    // 内容与边界填充距离
    padding: '20px 25px',
    
    // 皮肤名(多皮肤共存预留接口)
    skin: null,
    
    // 自动关闭时间
    time: null,
    
    // 是否支持Esc键关闭
    esc: true,
    
    // 是否支持对话框按钮自动聚焦
    focus: true,
    
    // 初始化后是否显示对话框
    visible: true,
    
    // 让对话框跟随某元素
    follow: null,
    
    // 是否锁屏
    lock: false,
    
    // 是否固定定位
    fixed: false,
    
    // 对话框叠加高度值(重要：此值不能超过浏览器最大限制)
    zIndex: 1987
    
};

this.artDialog = $.dialog = $.artDialog = artDialog;
}(this.art || this.jQuery, this));


