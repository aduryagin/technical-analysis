/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import Pane from './Pane'
import XAxisWidget from '../widget/XAxisWidget'
import XAxis from '../component/axis/XAxis'

export default class XAxisPane extends Pane {
  _initBefore () {
    this._xAxis = new XAxis(this._chartStore)
  }

  _createMainWidget (container, props) {
    return new XAxisWidget({ container, chartStore: props.chartStore, xAxis: this._xAxis })
  }

  xAxis () {
    return this._xAxis
  }

  setWidth (mainWidgetWidth, yAxisWidgetWidth) {
    super.setWidth(mainWidgetWidth, yAxisWidgetWidth)
    this._xAxis.setWidth(mainWidgetWidth)
  }

  setHeight (height) {
    super.setHeight(height)
    this._xAxis.setHeight(height)
  }
}
