# 实例API

### getWidth()
获取图表宽度。


### getHeight()
获取图表高度。


### setStyleOptions(options)
设置样式配置。
- `options` 样式配置，详情可参阅[样式说明](styles.md)


### getStyleOptions()
获取样式配置。


### setPriceVolumePrecision(pricePrecision, volumePrecision)
设置价格和数量精度，同时技术指标系列是'price'或者'volume'也会受影响
- `pricePrecision` 价格精度
- `volumePrecision` 数量精度



### setTimezone(timezone)
设置时区。
- `timezone` 时区名，如'Asia/Shanghai'，如果不设置会自动获取本机时区，时区对应名字列表请自寻查找相关文档


### getTimezone()
获取图表时区。


### setZoomEnabled(enabled)
设置是否缩放。
- `enabled` true 或 false


### isZoomEnabled()
是否可以缩放。


### setScrollEnabled(enabled)
设置是否可以拖拽滚动。
- `enabled` true 或 false


### isScrollEnabled()
是否可以拖拽滚动。


### setOffsetRightSpace(space)
设置图表右边可以空出来的间隙。
- `space` 距离大小，number类型


### setLeftMinVisibleBarCount(barCount)
设置左边最小可见的蜡烛数量。
- `barCount` 数量，number类型


### setRightMinVisibleBarCount(barCount)
设置右边最小可见的蜡烛数量。
- `barCount` 数量，number类型


### setDataSpace(space)
设置图表一条数据所占用的空间，即单根蜡烛柱的宽度。
- `space` 宽度，number类型


### getDataSpace()
获取图表一条数据所占用的空间。


### getBarSpace()
获取图表一条数据绘制所占用的空间。


### applyNewData(dataList, more)
添加新数据，此方法会清空图表数据，不需要额外调用clearData方法。
- `dataList` 是一个KLineData数组，KLineData类型详情可参阅数据源
- `more` 告诉图表还有没有更多历史数据，可缺省，默认为true


### applyMoreData(dataList, more)
添加历史更多数据。
- `dataList` 是一个KLineData数组，KLineData类型详情可参阅数据源
- `more` 告诉图表还有没有更多历史数据，可缺省，默认为true


### updateData(data)
更新数据，目前只会匹配当前最后一条数据的时间戳，相同则覆盖，不同则追加。
- `data` 单条k线数据


### getDataList()
获取图表目前的数据源。


### clearData()
清空图表数据，一般情况下清空数据是为了添加新的数据，为了避免重复绘制，所有这里只是清除数据，图表不会重绘


### loadMore(cb)
设置加载更多回调函数。
- `cb` 是一个回调方法，回调参数为第一条数据的时间戳


### createTechnicalIndicator(value, isStack, paneOptions)
创建一个技术指标，返回值是一个标识窗口的字符串，这非常重要，后续对该窗口的一些操作，都需要此标识。
- `value` 技术指标名或者技术指标对象，当是对象时，类型和`overrideTechnicalIndicator`的入参一致
- `isStack` 是否覆盖
- `paneOptions` 窗口配置信息，可缺省， `{ id, height, dragEnabled }`
   - `id` 窗口id，可缺省。特殊的paneId: candle_pane，主图的窗口id
   - `height` 窗口高度，可缺省
   - `dragEnbaled` 窗口是否可以拖拽调整高度，可缺省

示例：
```javascript
chart.createTechnicalIndicator('MA', false, {
  id: 'pane_1',
  height: 100,
  dragEnabled: true
})
```


### overrideTechnicalIndicator(override, paneId)
覆盖技术指标信息。
- `override` 需要覆盖的一些参数， `{ name, calcParams, precision, styles }`
   - `name` 技术指标名，必填字段
   - `calcParams` 计算参数，可缺省
   - `shouldOhlc` 是否需要ohlc辅助线，可缺省
   - `shouldFormatBigNumber` 是否需要格式化大数字，可缺省
   - `precision` 精度，可缺省
   - `styles` 样式，可缺省，格式同样式配置中 `technicalIndicator` 一致
- `paneId` 窗口id，缺省则设置所有

