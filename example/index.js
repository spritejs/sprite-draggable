
import { draggable, droppable } from '../src/index'
import { ResizeBlock } from './ResizeBlock'
let i = 0;
const { Scene, Sprite, Group } = spritejs, w = window.innerWidth, h = window.innerHeight;
const scene = new Scene('#canvas-wrap', { viewport: [ w, h ], displayRatio: 'auto', resolution: 'flex' });

scene.delegateEvent('mousewheel', document); //sprite 元素侦听mousewheel事件

const layer = scene.layer();

let spriteRed = draggable(new Sprite());//设置拖动范围
draggable(spriteRed, { dragRect: [ 0, 0, 300, 300 ] })
let spriteGreen = new Sprite();
let spriteScale = new ResizeBlock({ size: [ 100, 30 ], backgroundColor: '#eee', dragRect: [ 0, 0 ] });

spriteRed.attr({ size: [ 100, 30 ], bgcolor: '#f00', pos: [ 200, 200 ] })
spriteGreen.attr({ size: [ 100, 30 ], bgcolor: 'rgba(0,255,0,0.2)', zIndex: 1 })

// spriteGreen.on('dblclick', (evt) => {
//   droppable(group, { destroy: true });
// });
let nGroup = draggable(new Group());
nGroup.attr({ size: [ 30, 30 ], pos: [ 300, 300 ], clipOverflow: false, bgcolor: '#f00' })
nGroup.append(spriteGreen);
nGroup.on('mousedown', function () {
  console.log('mousedown')
})
//layer.append(spriteGreen);


let group = draggable(new Group());//设置group可以拖动

droppable(group); //设置group接收drop

group.on('drag', (evt) => {
  console.log('drag')
});

group.on('drop', (evt) => {
  console.log('drop')
});

group.on('dragenter', (evt) => {
  console.log('dragenter')
});

group.on('dragleave', (evt) => {
  console.log('dragleave')
});

group.on('dragover', (evt) => {
  console.log('dragover')
});


group.attr({ size: [ w, h ], bgcolor: '#ff0', rotate: 0, pos: [ w / 2, h / 2 ] });

group.append(spriteScale);
group.append(spriteRed);
layer.append(group);
layer.append(nGroup)

layer.on('dblclick', function () {
  draggable(spriteRed, { destroy: true })
  draggable(spriteGreen, { dragRect: [ 200, 240 ] })
});

group.on('mousewheel', (e) => {
  e.preventDefault();
  const [ scaleX, scaleY ] = group.attr('scale');
  let [ w, h ] = group.attr("size");
  let direction = 1;
  if (e.originalEvent.wheelDelta < 0) {//向下滚动
    direction = -1;
  }
  const dscale = 0.05 * direction;

  /** 计算以鼠标点为中心缩放 **/
  const [ oAnchorX, oAnchorY ] = group.attr('anchor');
  let pX = (oAnchorX * w + e.offsetX) / w; //鼠标点相对占比
  let pY = (oAnchorY * h + e.offsetY) / h;
  const [ oX, oY ] = group.attr("pos");
  let dx = w * dscale * pX;
  let dy = h * dscale * pY;
  group.attr({ scale: [ scaleX + dscale ], pos: [ oX - dx, oY - dy ] });
});
document.querySelector("#rotate").addEventListener('click', function () {
  let rotate = group.attr('rotate');
  group.attr({ 'rotate': rotate + 15 });
});