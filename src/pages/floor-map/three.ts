import * as THREE from "three"
import {CSS2DRenderer,CSS2DObject} from "three/examples/jsm/renderers/CSS2DRenderer"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import Stats from "stats.js"

const stats = new Stats()
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom

const canvas = document.createElement("canvas")
export const ctx = canvas.getContext("2d")
if(ctx){
    ctx.font = "10px"
}

const webGLRenderer = new THREE.WebGLRenderer(canvas);
webGLRenderer.setSize( window.innerWidth, window.innerHeight );

const css2dRenderer = new CSS2DRenderer();
css2dRenderer.domElement.style.position = 'absolute';
css2dRenderer.domElement.style.top = '0px';
css2dRenderer.setSize( window.innerWidth, window.innerHeight );

export const camera = new THREE.OrthographicCamera(
    window.innerWidth/-2,
    window.innerWidth/2,
    window.innerHeight/2,
    window.innerHeight/-2,
    1, 1000
)
// const camera = new THREE.PerspectiveCamera(45,window.innerWidth / window.innerHeight)

const controls = new OrbitControls(camera,css2dRenderer.domElement)
controls.mouseButtons = {
    LEFT: THREE.MOUSE.PAN,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: THREE.MOUSE.ROTATE
}
camera.position.z = 5
controls.update();

export const scene = new THREE.Scene()

export function init(){
    const three = document.getElementById("three")
    if(three){
        three.appendChild(stats.dom)
        three.appendChild(css2dRenderer.domElement);
        three.appendChild(webGLRenderer.domElement);
        animate()
    }
}

type Listener = (time?:number) => void
const listeners:Array<Listener> = []
export function registryListener(listener:Listener){
    listeners.push(listener)
}

export function animate(time?: number){
    requestAnimationFrame( animate );
    stats.begin()
    listeners.forEach(listener=>listener(time))

    controls.update()
    webGLRenderer.render(scene,camera)
    css2dRenderer.render(scene,camera)
    stats.end()
}
