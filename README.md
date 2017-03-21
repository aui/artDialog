#	artDialog

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]

artDialog——经典、优雅的网页对话框控件。

[文档与示例](http://aui.github.io/artDialog/doc/index.html) | [AngularJS 版本](https://github.com/aui/angular-popups)

```
npm install --save-dev art.dialog
```

##	成功案例

超过 40 万网站在使用 artDialog，其中不乏国内顶尖的产品：

*	[QQ空间 v8（腾讯）](http://qzone.qq.com)
*	[Phpcms（盛大）](http://www.phpcms.cn)
*	[极路由](http://www.hiwifi.com)
*	...

##	更新历史

7.0.0

1. 支持 Webpack
2. 支持 Npm
2. 将 CSS 打包到 JS 中

6.0.4

1. ``content()``方法传入隐藏元素并显示，并且``remove()``的时候会将元素插入到``body``避免被销毁 [#103](https://github.com/aui/artDialog/issues/103) [#126](https://github.com/aui/artDialog/issues/126)
2. 修复``button``方法可能会多次绑定事件的问题
3. 模态对话框可以避免 shift + tab 将焦点移出对话框 [#67](https://github.com/aui/artDialog/issues/67)

6.0.3

1. 修复``button``方法直接传入 html 不显示的问题
2. 修复版本管理导致[#78](https://github.com/aui/artDialog/issues/78)重现问题

6.0.2

1. 提供无依赖 seajs 与 requirejs 的版本
2. 取消按钮增加``cancelDisplay``配置，保留``cancel``事件的同时也不会显示取消按钮

6.0.1

1. 进一步完善焦点管理，避免抢夺开发者自己设置的焦点[#67](https://github.com/aui/artDialog/issues/67)
2. 修复对话框内容使用 html5 data-id 属性冲突的问题[#78](https://github.com/aui/artDialog/issues/78)
3. 改善 Esc 快捷键与 cancel 的问题[#36](https://github.com/aui/artDialog/issues/36)

6.0.0

1. 功能增强：支持定义左下角的区域 HTML、支持 12 个方向的气泡对话框、支持无标题栏与按钮区的对话框
2. 更好的交互体验：更加先进的焦点管理，支持无障碍访问
3. 面向未来：基于 HTML5 Dialog 的 API
4. 模块化：支持 AMD、CMD 规范
5. 可选增强版：拖拽支持、简化框架页面调用

##	授权协议

免费，且开源，基于[LGPL-3.0](./LICENSE.md)协议。


[npm-image]: https://img.shields.io/npm/v/art.dialog.svg
[npm-url]: https://npmjs.org/package/art.dialog
[downloads-image]: https://img.shields.io/npm/dm/art.dialog.svg
[downloads-url]: https://npmjs.org/package/art.dialog
