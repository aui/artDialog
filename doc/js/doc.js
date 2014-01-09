define(function (require) {
	
var $ = require('jquery');
var dialog = require('../../src/dialog-plus');
//var sh_languages = require('./sh_languages');
var css = '../css/doc.css';


// css loader: RequireJS & SeaJS
css = require[require.toUrl ? 'toUrl' : 'resolve'](css);
css = '<link rel="stylesheet" href="' + css + '" />';
$('base')[0] ? $('base').before(css) : $('head').append(css);

window.dialog = dialog;
window.$ = window.jQuery = $;
window.console = window.console || {
	log: $.noop
};


var codes = {};
var debug = location.href.indexOf('Users/tangbin') !== -1;

$(function () {

	console.log('你可以在调试器中粘贴本页示例代码运行');

	var RE = /[\n\s\t]*?\/\/\.\.[\r\n]/;
	$('pre code').each(function (index) {
		var $this = $(this);
		var code = $this.text();


		//$this.addClass('sh_javascript')

		// 忽略不完整的代码片段
		// 开头使用"//.."表示
		if (RE.test(code)) {
			$this.text(code.replace(RE, ''));
			return;
		}

		try {
			codes[index] = new Function(code);
		} catch (e) {
			return;
		}

		$this
		//.addClass('sh_javascript')
		.after('<div class="doc-line"></div>'
			+'<button data-code="' + index + '">运行</button>');
	});

	// 代码高亮
	//setTimeout(sh_languages, 500);

	// 回到顶部
	var $top = $('<a class="doc-gotop" href="javascript:;">TOP</a>')
	.on('click', function () {
		$(window).scrollTop(0);
		return false;
	});
	$('body').append($top);
});


var runCode = function (id) {
	codes[id]();

	var api = dialog.getCurrent();
	if (debug && api) {
		console.log(api);
	}
};


$(document).on('click', 'button[data-code]', function () {
	var id = $(this).data('code');
	runCode(id);
	return false;
}).on('click', 'h1 [id], h2 [id], h3 [id], h4 [id], h5 [id], h6 [id]', function () {
	var id = this.id;
	location.hash = id;
});

});