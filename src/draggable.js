import { Matrix } from 'sprite-math';
let $drag = null;
export function draggable(sprite, option) {
  if (option && option.distory) { //销毁拖动
    if (!sprite.isDraggable) return sprite;
    delete sprite.isDraggable;
    return sprite.off('mousedown', sprite.dragMousedown).off('mousemove', sprite.dragMousemove).off('mouseup', sprite.dragMouseup);
  } else {
    if (sprite.isDraggable) return sprite;
    sprite.isDraggable = true;
    sprite.dragMousedown = mouseDown;
    sprite.dragMousemove = mouseMove;
    sprite.dragMouseup = mouseUp;
    return sprite.on('mousedown', sprite.dragMousedown).on('mousemove', sprite.dragMousemove).on('mouseup', sprite.dragMouseup);
  }

  function mouseDown(evt) {
    evt.stopPropagation();
    $drag = getDragTarget(evt.target);
    if ($drag !== sprite) return;
    const { offsetX, offsetY } = evt;
    $drag.x0_ = offsetX;
    $drag.y0_ = offsetY;
    $drag.dispatchEvent('dragstart', evt, true, true)
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
      $drag.dispatchEvent('dragging', evt, true, true)
    }
  };

  function mouseUp(evt) {
    evt.stopPropagation();
    if ($drag && $drag.x0_ != null) {
      $drag.releaseMouseCapture();
      delete $drag.x0_;
      delete $drag.y0_;
      $drag.dispatchEvent('dragend', evt, true, true)
    }
    $drag = null;
  };
}
function getDragTarget(dom) {
  if (dom.isDraggable) {
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