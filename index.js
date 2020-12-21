const scGap = 0.02 
const w = window.innerWidth
const h = window.innerHeight 

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