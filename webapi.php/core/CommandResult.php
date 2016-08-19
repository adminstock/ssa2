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
 * Represents the result of the remote command execution.
 */
class CommandResult
{

  /**
    * Result.
    * 
    * @var string
    */
  private $Output;

  /**
    * Error message.
    * 
    * @var string
    */
  private $Error;

  function __construct($result, $error = '')
  {
    $this->Output = $result;
    $this->Error = $error;
  }

  /**
   * Returns the results of a command execution.
   * 
   * @param bool $trimming Specifies whether to remove white space on the sides. Default: TRUE.
   * 
   * @return string
   */
  public function GetOutput($trimming = TRUE)
  {
    if ($trimming === TRUE)
    {
      return trim($this->Output);
    }
    else
    {
      return $this->Output;
    }
  }
  
  /**
   * Returns an error messages received when a command executing.
   * 
   * @param bool $trimming  Specifies whether to remove white space on the sides. Default: TRUE.
   * 
   * @return string
   */
  public function GetError($trimming = TRUE)
  {
    if ($trimming === TRUE)
    {
      return trim($this->Error);
    }
    else
    {
      return $this->Error;
    }
  }

  /**
   * Checks contains the current instance of an error messages or not.
   * 
   * @return bool
   */
  public function HasError()
  {
    return isset($this->Error) && trim($this->Error) != '';
  }
  
  /**
   * Checks contains the current instance of an output data or not.
   * 
   * @return bool
   */
  public function HasOutput()
  {
    return isset($this->Output) && trim($this->Output) != '';
  }

  /**
   * Returns TRUE, if the output data and specified value are equal.
   * 
   * @param mixed $pattern String to compare, or string array, or function.
   * @param mixed $caseInsensitive Case-insensitive or not. Default: TRUE.
   * 
   * @return bool
   */
  public function OutputAre($pattern, $caseInsensitive = TRUE)
  {
    if (is_callable($pattern))
    {
      return $pattern($this->GetOutput());
    }

    $values = [];

    if (is_array($pattern) === FALSE)
    {
      $values[] = $pattern;
    }
    else
    {
      $values = $pattern;
    }

    if ($caseInsensitive === TRUE)
    {
      $values = array_map('strtolower', $values);

      return in_array(strtolower($this->GetOutput()), $values);
    }
    else
    {
      return in_array($this->GetOutput(), $values);
    }
  }

}