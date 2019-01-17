const { Sprite, Group, Label } = spritejs;
import { draggable } from '../lib/index';
export class ResizeBlock extends Group {
  constructor({ size = [ 100, 30 ], backgroundColor = '#eee', borderColor = '#f00', borderWidth = 1, dragRect = [] }) {
    super();
    this.size = size;
    this.backgroundColor = backgroundColor;
    this.borderWidth = borderWidth;
    this.borderColor = borderColor;
    this.dragRect = dragRect;
    this.init();
  }
  init() {
    let dragPx = 8; //拖动块的大小
    let dragDx = dragPx - this.borderWidth - 1;
    let $sprite = new Sprite();
    let label = new Label('xxxxx');
    $sprite.attr({ size: this.size, bgcolor: this.backgroundColor, border: { color: this.borderColor, width: this.borderWidth } });
    $sprite.dragRect = this.dragRect;
    let $drag = new Sprite();
    let [ ox, oy ] = $sprite.attr('pos');
    $drag.attr({ size: [ dragPx, dragPx ], pos: [ this.size[ 0 ] - dragDx, this.size[ 1 ] - dragDx ], bgcolor: '#f00' });
    $drag.dragRect = [ ox + dragPx * 2, oy + dragPx * 2 ];//父级容器至少为拖动块的两倍大小
    draggable($sprite);
    draggable($drag);
    $sprite.on("drag", function () {
      let [ x, y ] = this.attr("pos");
      let [ w, h ] = this.attr("size");
      $drag.attr({ pos: [ x + w - dragDx, y + h - dragDx ] });
      label.attr({ pos: [ x, y ] })
      draggable($drag, { dragRect: [ x + dragPx * 2, y + dragPx * 2 ] });
    });
    $drag.on("drag", function (evt) {
      let [ x, y ] = this.attr('pos');
      let [ ox, oy ] = $sprite.attr('pos');
      let width = x - ox + dragDx;
      let height = y - oy + dragDx;
      $sprite.attr({ size: [ width, height ] });
    });
    $drag.on("dragstart", function (evt) {
      let [ x, y ] = this.attr('pos');
      let [ ox, oy ] = $sprite.attr('pos');
    });
    $drag.on("mouseenter", function () {
      if (this.context && this.context.canvas) {
        this.context.canvas.style.cursor = "se-resize"
      }
    }).on("mouseleave", function () {
      if (this.context && this.context.canvas) {
        this.context.canvas.style.cursor = "default"
      }
    });
    this.append($sprite);
    this.append($drag);
    this.append(label);
  }
}