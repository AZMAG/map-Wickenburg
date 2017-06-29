module.exports = function(grunt) {

    "use strict";

    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({

        pkg: grunt.file.readJSON("package.json"),

        bannercss: "/*! ========================================================================\n" +
            " * Maricopa Association of Governments\n" +
            " * CSS files for MAG Wickenburg Zoning Map Viewer\n" +
            " * @concat.min.css | @version | <%= pkg.version %>\n" +
            " * Production | <%= pkg.date %>\n" +
            " * MAG Wickenburg Zoning Map Viewer\n" +
            " * http://geo.azmag.gov/maps/wickenburg/\n" +
            " * ==========================================================================\n" +
            " * @Copyright <%= pkg.copyright %> MAG\n" +
            " * @License MIT\n" +
            " * ========================================================================== */\n",

        bannerjs: "/*! ========================================================================\n" +
            " * Maricopa Association of Governments\n" +
            " * JavaScript files for MAG Wickenburg Zoning Map Viewer\n" +
            " * @main.min.js | @version | <%= pkg.version %>\n" +
            " * Production | <%= pkg.date %>\n" +
            " * MAG Wickenburg Zoning Map Viewer\n" +
            " * http://geo.azmag.gov/maps/wickenburg/\n" +
            " * ==========================================================================\n" +
            " * @Copyright <%= pkg.copyright %> MAG\n" +
            " * @License MIT\n" +
            " * ========================================================================== */\n",

        jshint: {
            files: ["src/js/config.js", "src/js/main.js"],
            options: {
                // strict: true,
                sub: true,
                quotmark: "double",
                trailing: true,
                curly: true,
                eqeqeq: true,
                unused: true,
                scripturl: true, // This option defines globals exposed by the Dojo Toolkit.
                dojo: true, // This option defines globals exposed by the jQuery JavaScript library.
                jquery: true, // Set force to true to report JSHint errors but not fail the task.
                force: true,
                reporter: require("jshint-stylish-ex")
            }
        },

        csslint: {
            options: {
                csslintrc: ".csslintrc",
                formatters: [{
                    id: require("csslint-stylish"),
                    dest: "tmp/csslint_stylish.xml"
                }]
            },
            strict: {
                options: {
                    import: 2
                },
                src: ["src/css/main.css"]
            },
            lax: {
                options: {
                    import: false
                },
                src: ["src/css/main.css"]
            }
        },

        uglify: {
            options: {
                // add banner to top of output file
                banner: "<%= bannerjs %>\n"
            },
            build: {
                files: {
                    "dist/js/main.min.js": ["src/js/main.js"],
                    "dist/js/config.min.js": ["src/js/config.js"],
                    "dist/js/vendor/bootstrapmap.min.js": ["src/js/vendor/bootstrapmap.js"],
                    "dist/js/vendor/plugins.min.js": ["src/js/vendor/plugins.js"]
                }
            }
        },

        cssmin: {
            add_banner: {
                options: {
                    // add banner to top of output file
                    banner: '/* <%= pkg.name %> - v<%= pkg.version %> | <%= grunt.template.today("mm-dd-yyyy") %> */\n'
                },
                files: {
                    "dist/css/main.min.css": ["src/css/main.css"],
                    "dist/css/normalize.min.css": ["src/css/normalize.css"],
                    "dist/css/bootstrapmap.min.css": ["src/css/bootstrapmap.css"]
                }
            }
        },

        concat: {
            options: {
                stripBanners: true,
                banner: "<%= bannercss %>\n"
            },
            dist: {
                src: ["dist/css/normalize.min.css", "dist/css/bootstrapmap.min.css", "dist/css/main.min.css"],
                dest: "dist/css/concat.min.css"
            }
        },

        clean: {
            build: {
                src: ["dist/"]
            },
            js: ["dist/js/*.js", "!dist/js/*.min.js"],
            jsv: ["dist/js/vendor/*.js", "!dist/js/vendor/*.min.js"],
            css: ["dist/css/*.css", "!dist/css/concat.min.css"]
        },

        copy: {
            build: {
                cwd: "src/",
                src: ["**"],
                dest: "dist/",
                expand: true
            }
        },

        watch: {
            scripts: {
                files: ["src/js/main.js", "src/js/config.js", "Gruntfile.js"],
                tasks: ["jshint"],
                options: {
                    spawn: false,
                    interrupt: true,
                },
            },
        },

        versioncheck: {
            options: {
                skip: ["semver", "npm", "lodash"],
                hideUpToDate: false
            }
        },

        replace: {
            update_Meta: {
                src: ["src/index.html", "src/js/config.js", "src/humans.txt", "README.md"], // source files array
                // src: ["README.md"], // source files array
                overwrite: true, // overwrite matched source files
                replacements: [{
                    // html pages
                    from: /(<meta name="revision-date" content=")[0-9]{2}\/[0-9]{2}\/[0-9]{4}(">)/g,
                    to: '<meta name="revision-date" content="' + '<%= pkg.date %>' + '">',
                }, {
                    // html pages
                    from: /(<meta name="version" content=")([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))(">)/g,
                    to: '<meta name="version" content="' + '<%= pkg.version %>' + '">',
                }, {
                    // config.js
                    from: /(v)([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))( \| )[0-9]{2}\/[0-9]{2}\/[0-9]{4}/g,
                    to: 'v' + '<%= pkg.version %>' + ' | ' + '<%= pkg.date %>',
                }, {
                    // humans.txt
                    from: /(Version\: )([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))/g,
                    to: "Version: " + '<%= pkg.version %>',
                }, {
                    // humans.txt
                    from: /(Last updated\: )[0-9]{2}\/[0-9]{2}\/[0-9]{4}/g,
                    to: "Last updated: " + '<%= pkg.date %>',
                }, {
                    // README.md
                    from: /(### version )([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))/g,
                    to: "### version " + '<%= pkg.version %>',
                }, {
                    // README.md
                    from: /(`Updated: )[0-9]{2}\/[0-9]{2}\/[0-9]{4}/g,
                    to: "`Updated: " + '<%= pkg.date %>',
                }, {
                    // main.css
                    from: /(@main.css)( \| )(version)( \| )([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))/g,
                    to: "@main.css | version |" + ' <%= pkg.version %>',
                }]
            }
        }


    });
    //==============================================================================>
    // this would be run by typing "grunt test" on the command line

    grunt.registerTask("check", ["versioncheck"]);
    grunt.registerTask("work", ["jshint"]);
    grunt.registerTask("workcss", ["csslint"]);

    grunt.registerTask("buildcss", ["cssmin", "concat"]);
    grunt.registerTask("buildjs", ["uglify"]);

    // grunt.registerTask("build", ["replace", "uglify", "cssmin", "concat"]);
    grunt.registerTask("build", ["clean:build", "replace", "uglify", "cssmin", "concat", "copy", "clean:js", "clean:jsv", "clean:css"]);


    // the default task can be run just by typing "grunt" on the command line
    grunt.registerTask("default", []);

};

// ref
//==============================================================================>
// http://coding.smashingmagazine.com/2013/10/29/get-up-running-grunt/
// http://csslint.net/about.html
// http://www.jshint.com/docs/options/