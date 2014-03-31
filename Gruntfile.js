'use strict';
module.exports = function (grunt) {
    grunt.initConfig({
        closurecompiler: {
            minify: {
                files: {
                    // Destination: Sources...
                    "main.min.js": ['main.js']
                },
                options: {
                    "define": ["DEBUG=false", "ROTATE=false"],
                    "compilation_level": "ADVANCED_OPTIMIZATIONS",
                    "externs": [ "externs/w3c_audio.js"]
                }
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-closurecompiler');

    grunt.registerTask('minify', ['closurecompiler:minify']);
};
