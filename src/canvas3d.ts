import * as THREE from 'three';
import { easeOutSine } from 'js-easing-functions';
import Grid from './lib/grid';
import { navigate } from '../svelte-routing/src/index';
import { mask } from './stores';
import navigateEffect from './navigate';

export default async function canvas3d(canvas: HTMLElement) {

    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(window.devicePixelRatio);
    let moveShift: { x: number, y: number } = { x: 0, y: 0 }
    let throwStartPoint: { x: number, y: number } | null = null
    let startPoint: { x: number, y: number } = { x: 0, y: 0 }
    let startPos: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    let allowMove = false;
    let renderCancel: boolean = false;

    let AR = canvas.clientWidth / canvas.clientHeight

    const fov = 45; // 45
    let aspect = AR;
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 0, 2.4);

    const scene = new THREE.Scene();
    scene.background = null

    let raycaster = new THREE.Raycaster();
    let pointer = new THREE.Vector2();

    let bgGeometry = new THREE.PlaneGeometry(2 * AR, 2);

    let grid = new Grid();

    scene.add(grid.planes);

    grid.animateIntro();
    canvas.style.cursor = "grab"

    function resizeRendererToDisplaySize(renderer: THREE.WebGLRenderer) {

        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {

            renderer.setSize(width, height, false);

        }

        return needResize;

    }

    function convertCoords(x: number, y: number) {
        let w = bgGeometry.parameters.width
        let h = bgGeometry.parameters.height
        return { x: x * w / canvas.clientWidth - w / 2, y: -(y * h / canvas.clientHeight - h / 2) }
    }

    function unconvertCoords(pos: THREE.Vector3) {
        let w = bgGeometry.parameters.width
        let h = bgGeometry.parameters.height
        return { x: pos.x * canvas.clientWidth / w + w / 2, y: -(pos.y * canvas.clientHeight / h + h / 2) }
    }

    function hoverTransition(this: {
        id?: number,
        scale: number;
        reverse?: boolean;
        startTime?: number; 
        element: THREE.Object3D<THREE.Object3DEventMap>
    }) {
        if (!this.startTime) {
            this.startTime = Date.now();
        }
        const elapsed = Date.now() - this.startTime;
        if (!this.element) {
            return;
        }

        let duration = 250

        let value: number;
        if (this.reverse) {
            value = easeOutSine(elapsed, this.scale, -(this.scale - 1.04), duration);
        } else {
            value = easeOutSine(elapsed, this.scale, 1.1 - this.scale, duration);
        }

        this.element.scale.set(value, value, 1);
        if (elapsed < duration) {
            requestAnimationFrame(hoverTransition.bind(this));
        }
    }

    let renderCap = 0;
    let throwCount = 0;

    function render() {
        if(renderCancel){
            return;
        }
        if (resizeRendererToDisplaySize(renderer)) {
            camera.updateProjectionMatrix();
        }
        renderer.render(scene, camera);

        if (!allowMove && throwCount > 0) {
            let pos = grid.planes.position.clone();
            let speedReduce = 200
            uOffsetTarget = throwSpeed * throwCount < 65 ? throwSpeed * throwCount / 65 : 1.0
            pos.x = pos.x + (throwSpeedX * throwCount / speedReduce) * 0.7;
            pos.y = pos.y + -(throwSpeedY * throwCount / speedReduce) * 0.7;
            throwCount -= 0.01;
            grid.planes.position.lerp(pos, 0.5);
            grid.makeNewDiagonals();
        }
        
        if(!allowMove && throwCount < 0.0001){
            uOffsetTarget = 0;
        }

        if (renderCap == 2) {
            let z = grid.planes.position.z
            if (Math.abs((apprZTarget - z) / 7) > 0.00001) {
                grid.planes.position.z += (apprZTarget - z) / 7
            }
            let u = grid.uniforms.uOffset.value.x;
            if (Math.abs((uOffsetTarget - u) / 5) > 0.00001) {
                grid.uniforms.uOffset.value.x += (uOffsetTarget - u) / 5
            }
            renderCap = 0;
        }

        if (Date.now() - timestamp > 100) {
            apprZTarget = 0;
            uOffsetTarget = 0;
        }

        renderCap += 1;
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);

    let timestamp = 0;

    let apprZTarget = 0;
    let uOffsetTarget = 0;

    let speed: number = 0, speedX: number = 0, speedY: number = 0;
    let throwSpeedX: number = 0, throwSpeedY: number = 0;
    let throwSpeed: number = 0;

    let cap = 0

    let hovered: THREE.Object3D<THREE.Object3DEventMap>[] = [];

    setInterval(() => {
        speedX = 0; speedY = 0;
    }, 100)

    function canvasMouseDown(e: MouseEvent){
        if(!grid.intro){
            let { x: mx, y: my } = convertCoords(e.pageX, e.pageY);
            moveShift.x = mx - grid.planes.position.x;
            moveShift.y = my - grid.planes.position.y;
            if(hovered.length){
                navigateEffect(hovered[0].userData.link)
            }
            allowMove = true;
            canvas.style.cursor = "grabbing"
            startPoint = { x: e.pageX, y: e.pageY };
            startPos = grid.planes.position.clone();
        }
    }

    function documentMouseMoveOne(e: MouseEvent){
        if (cap == 2) {
            let now = Date.now();

            let dt = now - timestamp;
            let dx = e.movementX;
            let dy = e.movementY;

            pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
            pointer.y = - (e.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(pointer, camera);
            let objs = raycaster.intersectObjects(grid.planes.children)
            if (objs.length > 0) {
                let obj = objs[0].object;
                if (!hovered.includes(obj)) {
                    hovered.push(obj)
                    hoverTransition.call({ element: obj, scale: obj.scale.x })
                }
            }
            hovered.forEach((el, i) => {
                if (!raycaster.intersectObject(el).length) {
                    hoverTransition.call({ element: el, id: i, reverse: true, scale: el.scale.x })
                    hovered.splice(i, 1)
                }
            })

            let distance = Math.sqrt(dx * dx + dy * dy);
            let direction = Math.atan2(dy, dx);

            speed = distance / dt * 100;
            speedX = Math.round(dx / dt * 100);
            speedY = Math.round(dy / dt * 100);

            let strenghtCoef = 65.0
            if (allowMove) {
                uOffsetTarget = speed < strenghtCoef ? speed / strenghtCoef : 1.0;
            }
            let zEffect = 0.5
            if (allowMove) {
                apprZTarget = speed / 2 < strenghtCoef ? speed / 2 * (zEffect / strenghtCoef) : zEffect
            }

            timestamp = now;
            cap = 0
        }
        cap += 1;
    }

    function windowMouseUp(e: MouseEvent){
        if(!grid.intro){
            allowMove = false;
            canvas.style.cursor = "grab"
            apprZTarget = 0;
            uOffsetTarget = 0;
            throwStartPoint = { x: e.pageX, y: e.pageY };
            let throwSpeedCap = 70
            throwCount = Math.max(0, Math.min(1, (Math.sqrt(speedX * speedX + speedY * speedY) / 140) - 0 / 1 - 0))
            throwSpeedX = Math.abs(speedX) < throwSpeedCap ? speedX : throwSpeedCap * Math.sign(speedX);
            throwSpeedY = Math.abs(speedY) < throwSpeedCap ? speedY : throwSpeedCap * Math.sign(speedY);
            throwSpeed = Math.sqrt(throwSpeedX * throwSpeedX + throwSpeedY * throwSpeedY)
            // grid.uniforms.uOffset.value.x = throwSpeed > 45 ? throwSpeed < 65 ? throwSpeed / 65 : 1.0 : grid.uniforms.uOffset.value.x;
        }
    }

    function windowMouseMove(e: MouseEvent){
        if (allowMove) {
            let pos = grid.planes.position.clone();
            let { x, y } = convertCoords(e.pageX, e.pageY);
            let { x: sx, y: sy } = convertCoords(startPoint.x, startPoint.y);
            let dx = x - sx;
            let dy = y - sy;
            pos.x = startPos.x + dx * 0.7;
            pos.y = startPos.y + dy * 0.7;
            grid.planes.position.lerp(pos, 0.5);
            grid.makeNewDiagonals();
        }
    }

    function documentMouseMoveTwo(e: MouseEvent){
        if(hovered.length){
            canvas.style.cursor = "pointer"
        }
        else{
            canvas.style.cursor = "grab"
        }
    }

    function windowResize(){
        aspect = canvas.clientWidth / canvas.clientHeight;
        camera.aspect = aspect
    }

    canvas.addEventListener("mousedown", canvasMouseDown)
    document.body.addEventListener("mousemove", documentMouseMoveOne);
    window.addEventListener("mouseup", windowMouseUp)
    window.addEventListener("mousemove", windowMouseMove )
    document.body.addEventListener("mousemove", documentMouseMoveTwo)
    window.addEventListener("resize", windowResize)

    return function cleanUp(){
        canvas.removeEventListener("mousedown", canvasMouseDown)
        document.body.removeEventListener("mousemove", documentMouseMoveOne);
        window.removeEventListener("mouseup", (e) => windowMouseUp)
        window.removeEventListener("mousemove", windowMouseMove )
        document.body.removeEventListener("mousemove", documentMouseMoveTwo)
        window.removeEventListener("resize", () => windowResize)
        renderCancel = true;
    }
}