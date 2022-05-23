import {Space} from "../../api";
import * as THREE from "three"
import {Mesh} from "three";
import {randomColor} from "../color";
import {CSS2DObject} from "three/examples/jsm/renderers/CSS2DRenderer"


const extrudeSettings = {
    depth: -10,
    bevelEnabled: false,
    steps: 2
};
export function spaceOutLineLoader2(space:Space):Array<Mesh>{
    return space.outline.flatMap(([arr,holePoints])=>{
        const points = arr.map(({X,Y})=>new THREE.Vector2(X/100,Y/100))
        const shape = new THREE.Shape(points)
        if(holePoints){
            shape.holes = [
                new THREE.Path(
                    holePoints.map(({X,Y})=>new THREE.Vector2(X/100,Y/100))
                )
            ]
        }

        const geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
        const material = new THREE.MeshBasicMaterial( { color: randomColor() } )
        const mesh = new THREE.Mesh( geometry,material );
        mesh.position.set(0,0,0)
        return mesh
    })
}

export function spaceOutLineLoader(space:Space):Array<Mesh>{
    return space.outline.flatMap(([arr,holePoints])=>{
        const points = arr.map(({X,Y})=>new THREE.Vector2(X/100,Y/100))
        const shape = new THREE.Shape(points)
        if(holePoints){
            shape.holes = [
                new THREE.Path(
                    holePoints.map(({X,Y})=>new THREE.Vector2(X/100,Y/100))
                )
            ]
        }

        const geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
        const material = new THREE.MeshBasicMaterial( { color: randomColor() } )
        const mesh = new THREE.Mesh( geometry,material );
        mesh.position.set(0,0,0)
        return mesh
    })
}

export function spaceNameLoader(space:Space):CSS2DObject{
    const nameDiv = document.createElement("div")
    nameDiv.textContent = space.name
    nameDiv.style.color = "white"
    nameDiv.style.fontSize = "10px"
    nameDiv.style.height = "10px"
    nameDiv.style.lineHeight = "10px"


    const object = new CSS2DObject(nameDiv)
    const [x,y,z] = space.bimLocation.split(",")

    object.position.set(parseFloat(x)/100,parseFloat(y)/100,0)

    return object
}

