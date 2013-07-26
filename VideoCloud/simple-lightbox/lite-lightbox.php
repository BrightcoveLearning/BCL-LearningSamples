<?php //Create variable for title to be used in header  ?>
<?php $theTitle='Smart Player API - Lite Lightbox Player'; ?>
<?php //header does NOT include </head> and <body> so other CSS files can be used  ?>
<?php
   $path = $_SERVER['DOCUMENT_ROOT'];
   $path .= "/bcls/php/header.php";
   include_once($path);
?>
<?php //Place extra header information here, e.g. other CSS includes ?>
<link rel="stylesheet" href="simple-lightbox.css">


<?php //Nav does include the </head> and <body>  ?>
<?php
   $path = $_SERVER['DOCUMENT_ROOT'];
   $path .= "/bcls/php/nav.php";
   include_once($path);
?>
<?php //Actual body content goes here ?>
    <div class="section" id="player">
      <!-- h2 contents will be in page navigation label - 21 characters (including spaces) maximum -->
      <h2><a name="player"></a>The player</h2>
      <p>A standard Chromeless Video Player is used for this sample.</p>
      <p class="text-warning">Note that the buttons below are for development purposes only &mdash; do not use in production.</p>
      <div id="modeSwitch">
        <span class="bc-button" id="switchToHTML5" style="margin-bottom: 20px;margin-right: 10px;">Switch to HTML5 Player</span>
        <span class="bc-button" id="switchToFlash" style="margin-bottom: 20px;">Switch to Flash Player</span>
      </div>
      <div class="player-block">
        <!-- This is the container for the video list -->
        <div id="videoList" class="video-list"></div>
        <!-- Start of Brightcove Player -->
        <script language="JavaScript" type="text/javascript" src="//admin.brightcove.com/js/BrightcoveExperiences.js"></script>
        <!-- lightbox block -->
        <div id="BCLSlightbox" class="BCLShide">
          <object id="myExperience921449663001" class="BrightcoveExperience">
            <param name="bgcolor" value="#FFFFFF" />
            <param name="width" value="480" />
            <param name="height" value="270" />
            <param name="playerID" value="2079935931001" />
            <param name="playerKey" value="AQ~~,AAAA1oy1bvE~,ALl2ezBj3WE0z3yX6Xw29sdCvkH5GCJv" />
            <param name="isVid" value="true" />
            <param name="isUI" value="true" />
            <param name="dynamicStreaming" value="true" />
            <param name="@videoPlayer" value="921449663001" />

            <param name="includeAPI" value="true" />
            <param name="templateLoadHandler" value="onTemplateLoad" />
            <param name="templateReadyHandler" value="onTemplateReady" />
          </object>
          <div id="BCLSclose" class="BCLSclose">Close</div>
        </div>
        <script type="text/javascript">brightcove.createExperiences();</script>
        <!-- End of Brightcove Player -->
      </div>
    </div>

    <!-- bcl scripts ============================================================ -->
    <script src="//docs.brightcove.com/en/scripts/bc-mapi.js"></script>
    <script src="//docs.brightcove.com/en/scripts/secondsToTime.js"></script>
    <script src="//docs.brightcove.com/en/scripts/flashHTMLswitch-nojQ.js"></script>
    <script src="simple-lightbox.js"></script>



<?php //Footer just </body> and </html> ?>
<?php
   $path = $_SERVER['DOCUMENT_ROOT'];
   $path .= "/bcls/php/footer.php";
   include_once($path);
?>