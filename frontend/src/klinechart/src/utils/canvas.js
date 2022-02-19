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

/**
 * 获取屏幕比
 * @param canvas
 * @returns {number}
 */
export function getPixelRatio (canvas) {
  return (canvas.ownerDocument && canvas.ownerDocument.defaultView && canvas.ownerDocument.defaultView.devicePixelRatio) || 2
}

/**
 * 测量文字的宽度
 * @param ctx
 * @param text
 * @returns {number}
 */
export function calcTextWidth (ctx, text) {
  return Math.round(ctx.measureText(text).width)
}

/**
 * 创建字体
 * @param fontSize
 * @param fontFamily
 * @param fontWeight
 * @returns {string}
 */
export function createFont (fontSize = 12, fontWeight = 'normal', fontFamily = 'Helvetica Neue') {
  return `${fontWeight} ${fontSize}px ${fontFamily}`
}

/**
 * 获取文字框宽度
 * @param ctx
 * @param text
 * @param options
 * @returns {number}
 */
export function getTextRectWidth (ctx, text, options) {
  ctx.font = createFont(options.size, options.weight, options.family)
  const textWidth = calcTextWidth(ctx, text)
  return options.paddingLeft + options.paddingRight + textWidth + (options.borderSize || 0) * 2
}

/**
 * 获取文字框高度
 * @param options
 * @returns {number}
 */
export function getTextRectHeight (options) {
  return options.paddingTop + options.paddingBottom + options.size + (options.borderSize || 0) * 2
}
