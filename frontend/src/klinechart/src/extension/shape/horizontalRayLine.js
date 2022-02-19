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

import { checkCoordinateOnRayLine } from './shapeHelper'

export default {
  name: 'horizontalRayLine',
  totalStep: 3,
  checkEventCoordinateOnShape: ({ dataSource, eventCoordinate }) => {
    return checkCoordinateOnRayLine(dataSource[0], dataSource[1], eventCoordinate)
  },
  createShapeDataSource: ({ coordinates, viewport }) => {
    const coordinate = { x: 0, y: coordinates[0].y }
    if (coordinates[1] && coordinates[0].x < coordinates[1].x) {
      coordinate.x = viewport.width
    }
    return [
      {
        type: 'line',
        isDraw: true,
        isCheck: true,
        dataSource: [[coordinates[0], coordinate]]
      }
    ]
  },
  performEventPressedMove: ({ points, pressPoint }) => {
    points[0].value = pressPoint.value
    points[1].value = pressPoint.value
  },
  performEventMoveForDrawing: ({ step, points, movePoint }) => {
    if (step === 2) {
      points[0].value = movePoint.value
    }
  }
}
