'use strict';

var fs = require('fs');
var path = require('path');
var compile = require('./compile.js');

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
	        	grunt.log.writeln('File ' + f.dest + ' created.');
	        });
		});

		
	});
};
