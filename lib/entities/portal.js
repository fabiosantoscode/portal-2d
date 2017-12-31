
const { Entity } = require('./entity')
const { Player } = require('./player')

var lastPortal = null;

exports.Portal = class Portal extends Entity {
  constructor(center, exit) {
    super(center)
    this.exit = exit || null
    this.color = exit ? 'blue' : 'orange'
  }
  update() {
    if (this.exit) {
      if (this.collide(Player.current) && lastPortal !== this) {
        Player.current.center = { x: this.exit.center.x, y: this.exit.center.y }
        lastPortal = this.exit;
      } else if (!this.collide(Player.current) && lastPortal === this) {
        lastPortal = null;
      }
    }
  }
}
