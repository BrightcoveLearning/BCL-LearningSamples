'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    // Task configuration.
    minjson: {
      compile:{
        files: {
          'working/docs-nav-data-from-minjson.json':
          ['source/smart-player-api.json',
              'source/index.json',
              'source/brightcove-player-sdk-for-ios.json',
              'source/brightcove-player-sdk-for-android.json',
              'source/analytics-api.json',
              'source/media.json']
        },
      },
    },
    replace: {
      example: {
        src: ['working/docs-nav-data-from-minjson.json'],
        dest: 'working/docs-nav-data-from-minjson-replace.json',
        replacements: [{ 
          from: '\[{"smart-player-api',
          to: '\{"smart-player-api'
        },
        {
          from: '\}\},\{',
          to: '\},'
        },
        {
          from: '"Media API"}}]',
          to: '"Media API"}}' 
        }]
      },
    },  
    concat: {
      buildjson: {
        src: ['source/header.json',
              'working/docs-nav-data-from-minjson-replace.json',
              'source/footer.json'],
        dest: 'working/docs-nav-data.json'
      },
      buildvar: {
        src: ['source/var-name.txt',
              'working/docs-nav-data.json',
              'source/semicolon.txt'],
        dest: 'working/docs-nav-data.min.js'
      },
    },
    jsonlint: {
      sample: {
        src: [ 'working/docs-nav-data.json' ]
      }
    },
    uglify: {
      dist: {
        src: 'working/docs-nav-data.min.js',
        dest: 'dist/docs-nav-data.min.js'
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-minjson');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-jsonlint');
  grunt.loadNpmTasks('grunt-json-minify');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task.
  grunt.registerTask('default', ['minjson','replace','concat:buildjson','jsonlint','concat:buildvar','uglify']);
}
