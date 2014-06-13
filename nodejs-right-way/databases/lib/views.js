/***
 * Excerpted from "Node.js the Right Way",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material, 
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose. 
 * Visit http://www.pragmaticprogrammer.com/titles/jwnode for more book information.
***/
module.exports = {
  by_author: {
    map: function(doc) {
      if ('authors' in doc) {
        doc.authors.forEach(emit);
      }
    }.toString(),
    reduce: '_count'
  },
  
  by_subject: {
    map: function(doc) {
      if ('subjects' in doc) {
        doc.subjects.forEach(function(subject){
          emit(subject, subject);
		  
          subject.split(/\s+--\s+/).forEach(function(part){
            emit(part, subject);
          });
        });
      }
    }.toString(),
    
    reduce: '_count'
  }
};

