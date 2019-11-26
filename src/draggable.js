import { Matrix } from 'sprite-math'
let $drag = null
let dropList = []
const _mouseDown = Symbol('mouseDown')
const _mouseMove = Symbol('mouseMove')
const _mouseUp = Symbol('mouseUp')
const _isDraggable = Symbol('isDraggable')
const _isDroppable = Symbol('isDroppable')
const _isDragenter = Symbol('isDragenter')
const _dragRect = Symbol('dragRect')

export function draggable(sprite, option) {
  if (option && option.dragRect !== undefined) {
    // 拖动范围设置
    sprite[_dragRect] = option.dragRect
  }
  if ((option && option.destroy) || option === false) {
    //销毁draggable
    if (!sprite[_isDraggable]) return sprite
    delete sprite[_isDraggable]
    return sprite
      .removeEventListener('mousedown', sprite[_mouseDown])
      .removeEventListener('mousemove', sprite[_mouseMove])
      .removeEventListener('mouseup', sprite[_mouseUp])
  } else {
    if (!sprite[_isDraggable]) {
      sprite[_isDraggable] = true
      sprite[_mouseDown] = mouseDown
      sprite[_mouseMove] = mouseMove
      sprite[_mouseUp] = mouseUp
      return sprite
        .addEventListener('mousedown', sprite[_mouseDown])
        .addEventListener('mousemove', sprite[_mouseMove])
        .addEventListener('mouseup', sprite[_mouseUp])
    }
  }
  function mouseDown(evt) {
    if (evt.originalEvent && evt.originalEvent.which === 3) {
      return
    }
    evt.stopPropagation()
    $drag = getDragTarget(evt.target)
    if ($drag !== sprite) return
    const { x, y } = evt
    let [cx, cy] = $drag.attr('pos')
    $drag.x0_ = x
    $drag.y0_ = y
    $drag.startX = cx
    $drag.startY = cy
    $drag.dispatchEvent('dragstart', transEvent(evt), true, true)
    $drag.setMouseCapture()
  }

  function mouseMove(evt) {
    if ($drag && $drag === sprite && $drag.x0_ != null) {
      const { x, y } = evt
      let dx = x - sprite.x0_
      let dy = y - sprite.y0_
      const m = new Matrix(sprite.transformMatrix)
      ;[dx, dy] = m.transformPoint(dx, dy)
      let [minX, minY, maxX, maxY] = sprite[_dragRect] || [] //
      let tarX = $drag.startX + dx
      let tarY = $drag.startY + dy
      if (minX !== undefined) {
        tarX = Math.max(minX, tarX)
      }
      if (maxX !== undefined) {
        tarX = Math.min(maxX, tarX)
      }
      if (minY !== undefined) {
        tarY = Math.max(minY, tarY)
      }
      if (maxY !== undefined) {
        tarY = Math.min(maxY, tarY)
      }
      sprite.attr({ x: tarX, y: tarY })
      $drag.dispatchEvent('drag', transEvent(evt), true, true)
      checkDragmove(evt, sprite)
    }
  }

  function mouseUp(evt) {
    if ($drag && $drag.x0_ != null) {
      $drag.releaseMouseCapture()
      delete $drag.x0_
      delete $drag.y0_
      $drag.dispatchEvent('dragend', transEvent(evt), true, true)
      checkDragUp(evt, sprite)
    }
    $drag = null
  }
}

export function droppable(sprite, option) {
  if ((option && option.destroy) || option === false) {
    //销毁drop
    if (sprite[_isDroppable]) {
      delete sprite[_isDraggable]
      const spriteIndex = dropList.indexOf(sprite)
      if (spriteIndex !== -1) {
        dropList.splice(spriteIndex, 1)
      }
    }
  } else {
    if (!sprite[_isDroppable]) {
      dropList.push(sprite)
      sprite[_isDroppable] = true
    }
  }
  return sprite
}

function transEvent(evt) {
  return { detail: evt }
}

function checkDragmove(evt, sprite) {
  evt.dragItem = sprite
  //const moveRect = sprite.renderBox;
  dropList.forEach(dropSprite => {
    if (sprite !== dropSprite) {
      let collision = rectCollision(sprite, dropSprite)
      if (collision && !dropSprite[_isDragenter]) {
        dropSprite[_isDragenter] = true
        dropSprite.dispatchEvent('dragenter', transEvent(evt), true, true)
      } else if (!collision && dropSprite[_isDragenter]) {
        delete dropSprite[_isDragenter]
        dropSprite.dispatchEvent('dragleave', transEvent(evt), true, true)
      } else if (collision && dropSprite[_isDragenter]) {
        dropSprite.dispatchEvent('dragover', transEvent(evt), true, true)
      }
    }
  })
}

function checkDragUp(evt, sprite) {
  evt.dragItem = sprite
  dropList.forEach(dropSprite => {
    let collision = rectCollision(sprite, dropSprite)
    if (collision && dropSprite[_isDragenter]) {
      delete dropSprite[_isDragenter]
      dropSprite.dispatchEvent('drop', transEvent(evt), true, true)
    }
  })
}

function rectCollision(sprite, bgRect) {
  //判断 moveRect的centerPoint是否在bgRect中
  let moveRect = sprite.renderBox
  let dPos = getLayerPos(sprite)
  let bgParentPos = getLayerPos(bgRect)
  dPos = [dPos[0] - bgParentPos[0], dPos[1] - bgParentPos[1]]
  const centerPoint = [(moveRect[0] + moveRect[2]) / 2 + dPos[0], (moveRect[1] + moveRect[3]) / 2 + dPos[1]]
  return bgRect.pointCollision({
    offsetX: centerPoint[0],
    offsetY: centerPoint[1],
    layerX: centerPoint[0],
    layerY: centerPoint[1]
  })
}

function getLayerPos(sprite) {
  let x = 0,
    y = 0
  if (sprite.parent && sprite.parent.tagName && sprite.parent.tagName.toLowerCase() !== 'layer') {
    ;[x, y] = sprite.parent.renderBox
  }
  return [x, y]
}

function getDragTarget(dom) {
  if (dom[_isDraggable]) {
    return dom
  }
  if (dom.tarName === 'layer') {
    return null
  }
  if (dom.parentNode) {
    return getDragTarget(dom.parentNode)
  }
  return null
}
