import { draggable, droppable, install } from '../src/index'
import { ResizeBlock } from './ResizeBlock'
let i = 0
const { Scene, Sprite, Group } = spritejs,
  w = window.innerWidth,
  h = window.innerHeight
install(spritejs)
let container = document.querySelector('#canvas-wrap')
const scene = new Scene({ container, displayRatio: window.devicePixelRatio })

//scene.delegateEvent('mousewheel', document) //sprite 元素侦听mousewheel事件
window.scene = scene
const layer = scene.layer()

let spriteRed = new Sprite() //
spriteRed.draggable({ dragRect: [0, 0, 300, 300] })
let spriteGreen = new Sprite()
let spriteScale = new ResizeBlock({ size: [100, 30], backgroundColor: '#eee', dragRect: [0, 0] })

spriteRed.attr({ size: [100, 30], bgcolor: '#f00', pos: [200, 200] })

spriteGreen.attr({ size: [100, 30], pos: [150, 300], bgcolor: 'rgba(0,255,0,0.2)', zIndex: 1 })

spriteGreen.addEventListener('dblclick', evt => {
  //group.droppable(false)
})
let nGroup = new Group()
nGroup.draggable()
nGroup.attr({ size: [30, 30], pos: [300, 300], clipOverflow: false, bgcolor: '#f00' })
nGroup.append(spriteGreen)
nGroup.addEventListener('mousedown', function() {
  console.log('mousedown')
})
layer.append(spriteGreen)

let group = draggable(new Group()) //设置group可以拖动
group.droppable()
group.append(spriteRed)
group.addEventListener('drag', evt => {
  console.log('drag')
})
window.group = group
group.addEventListener('drop', evt => {
  console.log('drop')
})

group.addEventListener('dragenter', evt => {
  console.log('dragenter')
})

group.addEventListener('dragleave', evt => {
  console.log('dragleave')
})

group.addEventListener('dragover', evt => {
  console.log('dragover')
})

group.attr({ size: [w, h], bgcolor: '#ff0', rotate: 0, pos: [0, 0] })
// group.attr({ pos: [w / 2, h / 2] })
//layer.append(group)
group.append(spriteScale)
group.append(spriteRed)

let newGroup = new Group()

newGroup.append(group)

layer.append(newGroup)
layer.append(nGroup)

layer.addEventListener('dblclick', function() {
  spriteRed.draggable(false)
  draggable(spriteGreen, { dragRect: [200, 240] })
})

group.addEventListener('mousewheel', e => {
  e.preventDefault()
  const [scaleX, scaleY] = group.attr('scale')
  let [w, h] = group.attr('size')
  let direction = 1
  if (e.originalEvent.wheelDelta < 0) {
    //向下滚动
    direction = -1
  }
  const dscale = 0.05 * direction

  /** 计算以鼠标点为中心缩放 **/
  const [oAnchorX, oAnchorY] = group.attr('anchor')
  let pX = (oAnchorX * w + e.offsetX) / w //鼠标点相对占比
  let pY = (oAnchorY * h + e.offsetY) / h
  const [oX, oY] = group.attr('pos')
  let dx = w * dscale * pX
  let dy = h * dscale * pY
  group.attr({ scale: [scaleX + dscale], pos: [oX - dx, oY - dy] })
})
document.querySelector('#rotate').addEventListener('click', function() {
  let rotate = group.attr('rotate')
  group.attr({ rotate: rotate + 15 })
})
