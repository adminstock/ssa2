<?php

spl_autoload_register(function ($class) {
  $namespace = substr($class, strripos($class, 'WebAPI') + strlen('WebAPI') + 1);
  $className = substr($class, strripos($class, '\\') + 1);

  $paths = [];

  if ($namespace == $className) 
  {
    $paths[] = strtolower($className).'.php';
    $paths[] = $className.'.php';
  }
  else 
  {
    $segments = explode('\\', $namespace);

    if (count($segments) <= 2)
    {
      $paths[] = str_replace('\\', '/', strtolower($namespace)).'.php';
      $paths[] = str_replace('\\', '/', $namespace).'.php';
    }
    else
    {
      array_pop($segments);
      $folderPath = implode('/', $segments);
      $paths[] = strtolower($folderPath).'/'.$className.'.php';
      $paths[] = strtolower($folderPath).'/'.strtolower($className).'.php';
      $paths[] = $folderPath.'/'.$className.'.php';
    }
  }

  foreach ($paths as $path)
  {
    if (is_file($path))
    {
      require_once $path;
      break;
    }  
  }
});