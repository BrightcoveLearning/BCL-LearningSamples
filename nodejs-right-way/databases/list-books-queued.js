/***
 * Excerpted from "Node.js the Right Way",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material, 
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose. 
 * Visit http://www.pragmaticprogrammer.com/titles/jwnode for more book information.
***/
'use strict';
const
  
  async = require('async'),
  file = require('file'),
  rdfParser = require('./lib/rdf-parser.js'),
  
  work = async.queue(function(path, done) {
    rdfParser(path, function(err, doc) {
      console.log(doc);
      done();
    });
  }, 1000);

console.log('beginning directory walk');
file.walk(__dirname + '/cache', function(err, dirPath, dirs, files){
  files.forEach(function(path){
    work.push(path);
  });
});

