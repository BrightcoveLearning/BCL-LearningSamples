var childProcess = require('child_process');
var flexSdk = require('flex-sdk');
var async = require('async');
var argv = require('optimist')
      .default('write', false)
      .argv,
    releaseType = process.env.RELEASE_TYPE || 'prerelease';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      all: ['*.js', 'src/*.js', 'test/*.js'],
      options: {
        undef: true,
        browser: true,
        qunit: true,
        node: true,
        predef: [
          "videojs",
          "google",
          "sinon",
          "_"
        ]
      }
    },

    qunit: {
      all: ['test/**/*.html', '!test/set-src.html']
    },

    blanket_qunit: {
      all: {
        options: {
          urls: ['test/videojs.ima3.html?coverage=true&gruntReport'],
          threshold: 80
        }
      }
    },

    copy: {
      version: {
        files: [
          { expand: true, cwd: 'dist', src: ['*'], dest: 'dist/<%= pkg.version %>/' }
        ]
      }
    },

    cssmin: {
      options: {
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
                ' * Copyright (c) <%= grunt.template.today("yyyy") %> Brightcove  */\n'
      },
      combine: {
        files: {
          'dist/videojs.ima3.min.css': [
            'node_modules/videojs-contrib-ads/src/videojs.ads.css',
            'src/videojs.ima3.css'
          ]
        }
      }
    },

    'string-replace': {
      version: {
        files: {
          'dist/videojs.ima3.min.js': 'dist/videojs.ima3.min.js'

        },
        options: {
          replacements: [{
            pattern: /{{ VERSION }}/g,
            replacement: '<%= pkg.version %>'
          }]
        }
      }
    },

    mxmlc: {
      videojs: {
        ima: {
          swf: {
            src: ['src/VideoJSIMA.as'],
            dest: 'dist/videojs.ima3.swf'
          }
        }
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
                ' * Copyright (c) <%= grunt.template.today("yyyy") %> Brightcove  */\n'
      },
      build: {
        src: ['node_modules/videojs-contrib-ads/dist/videojs.ads.global.js',
              'src/videojs.ima3.js',
              'src/videojs.ima3-html5.js',
              'src/videojs.ima3-flash.js'],
        dest: 'dist/videojs.ima3.min.js'
      }
    },

    clean: ['dist'],

    watch: {
      files: ['**/*.js', '!node_modules/**'],
      tasks: ['jshint', 'qunit']
    },

    compress: {
      package: {
        options: {
          archive: '<%= pkg.name %>.tgz',
          mode: 'tgz'
        },
        cwd: 'dist',
        expand: true,
        src: ['**']
      }
    },

    connect: {
      dev: {
        options: {
          port: 9999,
          keepalive: true
        }
      }
    },

    release: {
      options: {
        npm: false
      }
    }

  });

  // replaces grunt.loadNpmTasks('grunt-*')
  require('load-grunt-tasks')(grunt);

  // Default task(s).
  grunt.registerTask('default', ['clean', 'jshint', 'mxmlc', 'qunit', 'uglify', 'cssmin', 'string-replace', 'copy']);
  grunt.registerTask('cover', ['blanket_qunit']);
  grunt.registerTask('package', ['default', 'copy:version', 'compress:package']);
  grunt.registerTask('build', ['mxmlc', 'copy']);
  grunt.registerTask('version', 'This should only be called by Team City!', ['release:' + releaseType ]);
  grunt.registerMultiTask('mxmlc', 'Compiling the IMA SWF for Flash-based ads', function () {
    var
      pkg = grunt.file.readJSON('package.json'),
      done = this.async(),
      dest = this.data.ima.swf.dest,
      cmdLineOpts = [];

    cmdLineOpts.push('-output');
    cmdLineOpts.push(dest);
    cmdLineOpts.push('-define=CONFIG::version, "' + pkg.version + '"');
    cmdLineOpts.push('-library-path=libs/ima_lib_as3.swc');
    cmdLineOpts.push('--');
    cmdLineOpts.push.apply(cmdLineOpts, this.data.ima.swf.src);

    childProcess.execFile(flexSdk.bin.mxmlc, cmdLineOpts, function(err) {
      if (err) {
        grunt.log.error('Error Creating SWF');
        grunt.log.error(err.toString());
        done(0);
      } else {
        grunt.log.write('Built ' + dest);
      }
      return done(err);
    });
  });
};