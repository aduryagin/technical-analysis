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

import Overlay from './Overlay'

import { renderFillCircle } from '../../renderer/circle'
import { renderFillRect } from '../../renderer/rect'
import { renderFillDiamond } from '../../renderer/diamond'
import { renderFillTriangle } from '../../renderer/triangle'
import {
  checkCoordinateInCircle, checkCoordinateInDiamond,
  checkCoordinateInRect, checkCoordinateInTriangle
} from '../../extension/shape/shapeHelper'

import { isNumber } from '../../utils/typeChecks'

import {
  OverlayPosition,
  AnnotationSymbolType
} from '../../options/styleOptions'

/**
 * 注解
 */
export default class Annotation extends Overlay {
  constructor ({
    id, point, chartStore, xAxis, yAxis, styles
  }) {
    super({ id, chartStore, xAxis, yAxis })
    this._point = point
    this._symbolCoordinate = {}
    this.setStyles(styles, chartStore.styleOptions().annotation)
  }

  /**
   * 绘制标识
   * @param ctx
   * @param isActive
   * @param styles
   * @private
   */
  _drawSymbol (ctx, isActive, styles) {
    const barSpace = this._chartStore.timeScaleStore().barSpace()
    const symbolOptions = styles.symbol
    const styleSize = symbolOptions.size
    const styleActiveSize = symbolOptions.activeSize
    const size = isActive
      ? (isNumber(styleActiveSize) ? styleActiveSize : barSpace)
      : (isNumber(styleSize) ? styleSize : barSpace)
    const color = isActive ? symbolOptions.activeColor : symbolOptions.color
    switch (symbolOptions.type) {
      case AnnotationSymbolType.CIRCLE: {
        renderFillCircle(ctx, color, this._symbolCoordinate, size / 2)
        break
      }
      case AnnotationSymbolType.RECT: {
        renderFillRect(
          ctx, color,
          this._symbolCoordinate.x - size / 2,
          this._symbolCoordinate.y - size / 2,
          size, size
        )
        break
      }
      case AnnotationSymbolType.DIAMOND: {
        renderFillDiamond(ctx, color, this._symbolCoordinate, size, size)
        break
      }
      case AnnotationSymbolType.TRIANGLE: {
        renderFillTriangle(ctx, color, this._symbolCoordinate, size, size)
        break
      }
      case AnnotationSymbolType.CUSTOM: {
        ctx.save()
        this.drawCustomSymbol({
          ctx,
          point: this._point,
          coordinate: this._symbolCoordinate,
          viewport: {
            width: this._xAxis.width(),
            height: this._yAxis.height(),
            barSpace
          },
          styles: symbolOptions,
          isActive
        })
        ctx.restore()
        break
      }
      default: {
        break
      }
    }
  }

  draw (ctx) {
    const styles = this._styles || this._chartStore.styleOptions().annotation
    const offset = styles.offset || [0, 0]
    let y = 0
    switch (styles.position) {
      case OverlayPosition.POINT: {
        y = this._yAxis.convertToPixel(this._point.value)
        break
      }
      case OverlayPosition.TOP: {
        y = 0
        break
      }
      case OverlayPosition.BOTTOM: {
        y = this._yAxis.height()
        break
      }
    }
    this._symbolCoordinate.y = y + offset[0]
    const isActive = this._id === this._chartStore.annotationStore().mouseOperate().id
    this._drawSymbol(ctx, isActive, styles)
    if (this.drawExtend) {
      ctx.save()
      this.drawExtend({
        ctx,
        point: this._point,
        coordinate: this._symbolCoordinate,
        viewport: {
          width: this._xAxis.width(),
          height: this._yAxis.height()
        },
        styles,
        isActive
      })
      ctx.restore()
    }
  }

  checkEventCoordinateOn (eventCoordinate) {
    const barSpace = this._chartStore.timeScaleStore().barSpace()
    const styles = this._styles || this._chartStore.styleOptions().annotation
    const symbolOptions = styles.symbol
    const size = isNumber(symbolOptions.size) ? symbolOptions.size : barSpace
    let isOn
    switch (symbolOptions.type) {
      case AnnotationSymbolType.CIRCLE: {
        isOn = checkCoordinateInCircle(this._symbolCoordinate, size / 2, eventCoordinate)
        break
      }
      case AnnotationSymbolType.RECT: {
        const coordinate1 = { x: this._symbolCoordinate.x - size / 2, y: this._symbolCoordinate.y - size / 2 }
        const coordinate2 = { x: this._symbolCoordinate.x + size / 2, y: this._symbolCoordinate.y + size / 2 }
        isOn = checkCoordinateInRect(coordinate1, coordinate2, eventCoordinate)
        break
      }
      case AnnotationSymbolType.DIAMOND: {
        isOn = checkCoordinateInDiamond(this._symbolCoordinate, size, size, eventCoordinate)
        break
      }
      case AnnotationSymbolType.TRIANGLE: {
        isOn = checkCoordinateInTriangle(
          [
            { x: this._symbolCoordinate.x - size / 2, y: this._symbolCoordinate.y + size / 2 },
            { x: this._symbolCoordinate.x, y: this._symbolCoordinate.y - size / 2 },
            { x: this._symbolCoordinate.x + size / 2, y: this._symbolCoordinate.y + size / 2 }
          ],
          eventCoordinate
        )
        break
      }
      case AnnotationSymbolType.CUSTOM: {
        isOn = this.checkEventCoordinateOnCustomSymbol({
          eventCoordinate,
          coordinate: this._symbolCoordinate,
          size
        })
        break
      }
      default: {
        break
      }
    }
    if (isOn) {
      return {
        id: this._id,
        instance: this
      }
    }
  }

  /**
   * 生成标识坐标
   * @param x
   */
  createSymbolCoordinate (x) {
    const styles = this._styles || this._chartStore.styleOptions().annotation
    const offset = styles.offset || [0, 0]
    this._symbolCoordinate = { x: x + offset[1] }
  }

  /**
   * 获取点
   * @return {*}
   */
  points () {
    return this._point
  }

  /**
   * 检查鼠标点是否在自定义标识内
   * @param eventCoordinate
   * @param coordinate
   * @param size
   */
  checkEventCoordinateOnCustomSymbol ({ eventCoordinate, coordinate, size }) {}

  /**
   * 绘制自定义标识
   * @param ctx
   * @param point
   * @param coordinate
   * @param viewport
   * @param styles
   * @param isActive
   */
  drawCustomSymbol ({ ctx, point, coordinate, viewport, styles, isActive }) {}
}
