module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta: {
            banner: '/*!<%= pkg.name %> | <%= pkg.homepage %>*/\n'
        },
        combo: {
            options: {
                name: 'dialog',
                namespace: 'window',
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
                src: './src/dialog.js',
                dest: './dist/dialog-min.js'
            },
            'dialog-plus.js': {
                src: './src/dialog-plus.js',
                dest: './dist/dialog-plus-min.js'
            }
        }
    });

    require('./tool/tasks/combo.js')(grunt);
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', ['combo', 'uglify']);

};