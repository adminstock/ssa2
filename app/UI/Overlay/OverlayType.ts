/*
 * Copyright © AdminStock Team (www.adminstock.net), 2016. All rights reserved.
 * Copyright © Aleksey Nemiro (aleksey.nemiro.ru), 2016. All rights reserved.
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

/** Overlay type. */
export enum OverlayType {
  Invisible = 0,
  Loader = 1 << 0,

  /** Default. */
  White = 1 << 1,
  Black = 1 << 2,

  /** Default. */
  TextBlack = 1 << 3,
  TextWhite = 1 << 4,
  TextYellow = 1 << 5,
  TextRed = 1 << 6,
  TextGreen = 1 << 7,

  Opacity15 = 1 << 8,
  Opacity25 = 1 << 9,
  Opacity50 = 1 << 10,
  Opacity75 = 1 << 11,
  Opacity90 = 1 << 12,
}