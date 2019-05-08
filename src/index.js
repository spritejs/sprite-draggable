import { draggable, droppable } from './draggable';
function install(spritejs){
  const BaseSprite = spritejs.BaseSprite;
  Object.assign(BaseSprite.prototype,{
    draggable:function(option){
      draggable(this,option)
    },
    droppable:function(option){
      droppable(this,option)
    }
  })
}
export {
  draggable,
  droppable,
  install
};
