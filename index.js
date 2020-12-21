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