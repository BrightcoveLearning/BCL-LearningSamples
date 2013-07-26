<?php //Create variable for title to be used in header  ?>
<?php $theTitle='Replace with your title'; ?>
<?php //header does NOT include </head> and <body> so other CSS files can be used  ?>
<?php
   $path = $_SERVER['DOCUMENT_ROOT'];
   $path .= "/junk/php-includes/header.php";
   include_once($path);
?>
<?php //Place extra header information here, e.g. other CSS includes ?>



<?php //Nav does include the </head> and <body>  ?>
<?php
   $path = $_SERVER['DOCUMENT_ROOT'];
   $path .= "/junk/php-includes/nav.php";
   include_once($path);
?>
<?php //Actual body content goes here ?>

<h3>this is content</h3>


<?php //Footer just </body> and </html> ?>
<?php
   $path = $_SERVER['DOCUMENT_ROOT'];
   $path .= "/junk/php-includes/footer.php";
   include_once($path);
?>