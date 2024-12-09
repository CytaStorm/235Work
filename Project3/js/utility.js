export class Vector extends Array{

    /**
     * @param {number} x X value of Vector
     * @param {number} y Y value of Vector
     */
    constructor(x, y){
        super();
        this.x = x;
        this.y = y;
    }
}

export function lerp(start, end, amt){
    return start * (1-amt) + amt * end;
}

export function clamp(val, min, max){
    return val < min ? min : (val > max ? max : val);
}

// bounding box collision detection - it compares PIXI.Rectangles
export function rectsIntersect(a,b){
    var ab = a.getBounds();
    var bb = b.getBounds();
    return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
}