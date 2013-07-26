<?php

// This code example uses the PHP Media API wrapper
// For the PHP Media API wrapper, visit opensource.brightcove.com

	// Include the BCMAPI SDK
	require('bc-mapi.php');
	      
	// Instantiate the class, passing it our Brightcove API tokens (read, then write)
	$bc = new BCMAPI(
	  'jskS1rEtQHy9exQKoc14IcMq8v5x2gCP6yaB7d0hraRtO__6HUuxMg..',
	  'uikR5D2s7F-ODnXFRV6u7riQIDiHtsDNXRWsLS_mHltMKRMWr6mmYg..'
	);

	// Create an array of meta data from our form fields
	  $metaData = array(
	    'name' => $_POST['bcVideoName'],
	    'shortDescription' => $_POST['bcShortDescription']
	  );
	
	  // Move the file out of 'tmp', or rename
	  rename($_FILES['videoFile']['tmp_name'], '/tmp/' . $_FILES['videoFile']['name']);
	  $file = '/tmp/' . $_FILES['videoFile']['name'];
	
	  // Create a try/catch
	    try {
	      // Upload the video and save the video ID
	      $id = $bc->createMedia('video', $file, $metaData);
				echo 'New video id: ';
				echo $id;
	    } catch(Exception $error) {
	      // Handle our error
	      echo $error;
	      die();
	    }
?>
