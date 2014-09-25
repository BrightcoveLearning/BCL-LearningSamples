videojs.plugin('readMetaData', function () {
  var player = this;
  //Read metadata from the property, it will be a string
  var metadata = player.options()['data-media'];
  console.log("The data type of the metadata is initially of type: " + typeof metadata);
  //Use JSON.parse() to convert string into object
  var metadataObject = JSON.parse(metadata);
  console.log(metadataObject);
  //Display one value
  console.log(metadataObject.program);
  //Iterate through all the options displaying their data attributes
  for (var k in metadataObject) {
      document.getElementById('displayArea').innerHTML += 'Media property ' + k + ' has value:' + metadataObject[k] + '<br>';
  }
});