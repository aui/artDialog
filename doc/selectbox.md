#	selectbox

######	select 修饰器 - 让 select 原生控件可自定义样式与结构

===================

**请注意**：原生 select 是一个很基础的 UI 控件，包含大量的交互逻辑。如果想要“美化”它必须重新使用 HTML 与 CSS 实现一套，复杂度极高，作为前端工程师的我们应该了解其利弊，尽可能的对项目进行审视，是否为了一点视觉细节而加剧项目复杂度？如果你认为值得尝试，请相信这是你见过的世界上最负责的模拟下拉控件，没有之一。

##	特性

###	已经模拟的特性

* 用户操作产生的数据可同步到原生 select 控件，不会破坏表单特性
* 操作可触发原生 select 的 onchange 事件
* iPhone 、iPad 点击能显示滚轮
* 盲人的读屏器操作支持
* 基本快捷键支持
* 自适应位置
* label 标签 for 行为支持
* 自动 zIndex 值
* disabled 属性
* optgroup 选项分组
* 点击页面任意空白区域自动关闭（包括 iframe）
* 超多选项自动使用滚动条并自动滚动到选中项

###	不支持的特性

* 原生 select 控件的 DOM 操作无法自动同步到模拟控件
* multiple 属性
* 其他未列举的特性…

###	兼容性

* IE6~IE11
* Chrome
* Firefox
* Safari
* Opera

##	调用

在模块中引入 selectbox（使用 RequireJS 或 SeaJS 加载）：

```
var selectbox = require('./popup/src/selectbox');
```

###	接口

```
selectbox(HTMLElement, Options)
```

其中 HTMLElement 是要修饰的原生 select 节点，Options 是可选项，用来进行自定义模板结构。

若原生的 select 控件被更新，重新执行 selectbox 即可保持同步。

###	修饰原生下拉控件

```
<select id="demo-basic">
	<option selected value="0">---请选择---</option>
	<option value="1">选项二</option>
	<option value="2">选项二</option>
	<option value="3">选项三</option>
	<option value="4">选项四</option>
	<option value="5">选项五</option>
</select>
```

```
selectbox(document.getElementById('demo-basic'));
```

<select id="demo-basic">
	<option selected value="0">---请选择---</option>
	<option value="1">选项二</option>
	<option value="2">选项二</option>
	<option value="3">选项三</option>
	<option value="4">选项四</option>
	<option value="5">选项五</option>
</select> <button id="start-demo-basic">执行</button>

###	高级：自定义模板

例如我们生成一个包含图片的下拉列表：

```
<select id="demo-select-img">
	<optgroup label="常用">
		<option value="e100" data-icon="http://ctc.qzonestyle.gtimg.cn/qzone/em/e100.gif">微笑</option>
		<option value="e101" data-icon="http://ctc.qzonestyle.gtimg.cn/qzone/em/e101.gif">瘪嘴</option>
		<option value="e102" data-icon="http://ctc.qzonestyle.gtimg.cn/qzone/em/e102.gif">发情</option>
		<option value="e103" data-icon="http://ctc.qzonestyle.gtimg.cn/qzone/em/e103.gif">惊讶</option>
		<option value="e104" data-icon="http://ctc.qzonestyle.gtimg.cn/qzone/em/e104.gif">得意</option>
		<option value="e105" data-icon="http://ctc.qzonestyle.gtimg.cn/qzone/em/e105.gif">哭泣</option>
	</optgroup>
	<optgroup label="爱情">
		<option value="e163" data-icon="http://ctc.qzonestyle.gtimg.cn/qzone/em/e163.gif">玫瑰</option>
		<option value="e164" data-icon="http://ctc.qzonestyle.gtimg.cn/qzone/em/e164.gif">凋谢</option>
		<option disabled value="e165" data-icon="http://ctc.qzonestyle.gtimg.cn/qzone/em/e165.gif">亲吻(黄钻用户专享)</option>
	</optgroup>
</select>
```

上面是原生 select 控件的 HTML 代码，注意到我们将图片属性写在了``<option>``标签的自定义属性``data-icon``上，接下来我们根据它转换带图的下拉选项：

```
selectbox(document.getElementById('demo-select-img'), {
	optionHtml: '<dd class="ui-selectbox-option {{className}}" data-option="{{index}}" tabindex="-1"><img src="{{icon}}" alt="icon" style="width:16px;height:16px;vertical-align:middle" /> {{textContent}}</dd>'
});
```

