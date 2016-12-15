//start with a self-invoking function, to prevent exposing anything to the global scope
(function() {

    //on submit
    var button = document.getElementById('doit');
    button.onclick = function() {

        var f = document.getElementsByTagName('form')[0];
          if(f.checkValidity()) {
            f.submit();
          } else {
            alert('All fields on this form are required to successfully create an ingest profile. Please ensure that you have completed all of the fields and then try submitting the form again.');
            return false;
          }

        var headerArray = [];
        var dataArray = [];
        var dataArray2 = [];
        var imageArray = [];
        var imageArray2 = [];

        //get reference to the header fields
        var headerFields = document.getElementById('headerFields').children;

        //iterate over header fields,
        for (i = 0; i < headerFields.length; i++) {
            if (headerFields[i].type === "text" && headerFields[i].id !== "renditions" || headerFields[i].type === "select-one") {
                headerArray.push(JSON.stringify(headerFields[i].id) + ": " + JSON.stringify(headerFields[i].value));
            }
        }

        //get reference to the first rendition input data
        var renditionFields = document.getElementById('renditionDiv1').children;

        //iterate over first rendition fields, print out key-value pairs to console
        for (z = 0; z < (renditionFields.length); z++) {
            if (renditionFields[z].type === "text" || renditionFields[z].type === "select-one") {

                dataArray.push((JSON.stringify(renditionFields[z].id) + ": " + JSON.stringify(renditionFields[z].value)));
            }
        }

        //get reference to the additional rendition input data
        var renditionFields2 = document.getElementById('renditionDiv2').children;

        //iterate over first rendition fields, print out key-value pairs to console
        for (z = 0; z < (renditionFields2.length); z++) {
            if (renditionFields2[z].type === "text" || renditionFields2[z].type === "select-one") {

                dataArray2.push((JSON.stringify(renditionFields2[z].id) + ": " + JSON.stringify(renditionFields2[z].value)));
            }
        }

        //http://stackoverflow.com/questions/4492385/how-to-convert-simple-array-into-two-dimensional-arraymatrix-in-javascript-or
        function listToMatrix(list, elementsPerSubArray) {
            var matrix = [],
                i, k;

            for (i = 0, k = -1; i < list.length; i++) {
                if (i % elementsPerSubArray === 0) {
                    k++;
                    matrix[k] = [];
                }

                matrix[k].push(list[i]);
            }

            return matrix;
        }
        var renditionsMatrix = listToMatrix(dataArray2, 15);

        //console.log(renditionsMatrix.length);

        dataDeMatrixed = [];

        for (i = 0; i <= (renditionsMatrix.length - 1); i++) {

            dataDeMatrixed.push('{' + renditionsMatrix[i] + '}');

        }
        //console.log(dataDeMatrixed);

        //end credit to stackoverflow user for converting single array into multiple

        //get reference to the poster fields
        var imageFields = document.getElementById('imageDiv1').children;

        //iterate over poster fields,
        for (i = 0; i < imageFields.length; i++) {
            if (imageFields[i].type === "text" || imageFields[i].type === "select-one" || imageFields[i].type === "hidden") {
                imageArray.push(JSON.stringify(imageFields[i].id) + ": " + JSON.stringify(imageFields[i].value));
            }
        }

        //get reference to the thumbnail fields
        var imageFields2 = document.getElementById('imageDiv2').children;

        //iterate over thumbnail fields,
        for (i = 0; i < imageFields2.length; i++) {
            if (imageFields2[i].type === "text" || imageFields2[i].type === "select-one" || imageFields2[i].type === "hidden") {
                imageArray2.push(JSON.stringify(imageFields2[i].id) + ": " + JSON.stringify(imageFields2[i].value));
            }
        }
        //log form data to the output container as formatted JSON object
        var container = document.getElementById('output');

        var finalData = "{" + headerArray + ', "digital_master": {"rendition": "passthrough", "distribute": false}' + ',"renditions"' + ":" + "[{" + dataArray + '}, ' + dataDeMatrixed + ', {' + imageArray + '}, {' + imageArray2 + '}], "packages": []}';
        var finalData1 = "{" + headerArray + ', "digital_master": {"rendition": "passthrough", "distribute": false}' + ',"renditions"' + ":" + "[{" + dataArray + '}, {' + imageArray + '}, {' + imageArray2 + '}], "packages": []}';
        if (renditions.value == 1) {
            container.innerHTML = finalData1;
        } else {
            container.innerHTML = finalData;
        }

        //submit data to Ingest Profile API
        //TODO: get access token dynamically, work around CORS
        var options = {};
        var account_id = document.getElementById('account_id').value;
        var client_id = document.getElementById('client_id').value;
        var client_secret = document.getElementById('client_secret').value;
        options.url = 'https://ingestion.api.brightcove.com/v1/accounts/' + account_id + '/profiles';
        options.client_id = client_id;
        options.client_secret = client_secret;
        options.requestType = 'POST';
        options.requestData = JSON.stringify(finalData);
        makeRequest(options, function(response) {
            var responseDecoded = JSON.parse(response);
            // do whatever you want to here with or after the response
        });

        // var xhr = new XMLHttpRequest();
        // xhr.withCredentials = true;
        //
        // xhr.addEventListener("readystatechange", function() {
        //     if (this.readyState === 4) {
        //         console.log(this.responseText);
        //     }
        // });

        /**
         * send API request to the proxy
         * @param  {Object} requestData options for the request
         * @param  {String} requestData options.url the full API request URL
         * @param  {String="GET","POST","PATCH","PUT","DELETE"} requestData [options.requestType="GET"] HTTP type for the request
         * @param  {String} requestData [options.client_id] client id for the account (default is in the proxy)
         * @param  {String} requestData [options.client_secret] client secret for the account (default is in the proxy)
         * @param  {JSON} requestData [options.requestData] Data to be sent in the request body in the form of a JSON string
         * @param  {Function} [callback] callback function that will process the response
         */
        function makeRequest(options, callback) {
            var httpRequest = new XMLHttpRequest(),
                response,
                requestParams,
                dataString,
                proxyURL = 'https://solutions.brightcove.com/bcls/bcls-proxy/ip-generator-proxy.php',
                // response handler
                getResponse = function() {
                    try {
                        if (httpRequest.readyState === 4) {
                            if (httpRequest.status === 200 || httpRequest.status === 204) {
                                response = httpRequest.responseText;
                                // some API requests return '{null}' for empty responses - breaks JSON.parse
                                if (response === '{null}') {
                                    response = null;
                                }
                                // return the response
                                callback(response);
                            } else {
                                alert('There was a problem with the request. Request returned ' + httpRequest.status);
                            }
                        }
                    } catch (e) {
                        alert('Caught Exception: ' + e);
                    }
                };
            /**
             * set up request data
             * the proxy used here takes the following params:
             * url - the full API request (required)
             * requestType - the HTTP request type (default: GET)
             * clientId - the client id (defaults here to a Brightcove sample account value - this should always be stored on the server side if possible)
             * clientSecret - the client secret (defaults here to a Brightcove sample account value - this should always be stored on the server side if possible)
             */
            requestParams = "url=" + encodeURIComponent(options.url) + "&requestType=" + options.requestType;
            // only add client id and secret if both were submitted
            if (client_id.value && client_secret.value) {
                requestParams += '&client_id=' + clientId + '&client_secret=' + clientSecret;
            }
            // add request data if any
            if (options.requestData) {
                requestParams += '&requestData=' + options.requestData;
            }
            // set response handler
            httpRequest.onreadystatechange = getResponse;
            // open the request
            httpRequest.open('POST', proxyURL);
            // set headers
            httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            // open and send request
            httpRequest.send(requestParams);
        }


        //prevent the page from reloading -- need another workaround
        return false;
    };

    //hide descriptions
    //$(".description").css("display", "none");

    //add question toggle
    $(".description").append("<div class=question>?");
    //get reference to the ? buttons
    var info = document.getElementById('question');
    var open = document.getElementById('descriptionAddtl');


    //show additional content on hover
    /*$(".question").hover(function() {
        $(this).parent().next().toggle();
    });*/

    $(document).on('mouseenter', '.question', function(){
        $(this).parent().next().toggle();
    });

    $(document).on('mouseleave', '.question', function(){
        $(this).parent().next().toggle();
    });


    //reveal the subform depending upon how many renditions the user wants
    var renditions = document.getElementById('renditions');
    var changeThis = document.getElementById('renditionDiv1');
    var changeThis2 = document.getElementById('renditionDiv2');

    //determine number of renditions to display
    /*renditions.addEventListener('change', function() {
        if (renditions.value == 1) {
            changeThis.setAttribute('style', 'display: inline');
        } else if (renditions.value == 2) {
            changeThis.setAttribute('style', 'display: inline');
            changeThis2.setAttribute('style', 'display: inline');
        }
    });*/

    renditions.addEventListener('change', function() {
        //console.log(renditions.value);

        for (i = 2; i <= renditions.value; i++) {
            //console.log(changeThis);
            $('#renditionDiv2').append(changeThis.innerHTML);
        }
    });

    //on change event to check that Audio Bitrate value is a number
    var audioBitrate = document.getElementById('audio_bitrate');

    //listen for the change event
    //CAPTURING AND HANDLING EVENTS
    audioBitrate.addEventListener("change", function() {

        //test regex for the audio bitrate
        //TODO: make this account for case of '12g'
        var audioBitrateTest = /[0-9]{1,5}/;

        //test value of the input against regex
        var res = audioBitrateTest.test(audioBitrate.value);

        //alert the user if they enter an invalid value
        if (res == false) {
            alert('The Audio Bitrate must be a numeric value between 1 and 5 digits in length. Please correct this issue and continue.');
            //clear invalid data from the field
            audioBitrate.value = "";
        }

    });

    //on change event to check that Video Bitrate value is a number
    var videoBitrate = document.getElementById('video_bitrate');

    //listen for the change event
    //CAPTURING AND HANDLING EVENTS
    videoBitrate.addEventListener("change", function() {

        //test regex for the video bitrate
        //TODO: make this account for case of '12g'
        var videoBitrateTest = /[0-9]{1,5}/;

        //test value of the input against regex
        var res = videoBitrateTest.test(videoBitrate.value);
        //console.log(res);

        //alert the user if they enter an invalid value
        if (res == false) {
            alert('The Video Bitrate must be a numeric value between 1 and 5 digits in length. Please correct this issue and continue.');
            videoBitrate.value = "";
        }

    });

    //on change event to check that Decoder Bitrate Cap value is a number
    var decoderBitrateCap = document.getElementById('decoder_bitrate_cap');

    //listen for the change event
    //CAPTURING AND HANDLING EVENTS
    decoderBitrateCap.addEventListener("change", function() {

        //test regex for the decoder bitrate cap
        //TODO: make this account for case of '12g'
        var decoderBitrateCapTest = /[0-9]{1,5}/;

        //test value of the input against regex
        var res = decoderBitrateCapTest.test(decoderBitrateCap.value);

        //alert the user if they enter an invalid value
        if (res == false) {
            alert('The Decoder Bitrate Cap must be a numeric value between 1 and 5 digits in length. Please correct this issue and continue.');
            decoderBitrateCap.value = "";
        }

    });

    //on change event to check that Keyframe Rate value is a number
    var keyframeRate = document.getElementById('keyframe_rate');

    //listen for the change event
    //CAPTURING AND HANDLING EVENTS
    keyframeRate.addEventListener("change", function() {

        //test regex for the keyframe rate
        //TODO: make this account for case of '12g'
        var keyframeRateTest = /[0-9]{1,5}/;

        //test value of the input against regex
        var res = keyframeRateTest.test(keyframeRate.value);
        //console.log(res);

        //alert the user if they enter an invalid value
        if (res == false) {
            alert('The Keyframe Rate must be a numeric value between 1 and 5 digits in length. Please correct this issue and continue.');
            keyframeRate.value = "";
        }

    });

    //on change event to check that Max Frame Rate value is a number
    var maxFrameRate = document.getElementById('max_frame_rate');

    //listen for the change event
    maxFrameRate.addEventListener("change", function() {

        //test regex for the max frame rate
        //TODO: make this account for case of '12g'
        var maxFrameRateTest = /[0-9]{1,5}/;

        //test value of the input against regex
        var res = maxFrameRateTest.test(maxFrameRate.value);
        //console.log(res);

        //alert the user if they enter an invalid value
        if (res == false) {
            alert('The Max Frame Rate must be a numeric value between 1 and 5 digits in length. Please correct this issue and continue.');
            maxFrameRate.value = "";
        }

    });

    //on change event to check that Height value is a number
    var height = document.getElementById('height');

    //listen for the change event
    height.addEventListener("change", function() {

        //test regex for the max frame rate
        //TODO: make this account for case of '12g'
        var heightTest = /[0-9]{1,5}/;

        //test value of the input against regex
        var res = heightTest.test(height.value);
        //console.log(res);

        //alert the user if they enter an invalid value
        if (res == false) {
            alert('The Height must be a numeric value between 1 and 5 digits in length. Please correct this issue and continue.');
            height.value = "";
        }

    });

    //on change event to check that Max Frame Rate value is a number
    var width = document.getElementById('width');

    //listen for the change event
    width.addEventListener("change", function() {

        //test regex for the max frame rate
        //TODO: make this account for case of '12g'
        var widthTest = /[0-9]{1,5}/;

        //test value of the input against regex
        var res = widthTest.test(width.value);
        //console.log(res);

        //alert the user if they enter an invalid value
        if (res == false) {
            alert('The Width must be a numeric value between 1 and 5 digits in length. Please correct this issue and continue.');
            width.value = "";
        }

    });

//validation



    //16:9 calculator

    /*var calcWidth = document.getElementById('width');

    calcWidth.addEventListener("change", function() {
        var calcHeightValue = Math.round((calcWidth.value / 16) * 9);

        document.getElementById('height').value = calcHeightValue;

    });*/

$(document).on('focus', '.width', function(){
    var tip = document.getElementById('floatingTipShown');
    //console.log('good');
    tip.setAttribute("style", "display: block");

        /*var calcHeightValue = Math.round((this.value / 16) * 9);
        console.log(calcHeightValue);
        //document.getElementById('height').value = calcHeightValue;

        $(this).nextAll('input').first().value = calcHeightValue;
        //$(this).next('input').value = calcHeightValue;*/
    });

$(document).on('change', '.height', function(){
    var tip = document.getElementById('floatingTipShown');
    //console.log('good');
    tip.setAttribute("style", "display: none");
    });

    //TODO: add toggle to remove description
    //  if (open.style.display == "none") {
    //open.setAttribute("style", "display: inline");
    //info.setAttribute("style", "display: none")
    //  }
    //});

    //$('.description2').css('display', 'inline');
    //validation checks

})();
