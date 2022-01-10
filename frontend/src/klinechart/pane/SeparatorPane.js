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

import EventBase from '../event/EventBase'
import { getPixelRatio } from '../utils/canvas'
import { isValid } from '../utils/typeChecks'
import { createElement } from '../utils/element'

export default class SeparatorPane {
  constructor (container, chartStore, topPaneId, bottomPaneId, dragEnabled, dragEventHandler) {
    this._chartStore = chartStore
    this._topPaneId = topPaneId
    this._bottomPaneId = bottomPaneId
    this._dragEnabled = dragEnabled
    this._width = 0
    this._offsetLeft = 0
    this._dragEventHandler = dragEventHandler
    this._dragFlag = false
    this._initElement(container)
    this._initEvent(dragEnabled)
  }

  /**
   * 初始化dom元素
   * @param container
   * @private
   */
  _initElement (container) {
    this._container = container
    this._wrapper = createElement('div', {
      margin: '0', padding: '0', position: 'relative', boxSizing: 'border-box'
    })
    this._element = createElement('div', {
      width: '100%',
      height: '7px',
      margin: '0',
      padding: '0',
      position: 'absolute',
      top: '-3px',
      zIndex: '20',
      boxSizing: 'border-box'
    })
    this._wrapper.appendChild(this._element)
    const lastElement = container.lastChild
    if (lastElement) {
      container.insertBefore(this._wrapper, lastElement)
    } else {
      container.appendChild(this._wrapper)
    }
  }

  /**
   * 初始化事件
   * @param dragEnabled
   * @private
   */
  _initEvent (dragEnabled) {
    if (dragEnabled) {
      this._element.style.cursor = 'ns-resize'
      this._dragEvent = new EventBase(this._element, {
        mouseDownEvent: this._mouseDownEvent.bind(this),
        mouseUpEvent: this._mouseUpEvent.bind(this),
        pressedMouseMoveEvent: this._pressedMouseMoveEvent.bind(this),
        mouseEnterEvent: this._mouseEnterEvent.bind(this),
        mouseLeaveEvent: this._mouseLeaveEvent.bind(this)
      }, {
        treatVertTouchDragAsPageScroll: false,
        treatHorzTouchDragAsPageScroll: true
      })
    }
  }

  _mouseDownEvent (event) {
    this._dragFlag = true
    this._startY = event.pageY
    this._dragEventHandler.startDrag(this._topPaneId, this._bottomPaneId)
  }

  _mouseUpEvent () {
    this._dragFlag = false
    this._chartStore.setDragPaneFlag(false)
  }

  _pressedMouseMoveEvent (event) {
    const dragDistance = event.pageY - this._startY
    this._dragEventHandler.drag(dragDistance, this._topPaneId, this._bottomPaneId)
    this._chartStore.setDragPaneFlag(true)
    this._chartStore.crosshairStore().set()
  }

  _mouseEnterEvent () {
    const separatorOptions = this._chartStore.styleOptions().separator
    this._element.style.background = separatorOptions.activeBackgroundColor
    // this._chartStore.setDragPaneFlag(true)
    this._chartStore.crosshairStore().set()
  }

  _mouseLeaveEvent () {
    if (!this._dragFlag) {
      this._element.style.background = null
      this._chartStore.setDragPaneFlag(false)
    }
  }

  /**
   * 获取高度
   * @returns {number}
   */
  height () {
    return this._wrapper.offsetHeight
  }

  /**
   * 设置尺寸
   * 用于fill属性
   * @param offsetLeft
   * @param width
   */
  setSize (offsetLeft, width) {
    this._offsetLeft = offsetLeft
    this._width = width
    this.invalidate()
  }

  /**
   * 设置是否可以拖拽
   * @param dragEnabled
   */
  setDragEnabled (dragEnabled) {
    if (dragEnabled !== this._dragEnabled) {
      this._dragEnabled = dragEnabled
      if (dragEnabled) {
        !this._dragEvent && this._initEvent(dragEnabled)
      } else {
        this._element.style.cursor = 'default'
        this._dragEvent && this._dragEvent.destroy()
        this._dragEvent = null
      }
    }
  }

  /**
   * 顶部paneId
   * @return {*}
   */
  topPaneId () {
    return this._topPaneId
  }

  /**
   * 底部paneId
   * @return {*}
   */
  bottomPaneId () {
    return this._bottomPaneId
  }

  /**
   * 更新上下两个图表的索引
   * @param topPaneId
   * @param bottomPaneId
   */
  updatePaneId (topPaneId, bottomPaneId) {
    if (isValid(topPaneId)) {
      this._topPaneId = topPaneId
    }
    if (isValid(bottomPaneId)) {
      this._bottomPaneId = bottomPaneId
    }
  }

  /**
   * 刷新
   */
  invalidate () {
    const separatorOptions = this._chartStore.styleOptions().separator
    this._element.style.top = `${-Math.floor((7 - separatorOptions.size) / 2)}px`
    this._wrapper.style.backgroundColor = separatorOptions.color
    this._wrapper.style.height = `${separatorOptions.size}px`
    this._wrapper.style.marginLeft = `${separatorOptions.fill ? 0 : this._offsetLeft}px`
    this._wrapper.style.width = separatorOptions.fill ? '100%' : `${this._width}px`
  }

  /**
   * 将图形转换成图片
   * @returns {HTMLCanvasElement}
   */
  getImage () {
    const separatorOptions = this._chartStore.styleOptions().separator
    const width = this._wrapper.offsetWidth
    const height = separatorOptions.size
    const canvas = createElement('canvas', {
      width: `${width}px`,
      height: `${height}px`,
      boxSizing: 'border-box'
    })
    const ctx = canvas.getContext('2d')
    const pixelRatio = getPixelRatio(canvas)
    canvas.width = width * pixelRatio
    canvas.height = height * pixelRatio
    ctx.scale(pixelRatio, pixelRatio)
    ctx.fillStyle = separatorOptions.color
    ctx.fillRect(this._offsetLeft, 0, width, height)
    return canvas
  }

  /**
   * 销毁
   */
  destroy () {
    if (this._dragEvent) {
      this._dragEvent.destroy()
    }
    this._container.removeChild(this._wrapper)
  }
}
