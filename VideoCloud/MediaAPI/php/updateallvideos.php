<?php

	# Include & Instantiate
	require('bc-mapi.php');
	$bc = new BCMAPI(
		'jskS1rEtQHy9exQKoc14IcMq8v5x2gCP6yaB7d0hraRtO__6HUuxMg..',
		'uikR5D2s7F-ODnXFRV6u7riQIDiHtsDNXRWsLS_mHltMKRMWr6mmYg..'
	);

	# Only return ID and Tags data
	$params = array(
		'video_fields' => 'id,tags'
	);
	
	# Request all videos from API
	$videos = $bc->findAll('video', $params);
	
	# Loop through videos
	foreach($videos as $video)
	{
		# Assign tags to temporary variable
		$new_tags = $video->tags;
		
		# Add new tag
		$new_tags[] = 'newTag';
		
		# Create new meta data
		$new_meta = array(
			'id' => $video->id,
			'tags' => $new_tags
		);
		
		# Send changes to API
		$bc->update('video', $new_meta);
	}

?>