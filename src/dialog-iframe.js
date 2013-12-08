/*!
* artDialog v6.0.0 - iframe 插件
* Date: 2013-12-06
* https://github.com/aui/artDialog6
* (c) 2009-2013 TangBin, http://www.planeArt.cn
*
* This is licensed under the GNU LGPL, version 2.1 or later.
* For details, see: http://www.gnu.org/licenses/lgpl-2.1.html
*/
define(function (require) {

var $ = require('jquery');
var dialog = require('./dialog');

return $.extend(function (options) {

	options = options || {};
	var url = options.url;
	var oniframeload = options.oniframeload;

	options.padding = 0;

	var api = dialog(options);
	var $iframe = $('<iframe />');

	$iframe.attr({
		src: url,
		name: api.id,
		width: '100%',
		height: '100%',
		allowtransparency: 'yes',
		frameborder: 'no',
		scrolling: 'no'
	})
	.on('load', function () {
		var test;
		
		try {
			// 跨域测试
			test = $iframe[0].contentWindow.frameElement;
		} catch (e) {}

		if (test) {
			!options.width && api.width($iframe.contents().width());
			!options.height && api.height($iframe.contents().height());
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

	return api;

}, dialog);

});