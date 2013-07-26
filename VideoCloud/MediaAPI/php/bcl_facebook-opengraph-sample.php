<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
<!-- Brightcove URL: http://files.brightcove.com/bcl_facebook-opengraph-sample.php -->
<style type="text/css">
body
{
background-color:#66CCCC;
margin-top: 100px;
margin-left: 100px;
text-align:middle;
}
</style>

<?php
# Include the PHP SDK  -- remember to make sure the include fits your directory structure, more abou the SDK can be found at http://opensource.brightcove.com/project/PHP-MAPI-Wrapper/
require('bc-mapi.php'); 
# Instantiate the class, passing it our Brightcove API tokens
$bc = new BCMAPI(
                'jskS1rEtQHy9exQKoc14IcMq8v5x2gCP6yaB7d0hraRtO__6HUuxMg..',
                'uikR5D2s7F-ODnXFRV6u7riQIDiHtsDNXRWsLS_mHltMKRMWr6mmYg..'
        );

# Define our parameters
//enter your publisher id
$pubid = 57838016001;
//enter the player id you would like to publish to facebook
$fbplayid = 1463030067001;
$fbplaykey = "AQ~~,AAAADXdqFgE~,aEKmio9UXag7mI6RpcOQDPGA271tZKoC";
//enter true false for if you want video to autoplay or not when thumbnail clicked in FB
$fbautoplay = "true";
//enter the player id and player key you would like to publish on this page 
$playid = 1463030068001;
$playkey = "AQ~~,AAAADXdqFgE~,aEKmio9UXaj62LQZfWSovLDmHDDA8rXn"; 
//set the page URL you want - you can use the curPageURL function to set to the current page. 
$pageulr = curPageURL();
//default video to load
$vidid = 734462565001;
//check if video id field populated in query string.
if (isset($_GET['bctid'])){
  $vidid = $_GET['bctid'];
}
$params = array(
'video_id' => $vidid,
'video_fields' => 'shortDescription,name,videoStillURL,id'
        );

# Make our API call
try {
    $video = $bc->find('videoById', $params);
} catch(Exception $error) {
    echo $error;
}
// function to get the current page URL - used to set the share link of the player. 
function curPageURL() {
 $pageURL = 'http';
 if ($_SERVER["HTTPS"] == "on") {$pageURL .= "s";}
 $pageURL .= "://";
 if ($_SERVER["SERVER_PORT"] != "80") {
  $pageURL .= $_SERVER["SERVER_NAME"].":".$_SERVER["SERVER_PORT"].$_SERVER["REQUEST_URI"];
 } else {
  $pageURL .= $_SERVER["SERVER_NAME"].$_SERVER["REQUEST_URI"];
 }
 $pageURL = str_replace("?".$_SERVER["QUERY_STRING"], "", $pageURL);
 return $pageURL;
}

?>
  <meta property="og:title" content="<?php echo $video->name; ?>"/>
  <meta property="og:description" content="<?php echo $video->shortDescription; ?>" />
  <meta property="og:type" content="movie"/>
  <meta property="og:video:height" content="226"/>
  <meta property="og:video:width" content="320"/>
  <meta property="og:url"  content="<?php echo $pageulr; ?>?bctid=<?php echo $video->id; ?>"/>
  <meta property="og:video" content="http://c.brightcove.com/services/viewer/federated_f9/<?php echo $fbplayid; ?>?isVid=1&isUI=1&publisherID=<?php echo $pubid; ?>&playerID=<?php echo $fbplayid; ?>&domain=embed&videoId=<?php echo $video->id; ?>&autoStart=<?php echo $fbautoplay; ?>"/> 
  <meta property="og:image" content="<?php echo $video->videoStillURL; ?>"/>
  <meta property="og:video:secure_url" content="https://secure.brightcove.com/services/viewer/federated_f9/<?php echo $pubid; ?>?isVid=1&isUI=1&playerKey=<?php echo $fbplaykey; ?>&videoID=<?php echo $video->id; ?>&secureConnections=true&autoStart=<?php echo $fbautoplay; ?>" />

  
  </head>

<body>
<script type="text/javascript">

var video;
var socialMod;

function onTemplateLoaded(pPlayer) {
	//alert("templateLoaded");
	

	player = bcPlayer.getPlayer(pPlayer);
	//exp 	= player.getModule(APIModules.EXPERIENCE);
	video 	= player.getModule(APIModules.VIDEO_PLAYER);
	socialMod = player.getModule(APIModules.SOCIAL);
	video.addEventListener(BCMediaEvent.CHANGE, onMediaChange);

}

function onMediaChange(e) {
    
    socialMod.setLink("<?php echo $pageurl; ?>?bctid=" +  video.getCurrentVideo().id);  
	//alert(socialMod.getLink());
}



</script>

<!-- Start of Brightcove Player -->

<div style="display:none">

</div>

<!--
By use of this code snippet, I agree to the Brightcove Publisher T and C 
found at https://accounts.brightcove.com/en/terms-and-conditions/. 
-->


<script language="JavaScript" type="text/javascript" src="http://admin.brightcove.com/js/BrightcoveExperiences.js"></script>
<script type="text/javascript" src="http://admin.brightcove.com/js/APIModules_all.js"></script>

<object id="myExperience" class="BrightcoveExperience">
  <param name="bgcolor" value="#66CCCC" />
  <param name="width" value="960" />
  <param name="height" value="445" />
  <param name="playerID" value="<?php echo $playid; ?>" />
  <param name="playerKey" value="<?php echo $playkey; ?>"/>
  <param name="isVid" value="true" />
  <param name="isUI" value="true" />
  <param name="dynamicStreaming" value="true" />
  <param name="@videoList" value="729955373001" />
  <param name="linkBaseURL" value="<?php echo $pageulr; ?>?bctid=<?php echo $video->id; ?> " />
</object>

<!-- 
This script tag will cause the Brightcove Players defined above it to be created as soon
as the line is read by the browser. If you wish to have the player instantiated only after
the rest of the HTML is processed and the page load is complete, remove the line.
-->
<script type="text/javascript">brightcove.createExperiences();</script>

<!-- End of Brightcove Player -->

 

</body>
</html>