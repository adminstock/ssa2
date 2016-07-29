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

import * as React from 'react';

export default class Edit extends React.Component<any, any> {

  static contextTypes: React.ValidationMap<any> = {
    setTitle: React.PropTypes.func.isRequired,
    Alert: React.PropTypes.func.isRequired,
    Confirm: React.PropTypes.func.isRequired
  }

  constructor(props, context) {
    super(props, context);

    Debug.Log(this);
  }

  componentWillMount() {
    (this.context as any).setTitle('Users Editor');

    // test
    (this.context as any).Alert('test1');
    (this.context as any).Alert(<div>hello world</div>);
    (this.context as any).Confirm(<div>hello world11111</div>);
    (this.context as any).Confirm(<div>This is test<br />test<br />tessst</div>, (s, confirmed) => { Debug.Log('Confirmed', confirmed); });
    (this.context as any).Confirm({ message: '123', title: 'Are you want?', callback: (s, confirmed) => { Debug.Log('Confirmed', confirmed); } });

  }

  render() {
    return (
      <div>TODO: User Editor</div>
    );
  }

}