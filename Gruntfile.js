/* jshint node: true */
/*!
 * jQuery MultiSelect's Gruntfile
 */

module.exports = function (grunt) {
  'use strict';

  // Force use of Unix newlines
  grunt.util.linefeed = '\n';

  RegExp.quote = function (string) {
    return string.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
  };

  var fs = require('fs');
  var path = require('path');

  // Project configuration.
  grunt.initConfig({

    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*!\n' +
              ' * jQuery MultiSelect v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
              ' * Copyright 2011-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
              ' * <%= _.pluck(pkg.licenses, "type") %> (<%= _.pluck(pkg.licenses, "url") %>)\n' +
              ' */\n',
    bannerDocs: '/*!\n' +
              ' * jQuery MultiSelect Docs (<%= pkg.homepage %>)\n' +
              ' * Copyright 2011-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
              ' * <%= _.pluck(pkg.licenses, "type") %> (<%= _.pluck(pkg.licenses, "url") %>)\n' +
              ' * NDA applies, etc.etc.etc.\n' +
              ' */\n',
    jqueryCheck: 'if (typeof jQuery === \'undefined\') { throw new Error(\'jQuery MultiSelect requires jQuery\') }\n\n',

    // Task configuration.
    clean: {
      dist: 'dist'
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      src: {
        src: 'js/*.js'
      },
      test: {
        src: 'test/unit/*.js'
      },
      demos: {
        src: 'demos/assets/*.js'
      },
      i18n: {
        src: 'i18n/*.js'
      }
    },

    jscs: {
      options: {
        config: '.jscs.json',
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      src: {
        src: 'js/*.js'
      },
      test: {
        src: 'test/unit/*.js'
      },
      demos: {
        src: 'demos/assets/*.js'
      },
      i18n: {
        src: 'i18n/*.js'
      }
    },

    csslint: {
      library: {
        options: {
          csslintrc: '.csslintrc'
        },
        src: [
          'jquery.multiselect.css',
          'jquery.multiselect.rtl.css',
          'jquery.multiselect.filter.css',
          'jquery.multiselect.filter.rtl.css'
        ]
      },
      demos: {
        options: {
          csslintrc: '.csslintrc',
          ids: false
        },
        src: [
          'demos/assets/style.css'
        ]
      }
    },

    concat: {
      options: {
        banner: '<%= banner %>\n<%= jqueryCheck %>',
        stripBanners: false
      },
      multiselect: {
        src: [
          'src/jquery.multiselect.js',
          'src/jquery.multiselect.filter.js'
        ],
        dest: 'dist/js/<%= pkg.name %>.js'
      }
    },

    uglify: {
      multiselect: {
        options: {
          preserveComments: 'some',
          report: 'min'
        },
        src: [
          'src/jquery.multiselect.js',
          'src/jquery.multiselect.filter.js'
        ],
        dest: 'dist/js/<%= pkg.name %>.min.js'
      }
    },

    less: {
      compileCore: {
        options: {
          strictMath: true,
          sourceMap: true,
          outputSourceFiles: true,
          sourceMapURL: '<%= pkg.name %>.css.map',
          sourceMapFilename: '<%= pkg.name %>.css.map'
        },
        files: {
          '<%= pkg.name %>.css': 'jquery.multiselect.less',
          '<%= pkg.name %>.rtl.css': 'jquery.multiselect.rtl.less',
          '<%= pkg.name %>.filter.css': 'jquery.multiselect.filter.less',
          '<%= pkg.name %>.filter.rtl.css': 'jquery.multiselect.filter.rtl.less'
        }
      },
      minify: {
        options: {
          cleancss: true,
          report: 'min'
        },
        files: {
          '<%= pkg.name %>.min.css': '<%= pkg.name %>.css',
          '<%= pkg.name %>.rtl.min.css': '<%= pkg.name %>.rtl.css',
          '<%= pkg.name %>.filter.min.css': '<%= pkg.name %>.filter.css',
          '<%= pkg.name %>.filter.rtl.min.css': '<%= pkg.name %>.filter.rtl.css'
        }
      }
    },

    cssmin: {
      compress: {
        options: {
          keepSpecialComments: '*',
          noAdvanced: true, // turn advanced optimizations off until the issue is fixed in clean-css
          report: 'min',
          selectorsMergeMode: 'ie8'
        },
        src: [
          'docs/assets/css/docs.css',
          'docs/assets/css/pygments-manni.css'
        ],
        dest: 'docs/assets/css/pack.min.css'
      }
    },

    usebanner: {
      dist: {
        options: {
          position: 'top',
          banner: '<%= banner %>'
        },
        files: {
          src: [
            '<%= pkg.name %>.css',
            '<%= pkg.name %>.min.css',
            '<%= pkg.name %>.rtl.css',
            '<%= pkg.name %>.rtl.min.css',
          ]
        }
      }
    },

    csscomb: {
      sort: {
        options: {
          config: '.csscomb.json'
        },
        files: {
          'css/_/bootstrap/<%= pkg.name %>.css': 'css/_/bootstrap/<%= pkg.name %>.css',
          'css/_/bootstrap/<%= pkg.name %>-theme.css': 'css/_/bootstrap/<%= pkg.name %>-theme.css'
        }
      }
    },

    copy: {
      fonts: {
        expand: true,
        src: 'fonts/*',
        dest: 'dist/'
      },
      docs: {
        expand: true,
        cwd: './dist',
        src: [
          '{css,js}/*.min.*',
          'css/*.map',
          'fonts/*'
        ],
        dest: 'docs/dist'
      }
    },

    qunit: {
      options: {
        inject: 'tests/unit/phantom.js'
      },
      files: 'tests/unit/*.html'
    },

    watch: {
      src: {
        files: '<%= jshint.src.src %>',
        tasks: ['jshint:src', 'qunit']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'qunit']
      },
      less: {
        files: 'less/*.less',
        tasks: 'less'
      }
    }
  });


  // These plugins provide necessary tasks.
  require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});

  // Test task.
  grunt.registerTask('test', ['dist-css', 'lint', 'qunit']);

  // JS distribution task.
  grunt.registerTask('dist-js', ['concat', 'uglify']);

  // CSS distribution task.
  grunt.registerTask('dist-css', ['less', 'cssmin', 'csscomb', 'usebanner']);

  // Docs distribution task.
  grunt.registerTask('dist-docs', 'copy:docs');

  // Full distribution task.
  grunt.registerTask('dist', ['clean', 'dist-css', 'copy:fonts', 'dist-docs', 'dist-js']);

  // Default task.
  grunt.registerTask('default', ['test', 'dist']);

  // Code lint task.
  grunt.registerTask('lint', ['csslint', 'jshint', 'jscs']);
};
