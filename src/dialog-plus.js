/*!
 * artDialog-plus
 * Date: 2013-11-09
 * https://github.com/aui/artDialog
 * (c) 2009-2014 TangBin, http://www.planeArt.cn
 *
 * This is licensed under the GNU LGPL, version 2.1 or later.
 * For details, see: http://www.gnu.org/licenses/lgpl-2.1.html
 */
define(function (require) {

var $ = require('jquery');
var dialog = require('./dialog');
var drag = require('./drag');

dialog.oncreate = function (api) {

    var options = api.options;
    var originalOptions = options.original;

    // 页面地址
    var url = options.url;
    // 页面加载完毕的事件
    var oniframeload = options.oniframeload;

    var $iframe;


    if (url) {
        this.padding = options.padding = 0;

        $iframe = $('<iframe />');

        $iframe.attr({
            src: url,
            name: api.id,
            width: '100%',
            height: '100%',
            allowtransparency: 'yes',
            frameborder: 'no',
            scrolling: 'yes'
        })
        .on('load', function () {
            var test;
            
            try {
                // 跨域测试
                test = $iframe[0].contentWindow.frameElement;
            } catch (e) {}

            if (test) {

                if (!options.width) {
                    api.width($iframe.contents().width());
                }
                
                if (!options.height) {
                    api.height($iframe.contents().height());
                    // 节流, 避免在事件流中频繁执行回调函数浪费浏览器资源
                    // fn为回调函数; wait为回调执行的间隔时间, 单位ms; context为执行环境
                    var throttle = function (fn, wait, context) {
                        var tid = null;
                        var lastTime;
                        context = context || this;
                        return function thrttl () {
                            var now = +new Date();
                            if (!lastTime) lastTime = now;
                            var remain = wait - (now - lastTime);
                            if (remain <= 0) {
                                clearTimeout(tid);
                                tid = null;
                                fn.call(context);
                                lastTime = now;
                            } else if(!tid) {
                                tid = setTimeout(thrttl, remain);
                            }
                        }
                    }
                    // 调节iframe高度, 触发时每200ms执行一次
                    var adjustHeight = throttle(function () {
                        // iframe高度取iframe内容高度和其父窗口高度的最小值
                        // 120px 为对话框本身 header和footer占用高度
                        api.height(Math.min($iframe.contents().height(), $(window).height() - 120));
                    }, 200);
                    // iframe内容变化时调整iframe高度
                    // 事件 DOMSubtreeModified 针对标准浏览器
                    // 事件 propertychange 则针对IE
                    $iframe.contents().on('DOMSubtreeModified propertychange',adjustHeight);
                    // 父窗口大小改变时调整iframe大小
                    $(window).on('resize', adjustHeight);
                    // 在对话框移除时去掉事件绑定
                    api.onbeforeremove = function () {
                        $iframe.contents().off('DOMSubtreeModified propertychange',adjustHeight);
                        $(window).off('resize', adjustHeight);
                    }
                }
            }

            if (oniframeload) {
                oniframeload.call(api);
            }

        });

        api.addEventListener('beforeremove', function () {

            // 重要！需要重置iframe地址，否则下次出现的对话框在IE6、7无法聚焦input
            // IE删除iframe后，iframe仍然会留在内存中出现上述问题，置换src是最容易解决的方法
            $iframe.attr('src', 'about:blank').remove();


        }, false);

        api.content($iframe[0]);

        api.iframeNode = $iframe[0];

    }


    // 对于子页面呼出的对话框特殊处理
    // 如果对话框配置来自 iframe
    if (!(originalOptions instanceof Object)) {

        var un = function () {
            api.close().remove();
        };

        // 找到那个 iframe
        for (var i = 0; i < frames.length; i ++) {
            try {
                if (originalOptions instanceof frames[i].Object) {
                    // 让 iframe 刷新的时候也关闭对话框，
                    // 防止要执行的对象被强制收回导致 IE 报错：“不能执行已释放 Script 的代码”
                    $(frames[i]).one('unload', un);
                    break;
                }
            } catch (e) {} 
        }
    }


    // 拖拽支持
    $(api.node).on(drag.types.start, '[i=title]', function (event) {
        // 排除气泡类型的对话框
        if (!api.follow) {
            api.focus();
            drag.create(api.node, event);
        }
    });

};



dialog.get = function (id) {

    // 从 iframe 传入 window 对象
    if (id && id.frameElement) {
        var iframe = id.frameElement;
        var list = dialog.list;
        var api;
        for (var i in list) {
            api = list[i];
            if (api.node.getElementsByTagName('iframe')[0] === iframe) {
                return api;
            }
        }
    // 直接传入 id 的情况
    } else if (id) {
        return dialog.list[id];
    }

};



return dialog;

});
