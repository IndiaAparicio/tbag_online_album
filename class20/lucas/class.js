
class Vertex {
    constructor(_pos, _col){
        this.pos = _pos;
        this.col = _col;
    }

    move(amount){
        this.offset = createVector(amount, amount, amount);
    }
    
    show(){
        strokeWeight(1);
        //noFill();
        fill(this.col.x, this.col.y, this.col.z);
        vertex(this.pos.x * this.offset.x, this.pos.y * this.offset.y, this.pos.z * this.offset.z);        
    }
}