<select id="demo-diy">
	<optgroup label="常用">
		<option value="e100" data-icon="http://ctc.qzonestyle.gtimg.cn/qzone/em/e100.gif">微笑</option>
		<option value="e101" data-icon="http://ctc.qzonestyle.gtimg.cn/qzone/em/e101.gif">瘪嘴</option>
		<option value="e102" data-icon="http://ctc.qzonestyle.gtimg.cn/qzone/em/e102.gif">发情</option>
		<option value="e103" data-icon="http://ctc.qzonestyle.gtimg.cn/qzone/em/e103.gif">惊讶</option>
		<option value="e104" data-icon="http://ctc.qzonestyle.gtimg.cn/qzone/em/e104.gif">得意</option>
		<option value="e105" data-icon="http://ctc.qzonestyle.gtimg.cn/qzone/em/e105.gif">哭泣</option>
	</optgroup>
	<optgroup label="爱情">
		<option value="e163" data-icon="http://ctc.qzonestyle.gtimg.cn/qzone/em/e163.gif">玫瑰</option>
		<option value="e164" data-icon="http://ctc.qzonestyle.gtimg.cn/qzone/em/e164.gif">凋谢</option>
		<option disabled value="e165" data-icon="http://ctc.qzonestyle.gtimg.cn/qzone/em/e165.gif">亲吻(黄钻用户专享)</option>
	</optgroup>
</select> <button id="start-demo-diy">执行</button>

默认的模板结构：

```
{
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
    openClass:     'ui-selectbox-open'
}
```

你可能注意到模板结构中有``{{``与``}}``包裹起来的模板变量，这些是可以通过``<select>``、``<option>``标签的``data-*="*"``属性传过来的。

##	所有特性演示

<table id="test" style="width:100%; height:100%">
	<tr>
		<td style="text-align: left; vertical-align: top;">
			<label for="test-select">支持label标签：</label>
			<select id="test-select">
				<option value="0">---请选择---</option>
				<option value="1">选项二</option>
				<option selected value="2">选项二</option>
				<option value="3">&#60;s&#62;选项三&#60;/s&#62;</option>
				<option value="4"><s>选项四</s></option>
				<option value="5">选项五</option>
			</select>
		</td>
		<td style="text-align: center; vertical-align: top;">
			<label for="test-select-selected">不设置 selected 属性</label>
			<select id="test-select-selected">
				<option value="0">---请选择---</option>
				<option value="1">选项二</option>
				<option value="2">选项二</option>
				<option value="3">选项三</option>
				<option value="4">选项四</option>
				<option value="5">选项五</option>
			</select>
		</td>
		<td style="text-align: right; vertical-align: top;">
			<label for="test-select-disabled">不可用下拉：</label>
			<select disabled id="test-select-disabled">
				<option selected value="0">disabled</option>
				<option value="1">选项二</option>
				<option value="2">选项二</option>
				<option value="3">选项三</option>
				<option value="4">选项四</option>
				<option value="5">选项五</option>
			</select>
		</td>
	</tr>
	<tr>
		<td style="text-align: left; vertical-align: middle;">
			<label for="test-option-disabled">不可用选项：</label>
			<select id="test-option-disabled">
				<option value="0">---请选择---</option>
				<option value="1">选项二</option>
				<option selected value="2">selected</option>
				<option value="3">选项三</option>
				<option disabled value="4">disabled</option>
				<option value="5">选项五</option>
			</select>
		</td>
		<td style="text-align: center; vertical-align: middle;">
			<label for="test-optgroup">选项分组：</label>
			<select id="test-optgroup">
				<optgroup label="我是A组">
					<option value="0">选项零</option>
					<option value="1">选项二</option>
					<option value="2">选项二</option>
					<option value="3">选项三</option>
					<option value="4">选项四</option>
					<option value="5">选项五</option>
				</optgroup>
				<optgroup label="我是B组">
					<option value ="mercedes">Mercedes</option>
					<option value ="audi">Audi</option>
				</optgroup>
			</select>
		</td>
		<td style="text-align: right; vertical-align: middle;">
			<label for="test-onchange">onchange 事件支持：</label>
			<select id="test-onchange" onchange="location.href=this.value">
				<option value="javascript:;">友情链接</option>
				<option value="https://github.com">Github</option>
				<option value="http://google.com">Google</option>
				<option value="http://qq.com">腾讯</option>
				<option value="http://baidu.com">百度</option>
			</select>
		</td>
	</tr>
	<tr>
		<td style="text-align: left; vertical-align: bottom;">
			<label for="test-cut">超长选项截断</label>
			<select id="test-cut" style="width:4em">
				<option value="0">---请选择---</option>
				<option value="1">选项二</option>
				<option selected value="2">我是一个超长的选项</option>
				<option value="3">选项三</option>
				<option value="4">选项四</option>
				<option value="5">选项五</option>
			</select>
		</td>
		<td style="text-align: center; vertical-align: bottom;">
			<label for="test-numerous">自动滚动条</label>
			<select id="test-numerous">
				<option value="0">---请选择---</option>
				<option value="1">1</option>
				<option value="2">2</option>
				<option value="3">3</option>
				<option value="4">4</option>
				<option value="5">5</option>
				<option value="6">6</option>
				<option value="7">7</option>
				<option value="8">8</option>
				<option value="9">9</option>
				<option value="10">10</option>
				<option value="11">11</option>
				<option value="12">12</option>
				<option value="13">13</option>
				<option value="14">14</option>
				<option value="15">15</option>
				<option value="16">16</option>
				<option value="17">17</option>
				<option value="18">18</option>
				<option value="19">19</option>
				<option value="20">20</option>
				<option value="21">21</option>
				<option value="22">22</option>
				<option value="23">23</option>
				<option value="24">24</option>
				<option value="25">25</option>
				<option value="26">26</option>
				<option value="27">27</option>
				<option value="28">28</option>
				<option value="29">29</option>
				<option selected value="30">30</option>
				<option value="31">31</option>
				<option value="32">32</option>
				<option value="33">33</option>
				<option value="34">34</option>
				<option value="35">35</option>
				<option value="36">36</option>
				<option value="37">37</option>
				<option value="38">38</option>
				<option value="39">39</option>
				<option value="40">40</option>
				<option value="41">41</option>
				<option value="42">42</option>
				<option value="43">43</option>
				<option value="44">44</option>
				<option value="45">45</option>
				<option value="46">46</option>
				<option value="47">47</option>
				<option value="48">48</option>
				<option value="49">49</option>
				<option value="50">50</option>
				<option value="51">51</option>
				<option value="52">52</option>
				<option value="53">53</option>
				<option value="54">54</option>
				<option value="55">55</option>
				<option value="56">56</option>
				<option value="57">57</option>
				<option value="58">58</option>
				<option value="59">59</option>
				<option value="60">60</option>
			</select>
		</td>
		<td style="text-align: right; vertical-align: bottom;">
			<label for="test-none">无选项</label>
			<select id="test-none">
			</select>
		</td>
	</tr>
