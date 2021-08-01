import * as THREE from 'three';
import imagesLoaded from 'imagesloaded';
import FontFaceObserver from 'fontfaceobserver'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { Scene } from 'three';
import fragment from './shaders/fragment.glsl'
import vertex from './shaders/vertex.glsl'
import Scroll from './scroll'


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
        this.camera = new THREE.PerspectiveCamera(70, this.width / this.height, 100, 2000)
        this.camera.position.z = 600

        this.camera.fov = 2 * Math.atan((this.height * 0.5) / 600 ) * (180/Math.PI)

        this.renderer = new THREE.WebGLRenderer( { 
            antialias: true,
            alpha: true,
        } );
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize( this.width, this.height );
        this.container.appendChild( this.renderer.domElement );
        // Add orbital controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)

        this.images = [...document.querySelectorAll('img')]

        // Promises
        const fontOpen = new Promise(resolve => {
            new FontFaceObserver("Open Sans").load().then(() => {
                resolve();
            })
        })
        const fontPlayfair = new Promise(resolve => {
            new FontFaceObserver("Playfair Display").load().then(() => {
                resolve();
            })
        })
        const preloadImages = new Promise((resolve, reject) => {
            imagesLoaded(document.querySelectorAll("img"), { background: true }, resolve)
        })

        let allDone = [fontOpen, fontPlayfair, preloadImages] 
        console.log(allDone)
        this.currentScroll = 0
        
        Promise.all(allDone).then(() => {
            this.scroll = new Scroll()
            // Call Obj self methods
            this.addImages()
            this.setPosition()
            // this.addObjects()
            this.resize()
            this.setupResize()
            this.render()
            window.addEventListener('scroll', () => {
                // this.currentScroll = window.scrollY
                // this.setPosition()
            })

        })

        

  

    }

    setupResize() {
        window.addEventListener("resize", this.resize.bind(this))
    }

    resize() {
        this.width = this.container.offsetWidth
        console.log(this.container.offsetWidth)
        this.height = this.container.offsetHeight
        this.renderer.setSize(this.width, this.height)
        console.log("width: ", this.width, "height: ", this.height)
        this.camera.aspect = this.width / this.height
        console.log("camera aspect: ",  this.camera.aspect)
        this.camera.updateProjectionMatrix()
    }

    addImages() {
        this.imagesStore = this.images.map(img => {
            let bounds = img.getBoundingClientRect()
            let geometry = new THREE.PlaneBufferGeometry(bounds.width, bounds.height, 1, 1)
            let texture = new THREE.Texture(img)
            texture.needsUpdate = true
            let material = new THREE.MeshBasicMaterial({
                // color: 'red',
                map: texture
            })
            let mesh = new THREE.Mesh(geometry, material)
            this.scene.add(mesh)

            return {
                img,
                mesh,
                top: bounds.top,
                left: bounds.left,
                width: bounds.width,
                height: bounds.height,
            }

        })
        console.log(this.imagesStore);
    }

    setPosition() {
        this.imagesStore.forEach(image => {
            image.mesh.position.y = this.currentScroll - image.top + this.height/2 - image.height/2
            image.mesh.position.x = image.left - this.width/2 + image.width/2
        })
    }

    addObjects() {
        this.geometry = new THREE.PlaneBufferGeometry(100, 100, 10, 10)
        // this.material = new THREE.MeshNormalMaterial({});
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            // side: THREE.DoubleSide,
            fragmentShader: fragment,
            vertexShader: vertex,
            wireframe: true
        })
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.scene.add(this.mesh)
    }

    render () {
        this.time += 0.05
        this.scroll.render()
        this.currentScroll = this.scroll.scrollToRender
        this.setPosition()
        window.requestAnimationFrame(this.render.bind(this))

        // this.material.uniforms.time.value = this.time;
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