示例：
```javascript
chart.overrideTechnicalIndicator({
  name: 'BOLL',
  calcParams: [20, { value: 5.5, allowDecimal: true }],
  precision: 4,
  shouldOhlc: true,
  shouldFormatBigNumber: false,
  styles: {
    margin: {
      top: 0.2,
      bottom: 0.1
    },
  	bar: {
      upColor: '#26A69A',
      downColor: '#EF5350',
      noChangeColor: '#888888'
    },
    line: {
      size: 1,
      colors: ['#FF9600', '#9D65C9', '#2196F3', '#E11D74', '#01C5C4']
    },
    circle: {
      upColor: '#26A69A',
      downColor: '#EF5350',
      noChangeColor: '#888888'
    }
  }
}, 'candle_pane')
```


### getTechnicalIndicatorTemplate(name)
根据技术指标模板信息。
- `name` 技术指标名，可缺省，缺省则返回所有


### getTechnicalIndicatorByPaneId(paneId, name)
根据窗口id获取技术指标信息。
- `paneId` 窗口id，可缺省，缺省则返回所有。
- `name` 技术指标名
特殊的paneId: candle_pane，主图的窗口id


### removeTechnicalIndicator(paneId, name)
移除技术指标。
- `paneId` 窗口id，即调用createTechnicalIndicator方法时返回的窗口标识
特殊的paneId: candle_pane，主图的窗口id
- `name` 技术指标类型，如果缺省，则会移除所有


### addTechnicalIndicatorTemplate(template)
添加一个自定义技术指标，可批量创建，批量传入数组即可。
- `template` 技术指标模板，详细请参考[技术指标](technical-indicator.md)


### createShape(value, paneId)
创建图形标记，返回一个字符串类型的标识。
- `value` 图形标记名或者对象，当是对象时，参数为`{ name, id, points, styles, lock, mode, data, onDrawStart, onDrawing, onDrawEnd, onClick, onRightClick, onPressedMove, onRemove }` 
   - `name` 技术指标名
   - `id` 可缺省，如果指定，则返回该id
   - `points` 点信息，可缺省，如果指定，则会按照点信息绘制一个图形
   - `styles` 样式，可缺省，格式同样式配置中 `shape` 一致
   - `lock` 是否锁定
   - `mode` 模式类型，类型为'normal' | 'weak_magnet' | 'strong_magnet'
   - `data` 数据
   - `onDrawStart` 绘制开始回调事件，可缺省
   - `onDrawing` 绘制过程中回调事件，可缺省
   - `onDrawEnd` 绘制结束回调事件，可缺省
   - `onClick` 点击回调事件，可缺省
   - `onRightClick` 右击回调事件，可缺省，需要返回一个boolean类型的值，如果返回true，内置的右击删除将无效
   - `onMouseEnter` 鼠标移入事件，可缺省
   - `onMouseLeave` 鼠标移出事件，可缺省
   - `onPressedMove` 按住拖动回调事件，可缺省
   - `onRemove` 删除回调事件，可缺省

示例：
```javascript
chart.createShape({
  name: 'segment',
  points: [
    { timestamp: 1614171282000, value: 18987 },
    { timestamp: 1614171202000, value: 16098 },
  ],
  styles: {
    line: {
      color: '#f00',
      size: 2
    }
  },
  lock: false,
  mode: 'weak_magnet',
  data: 'xxxxxxxx',
  onDrawStart: function ({ id }) { console.log(id) },
  onDrawing: function ({ id, step, points }) { console.log(id, step, points) },
  onDrawEnd: function ({ id }) { console.log(id) },
  onClick: function ({ id, event }) { console.log(id, event) },
  onRightClick: function ({ id, event }) {
    console.log(id, event)
    return false
  },
  onMouseEnter: function ({ id, event }) { console.log(id, event) },
  onMouseLeave: function ({ id, event }) { console.log(id, event) },
  onPressedMove: function ({ id, event }) { console.log(id, event) },
  onRemove: function ({ id }) { console.log(id) }
})
```


### getShape(shapeId)
获取图形标记信息。
- `paneId` 窗口id，调用createShape方法是返回的标识
- `shapeId` 调用createShape方法是返回的标识，缺省则返回所有


