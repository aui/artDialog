/*!
* selectbox.js
* Date: 2013-12-06
* (c) 2009-2013 TangBin, http://www.planeArt.cn
*
* This is licensed under the GNU LGPL, version 2.1 or later.
* For details, see: http://www.gnu.org/licenses/lgpl-2.1.html
*/
define(function (require) {

var $ = require('jquery');
var Popup = require('./popup');
var css = '../css/ui-selectbox.css';


// css loader: RequireJS & SeaJS
css = require[require.toUrl ? 'toUrl' : 'resolve'](css);
css = '<link rel="stylesheet" href="' + css + '" />';
$('base')[0] ? $('base').before(css) : $('head').append(css);


function Select (select, options) {

	$.extend(this, options || {});

	var that = this;
	var isIE6 = !('minWidth' in $('html')[0].style);

	select = this.select = $(select);

	if (select.is('[multiple]')) {
		return;
	}

	if (select.data('selectbox')) {
		// 删除上一次的 selectbox 以重新更新
		select.data('selectbox').remove();
	}


	var selectboxHtml = this._tpl(this.selectboxHtml, $.extend({
		textContent: that._getOption().html()
	}, select.data()));


	this._selectbox = $(selectboxHtml);
	this._value = this._selectbox.find('[data-value]');
	//this._globalClick = $.proxy(this._globalClick, this);
	this._globalKeydown = $.proxy(this._globalKeydown, this);


	select
	.on('focus blur', function (event) {
		that[event.type]();
		event.preventDefault();
	})
	.on('change', function () {
		var text = that._getOption().html();
		that._value.html(text);
	});


	this._selectbox
	.on('click focus blur', function (event) {
		that[event.type]();
	})
	.css({
		width: select.outerWidth() + 'px'
	});
	

	this._value.css({
		height: select.outerHeight() + 'px',
		lineHeight: select.outerHeight() + 'px'
	});


	// 隐藏原生 select
	// 盲人仍然可以通过 tab 键访问到原生控件
	// iPad 与 iPhone 等设备点击仍然能够使用滚动操作 select
	select.css({
		opacity: 0,
		position: 'absolute',
		left: isIE6 ? '-9999px' : 'auto',
		right: 'auto',
		top: 'auto',
		bottom: 'auto',
		zIndex: this.showDropdown ? -1 : 1
	}).data('selectbox', this);

	select.after(this._selectbox);
};

var popup = function () {};
popup.prototype = Popup.prototype;
Select.prototype = new popup;

$.extend(Select.prototype, {

	selectboxHtml:
	  '<div class="ui-selectbox" hidefocus="true" style="user-select:none" onselectstart="return false" tabindex="-1" aria-hidden>'
	+     '<div class="ui-selectbox-inner" data-value="">{{textContent}}</div>'
	+     '<i class="ui-selectbox-icon"></i>'
	+ '</div>',
	
	dropdownHtml:  '<dl class="ui-selectbox-dropdown" role="menu">{{options}}</dl>',
	optgroupHtml:  '<dt class="ui-selectbox-optgroup">{{label}}</dt>',
	optionHtml:    '<dd class="ui-selectbox-option {{className}}" data-option="{{index}}" tabindex="-1">{{textContent}}</dd>',
	selectedClass: 'ui-selectbox-selected',
	disabledClass: 'ui-selectbox-disabled',
	focusClass:    'ui-selectbox-focus',
	openClass:     'ui-selectbox-open',
	showDropdown:  !('createTouch' in document),

	selectedIndex: 0,
	value: '',


	close: function () {
		this._popup && this._popup.close().remove();
	},


	show: function () {

		var that = this;
		var select = this.select;

		if (select[0].disabled) {
			return false;
		};


		var popup = this._popup = new Popup;
		popup.offset = 0;
		popup.backdropOpacity = 0;
		popup.innerHTML = this._dropdownHtml();

		this._dropdown = $(popup.node);

		this._dropdown
		.on('click', '[data-option]', function (event) {
			var index = $(this).data('option');
			that.selected(index);
			that.close();

			event.preventDefault();
		});


		popup.onshow = function () {
			$(document).on('keydown', that._globalKeydown);
			that._selectbox.addClass(that.openClass);
		};


		popup.onremove = function () {
			$(document).off('keydown', that._globalKeydown);
			that._selectbox.removeClass(that.openClass);
		};

		$(popup.backdrop).on('click', function () {
			that.close();
		});

		popup.showModal(this._selectbox[0]);

		var isIE6 = !('minWidth' in $('html')[0].style);
		var children = this._dropdown.children();

		this._dropdown
		.css({
			minWidth: that._selectbox.outerWidth()
		});

		// 宽度设置这里可以想办法再优化下
		children.css({
			minWidth: that._selectbox.outerWidth() - 2, // 仅 IE7
			width: isIE6 ? Math.max(select.outerWidth(), children.outerWidth()) : children.width(), // 避免 IE8 hover 怪异 BUG
			overflowY: 'auto',
			overflowX: 'hidden',
			maxHeight: $(window).height() - select.outerHeight()
		});
	},


	selected: function (index) {

		if (this._getOption(index).attr('disabled')) {
			return false;
		};

		var dropdown = this._dropdown;
		var option = this._dropdown.find('[data-option=' + index + ']');
		var value = this.select[0].options[index].value;
		var oldIndex = this.select[0].selectedIndex;
		var selectedClass = this.selectedClass;

		// 更新选中状态样式
		dropdown.find('[data-option=' + oldIndex + ']').removeClass(selectedClass);
		option.addClass(selectedClass);
		option.focus();

		// 更新模拟控件的显示值
		this._value.html(this._getOption(index).html());

		// 更新 Select 对象属性
		this.value = value;
		this.selectedIndex = index;

		this.change();

		return true;
	},


	change: function () {
		if (!this.select[0].disabled) {
			this.select[0].selectedIndex = this.selectedIndex;
			this.select[0].value = this.value;
			this.select.triggerHandler('change');
		}
	},


	click: function () {
		if (!this.select[0].disabled) {
			this._popup && this._popup.open ? this.close() : this.show();
		}
	},


	focus: function () {
		if (!this.select[0].disabled) {
			this._selectbox.addClass(this.focusClass);
		};
	},


	blur: function () {
		if (!this.select[0].disabled) {
			this._selectbox.removeClass(this.focusClass);
		};
	},


	remove: function () {
		this.close();
		this._selectbox.remove();
	},


	// 获取原生 select 的 option jquery 对象
	_getOption: function (index) {
		index = index === undefined ? this.select[0].selectedIndex : index;
		return this.select.find('option').eq(index);
	},


	// 简单模板替换
	_tpl: function (tpl, data) {
		return tpl.replace(/{{(.*?)}}/g, function ($1, $2) {
			return data[$2];
		});
	},


	// 获取下拉框的 HTML
	_dropdownHtml: function () {
		var options = '';
		var that = this;
		var select = this.select;
		var selectData = select.data();
		var index = 0;


		var getOptionsData = function ($options) {
			$options.each(function () {
				var $this = $(this);
				var className = this.selected
				? that.selectedClass :
					this.disabled ? that.disabledClass : '';

				options += that._tpl(that.optionHtml, $.extend({
						value: $this.val(),
						// 如果内容类似： &#60;s&#62;选项&#60;/s&#62;
						// 使用 .text() 会导致 XSS
						// 另外，原生 option 不支持 html 文本
						textContent: $this.html(),
						index: index,
						className: className
					}, $this.data(), selectData))

				index ++;
			});
		};


		if (select.find('optgroup').length) {

			select.find('optgroup').each(function (index) {
				options += that._tpl(that.optgroupHtml, $.extend({
					index: index,
					label: this.label
				}, $(this).data(), selectData));
				getOptionsData($(this).find('option'));
			});

		} else {
			getOptionsData(select.find('option'));
		}


		return this._tpl(this.dropdownHtml, {
			options: options
		});
	},


	// 上下移动
	_go: function (n) {
		var min = 0;
		var max = this.select[0].length - 1;
		var index = this.select[0].selectedIndex + n;
		
		if (index >= min && index <= max) {
			// 跳过带有 disabled 属性的选项
			if (!this.selected(index)) {
				this._go(n + n);
			}
		}
	},


	// 全局键盘监听
	_globalKeydown: function (event) {

		var p;

        switch (event.keyCode) {
            case 8:
                // backspace
                p = true;
                break;

            // tab
            case 9:
            // esc
            case 27:
            // enter
            case 13:
                this.close();
                p = true;
                break;

            // up
            case 38:

            	this._go(-1);
                p = true;
                break;

            // down
            case 40:

            	this._go(1);
                p = true;
                break;
        }

        p && event.preventDefault();
	}

});


return function (elem, options) {
	// 注意：不要返回 Select 更多接口给外部，只保持装饰用途，以便后续可以灵活取消装饰

	if (elem.type === 'select') {
		new Select(elem, options);
	} else {
		$(elem).each(function () {
			new Select(this, options);
		});
	}
};

});