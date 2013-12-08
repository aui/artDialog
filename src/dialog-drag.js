/*!
* artDialog v6.0.0 - 拖拽插件
* Date: 2013-12-06
* https://github.com/aui/artDialog6
* (c) 2009-2013 TangBin, http://www.planeArt.cn
*
* This is licensed under the GNU LGPL, version 2.1 or later.
* For details, see: http://www.gnu.org/licenses/lgpl-2.1.html
*/
define(function (require) {

var $ = require('jquery');
var Popup = require('./popup');
var drag = require('./drag');
var dialog = require('./dialog')

Popup.oncreate = function (api) {
	$(api.node).on(drag.types.start, '[i=title]', function (event) {
		if (!api.follow) {
			drag.create(api.node, event);
		}
	});
};

return dialog;

});