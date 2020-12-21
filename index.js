const scGap = 0.02 
const w = window.innerWidth
const h = window.innerHeight 
const sizeFactor = 5.6 

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
            cb()
        }
    }

    stop(cb) {
        if (this.animated) {
            this.animated = false 
        }
    }
}