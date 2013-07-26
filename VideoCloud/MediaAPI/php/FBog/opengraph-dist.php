<?php
header("Content-Type: text/html; charset=utf-8");

/* ***
 * OPEN GRAPH FOR 'HOST ON YOUR URL' PLAYERS
 * 
 * Create a BC player with the 'host on your url' option set to this page
 * When you share a video, it will link to here with the url parameter bctid=123456
 * 123456 is the video ID
 * The Media API is used to get information about that video and populates the
 * Open Graph metadata accordingly. When the video link is shared to Facebook, the 
 * correct Open Graph for the video will be read.
 * 
 * Optionally includes HTTP URL for iOS playback 
 * 
 * Optionally writes the page so it will be valid HTML5 (hides Open Graph from anything
 * other than Facebook's user agent and writes a plpaceholder 'type' attribute into our
 * publishing code
 * 
 * Works with non-KK and KK accounts
 * 
 */

// OPTIONS
$bc_fbPlayerID		=	'';		// Player to use on Facebook (should be resizable)
$bc_pubID			=	'';		// Your Brightcove publisher ID
$bc_videoID			=	'';		// Default video ID if no bctid parameter supplied
$bc_KKaccount		=	false;	// Set to true only if a Brightcove Japan account
$bc_readToken		=	'';		// Your read API token (with URL access)
$bc_showHTTP		=	true;	// Include http link for iOS
$bc_validHTML5		=	false;	// Make code "valid" HTML5 (hide Open Graph metadata)
// END OF OPTIONS


// Uses opensource media api wrapper from http://opensource.brightcove.com/project/PHP-MAPI-Wrapper/
require('bc-mapi.php');

// You may optionally include the caching extension provided with BCMAPI...
// require('bc-mapi-cache.php');
// Using flat files
// $bc_cache = new BCMAPICache('file', 600, '/var/www/myWebSite/cache/', '.cache');
// Using Memcached
// $bc_cache = new BCMAPICache('memcached', 600, 'localhost', NULL, 11211);

// Initialise
$bc = new BCMAPI($bc_readToken, 'noWriteTokenNeeded');

if ($bc_KKaccount == true) {
	$bc->__set('url_read', 'api.brightcove.co.jp/services/library?');
	$bc->__set('url_write', 'api.brightcove.co.jp/services/post');
	$bc_serviceDomain = "brightcove.co.jp";
} else {
	$bc_serviceDomain = "brightcove.com";
}

// Replace video id from url parameters if bctid is present.
if (isset($_GET['bctid'])) {
	$bc_videoID = $_GET['bctid'];
}

// Set up params
$bc->__set('media_delivery', 'http');
$bc_params = array('video_id' => $bc_videoID,'video_fields' => 'name,shortDescription,videoStillURL,FLVURL');

// Make call
$bc_api_error = false;
$bc_video = $bc->find('videoById', $bc_params);

// Check if Facebook is doing the crawling
$bc_isFb = (eregi("facebookexternalhit", $_SERVER['HTTP_USER_AGENT'])) ? true : false;

// Get the page URL for Opengraph
$bc_url="http://".$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];

?><!DOCTYPE html>
<html>
<head>
	<title>Title</title>
	<meta name="description" content="<?= htmlspecialchars($bc_video->shortDescription); ?>" />

<?php if (($bc_validHTML5 == false) || ($bc_isFb == true)) { ?>	
	<meta property="og:title" content="<?= htmlspecialchars($bc_video->name) ?>"/>
	<meta property="og:type" content="movie"/>
	<meta property="og:url" content="<?=$bc_url; ?>"/>
	<meta property="og:video:width" content="480" />
	<meta property="og:video:height" content="270" /> 
	<meta property="og:video"  content="http://c.<?= $bc_serviceDomain ?>/services/viewer/federated_f9/?isVid=1&amp;isUI=1&amp;playerID=<?=$bc_fbPlayerID; ?>&amp;autoStart=true&amp;videoID=<?= $bc_videoID; ?>"/>
	<meta property="og:video:secure_url"  content="https://secure.<?= $bc_serviceDomain ?>/services/viewer/federated_f9/?isVid=true&amp;isUI=true&amp;playerID=<?=$bc_fbPlayerID; ?>&amp;secureConnections=true&amp;videoID=<?= $bc_videoID; ?>&amp;autoStart=true"/>
	<meta property="og:video:type" content="application/x-shockwave-flash"/>
<?php if (($bc_showHTTP == true) && (substr($bc_video->FLVURL, 0, 4) == 'http')) { ?>	
	<meta property="og:video"  content="<?= $bc_video->FLVURL ?>"/>
	<meta property="og:video:type" content="video/mp4"/>
<?php } ?>
	<meta property="og:image" content="<?=$bc_video->videoStillURL; ?>"/>
	<meta property="og:description" content="<?= htmlspecialchars($bc_video->shortDescription); ?>"/>
<?php } ?>

	<script type="text/javascript" src="http://admin.<?= $bc_serviceDomain ?>/js/BrightcoveExperiences.js"></script>

</head>
<body>

<?php if ($bc_showHTTP == true) { ?>
	<object id="myExperience" class="BrightcoveExperience" type="text/html">
<?php } else { ?>
	<object id="myExperience" class="BrightcoveExperience">
<?php } ?>
  <param name="bgcolor" value="#000000" />
  <param name="width" value="XXX" />
  <param name="height" value="XXX" />
  <param name="playerID" value="XXXXX" />
  <param name="playerKey" value="XXXXX" />
  <param name="isVid" value="true" />
  <param name="isUI" value="true" />
  <param name="dynamicStreaming" value="true" />
</object>

</body>
</html>