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
          'dist/docs-nav-data-from-minjson.json':
          ['source-minjson/smart-player-api.json',
              'source-minjson/index.json',
              'source-minjson/brightcove-player-sdk-for-ios.json',
              'source-minjson/brightcove-player-sdk-for-android.json',
              'source-minjson/analytics-api.json',
              'source-minjson/media.json']
        },
      },
    },
    replace: {
      example: {
        src: ['dist/docs-nav-data-from-minjson.json'],
        dest: 'dist/docs-nav-data-from-minjson-replace.json',
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
              'dist/docs-nav-data-from-minjson-replace.json',
              'source/footer.json'],
        dest: 'dist/docs-nav-data.json'
      },
      buildvar: {
        src: ['source/var-name.txt',
              'dist/docs-nav-data.json',
              'source/semicolon.txt'],
        dest: 'dist/docs-nav-data.min.js'
      },
    },
    jsonlint: {
      sample: {
        src: [ 'dist/docs-nav-data.json' ]
      }
    },
    uglify: {
      dist: {
        src: 'dist/docs-nav-data.min.js',
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
