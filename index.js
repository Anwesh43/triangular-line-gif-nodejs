const scGap = 0.02 
const w = window.innerWidth
const h = window.innerHeight 
const sizeFactor = 5.6 
const Canvas = require('canvas')
const GifEncoder = require('gifencoder')
const {createWriteStream} = require('fs')

class ScaleUtil {

    static maxScale(scale, i, n) {
        return Math.max(0, scale - i / n)
    }

    static divideScale(scale, i, n) {
        return Math.min(1 / n, ScaleUtil.maxScale(scale, i, n)) * n 
    }

    static sinify(scale) {
        return Math.sin(scale * Math.PI / 180)
    }
}

class DrawingUtil {

    static drawLine(context, x1, y1, x2, y2) {
        context.beginPath()
        context.moveTo(x1, y1)
        context.lineTo(x2, y2)
        context.stroke()
    }

    static drawEndingLine(context, x1, y1, x2, y2, sc1, sc2) {
        DrawingUtil.drawLine(
            context,
            x1 + (x2 - x1) * sc2,
            y1 + (y2 - y1) * sc2,
            x1 + (x2 - x1) * sc1, 
            y1 + (y2 - y1) * sc1
        )
    }

    static drawTriangularLine(context, scale) {
        const sf = ScaleUtil.sinify(scale)
        const sf12 = ScaleUtil.divideScale(sf, 0, 2)
        const sf22 = ScaleUtil.divideScale(sf, 1, 2)
        const sf13 = ScaleUtil.divideScale(sf, 0, 3)
        const sf23 = ScaleUtil.divideScale(sf, 1, 3)
        const sf33 = ScaleUtil.divideScale(sf, 2, 3)
        const size = Math.min(w, h) / sizeFactor 
        context.save()
        context.translate(w / 2, h / 2)
        DrawingUtil.drawEndingLine(context, -size, size, size, size, sf12, sf22)
        DrawingUtil.drawEndingLine(context, -size, size, 0, -size, sf13, sf23)
        DrawingUtil.drawEndingLine(context, 0, -size, size, size, sf23, sf33)
        context.restore()
    }
}


class State {

    constructor() {
        this.scale = 0 
    }

    update(cb) {
        this.scale += scGap 
        if (this.scale > 1) {
            this.scale = 1 
            cb()
        }  
    }
}

class Loop {

    constructor() {
        this.animated = false 
    }

    start(cb) {
        if (!this.animated) {
            this.animated = true 
            this.interval = setInterval(cb, 0)
        }
    }

    stop() {
        if (this.animated) {
            this.animated = false 
            clearInterval(this.interval)
        }
    }
}

class TriangleLine {

    constructor() {
        this.state = new State()
    }

    draw(context, cb) {
        DrawingUtil.drawTriangularLine(context, this.state.scale)
        cb(context)
    }

    update(endcb) {
        this.state.update(endcb)
    }
}


class Renderer {

    constructor() {
        this.loop = new Loop()
        this.canvas = new Canvas()
        this.gifEncoder = new GifEncoder(w, h)
        this.tl = new TriangleLine()
        this.initRendererAndCanvas() 
    }

    initRendererAndCanvas() {
        this.canvas.width = w 
        this.canvas.height = h 
        this.context = this.canvas.getContext('2d')
        this.gifEncoder.setQuality(100)
        this.gifEncoder.setDelay(20)
        this.gifEncoder.setRepeat(0)
    }

    create(fileName, stop) {
        this.gifEncoder.createReadStream().pipe(createWriteStream(fileName))
        this.loop.start(() => {
            this.tl.draw(this.context, (context) => {
                this.gifEncoder.addFrame(context)
            })
            this.tl.update(() => {
                this.loop.stop()
                stop()
            })
        })
    }
}

class TerminalLoader {

    constructor() {
        this.started = false 
    }

    start(text) {
        let i = 0 
        const parts = ['.', '..', '...']
        if (!this.started) {
            this.started = true 
            this.interval = setInterval(() => {
                process.stdout.write(`${text}${parts[i % parts.length]}`)
                i++
            }, 40)
        }
    }
    
    stop() {
        if (this.started) {
            this.started = false 
            clearInterval(this.interval)
        }
    }
}

const renderer = new Renderer()
const terminalLoader = new TerminalLoader()
terminalLoader.start()
renderer.create('test.gif', () => {
    terminalLoader.stop()
})