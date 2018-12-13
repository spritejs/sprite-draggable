import { Matrix } from 'sprite-math';
let $drag = null;
let dropList = [];
const _mouseDown = Symbol('mouseDown');
const _mouseMove = Symbol('mouseMove');
const _mouseUp = Symbol('mouseUp');
const _isDraggable = Symbol('isDraggable')
const _isDragenter = Symbol('_isDragenter');

export function draggable(sprite, option) {
  if (option && option.destroy) { //销毁拖动
    if (!sprite[ _isDraggable ]) return sprite;
    delete sprite[ _isDraggable ];
    return sprite.off('mousedown', sprite[ _mouseDown ]).off('mousemove', sprite[ _mouseMove ]).off('mouseup', sprite[ _mouseUp ]);
  } else {
    if (sprite[ _isDraggable ]) return sprite;
    sprite[ _isDraggable ] = true;
    sprite[ _mouseDown ] = mouseDown;
    sprite[ _mouseMove ] = mouseMove;
    sprite[ _mouseUp ] = mouseUp;
    if (option && option.dragRect) {
      sprite.dragRect = option.dragRect;
    }
    return sprite.on('mousedown', sprite[ _mouseDown ]).on('mousemove', sprite[ _mouseMove ]).on('mouseup', sprite[ _mouseUp ]);
  }

  function mouseDown(evt) {
    evt.stopPropagation();
    $drag = getDragTarget(evt.target);
    if ($drag !== sprite) return;
    const { offsetX, offsetY } = evt;
    $drag.x0_ = offsetX;
    $drag.y0_ = offsetY;
    $drag.dispatchEvent('dragstart', transEvent(evt), true, true)
    $drag.setMouseCapture();
  };

  function mouseMove(evt) {
    evt.stopPropagation();
    if ($drag && $drag === sprite && $drag.x0_ != null) {
      const { offsetX, offsetY } = evt;
      let dx = offsetX - sprite.x0_;
      let dy = offsetY - sprite.y0_;
      const [ cx, cy ] = sprite.attr('pos');
      const m = new Matrix(sprite.transform.m);
      [ dx, dy ] = m.transformPoint(dx, dy);
      let [ minX, minY, maxX, maxY ] = sprite.dragRect || []; //
      let tarX = cx + dx;
      let tarY = cy + dy;
      if (minX !== undefined) {
        tarX = Math.max(minX, tarX);
      }
      if (maxX !== undefined) {
        tarX = Math.min(maxX, tarX);
      }
      if (minY !== undefined) {
        tarY = Math.max(minY, tarY);
      }
      if (maxY !== undefined) {
        tarY = Math.min(maxY, tarY);
      }

      sprite.attr({ x: tarX, y: tarY });
      $drag.dispatchEvent('drag', transEvent(evt), true, true);
      checkDragmove(evt, sprite);
    }
  };

  function mouseUp(evt) {
    evt.stopPropagation();
    if ($drag && $drag.x0_ != null) {
      $drag.releaseMouseCapture();
      delete $drag.x0_;
      delete $drag.y0_;
      $drag.dispatchEvent('dragend', transEvent(evt), true, true)
      checkDragUp(evt, sprite);
    }
    $drag = null;
  };
}

export function droppable(sprite, option) {
  dropList.push(sprite);
  return sprite;
}

function transEvent(evt) {
  return { detail: evt };
}

function checkDragmove(evt, sprite) {
  evt.dragItem = sprite;
  const moveRect = sprite.renderBox;
  dropList.forEach(dropSprite => {
    if (sprite !== dropSprite) {
      let collision = rectCollision(sprite, dropSprite);
      if (collision && !dropSprite[ _isDragenter ]) {
        dropSprite[ _isDragenter ] = true;
        dropSprite.dispatchEvent('dragenter', transEvent(evt), true, true);
      } else if (!collision && dropSprite[ _isDragenter ]) {
        delete dropSprite[ _isDragenter ];
        dropSprite.dispatchEvent('dragleave', transEvent(evt), true, true);
      } else if (collision && dropSprite[ _isDragenter ]) {
        dropSprite.dispatchEvent('dragover', transEvent(evt), true, true);
      }
    }
  });
}

function checkDragUp(evt, sprite) {
  evt.dragItem = sprite;
  dropList.forEach(dropSprite => {
    let collision = rectCollision(sprite, dropSprite);
    if (collision && dropSprite[ _isDragenter ]) {
      delete dropSprite[ _isDragenter ];
      dropSprite.dispatchEvent('drop', transEvent(evt), true, true);
    }
  });
}

function rectCollision(sprite, bgRect) { //判断 moveRect的centerPoint是否在bgRect中
  let moveRect = sprite.renderBox;
  let parentPos = [ 0, 0 ];
  if (sprite.parent && sprite.parent.tarName !== 'layer') {
    parentPos = sprite.parent.attr("pos");
  }
  let res = false;
  const centerPoint = [ (moveRect[ 0 ] + moveRect[ 2 ]) / 2 + parentPos[ 0 ], (moveRect[ 1 ] + moveRect[ 3 ]) / 2 + parentPos[ 1 ] ];
  res = bgRect.pointCollision({ offsetX: centerPoint[ 0 ], offsetY: centerPoint[ 1 ], layerX: centerPoint[ 0 ], layerY: centerPoint[ 1 ] });
  return res;
}

function getDragTarget(dom) {
  if (dom[ _isDraggable ]) {
    return dom;
  }
  if (dom.tarName === 'layer') {
    return null;
  }
  if (dom.parentNode) {
    return getDragTarget(dom.parentNode);
  }
  return null;
}