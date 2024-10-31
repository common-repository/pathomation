<?php
$folder = join(DIRECTORY_SEPARATOR, array(dirname(__FILE__), "PmaLibs"));

if ((!is_dir($folder))) {
	die($folder." not found to load pma-php library from".PHP_EOL);
}

$pattern = join(DIRECTORY_SEPARATOR, array($folder, "*.php"));

foreach (glob($pattern) as $filename) {
    require_once $filename;
}

use Pathomation\PmaLibs\PMA;
?>
