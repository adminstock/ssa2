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
  None = 0,
  Loader = 1 << 0,

  /** Default. */
  White = 1 << 10,
  Black = 1 << 11,

  /** Default. */
  TextBlack = 1 << 20,
  TextWhite = 1 << 21,
  TextYellow = 1 << 22,
  TextRed = 1 << 23,
  TextGreen = 1 << 24,

  Opacity15 = 1 << 30,
  Opacity25 = 1 << 31,
  Opacity50 = 1 << 32,
  Opacity75 = 1 << 33,
  Opacity90 = 1 << 34,
}

/**
 * Represent overlay.
 */
export class Overlay {

  /**
   * Initialization of the overlay.
   */
  private static Init(): void {
    if ($('#overlay').length > 0) {
      return;
    }

    $('body').append('<div id="overlay" class="overlay-wrapper"><div data-loader="true" class="loader"><i class="fa fa-spinner fa-pulse fa-fw"></i><br /><span class="loader-text"></span></div></div>');
  }

  /**
   * Shows overlay.
   *
   * @param type
   * @param text
   * @param duration
   */
  public static Show(type: OverlayType, text?: string, duration?: number | string): void {
    Overlay.Init();

    Debug.Log('Overlay.Show', type, text);

    text = text || 'Please wait...';

    let wrapper = 'overlay-wrapper';

    if (type & OverlayType.Opacity15) {
      wrapper += ' overlay-opacity15';
    }
    else if (type & OverlayType.Opacity25) {
      wrapper += ' overlay-opacity25';
    }
    else if (type & OverlayType.Opacity50) {
      wrapper += ' overlay-opacity50';
    }
    else if (type & OverlayType.Opacity75) {
      wrapper += ' overlay-opacity75';
    }
    else if (type & OverlayType.Opacity90) {
      wrapper += ' overlay-opacity90';
    }

    let loader = 'hidden';

    if (type & OverlayType.Loader) {
      loader = 'loader';

      if (type & OverlayType.TextGreen) {
        loader += ' loader-green';
      }
      else if (type & OverlayType.TextRed) {
        loader += ' loader-red';
      }
      else if (type & OverlayType.TextGreen) {
        loader += ' loader-green';
      }
      else if (type & OverlayType.TextWhite) {
        loader += ' loader-white';
      }
    }

    $('#overlay').attr('class', wrapper);

    $('[data-loader]', '#overlay').attr('class', loader);

    $('.loader-text', '#overlay').html(text);

    $('#overlay').show(duration);
  }

  /**
   * Hides overlay.
   *
   * @param duration
   */
  public static Hide(duration?: number | string): void {
    Debug.Log('Overlay.Hide');
    $('#overlay').hide(duration);
  }

  /**
   * Sets new text to loader.
   *
   * @param text Text to set.
   */
  public static SetText(text: string): void {
    $('.loader-text', '#overlay').html(text);
  }
  
}