import {Space} from "../api";

const LIMIT = 5
import _ from "lodash"
import {SpaceD3} from "../pages/floor-map/space";

export function collisionDetection(spaces:Array<SpaceD3>,debug=false){

    const rects = spaces.map(it=>it.getRect())
    const left = _.min(rects.map(it=>it.left))
    const right = _.max(rects.map(it=>it.right))
    const top = _.min(rects.map(it=>it.top))
    const bottom = _.max(rects.map(it=>it.bottom))
    const quadTree = new QuadTreeNode(left-10,right+10,top-10,bottom+10)

    spaces.forEach(space=>{
        space.nameLabel.visible = false
        // space.nameLabel.element.style.color = "red"
        quadTree.addNode(space)
    })
    quadTree.getVisibleSpaces().forEach(space=>{
        // space.nameLabel.element.style.color = "white"
        space.nameLabel.visible = true
    })

    // if(debug){
    //     const three = document.getElementById("three")
    //     if(three){
    //         const temp = document.getElementById("temp")
    //         if(temp){
    //             three.removeChild(temp)
    //         }
    //         const newTemp = document.createElement("div")
    //         newTemp.id = "temp"
    //         newTemp.style.overflow = "hidden"
    //         newTemp.style.position = "absolute"
    //         newTemp.style.top = 0
    //         newTemp.style.width = window.innerWidth +"px"
    //         newTemp.style.height = window.innerHeight + "px"
    //         newTemp.style.pointerEvents = "none"
    //
    //
    //        spaces.forEach(it=>{
    //             const {top,bottom,left,right} = it.getRect()
    //             const div = document.createElement("div")
    //             div.style.left = left + "px";
    //             div.style.top = top +"px";
    //             div.style.width = (right - left)+"px"
    //             div.style.height = (bottom -top) + "px"
    //             div.style.background = "red"
    //             div.style.position = "absolute"
    //             newTemp.appendChild(div)
    //         })
    //         three.appendChild(newTemp)
    //
    //     }
    // }

}

interface Rect{
    left:number
    right:number
    top: number,
    bottom: number
}
function cross(rect1:Rect,rect2:Rect){
    const cross = (rect1.left <= rect2.right && rect2.right <= rect1.right && rect1.top <= rect2.bottom  && rect2.bottom<= rect1.bottom)||
        (rect1.left <= rect2.left && rect2.left <= rect1.right && rect1.top <= rect2.bottom && rect2.bottom <= rect1.bottom)||
        (rect1.left <= rect2.right && rect2.right <= rect1.right && rect1.top <= rect2.top&&rect2.top <= rect1.bottom)||
        (rect1.left <= rect2.left && rect2.left <= rect1.right && rect1.top <= rect2.top && rect2.top <= rect1.bottom)||

        (rect2.left <= rect1.right && rect1.right <= rect2.right && rect2.top <= rect1.bottom  && rect1.bottom<= rect2.bottom)||
        (rect2.left <= rect1.left && rect1.left <= rect2.right && rect2.top <= rect1.bottom && rect1.bottom <= rect2.bottom)||
        (rect2.left <= rect1.right && rect1.right <= rect2.right && rect2.top <= rect1.top&&rect1.top <= rect2.bottom)||
        (rect2.left <= rect1.left && rect1.left <= rect2.right && rect2.top <= rect1.top && rect1.top <= rect2.bottom)
    return cross
}

class QuadTreeNode {
    spaces = []

    isSplit = false
    quadrants = []

    left;
    right;
    top;
    bottom;

    constructor(left, right, top, bottom) {
        this.left = left;
        this.right = right
        this.top = top;
        this.bottom = bottom
    }

    toString(){
        return `${this.left},${this.right},${this.top},${this.bottom}`
    }

    addNode = (space) => {
        if (this.isSplit) {
            let match = false;
            for (let i = 0; i < this.quadrants.length; i++) {
                const quadrant = this.quadrants[i]
                if(quadrant.match(space)){
                    quadrant.addNode(space)
                    match = true
                    break
                }
            }
            if(!match){
                this.spaces.push(space)
            }
        } else {
            //如果没分裂，检查是否需要分裂
            this.spaces.push(space)
            if (this.spaces.length >= LIMIT) {
                this.split()
            }
        }
    }

    match = (space) => {
        const {left, right, top, bottom} = space.getRect()
        return left >= this.left
            && right <= this.right
            && top >= this.top
            && bottom <= this.bottom
    }

    cross = (space) => {
        return cross(space.getRect(),this.getRect())
    }

    split = () => {
        this.isSplit =  true

        if(this.right - this.left < 10 || this.bottom - this.top < 10){
            return
        }

        this.quadrants.push(
            new QuadTreeNode(this.left,(this.right  + this.left)/2,this.top,(this.bottom + this.top)/2),
            new QuadTreeNode((this.right  + this.left)/2,this.right,this.top,(this.bottom + this.top)/2),
            new QuadTreeNode(this.left,(this.right  + this.left)/2,(this.bottom + this.top)/2,this.bottom),
            new QuadTreeNode((this.right  + this.left)/2,this.right,(this.bottom + this.top)/2,this.bottom)
        )

        const newSpaces = []
        for (let i = 0; i < this.spaces.length; i++) {
            const space = this.spaces[i]
            let match = false;
            for (let j = 0; j < this.quadrants.length; j++) {
                const quadrant = this.quadrants[j]
                if(quadrant.match(space)){
                    quadrant.addNode(space)
                    match = true
                    break;
                }
            }
            if(!match){
                newSpaces.push(space)
            }
        }
        this.spaces = newSpaces
    }

    getVisibleSpaces(){
        const visibleSpaces = this.quadrants.flatMap(quadrant=>quadrant.getVisibleSpaces())
        this.spaces.forEach(space=>{
            let match = false;
            for (let i = 0; i < visibleSpaces.length; i++) {
                if(cross(space.getRect(),visibleSpaces[i].getRect())){
                    if(!window.debugger && space.name == "B3_2"){
                        window.cross = cross
                        window.debugger = [space,visibleSpaces[i]]
                        window.rect1 = space.getRect()
                        window.rect2 = visibleSpaces[i].getRect()
                        console.log(space.name,visibleSpaces[i].name)
                        console.log(space.getRect(),visibleSpaces[i].getRect())
                    }

                    match = true
                    break;
                }
            }
            if(!match){
                visibleSpaces.push(space)
            }
        })

        return visibleSpaces

    }

    getRect = ()=>{
        return this;
    }

}
