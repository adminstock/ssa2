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

import IOperatingSystem from 'IOperatingSystem';

export class OperatingSystemFamily {

  /** GNU/Linux */
  public static get FAMILY_LINUX(): string { return 'Linux'; }

  /** BSD, OS X */
  public static get FAMILY_BSD(): string { return 'BSD'; }

  public static get FAMILY_WINDOWS(): string { return 'Windows'; }

  public static get FAMILY_UNIX(): string { return 'Unix'; }

  public static get NamesByFamilies(): any {
    return {
      [OperatingSystemFamily.FAMILY_UNIX]: ['Unix'],
      [OperatingSystemFamily.FAMILY_LINUX]: ['Debian', 'Ubuntu', 'Red Hat', 'CentOS', 'openSUSE', 'Mandriva'], // Fedora, Arch Linux,
      [OperatingSystemFamily.FAMILY_BSD]: ['FreeBSD', 'Mac OS X', 'OS X'], // OpenBSD, NetBSD, DesktopBSD
      [OperatingSystemFamily.FAMILY_WINDOWS]: [
        'Windows', 'Windows 7', 'Windows 8', 'Windows 8.1', 'Windows 10',
        'Windows Server 2008', 'Windows Server 2008 R2', 'Windows Server 2012',
        'Windows Server 2012 R2', 'Windows Server 2016',
        'Microsoft Windows', 'Microsoft Windows 8', 'Microsoft Windows 8.1',
        'Microsoft Windows 10', 'Microsoft Windows Server 2008', 'Microsoft Windows Server 2008 R2',
        'Microsoft Windows Server 2012', 'Microsoft Windows Server 2012 R2',
        'Microsoft Windows Server 2016'
      ]
    };
  }

  /**
   * Gets a value indicating whether specified value is family of OS.
   *
   * @param value Family name to check.
   */
  public static IsKnownFamily(value: string): boolean {
    if (value == null || value == '') {
      return false;
    }

    return ['unix', 'linux', 'bsd', 'windows'].indexOf(value.toLowerCase()) != -1;
  }

  public static GetSupporedOSNames(family?: string): Array<string> {
    let result = new Array<string>();
    let families = OperatingSystemFamily.NamesByFamilies;

    if (family && family != '') {
      family = family.toLowerCase();

      if (family == 'bsd') {
        family = family.toUpperCase();
      } else {
        family = family.charAt(0).toUpperCase() + family.slice(1);
      }

      result = families[family];
    }
    else {
      for (let f in families) {
        result = result.concat(families[f]);
      }
    }

    return result;
  }

  /**
   * Returns preview image url.
   *
   * @param os OS info.
   */
  public static GetPreviewImageUrl(os: OperatingSystem): string {
    let result = '';

    if (os) {
      let name = '';
      let family = '';

      if (os.Name != null) {
        name = os.Name.toLowerCase();
      }

      if (os.Family != null) {
        family = os.Family.toLowerCase();
      }

      if (name.indexOf('debian') != -1) {
        result = 'debian.jpg';
      }
      else if (name.indexOf('ubuntu') != -1) {
        result = 'ubuntu.jpg';
      }
      else if (name.indexOf('freebsd') != -1 || name.indexOf('free bsd') != -1) {
        result = 'freebsd.jpg';
      }
      else if (name.indexOf('redhat') != -1 || name.indexOf('red hat') != -1) {
        result = 'redhat.jpg';
      }
      else if (name.indexOf('centos') != -1 || name.indexOf('cent os') != -1) {
        result = 'centos.jpg';
      }
      else if (name.indexOf('windows') != -1) {
        if (name.indexOf('2008') != -1 && name.indexOf('r2') != -1) {
          result = 'windows2008r2.jpg';
        }
        else if (name.indexOf('2008') != -1 && name.indexOf('r2') == -1) {
          result = 'windows2008.jpg';
        }
        else if (name.indexOf('2012') != -1 && name.indexOf('r2') != -1) {
          result = 'windows2012r2.jpg';
        }
        else if (name.indexOf('2012') != -1 && name.indexOf('r2') == -1) {
          result = 'windows2012.jpg';
        }
        else if (name.indexOf('2016') != -1) {
          result = 'windows2016.jpg';
        }
        else {
          result = 'windows.jpg';
        }
      }
      else if (name.indexOf('osx') != -1 || name.indexOf('os x') != -1 || name.indexOf('mac') != -1) {
        result = 'osx.jpg';
      }

      if (result == '' && family != '') {
        if (family.indexOf('linux') != -1) {
          result = 'linux.jpg';
        }
        // TODO
        /*else if (family.indexOf('unix') != -1) {

        }
        else if (family.indexOf('windows') != -1 || family.indexOf('win32') != -1 || family.indexOf('winnt') != -1) {
        }*/
      }
    }

    if (result == '') {
      result = 'server.jpg';
    }

    return '/dist/images/' + result;
  }

}

/**
 * Represents information about an operating system.
 */
export class OperatingSystem implements IOperatingSystem {

  /** Name. For example: Windows 7, Debian, Ubuntu, OS X. */
  public Name: string;

  /** The family of operating systems. For example: Linux, MacOSX, Win32 */
  public Family: string;

  /** Version number of the operating system. For example: 6.1.7601 */
  public Version: string;

  constructor() {
    this.Name = '';
    this.Family = '';
    this.Version = '';
  }

}