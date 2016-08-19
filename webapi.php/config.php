<?php
// TODO

// root path
define('ROOT_PATH', $_SERVER['DOCUMENT_ROOT']);

// path to the configuration files of servers
// default: ./servers
define('SSA_SERVERS_PATH', implode(DIRECTORY_SEPARATOR, [ROOT_PATH, 'servers']));