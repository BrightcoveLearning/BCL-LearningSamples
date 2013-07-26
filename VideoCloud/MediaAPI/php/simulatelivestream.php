  # Set up Constants
  define("TIMESTART", mktime(00, 00, 01, 01, 01, 2009)); #Timestamp of Jan 01, 2009 00:00:01
  
  # Set up variables
  $tNow = time(); #Time stamp as of UNIX Epoch
  
  # The algorithm
  # 1 - Get the difference between our Time Start and the Unix EPOCH time - this gives up Time Passed (Tpassed)
  # 2 - Tpassed = duration of video we need to seek through
  # 3 - Total duration of playlist - tells us our search length (if we need to jump to future sequence)
  # 4 - Divide whole multiplier of Playlist Duration into Tpassed - until we have a Mod
  # 5 - Mod is amount of time, seek through videos until again we have less than 1
  # 6 - Remainder is amount in video we need to seek to
  # 7 - Send player seek time via AJAX
  
  $tPassed = $tNow - TIMESTART;
  $liveList = $bc-&gt;find('find_playlist_by_reference_id', 'pl_liveList');
  $totalDuration = 0;
  
  foreach($liveList-&gt;videos as $item =&gt; $video) {
   $totalDuration = $totalDuration + round($video-&gt;length / 1000);
  }
  
  #echo "Time Passed = $tPassed &lt;br/&gt;";
  #echo "Total Duration = $totalDuration &lt;br/&gt;";
  
  $plsection = $tPassed % $totalDuration;
  #echo "Modulus = $plsection &lt;br/&gt;";
  
  $totalDuration = 0;
  $currentvideo;
  $videoremainder;
  foreach($liveList-&gt;videos as $item =&gt; $video) {
   $totalDuration = $totalDuration + round($video-&gt;length / 1000);
   if ($totalDuration &gt; $plsection) {
    $currentvideo = $video;
    $videoremainder = $totalDuration - $plsection;
    break;
   }
   
  }
  
  $vidpos = round($currentvideo-&gt;length / 1000) - $videoremainder;
  echo "$currentvideo-&gt;id,$vidpos";

