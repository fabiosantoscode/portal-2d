const { Entity } = require('./entity')

var maxFallSpeed = 10;

exports.Player = class Player extends Entity {
  constructor (center, controls) {
    super(center)
    this.direction = { x: 0, y: 0 } // 0 - stopped, 1 - down, -1 - up
    this.speed = 1
    this.size = { x: 4, y: 10 }
  }

  static setCurrent(player) {
    Player.current = player
  }

  update(dt) {
    this.center.x = this.center.x + (((this.grounded() ? 1 : 0.9) * this.direction.x) * dt)
    this.center.y = this.center.y + (this.direction.y * dt)

    // Gravity
    if (!this.grounded()) {
      this.direction.y += (0.1 * dt)
      if (this.direction.y > maxFallSpeed) {
        this.direction.y = maxFallSpeed
      }
    } else {
      this.direction.y = 0
      this.center.y = this.groundedY()
    }

    if (this.center.x > 100) this.center.x = 100
    if (this.center.x < 0) this.center.x = 0
    if (this.center.y > 100) this.center.y = 100
  }

  tryJump() {
    if (this.grounded()) {
      this.direction.y -= 2
    }
  }

  grounded() {
    return this.center.y + (this.size.y / 2) >= 100
  }

  groundedY() {
    return 100 - (this.size.y / 2);
  }
}
