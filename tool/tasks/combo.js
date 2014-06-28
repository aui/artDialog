'use strict';

var path = require('path');
var fs = require('fs');

var fs = require('fs');
var path = require('path');

var REQUIRE_RE = /\brequire\s*\(\s*(["'])(.+?)\1\s*\)/g;
var DEFINE_RE = /\bdefine\s*\(([\w\W]*?)\)/g;


function replaceDefine (code, id) {
	return code.replace(DEFINE_RE, function ($, $1) {
		return 'define("' + id + '", ' + $1 + ')';
	});
}


function replaceRequire (code, fn) {
	return code.replace(REQUIRE_RE, function ($, $1, $2) {
		return 'require("' + fn($2) + '")';
	});
}


function toId (id) {
	return id
	.replace(/^\//, '')
	.replace(/\.js$/, '');
}


function combo (base, target, uniq) {
	uniq = uniq || {};

	if (!path.extname(target)) {
		target = target + '.js';
	}

	var file = path.resolve(base, target);
	var dirname = path.dirname(file);
	var id = toId(file.replace(base, ''));
	var map = {};
	var targetContent = fs.readFileSync(file, 'utf-8');
	var requireContent = '';

	uniq[id] = true;

	targetContent = replaceDefine(targetContent, id);
	targetContent = replaceRequire(targetContent, function (uri) {

		if (!/^\./.test(uri)) {
			return uri;
		}

		var file = path.resolve(dirname, uri);
		var id = toId(file.replace(base, ''));


		if (!uniq[id]) {
			requireContent += ('\n\n' + combo(base, file, uniq));
		}

		return id;
	});

	return requireContent + '\n\n' + targetContent;
}


function compile (base, target, name, namespace) {
	namespace || 'this';
	var file = path.resolve(base, target);
	var dirname = path.dirname(file);
	var map = {};
	var targetContent = fs.readFileSync(file, 'utf-8');
	var commonjs = fs.readFileSync(__dirname + '/common.js', 'utf-8');
	var template = fs.readFileSync(__dirname + '/template.tpl', 'utf-8');
	var globalModules = fs.readFileSync(__dirname + '/global-modules.js', 'utf-8');

	var data = {
		name: name,
		commonjs: commonjs,
		namespace: namespace,
		globalModules: globalModules,
		modules: combo(base, target),
		id: toId(target)
	};

	return template.replace(/<(.*?)>/g, function ($, $1) {
		return data[$1];
	});
};


module.exports = function(grunt) {

	grunt.registerMultiTask('combo', 'the grunt plugin for combo', function() {

		var that = this;
		var options = this.options();
		var dest = this.files[0].dest;
        var base = path.resolve(options.base || './');

        if (path.extname(dest) === '.js') {
            options.runtime = path.basename(dest);
            options.output = path.dirname(dest);
        } else {
        	options.output = dest;
        }

		if (!fs.existsSync(base)) {
		    grunt.fail.warn('`options.base` is not a directory');
		}


		this.files.forEach(function (f) {

			var fileList = f.src.filter(function (filepath) {

	            if (!grunt.file.exists(filepath)) {
	                grunt.log.warn('Source file "' + filepath + '" not found.');
	                return false;
	            } else {
	                return true;
	            }

	        }).map(function (filepath) {
	        	return path.relative(base, filepath);
	        }).forEach(function (target) {
	        	var output = compile(base, target, options.name, options.namespace);
	        	grunt.file.write(f.dest, output);

	        	var comboFile = path.relative('./', target);
	        	grunt.log.writeln('File "' + target + '" created.');
	        });
		});

		
	});
};
