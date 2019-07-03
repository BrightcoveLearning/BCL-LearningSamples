<?
echo 'Test';
// Welcome to Carl's UPDATED sample Video Cloud iTunes feed

// Please use this at your own risk.
// This is just a sample to get you started. You can customize further as your requirements
// grow.

// The following is a list of requirements and conditions in order for this podcast feed
// to function properly;

//1) You must have a Pro or Enterprise level Video Cloud Account.
//2) You need to create the following custom fields. They are in your Account Settings: 
// Video Fields page on the Video Cloud Studio Home page:
//			1) itunesartist(text)
//			2) explicit(text) values = yes|no, true|false, explicit|clean
//
//3) You will have to manually or programmatically set the custom metadata values when you
// upload content.



// Please customize the variables below:

// This is the title of the podcast itself.
$title = "Brightcove Test Podcast";
// This is a link to where the podcast can be found.
$link = "http://www.carlrutman.com/php/brightcove_itunes.php";
// This is the language you display for this podcast.
$lang = "en-us";
// This is the copyright information.
$copyright = "&#x2117; &amp; &#xA9; 2019 Updated iTunes Feed";
// This is the subtitle of the podcast.
$subtitle = "iTunes Test XML FEED via the Video Cloud Playback APIs";
// This is the author's name.
$author = "Carl Rutman";
// The publication date of this iTunes Feed
$pubDate = date("m-d-Y"); // OPTIONALLY USE THE "updated_at" VARIABLE FROM THE RETURNED JSON
// This is the summary for the podcast.
$summary = "This is a sample iTunes XML generated from Video Cloud.";
// This is a description of this iTunes Feed.
$description= "Description of the Video Cloud iTunes Test Feed";
// This is the owner's name.
$ownername = "Carl Rutman";
// This is the owner's email address.
$owneremail = "crutman@brightcove.com";
// This is the podcast thumbnail image url.
$imageurl = "http://www.carlrutman.com/php/logo.jpg";
// This is the podcast category.
$category = "TV &amp; Film";
// This is a yes or no boolean if the podcast is explicit.
$explicit = "no";

//Brightcove Account ID
$accountId = "948002569001";
// This is your Policy Key associated with your account. 
$policyKey = "BCpkADawqM0WjAJnQCXelwCL_sudfR4HycluOT5LOImBPAfUCLn46vxR6hG7mMm1VoineewK4tkFbfDakfEwYInEMSa_fAJ7HxVMIN1ItBJHXEDYGMnPbJrkK0U";
// The ID of the playlist you wish to publish.
$playlistid = "6026675134001";

// This is the baseURL of the API endpoint you would like to use
$baseURL = "https://edge.api.brightcove.com/playback/v1/accounts/";




// Please DO NOT alter the code below;
print('<?xml version="1.0" encoding="UTF-8"?>');
echo"\n";
print('<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:atom="http://www.w3.org/2005/Atom">');
echo"\n";
print('<channel>');
echo"\n";
print('	<title>'. $title .'</title>');
echo"\n";
print('	<link>'. $link .'</link>');
echo"\n";
print('	<language>'. $lang .'</language>');
echo"\n";
print('	<copyright>'. $copyright .'</copyright>');
echo"\n";
print('	<itunes:subtitle>'. $subtitle .'</itunes:subtitle>');
echo"\n";
print('	<itunes:author>'. $author .'</itunes:author>');
echo"\n";
print('	<pubDate>'. $pubDate .'</pubDate>');
echo"\n";
print('	<itunes:summary><![CDATA['. $summary .']]></itunes:summary>');
echo"\n";
print('	<description><![CDATA['. $description .']]></description>');
echo"\n";
print('	<itunes:owner>');
echo"\n";
print('		<itunes:name>'. $ownername .'</itunes:name>');
echo"\n";
print('		<itunes:email>'. $owneremail .'</itunes:email>');
echo"\n";
print('	</itunes:owner>');
echo"\n";
print('	<itunes:image href="'. $imageurl .'" />');
echo"\n";
print('	<itunes:category text="'. $category .'"></itunes:category>');
echo"\n";
print('	<itunes:explicit>'. $explicit .'</itunes:explicit>');
echo"\n";
echo"\n";


function formatSeconds( $seconds )
{
  $seconds = ($seconds / 1000);
  $hours = 0;
  $milliseconds = str_replace( "0.", '', $seconds - floor( $seconds ) );

  if ( $seconds > 3600 )
  {
    $hours = floor( $seconds / 3600 );
  }
  $seconds = $seconds % 3600;


  return str_pad( $hours, 2, '0', STR_PAD_LEFT )
       . gmdate( ':i:s', $seconds )
  ;
}



$ch = curl_init();
$timeout = 5; // set to zero for no timeout
curl_setopt ($ch, CURLOPT_URL, $baseURL . $accountId . '/playlists/'. $playlistid);
curl_setopt ($ch, CURLOPT_HTTPHEADER, array(('Authorization:BCOV-Policy '. $policyKey),('BCOV-Policy:'. $policyKey),('Accept:application/json;pk='. $policyKey)));
curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
$file_contents = curl_exec($ch);
curl_close($ch);

$returndata = json_decode($file_contents);

foreach($returndata->videos as $items)
{
print('	<item>');
echo"\n";
print('		<title>');
print_r($items->{"name"});
print('</title>');
echo"\n";
 
print('		<itunes:author>');
print_r($items->custom_fields->{"itunesartist"});
print('</itunes:author>');
echo"\n";
 
print('		<itunes:subtitle>');
print_r($items->{"description"});
print('</itunes:subtitle>');
echo"\n";

print('		<itunes:summary>');
print_r($items->{"description"});
print('</itunes:summary>');
echo"\n";
 
print('		<itunes:image>');
print_r($items->{"poster"});
print('</itunes:image>');
echo"\n";
 
print('		<enclosure url="');
$newurl = $items->sources[4]->{"src"};
print_r($newurl);
print('" length="');
print_r($items->{"duration"});
print('" type="video/mp4" />');
echo"\n";
 
print('		<guid>');
print_r($items->{"id"});
print('</guid>');
echo"\n";
 
print('		<pubDate>');
print_r(date(DATE_RFC2822,($items->{"published_at"})));
print('</pubDate>');
echo"\n";
 
print('		<itunes:duration>');
print($duration = formatSeconds($items->{"duration"}));
print('</itunes:duration>');
echo"\n";

print('		<itunes:explicit>');
print_r($items->custom_fields->{"explicit"});
print('</itunes:explicit>');
echo"\n";

 
print('	</item>');
echo"\n";
}

echo"\n";

print('</channel>');
echo"\n";
print('</rss>');

?> 