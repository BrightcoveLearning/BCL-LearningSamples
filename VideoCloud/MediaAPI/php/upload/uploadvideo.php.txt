<?php
// Turn on error reporting during development
ini_set('error_reporting', E_ALL);
ini_set('display_errors', TRUE);

// Create Constants
define("UPLOAD_CALL", "http://api.brightcove.com/services/post");
define("TOKEN", "GwrdB2odqtcmCsmU9UtmcxMX6GmQxydWMyhtGDezpNo.");
define("METHOD", "create_video");


// Create arrays
$post = array();
$params = array();
$video = array();


// Handle the uploaded file
// It needs to be moved out of the temp directory so PHP can
// determine the mime-type from the file extension which is 
// ".tmp" in the temp directory.
$file = $_FILES['file'];
$newFile = "./uploads/" . $file["name"];
if(file_exists($newFile)) { // If file already exists in the uploads folder
			  unlink($newFile);  // delete it before copying the new file
}
$result = move_uploaded_file($file["tmp_name"], $newFile);


// Extract the other metadata from the POST and put into vars
$video["name"] = $_POST["name"];
$video["shortDescription"] = $_POST["desc"];
$video["tags"] = explode(",",$_POST["tags"]);

$params["token"] = TOKEN;
$params["video"] = $video;

$post["method"] = METHOD;
$post["params"] = $params;



// Assemble the multipart request: encode JSON part and the file part
$requestData["json"] = json_encode($post) . "\n";
$requestData["file"] = "@".dirname(__FILE__) . '/' . $newFile;




// Execute the call using curl
$ch = curl_init(UPLOAD_CALL);

// Request type is post
curl_setopt($ch, CURLOPT_POST, true);

// Declare the post data that we assembled earlier
curl_setopt($ch, CURLOPT_POSTFIELDS, $requestData);

// Return the result as a string of the return value of curl_exec instead of outputting it directly
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// Go!
$http_result = curl_exec($ch);



// Print the results if successful, otherwise print the errors :-(
if ($http_result) {
   echo "$http_result";
} else {
  echo curl_error($ch); 
  echo curl_getinfo($ch, CURLINFO_HEADER_OUT);
  echo curl_errno($ch); 
}


?>