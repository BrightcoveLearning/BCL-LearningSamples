videojs.plugin('redispatchEnded', function() {
  var player = this;
  player.myName = "david";

});

videojs.plugin('two', function(options) {
  var player = this;
  console.log(player.myName);
});



    plugins: [{name: 'something',
              options: 'link.bc.com'}]

    also possible:
    plugins: [{'name': 'link.bc.com',
              options: { something: 'link.bc.com' } }]

    in the former example, options would be the string itself. In the latter example, options would 
    contain a property called `something` which is the string.


    videojs.plugin('something', function(options) {
  // options is either link.bc.com
  // or an object that as a property 'something'
  console.log(options);
    });
