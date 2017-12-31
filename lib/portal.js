'use strict'

var ctx
var entities
var player
var portalEntrance
var portalExit

var playing = true

const { Portal } = require('./entities/portal')
const { Player } = require('./entities/player')
const { Trampoline } = require('./entities/trampoline')

function assert(ok, msg) {
  if (!ok) { throw new Error(msg || 'Assertion error somewhere!'); }
}

exports.startLevel = () => {
  ctx = mainCanvas.getContext('2d')
  player = new Player({ x: 50, y: 80 })

  Player.setCurrent(player)

  var trampoline = new Trampoline({ x: 40, y: 90 })

  portalExit =
    new Portal({ x: 40, y: 10 })
  portalEntrance =
    new Portal({ x: 90, y: 90 }, portalExit)
  portalExit.exit = portalEntrance

  entities = [
    player,
    portalExit,
    portalEntrance,
    trampoline
  ]
}

function update(dt) {
  if (playing == false) return;

  entities.forEach(function (ent) {
    ent.update(dt)
  })
}

function draw() {
  ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height)
  entities.forEach(function (ent) {
    ent.draw(ctx)
  })
}

var LEFT = 37
var RIGHT = 39
var JUMP = 38

document.addEventListener('keyup', function(ev) {
  var keyCode = ev.which
  if (LEFT == keyCode) {
    player.direction.x = 0
  }
  if (RIGHT == keyCode) {
    player.direction.x = 0
  }
})

document.addEventListener('keydown', function(ev) {
  var keyCode = ev.which
  if (LEFT == keyCode) {
    player.direction.x = -player.speed
  }
  if (RIGHT == keyCode) {
    player.direction.x = player.speed
  }
  if (JUMP == keyCode) {
    player.tryJump()
  }
})

mainCanvas.addEventListener('mouseup', function (ev) {
  if (ev.button == 0) {
    portalExit.center.x = ev.clientX - this.getBoundingClientRect().left
    portalExit.center.y = ev.clientY - this.getBoundingClientRect().top
  } else if (ev.button == 2) {
    portalEntrance.center.x = ev.clientX - this.getBoundingClientRect().left
    portalEntrance.center.y = ev.clientY - this.getBoundingClientRect().top
  }
})

function tick() {
  var dt = (+new Date() - lastTick) / 16
  lastTick = +new Date()
  update(dt)
  draw()

  requestAnimationFrame(tick);
}

var lastTick = +new Date()
requestAnimationFrame(tick)

