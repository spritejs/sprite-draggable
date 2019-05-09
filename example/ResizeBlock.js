const { Sprite, Group } = spritejs;
import { draggable } from '../src/index';

export class ResizeBlock extends Group {
  constructor({pos=[0,0], size = [ 100, 30 ], backgroundColor = '#eee', borderColor = 'transparent', borderWidth = 1, dragRect = [] }) {
    super();
    this.size = size;
    this.backgroundColor = backgroundColor;
    this.borderWidth = borderWidth;
    this.borderColor = borderColor;
    this.dragRect = dragRect;
    this.attr({clipOverflow:false,pos})
    this.init();
  }
  init() {
    let dragPx = 16; //拖动块的大小
    this.attr({ size: this.size, bgcolor: this.backgroundColor, border: { color: this.borderColor, width: this.borderWidth } });
    let $drag = new Sprite();
    $drag.attr({anchor:[1,1], size: [ dragPx, dragPx ], pos: [ this.size[ 0 ], this.size[ 1 ] ], bgcolor: '#f00' });
    draggable(this,{dragRect:this.dragRect});
    draggable($drag,{dragRect:[dragPx * 2,dragPx * 2]});//父级容器至少为拖动块的两倍大小
    let $group = this;
    $drag.on("drag", function (evt) {
      let [ x, y ] = this.attr('pos');
      $group.attr({ size: [ x,y ] });
    });
    $drag.on('dragend',function(){
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
    this.append($drag);
  }
}