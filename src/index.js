import { draggable, droppable } from './draggable'
function install(spritejs) {
  const Node = spritejs.Node
  Object.assign(Node.prototype, {
    draggable: function(option) {
      draggable(this, option)
    },
    droppable: function(option) {
      droppable(this, option)
    }
  })
}
export { draggable, droppable, install }
