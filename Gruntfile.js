module.exports = function(grunt){

    "use strict";

    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        htmlhint: {
            build: {
                options: {
                    'tag-pair': true,
                    // Force tags to have a closing pair
                    'tagname-lowercase': true,
                    // Force tags to be lowercase
                    'attr-lowercase': true,
                    // Force attribute names to be lowercase e.g. <div id="header"> is invalid
                    'attr-value-double-quotes': true,
                    // Force attributes to have double quotes rather than single
                    'doctype-first': true,
                    // Force the DOCTYPE declaration to come first in the document
                    'spec-char-escape': true,
                    // Force special characters to be escaped
                    'id-unique': true,
                    // Prevent using the same ID multiple times in a document
                    // 'head-script-disabled': false,
                    // Prevent script tags being loaded in the head for performance reasons
                    'style-disabled': true
                    // Prevent style tags. CSS should be loaded through
                },
                src: ['index.html']
            }
        },

        watch: {
            html: {
                files: ['index.html'],
                tasks: ['htmlhint']
            }
        }


    });

    grunt.registerTask('default', []);

};