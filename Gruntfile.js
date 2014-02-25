'use strict';
module.exports = function (grunt) {
    grunt.initConfig({
        closurecompiler: {
            minify: {
                files: {
                    // Destination: Sources...
                    "main.min.js": ['test.js']
                },
                options: {
                    "compilation_level": "ADVANCED_OPTIMIZATIONS"
                }
            }
        },
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-closurecompiler');

    grunt.registerTask('minify', ['closurecompiler:minify']);
};
