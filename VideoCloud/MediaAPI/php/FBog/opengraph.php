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
$bc_fbPlayerID		=	'1386727164001';	// Player to use on Facebook
$bc_pubID			=	'906043040001';	// Your Brightcove publisher ID
$bc_videoID			=	'1352995359001';	// Default video if 
$bc_KKaccount		=	false;			// Set to true only if a Brightcove Japan account
$bc_readToken		=	'4padFp2KtFo3R8px9Gy8ugjQ1Pedl6fqsdp71_6Z9b6YOmzse5_G5g..';	// Your read token
$bc_showHTTP		=	true;	// Include http link for iOS
$bc_validHTML5		=	false;	// Make code "valid" HTML5 (hide Open Graph metadata)
// END OF OPTIONS

// Uses opensource media api wrapper from http://opensource.brightcove.com/project/PHP-MAPI-Wrapper/
require('bc-mapi.php');

// You may optionally include the caching extension provided with BCMAPI...
require('bc-mapi-cache.php');
// Using flat files
$bc_cache = new BCMAPICache('file', 600, '/var/www/myWebSite/cache/', '.cache');
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

// Get the page URL for Opengraph
$bc_url="http://".$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];

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



?><!DOCTYPE html>
<html>
<head>
	<title>PHP Open Graph Example</title>
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
	<script type="text/javascript" src="http://code.jquery.com/jquery-1.7.1.min.js"> </script>
	<script type="text/javascript">
	$(document).ready(function(){
		var tbl = "";
		console.log($('meta[property^="og:"]'));
		$('meta[property^="og:"]').each(function(o) {
			console.log(this);
			tbl += "<tr><td>" + $(this).attr("property") + "</td><td>" + $(this).attr("content") + "</td></tr>\n";
		});
		$('#ogout').html(tbl);
		console.log(tbl);
	});
	</script>
	<style type="text/css">
		body {
			background-color: #000;
			color: #fff;
			text-align: center;
			min-width: 420px;
			font-size: 14px;
			font-family: helvetica, arial, sans-serif;
		}
		#wrapper {
			margin:10px auto 0;
			width:420px;
			text-align: left;
		}
		h1 {
			font-weight:normal;
	</style>

</head>
<body>

<div id="wrapper">
	<h1>PHP Open Graph Example</h1>
	<p>The Open Graph on this page is written based on the bctid parameter appended to the url on the sharing link for each video.</p>
<?php if ($bc_showHTTP == true) { ?>
	<object id="myExperience" class="BrightcoveExperience" type="text/html">
<?php } else { ?>
	<object id="myExperience" class="BrightcoveExperience">
<?php } ?>
<script language="JavaScript" type="text/javascript" src="http://admin.brightcove.com/js/BrightcoveExperiences.js"></script>
  <param name="bgcolor" value="#000000" />
  <param name="width" value="420" />
  <param name="height" value="347" />
  <param name="playerID" value="1490866637001" />
  <param name="playerKey" value="AQ~~,AAAA0vRfoQE~,baHF9-H5aHKCu3sWdk9NW-uLjbXN65QK" />
  <param name="isVid" value="true" />
  <param name="isUI" value="true" />
  <param name="dynamicStreaming" value="true" />
</object>
<h2>Open Graph in document</h2>
<table id="ogout">
</table>
</div>
</body>
</html>