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

import { checkCoordinateOnRayLine, getRayLine } from './shapeHelper'

export default {
  name: 'rayLine',
  totalStep: 3,
  checkEventCoordinateOnShape: ({ dataSource, eventCoordinate }) => {
    return checkCoordinateOnRayLine(dataSource[0], dataSource[1], eventCoordinate)
  },
  createShapeDataSource: ({ coordinates, viewport }) => {
    return [
      {
        type: 'line',
        isDraw: true,
        isCheck: true,
        dataSource: [getRayLine(coordinates[0], coordinates[1], { x: viewport.width, y: viewport.height })]
      }
    ]
  }
}
