var ctx = mainCanvas.getContext('2d')

var playing = true
var maxFallSpeed = 10;

function assert(ok, msg) {
    if (!ok) { throw new Error(msg || 'Assertion error somewhere!'); }
}


function Entity(center, opt) {
    opt = opt || {};
    this.size = opt.size || { x: 10, y: 10 }
    this.center = { x: center.x, y: center.y }

    assert(!isNaN(center.x) && isFinite(center.x), 'center.x is NaN or non-finite! It\'s ' + center.x);
    assert(!isNaN(center.y) && isFinite(center.y), 'center.y is NaN or non-finite! It\'s ' + center.y);
}

Entity.prototype.draw = function () {
    var x1 = this.center.x - (this.size.x / 2)
    var y1 = this.center.y - (this.size.y / 2)

    ctx.fillStyle = this.color || 'rgb(0,0,0)'
    ctx.fillRect(x1, y1, this.size.x, this.size.y)
}

Entity.prototype.collide = function (other) {
    var halfWidth = this.size.x / 2
    var halfHeight = this.size.y / 2

    var otherHalfWidth = other.size.x / 2
    var otherHalfHeight = other.size.y / 2

    return this.center.x - halfWidth < other.center.x + otherHalfWidth &&
        this.center.x + halfWidth > other.center.x - otherHalfWidth &&
        this.center.y - halfHeight < other.center.y + otherHalfHeight &&
        this.center.y + halfHeight > other.center.y - otherHalfHeight
}

function Player(center, controls) {
    Entity.call(this, center)
    this.direction = { x: 0, y: 0 } // 0 - stopped, 1 - down, -1 - up
    this.speed = 1
    this.size = { x: 4, y: 10 }
}

Player.prototype = Object.create(Entity.prototype)

Player.prototype.update = function (dt) {
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

Player.prototype.tryJump = function () {
    if (this.grounded()) {
        this.direction.y -= 2
    }
}

Player.prototype.grounded = function () {
    return this.center.y + (this.size.y / 2) >= 100
}

Player.prototype.groundedY = function () {
    return 100 - (this.size.y / 2);
}

function Portal(center, exit) {
    Entity.call(this, center)
    this.exit = exit || null
    this.color = exit ? 'blue' : 'orange'
}

Portal.prototype = Object.create(Entity.prototype)

Portal.prototype.update = function () {
    if (this.exit) {
        if (this.collide(player) && lastPortal !== this) {
            player.center = { x: this.exit.center.x, y: this.exit.center.y }
            lastPortal = this.exit;
        } else if (!this.collide(player) && lastPortal === this) {
            lastPortal = null;
        }
    }
}

var portalExit = 
    new Portal({ x: 40, y: 10 })
var portalEntrance =
    new Portal({ x: 90, y: 90 }, portalExit)
var lastPortal = null;

var minTrampolineSpeed = 5

function Trampoline(center) {
    Entity.call(this, center)
    this.center = center
}

Trampoline.prototype = Object.create(Entity.prototype)

Trampoline.prototype.update = function () {
    if (this.collide(player)) {
        if (player.direction.y < minTrampolineSpeed) {
            player.direction.y = -minTrampolineSpeed
        } else {
            player.direction.y = -player.direction.y
        }
    }
}


var player = new Player({ x: 50, y: 80 })


portalExit.exit = portalEntrance

var trampoline = new Trampoline({ x: 40, y: 90 })


var entities = [
    player,
    portalExit,
    portalEntrance,
    trampoline
]

function update(dt) {
    if (playing == false) return;

    entities.forEach(function (ent) {
        ent.update(dt)
    })
}

function draw() {
    ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height)
    entities.forEach(function (ent) {
        ent.draw()
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

mainCanvas.addEventListener('click', function (ev) {
    if (ev.button == 0) {
        portalExit.center.x = ev.clientX - this.getBoundingClientRect().left
        portalExit.center.y = ev.clientY - this.getBoundingClientRect().top
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

