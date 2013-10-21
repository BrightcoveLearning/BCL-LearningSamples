<?php
 
 # Include the PHP Media API Wrapper
 require('bc-mapi.php');
 
 # Instantiate the class, passing it our Brightcove API tokens
 $bc = new BCMAPI(
 'CO6uYEeNyUGE22AEvZkMKniQorK2vmR2bhYMNKXiKeHa_fqtcv640A..',
 ''
 );

  # Set up Constants
  define("TIMESTART", mktime(00, 00, 01, 01, 01, 2012)); #Timestamp of Jan 01, 2012 00:00:01
  
  # Set up variables
  $tNow = time(); #Time stamp as of UNIX Epoch
  
  $tPassed = $tNow - TIMESTART;

  // Change this playlist if you want a different playlist to be simulated
  // could also pass this in as a parameter in the AJAX request
  $liveList = $bc->find('find_playlist_by_id', '2520498283001');
  $totalDuration = 0;
  
  $videoIDs = array();

  // go through each video to find the total duration
  foreach($liveList->videos as $item => $video) {
   $totalDuration = $totalDuration + round($video->length / 1000);
   array_push($videoIDs,$video->id);
  }
  
  // find our location
  $plsection = $tPassed % $totalDuration;
  $totalDuration = 0;
  $currentvideo;
  $videoremainder;
  foreach($liveList->videos as $item => $video) {
   $totalDuration = $totalDuration + round($video->length / 1000);
   if ($totalDuration > $plsection) {
    $currentvideo = $video;
    $videoremainder = $totalDuration - $plsection;
    break;
   }
  }
  
  // return the current video, current position, and list of videos
  $vidpos = round($currentvideo->length / 1000) - $videoremainder;
  print(json_encode(array("currentVideoId"=>$currentvideo->id, "videoPosition"=>$vidpos, "videoIDs"=>$videoIDs)));
?>
