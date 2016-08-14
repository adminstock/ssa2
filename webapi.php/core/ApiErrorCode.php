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
 * List of error codes.
 */
abstract class ApiErrorCode
{

  const BAD_REQUEST = 'BAD_REQUEST';

  const JSON_PARSE_ERROR = 'JSON_PARSE_ERROR';

  /**
   * The argument is not specified or is empty.
   */
  const ARGUMENT_NULL_OR_EMPY = 'ARGUMENT_NULL_OR_EMPY';

  /**
   * The argument is out of range.
   */
  const ARGUMENT_OUT_OF_RANGE = 'ARGUMENT_OUT_OF_RANGE';

  /**
   * Internal/General server error.
   */
  const SERVER_ERROR = 'SERVER_ERROR';

  /**
   * Access denied.
   */
  const ACCESS_DENIED = 'ACCESS_DENIED';
  
  /**
   * Not found.
   */
  const NOT_FOUND = 'NOT_FOUND';

  /**
   * Module not found.
   */
  const UNKNOWN_MODULE = 'UNKNOWN_MODULE';

  /**
   * Method not found.
   */
  const UNKNOWN_METHOD = 'UNKNOWN_METHOD';

  const SSH_ERROR = 'SSH_ERROR';
  
  const SSH_CONNECTION_FAILED = 'SSH_CONNECTION_FAILED';
  
  const SSH_AUTHENTICATION_FAILED = 'SSH_AUTHENTICATION_FAILED';

}