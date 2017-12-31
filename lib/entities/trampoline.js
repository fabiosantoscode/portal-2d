'use strict'

const { Entity } = require('./entity')
const { Player } = require('./player')

var minTrampolineSpeed = 5

exports.Trampoline = class Trampoline extends Entity {
  constructor(center){
    super(center)
    this.center = center
  }

  update () {
    if (this.collide(Player.current)) {
      if (Player.current.direction.y < minTrampolineSpeed) {
        Player.current.direction.y = -minTrampolineSpeed
      } else {
        Player.current.direction.y = -player.direction.y
      }
    }
  }
}