</table>

[新页面打开](../test/selectbox.html)


<!--[SeaJS code]-->
<script src="../lib/sea.js"></script>
<script>
seajs.config({
  alias: {
	"jquery": "jquery-1.10.2.js"
  }
});
seajs.use(['jquery', '../src/selectbox'], function ($, selectbox) {
    $('#start-demo-basic').one('click', function () {
        selectbox(document.getElementById('demo-basic'));
        this.disabled = true;
    });
    $('#start-demo-diy').one('click', function () {
        selectbox(document.getElementById('demo-diy'), {
            optionHtml: '<dd class="ui-selectbox-option {{className}}" data-option="{{index}}" tabindex="-1"><img src="{{icon}}" alt="icon" style="width:16px;height:16px;vertical-align:middle" /> {{textContent}}</dd>'
        });
        this.disabled = true;
    });
    
    $('html, body').css('height', '100%');
    
    $('#test select').each(function () {
        selectbox(this);
    });
});
</script>
<!--[/SeaJS code]-->

<!--[RequireJS code]
<script src="../lib/require.js"></script>
<script>
require.config({
	paths: {
		jquery: '../lib/jquery-1.10.2'
	}
});
require(['jquery', '../src/selectbox'], function ($, selectbox) {
    
    $('#start-demo-basic').one('click', function () {
        selectbox(document.getElementById('demo-basic'));
        this.disabled = true;
    });
    $('#start-demo-diy').one('click', function () {
        selectbox(document.getElementById('demo-diy'), {
            optionHtml: '<dd class="ui-selectbox-option {{className}}" data-option="{{index}}" tabindex="-1"><img src="{{icon}}" alt="icon" style="width:16px;height:16px;vertical-align:middle" /> {{textContent}}</dd>'
        });
        this.disabled = true;
    });
    
    $('html, body').css('height', '100%');
    
    $('#test select').each(function () {
        selectbox(this);
    });
});
</script>
[/RequireJS code]-->