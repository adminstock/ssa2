<?php
namespace WebAPI\Core;

/* 
 * Copyright © AdminStock Team (www.adminstock.net), 2016. All rights reserved.
 * Copyright © Aleksey Nemiro, 2016. All rights reserved.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Decode JSON to class.
 */
class JsonDecode
{

  private $ObjectProperties = NULL;

  private $Result = NULL;

  function __construct($type, $path, $objectProperties = NULL)
  {
    if (!isset($type) || $type == '')
    {
      throw new \InvalidArgumentException('Type name is required. Value cannot be empty.');
    }

    if (!class_exists($type))
    {
      throw new \InvalidArgumentException('Class "'.$type.'" not found.');
    }

    if (!isset($path) || $path == '')
    {
      throw new \InvalidArgumentException('File is required. Value cannot be empty.');
    }

    if (!is_file($path))
    {
      throw new ApiException('File "'.$path.'" not found.', ApiErrorCode::NOT_FOUND, HttpStatusCode::NOT_FOUND);
    }
    
    if (!is_readable($path))
    {
      throw new ApiException('No access to the file "'.$path.'".');
    }

    // read file
    $json = file_get_contents($path);
    $json = str_replace("\xEF\xBB\xBF", '', $json);

    $data = json_decode($json, TRUE);

    if (json_last_error() != JSON_ERROR_NONE)
    {
      throw new ApiException('JSON Error: '.json_last_error(), ApiErrorCode::JSON_PARSE_ERROR);
    }
    
    // set object properties
    $this->ObjectProperties = $objectProperties;
    
    // create instance
    $this->Result = new $type();

    if ($this->Result instanceof IObjectProperties)
    {
      $this->ObjectProperties = $this->Result->GetObjectProperties();
    }

    // fill instance
    $this->Fill($this->Result, $data);
  }

  private function Fill($instance, $data)
  {
    $r = new \ReflectionClass($instance);
    $propeties = $r->getProperties(\ReflectionProperty::IS_PUBLIC);

    foreach($propeties as $property)
    {
      $propertyName = $property->getName();
      $key = str_replace('-', '', strtolower($propertyName));

      if (!isset($data[$key]))
      {
        continue;
      }
      
      // TODO: getDocComment() Hmm...

      if ($this->ObjectProperties != NULL && array_key_exists($propertyName, $this->ObjectProperties))
      {
        $elementType = NULL;

        if (strpos($this->ObjectProperties[$propertyName], '[]') === FALSE)
        {
          // single
          $value = new $this->ObjectProperties[$propertyName]();
          $this->Fill($value, $data[$key], $elementType);
        }
        else
        {
          // array
          $value = [];
          $elementType = substr($this->ObjectProperties[$propertyName], 0, -2);

          foreach ($data[$key] as $item)
          {
            $element = new $elementType();
            $this->Fill($element, $item);
            $value[] = $element;
          }
        }

        $instance->$propertyName = $value;
      }
      else
      {
        $instance->$propertyName = $data[$key];
      }
    }
  }

  /**
   * Returns deserialization result.
   * 
   * @return object
   */
  public function GetInstance()
  {
    return $this->Result;  
  }

}