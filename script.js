import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { Scene } from 'three';


export default class Sketch {
    constructor(options) {
        // initialize timer
        this.time = 0
        // get the dom elemnt
        this.container = options.dom
        // initialize new scene
        this.scene = new THREE.Scene();
        // create a container
        this.width = this.container.offsetWidth
        this.height = this.container.offsetHeight
        // create a camera
        this.camera = new THREE.PerspectiveCamera(70, this.width / this.height, 0.01, 10)
        this.camera.position.z = 1

        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer.setSize( this.width, this.height );
        this.container.appendChild( this.renderer.domElement );
        // Add orbital controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        // Call Obj self methods
        this.resize()
        this.setupResize()
        this.addObjects()
        this.render()

    }

    setupResize() {
        window.addEventListener("resize", this.resize.bind(this))
    }

    resize() {
        console.log('resizing')
        this.width = this.container.offsetWidth
        this.height = this.container.offsetHeight
        this.renderer.setSize(this.width, this.height)
        this.camera.aspect = this.width / this.height
        this.camera.updateProjectionMatrix()
    }

    addObjects() {
        this.geometry = new THREE.BoxBufferGeometry(0.5, 0.5, 0.5)
        this.material = new THREE.MeshNormalMaterial({});
        this.material = new THREE.ShaderMaterial({
            fragmentShader: `
                void main() {
                    gl_FragColor = vec4(1.,0.,0.0,1.);
                }
            `,
            vertexShader: `
                void main() {
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
        })
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.scene.add(this.mesh)
    }

    render () {
        this.time += 0.05
        window.requestAnimationFrame(this.render.bind(this))
        

        this.mesh.rotation.x = this.time / 2000;
        this.mesh.rotation.y = this.time / 1000;
        this.renderer.render( this.scene, this.camera )
    }
}

new Sketch({
    dom: document.getElementById('container')
})

// init();

// function init() {

// 	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
// 	camera.position.z = 1;

// 	scene = new THREE.Scene();

// 	geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
// 	material = new THREE.MeshNormalMaterial();

// 	mesh = new THREE.Mesh( geometry, material );
// 	scene.add( mesh );



// }

// function animation( time ) {



// }