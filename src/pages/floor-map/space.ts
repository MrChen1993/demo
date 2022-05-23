import {getSpacesInFloor,Space} from "../../api"
import * as THREE from "three"
import {scene,ctx,camera,registryListener} from "./three"

import {collisionDetection, spaceNameLoader, spaceOutLineLoader, test} from "../../utils"
export class SpaceD3{
    mesh;
    nameLabel;
    width = 0
    height = 20
    constructor(space:Space) {
        Object.assign(this,space)

        const meshes = spaceOutLineLoader(space);
        if(meshes.length > 1){
            this.mesh = meshes.reduce(new THREE.Group(),(group,mesh)=>{
                group.add(mesh)
                return group;
            })
        }else if(meshes.length === 1){
            this.mesh = meshes[0]
        }

        this.nameLabel = spaceNameLoader(space)

        const [x,y,z] = space.bimLocation.split(",")
        this.position = new THREE.Vector3(parseFloat(x)/100,parseFloat(y)/100,0)

        const {width} = ctx.measureText(space.name)
        this.width = width + 20
    }

    getRect = () => {
        //物理坐标转标准坐标
        const standard = this.position.clone().project(camera)

        //标准坐标转屏幕坐标
        const halfWidth = window.innerWidth / 2
        const halfHeight = window.innerHeight / 2;

        const x = Math.round(standard.x * halfWidth + halfWidth)
        const y = Math.round(-standard.y * halfHeight + halfHeight)

        return {
            left: x-this.width/2,
            right: x+this.width/2,
            top: y-this.height/2,
            bottom: y+this.height/2
        }
    }

    toString = () => {
        const {left,right,top,bottom} = this.getRect()
        return `${left},${right},${top},${bottom}`
    }
}

export async function initSpaces(){
    const spaces = await getSpacesInFloor()
    const spaceD3s = spaces.map(it=>new SpaceD3(it))
    spaceD3s.forEach(d3=>{
        if(d3.mesh){
            scene.add(d3.mesh)
        }
        if(d3.nameLabel){
            scene.add(d3.nameLabel)
        }
    })
    let lastTime = -99999999999
    registryListener((time)=>{
        if(time - lastTime > 10_000){
            lastTime = time
            collisionDetection(spaceD3s,true)
        }else{
            collisionDetection(spaceD3s)
        }
    })

}
