import './style.css'
import * as THREE from 'three'

let toRight = true
let toUp = true
const gameStage = 20
// Util function
const degreesToRadians = (degrees) => {
    return degrees * (Math.PI / 180)
}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x333333)

// Objects
const sphereGeom = new THREE.SphereGeometry(.6, 200, 200);
const playerBoxGeom = new THREE.BoxGeometry(10, 1, 1)
const aIBoxGeom = new THREE.BoxGeometry(10, 1, 1)


// Materials
const materialSphere = new THREE.MeshLambertMaterial({
    color: '#ff000',
    wireframe: false,
})

const materialPlayer = new THREE.MeshLambertMaterial({
    color: '#ff00a0',
    wireframe: false,
})

const materialAi = new THREE.MeshLambertMaterial({
    color: '#ffa000',
    wireframe: false,
})
// Mesh
const sphere = new THREE.Mesh(sphereGeom, materialSphere)
scene.add(sphere)

const player = new THREE.Mesh(playerBoxGeom, materialPlayer)
player.position.z = 10
scene.add(player)

const ai = new THREE.Mesh(aIBoxGeom, materialAi)
ai.position.z = -10
scene.add(ai)

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 0
pointLight.position.y = 20
pointLight.position.z = 0
pointLight.rotation.x = degreesToRadians(-90)
scene.add(pointLight)


const lightAmbient = new THREE.AmbientLight(0x9eaeff, 0.8)
scene.add(lightAmbient)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 20
camera.position.z = 0
camera.rotation.x = degreesToRadians(-90)
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () => {

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = .5 * elapsedTime

    // Update Orbital Controls
    // controls.update()

    animAi()
    animBall()
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

// animate ai box
const animAi = () => {
    if (toRight) {
        moveRight(ai)
    }
    else {
        moveLeft(ai)
    }
}

// animate ball
const animBall = () => {
    if (toUp) {
        moveUp()
    }
    else {
        moveDown()
    }
}

const moveLeft = (box) => {
    box.position.x -= 0.09
    if (box.position.x <= -((gameStage / 2))) {
        toRight = true
    }
}

const moveRight = (box) => {
    box.position.x += 0.09
    if (box.position.x >= ((gameStage / 2))) {
        toRight = false
    }
}

const moveUp = () => {
    sphere.position.z -= 0.1
    if (sphere.position.z <= -((gameStage - 2) / 2)) {
        toUp = false
    }
}

const moveDown = () => {
    sphere.position.z += 0.1
    if (sphere.position.z >= ((gameStage - 2) / 2)) {
        toUp = true
    }
}

// event listener
document.addEventListener('keydown', (e) => {
    e.preventDefault()
    switch (e.key) {
        case "ArrowLeft":
            player.position.x -= 0.5
            break;
        case "ArrowRight":
            player.position.x += 0.5
            break;
    }
})

tick()