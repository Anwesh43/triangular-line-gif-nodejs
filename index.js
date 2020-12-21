const scGap = 0.02 

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