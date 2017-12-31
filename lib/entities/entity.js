'use strict'

const assert = require('assert')

exports.Entity = class Entity {
  constructor(center, opt) {
    opt = opt || {};
    this.size = opt.size || { x: 10, y: 10 }
    this.center = { x: center.x, y: center.y }

    assert(!isNaN(center.x) && isFinite(center.x), 'center.x is NaN or non-finite! It\'s ' + center.x);
    assert(!isNaN(center.y) && isFinite(center.y), 'center.y is NaN or non-finite! It\'s ' + center.y);
  }

  draw (ctx) {
    var x1 = this.center.x - (this.size.x / 2)
    var y1 = this.center.y - (this.size.y / 2)

    ctx.fillStyle = this.color || 'rgb(0,0,0)'
    ctx.fillRect(x1, y1, this.size.x, this.size.y)
  }

  collide (other) {
    var halfWidth = this.size.x / 2
    var halfHeight = this.size.y / 2

    var otherHalfWidth = other.size.x / 2
    var otherHalfHeight = other.size.y / 2

    return this.center.x - halfWidth < other.center.x + otherHalfWidth &&
      this.center.x + halfWidth > other.center.x - otherHalfWidth &&
      this.center.y - halfHeight < other.center.y + otherHalfHeight &&
      this.center.y + halfHeight > other.center.y - otherHalfHeight
  }
}
