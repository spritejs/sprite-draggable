# sprite-draggable
let sprite can draggable，让sprite对象拥有draggable的能力

### 安装

```
npm install 

npm start
```
访问 http://localhost:9092 查看具体demo



### 使用
```
  import { draggable } from 'sprite-draggable'

  …

  let group = draggable(new Group());

  let sprite = draggable(new Sprite());

  //表示在 [0,0] 与 [300,300] 这两点矩形之间拖动 [xmin,ymin,xmax,ymax]，不设置表示不控制拖动范围 
  sprite.dragRect = [0,0,300,300]; 

  //表示拖动的范围大于坐标[0,0]
  //sprite.dragRect = [0,0]; 

  /**拖动过程中，有三个事件 dragstart、dragging、dragend**/
  sprite.on('dragstart',function(event){
    console.log('dragging');
  });

  sprite.on('dragging',function(event){
    console.log('dragging');
  });

  sprite.on('dragend',function(event){
    console.log('dragend');
  });

```


