# sprite-draggable
let sprite can draggable，让sprite对象拥有draggable的能力

### 运行demo

```
npm install

npm start
```
访问 http://localhost:9092 查看具体demo

<image src="./sprite-draggable.jpg" style="width:100%">



### 安装sprite-draggable依赖
``` 
  npm install sprite-draggable --save
```

### 使用
```javascript

  import { draggable, droppable } from 'sprite-draggable'

  …

  let group = draggable(new Group());

  // draggable(group,false); draggable(group,{destroy,true}) 取消注册drag

  dropabble(group) //注册drop事件

  // dropabble(group,false) ;dropabble(group,{destroy:true}) 取消注册drop

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

  let sprite = draggable(new Sprite());

  //表示在 [0,0] 与 [300,300] 这两点矩形之间拖动 [xmin,ymin,xmax,ymax]，不设置表示不控制拖动范围
  draggable(sprite,{dragRect:[0,0,300,300]});
  //draggable(sprite,{dragRect:[]});

  //表示拖动的范围大于坐标[0,0]
  //draggable(sprite,{dragRect:[0,0]});

  /**拖动过程中，有三个事件 dragstart、drag、dragend**/
  sprite.on('dragstart',function(event){
    console.log('dragstart');
  });

  sprite.on('drag',function(event){
    console.log('drag');
  });

  sprite.on('dragend',function(event){
    console.log('dragend');
  });


  //取消元素拖动
  sprite.draggable(sprite,{destroy:true});

```

### 事件列表：

| 事件   |      描述      |  其它 |
|----------|-------------|------|
| dragstart |  开始拖动对象 |  |
| drag |    正在拖动对象   |   |
| dragend | 停止拖动对象 |     |
| dragover | 一个draggable对象在另一个droppable对象上拖动 |     |
| dragenter | 一个draggable对象在进入一个droppable对象上 |   draggable进入droppable判断点为draggable对象最小矩形的中心  |
| dragleave | 一个draggable对象离开一个droppable对象上 |     |
| drop | 一个draggable对象放在一个droppable对象上 |     |



