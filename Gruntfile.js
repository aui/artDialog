module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta: {
            banner: '/*! <%= pkg.name %> v<%= pkg.version %> | <%= pkg.homepage %> */\n'
        },
        unwrap: {
            options: {
                base: './src',
                globalBase: './src/global_modules',
                name: 'dialog',
                namespace: 'window',
                banner: '<%= meta.banner %>'
            },
            'dialog.js': {
                src: './src/dialog.js',
                dest: './dist/dialog.js'
            },
            'dialog-plus.js': {
                src: './src/dialog-plus.js',
                dest: './dist/dialog-plus.js'
            }
        },
        uglify: {
            options: {
                banner: '<%= meta.banner %>'
            },
            'dialog.js': {
                src: './dist/dialog.js',
                dest: './dist/dialog-min.js'
            },
            'dialog-plus.js': {
                src: './dist/dialog-plus.js',
                dest: './dist/dialog-plus-min.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-unwrap');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', ['unwrap', 'uglify']);

};