### setShapeOptions(options)
设置已绘制的图形标记配置。
- `options` 配置， `{ id, styles, lock, mode, data }`
   - `id` 图形标记标识，缺省则设置所有的
   - `styles` 样式，可缺省，格式同样式配置中 `shape` 一致
   - `lock` 是否锁定，可缺省
   - `mode` 模式类型，可缺省，类型为'normal' | 'weak_magnet' | 'strong_magnet'
   - `data` 外部数据


### addShapeTemplate(template)
添加图形模板，可批量创建，批量传入数组即可。
- `template` 图形模板，详细请参考[详情](shape.md)


### removeShape(shapeId)
移除图形。
- `shapeId` 调用createShape方法是返回的标识，如果缺省，则会移除所有标记


### createAnnotation(annotation, paneId)
创建注解，可批量创建，批量传入数组即可。
- `annotation` 注解信息, `{ point, styles, checkEventCoordinateOnCustomSymbol, drawCustomSymbol, drawExtend, onClick, onRightClick onMouseEnter, onMouseLeave }`
  - `point` 点 `{ timestamp, value }`
  - `styles` 样式，格式和配置里的`annotation`一致
  - `checkEventCoordinateOnCustomSymbol` 检查鼠标点是否在symbol上，当样式`annotation.symbol.type`是`custom`的时候触发
  - `drawCustomSymbol` 绘制自定义symbol，当样式`annotation.symbol.type`是`custom`的时候触发
  - `drawExtend` 扩展绘制，可缺省
  - `onClick` 点击事件，可缺省
  - `onRightClick` 右击事件，可缺省
  - `onMouseEnter` 右击移入事件，可缺省
  - `onMouseLeave` 右击移出事件，可缺省
- `paneId` 窗口id

示例:
```javascript
chart.createAnnotation({
  point: { timestamp: 1614171282000, value: 18987 },
  styles: {
    offset: [0, 20]
    position: 'top',
    symbol: {
      type: 'diamond',
      size: 8,
      color: '#1e88e5',
      activeSize: 10,
      activeColor: '#FF9600',
    }
  },
  checkEventCoordinateOnCustomSymbol: function ({ eventCoordinate, coordinate, size }) {
    console.log(eventCoordinate, coordinate, size)
    return true
  },
  drawCustomSymbol: function ({ ctx, point, coordinate, viewport, isActive, styles }) {
    console.log(point, coordinate, viewport, isActive, styles)
  },
  drawExtend: function ({ ctx, point, coordinate, viewport, isActive, styles }) {
    console.log(point, coordinate, viewport, isActive, styles)
  },
  onClick: function ({ id, event }) { console.log(id, event) },
  onRightClick: function ({ id, event }) { console.log(id, event) },
  onMouseEnter: function ({ id, event }) { console.log(id, event) },
  onMouseLeave: function ({ id, event }) { console.log(id, event) },
})
```


### removeAnnotation(paneId, points)
移除注解，可批量移除，批量传入数组即可，如果缺省，则移除所有。
- `paneId` 窗口id，缺省则移除所有
- `points` 点，`{ timestamp }`，缺省则移除对应窗口上的所有


### createTag(tag, paneId)
创建标签，可批量创建，批量传入数组即可。
- `tag` 标签，`{ id, point, text, mark, styles }`
  - `id` 唯一标识，如果有重复的，则会覆盖
  - `point` 点信息，可缺省
  - `mark` 标记，可缺省
  - `text` 文字，可缺省
  - `styles` 样式，可缺省，格式和配置里的`tag`一致
- `paneId` 窗口id
示例:
```javascript
chart.createTag({
  id: 'bid_price',
  point: { value: 16908 },
  text: '16908.00',
  mark: 'bid',
  styles: {
    position: 'point',
    offset: 0,
    line: {
      show: true,
      style: LineStyle.DASH,
      dashValue: [4, 2],
      size: 1,
      color: '#2196F3'
    },
    text: {
      color: '#FFFFFF',
      backgroundColor: '#2196F3',
      size: 12,
      family: 'Helvetica Neue',
      weight: 'normal',
      paddingLeft: 2,
      paddingRight: 2,
      paddingTop: 2,
      paddingBottom: 2,
      borderRadius: 2
    },
    mark: {
      color: '#FFFFFF',
      backgroundColor: '#2196F3',
      size: 12,
      family: 'Helvetica Neue',
      weight: 'normal',
      paddingLeft: 2,
      paddingRight: 2,
      paddingTop: 2,
      paddingBottom: 2,
      borderRadius: 2
    }
  }
})
```

