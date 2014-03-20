module.exports = function(grunt){

    "use strict";

    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({

        pkg: grunt.file.readJSON("package.json"),

        htmlhint: {
            build: {
                options: {
                    "tag-pair": true,
                    // Force tags to have a closing pair
                    "tagname-lowercase": true,
                    // Force tags to be lowercase
                    "attr-lowercase": true,
                    // Force attribute names to be lowercase e.g. <div id="header"> is invalid
                    "attr-value-double-quotes": true,
                    // Force attributes to have double quotes rather than single
                    "doctype-first": true,
                    // Force the DOCTYPE declaration to come first in the document
                    "spec-char-escape": true,
                    // Force special characters to be escaped
                    "id-unique": true,
                    // Prevent using the same ID multiple times in a document
                    // "head-script-disabled": false,
                    // Prevent script tags being loaded in the head for performance reasons
                    "style-disabled": true
                    // Prevent style tags. CSS should be loaded through
                },
                src: ["index.html", "app/views/*html"]
            }
        },

        // CSSLint. Tests CSS code quality
        // https://github.com/gruntjs/grunt-contrib-csslint
        csslint: {
            // define the files to lint
            files: ["app/resources/css/main.css"],
                strict: {
                    options: {
                        "import": 0,
                        "empty-rules": 0,
                        "display-property-grouping": 0,
                        "shorthand": 0,
                        "font-sizes": 0,
                        "zero-units": 0,
                        "important": 0,
                        "duplicate-properties": 0,
                    }
            }
        },

        jshint: {
            files: ["app/model/main.js", "Gruntfile.js"],
                options: {
                    // strict: true,
                    sub: true,
                    quotmark: "double",
                    trailing: true,
                    curly: true,
                    eqeqeq: true,
                    unused: true,
                    scripturl: true,
                    // This option defines globals exposed by the Dojo Toolkit.
                    dojo: true,
                    // This option defines globals exposed by the jQuery JavaScript library.
                    jquery: true,
                    // Set force to true to report JSHint errors but not fail the task.
                    force: true,
                    reporter: require("jshint-stylish")
                }
        },

        uglify: {
            options: {
                // the banner is inserted at the top of the output
                banner: '/*! <%= pkg.name %> - main.js - <%= grunt.template.today("mm-dd-yyyy") %> */\n'
            },
            build: {
                files: {
                    "../deploy/build/main.min.js": ["app/model/main.js"]
                }
            }
        },

        watch: {
            html: {
                files: ["index.html", "app/views/*html"],
                tasks: ["htmlhint"]
            },
            css: {
                files: ["app/resources/css/main.css"],
                tasks: ["csslint"]
            },
            js: {
                files: ["app/model/main.js", "Gruntfile.js"],
                tasks: ["jshint"]
            }
        }


    });

    // this would be run by typing "grunt test" on the command line
    // grunt.registerTask("test", ["jshint", "csslint", "htmlhint"]);
    grunt.registerTask("test", ["uglify"]);

    // the default task can be run just by typing "grunt" on the command line
    grunt.registerTask("default", []);

};

// ref
// http://coding.smashingmagazine.com/2013/10/29/get-up-running-grunt/
// http://csslint.net/about.html
// http://www.jshint.com/docs/options/
// test test test test test