### removeTag(paneId, tagId)
移除标签，可批量移除，批量传入数组即可，如果缺省，则移除所有。
- `paneId` 窗口id，缺省则移除所有
- `tagId` 标签的唯一标识，缺省则移除窗口上所有


### createHtml(html, paneId)
创建一个html元素，返回一个id。
- `html` 元素 `{ id, position, content, style }`
  - `id` id
  - `position` 位置，类型为`yAxis`和`content`，默认为`content`
  - `style` html元素容器的样式，内联css样式
  - `content`  内容，可以是dom元素，也可以是dom元素组成的字符串
- `paneId` 窗口id，默认为'candle_pane'
示例:
```javascript
chart.createHtml({
  id: 'html_1',
  position: 'content',
  style: { zIndex: 12 },
  content: '<div>8888888</div>'
}, 'candle_pane')
```


### removeHtml(paneId, htmlId)
删除一个html元素
- `paneId` 窗口id，缺省则删除所有
- `htmlId` 创建时候的id，可以是单个id，也可以是id组成的数组，缺省则删除对应窗口上所有的


### scrollByDistance(distance, animationDuration)
滚动一定的距离。
- `distance` 距离
- `animationDuration` 动画时间，可以缺省，缺省则无动画


### scrollToRealTime(animationDuration)
滚动到最初的位置。
- `animationDuration` 动画时间，可以缺省，缺省则无动画


### scrollToDataIndex(dataIndex, animationDuration)
滚动到指定的位置。
- `dataIndex` 数据的索引
- `animationDuration` 动画时间，可以缺省，缺省则无动画


### zoomAtCoordinate(scale, coordinate, animationDuration)
在某个坐标点缩放。
- `scale` 缩放比例
- `coordinate` 坐标点，`{ x }` 可缺省，缺省则在图表中间位置缩放
- `animationDuration` 动画时间，可以缺省，缺省则无动画


### zoomAtDataIndex(scale, dataIndex, animationDuration)
在某个位置缩放。
- `scale` 缩放比例
- `dataIndex` 数据的索引
- `animationDuration` 动画时间，可以缺省，缺省则无动画


### setPaneOptions(options)
设置窗口配置。
- `options` 窗口配置 `{ id, height, dragEnabled }`
  - `id` 窗口id
  - `height` 窗口高度，可缺省
  - `dragEnbaled` 窗口是否可以拖拽调整高度，可缺省

示例：
```javascript
chart.setPaneOptions({
  id: 'pane_1',
  height: 100,
  dragEnabled: true
})
```


### subscribeAction(type, callback)
订阅图表动作。
- `type` 类型是'zoom'，'scroll'，'crosshair', 'tooltip'和'pane_drag'
- `callback` 是一个回调方法


### unsubscribeAction(type, callback)
取消订阅图表动作。
- `type` 类型是'zoom'，'scroll'，'crosshair', 'tooltip'和'pane_drag'
- `callback` 订阅时的回调方法，缺省则取消当前类型所有


### convertToPixel(value, finder)
将值转换成坐标。
- `value` 值，`{ timestamp, dataIndex, value }`
- `finder` 过滤条件，`{ paneId, absoluteYAxis }`


### convertFromPixel(coordinate, finder)
将坐标转换成值。
- `coordinate` 坐标，`{ x, y }`
- `finder` 过滤条件，`{ paneId, absoluteYAxis }`


### getConvertPictureUrl(includeOverlay, type, backgroundColor)
获取图表转换成图片后的图片url。
- `includeTooltip` 是否需要包含浮层，可缺省
- `type` 转换后的图片类型，类型是'png'、'jpeg'、'bmp'三种中的一种，可缺省，默认为'jpeg'
- `backgroundColor` 背景色，可缺省，默认为'#FFFFFF'


### resize()
调整图表大小，总是会填充容器大小。
注意：此方法会重新计算整个图表各个模块的大小，频繁调用可能会影响到性能，调用请谨慎
