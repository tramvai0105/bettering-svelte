import * as THREE from 'three';
import { easeOutSine } from 'js-easing-functions';

interface Diagonal {
    id: number,
    elements: THREE.Mesh[],
    line: THREE.Line3,
}

const dS = 1.5

const dW: number = dS - 0.5, dH: number = dS;

function getRandomFloat(min: number, max: number, decimals: number) {
    const str = (Math.random() * (max - min) + min).toFixed(
        decimals,
    );

    return parseFloat(str);
}

function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default class Grid {

    grid: Diagonal[] = [];
    planes = new THREE.Object3D();
    colors: string[] = [
        "235, 92, 104", // soft pink
        "249, 217, 78", // yellow
        "31, 162, 255", // blue
        "3, 181, 170", // green copper
        "235, 130, 88", // dust orange
        "102, 31, 255", // blue violet
        "237, 33, 124", // magenta
        "97, 232, 225", // sea blue
        "155, 163, 98", // green
        "255, 202, 109", // dust yellow
    ];
    positions: THREE.Vector3[][] = [];
    shuffledColors: string[] = [];
    range = { first: 0, last: 0 };
    interval = 4;
    introStart : number | undefined;
    intro: boolean = true;
    uniforms = {
        uOffset: {
            value: new THREE.Vector2(0.0, .0)
        },
    }

    constructor() {
        this.range.first = -this.interval;
        this.range.last = this.interval + 1;
        this.grid.push({ id: 0, elements: [], line: new THREE.Line3 })
        this.grid.push({ id: -1, elements: [], line: new THREE.Line3 })
        this.grid.push({ id: 1, elements: [], line: new THREE.Line3 })
        this.grid.push({ id: -2, elements: [], line: new THREE.Line3 })
        this.grid.push({ id: 2, elements: [], line: new THREE.Line3 })
        this.grid.push({ id: -3, elements: [], line: new THREE.Line3 })
        this.grid.push({ id: 3, elements: [], line: new THREE.Line3 })
        this.grid.push({ id: -4, elements: [], line: new THREE.Line3 })
        this.grid.push({ id: 4, elements: [], line: new THREE.Line3 })
        this.grid.forEach((d, i) => {
            this.grid[i] = this.generateDiagonal(d);
        })
        this.addElementsToPlanes()
        this.planes.position.y += 0.5
        this.planes.position.x -= 1.0
        this.grid = this.grid.sort((a, b) => {
            return a.id - b.id
        })
        this.copyStartPositions()
        this.grid = this.grid.map(d=>{return {...d, elements: d.elements.map(el=>{
            let singX = el.position.x?el.position.x<0?-1:1:1
            let singY = el.position.y?el.position.y<0?-1:1:1
            let shiftX = el.position.distanceTo(new THREE.Vector3(0, 0, 0)) < 1.4 ? 0.9 : 0
            let shiftY = el.position.distanceTo(new THREE.Vector3(0, 0, 0)) < 1.4 ? 1.3 : 0
            el.position.set((el.position.x + shiftX) * 1.9,
                            (el.position.y + shiftY) * 1.9, el.position.z)
            return el
        })}})
    }

    animateIntro(){
        if(!this.introStart){
            this.introStart = Date.now()
        }
        let elapsed = Date.now() - this.introStart;
        let duration = 40000
        let brake = false;
        this.grid = this.grid.map((d, di)=>{return {...d, elements: d.elements.map((el, ei)=>{
            let x = easeOutSine(elapsed, el.position.x, this.positions[di][ei].x - el.position.x, duration)
            let y = easeOutSine(elapsed, el.position.y, this.positions[di][ei].y - el.position.y, duration)
            if(Math.abs(this.positions[di][ei].x - el.position.x) < 0.001 
                && Math.abs(this.positions[di][ei].y - el.position.y) < 0.001){
                brake = true;
            }
            el.position.lerp(new THREE.Vector3(x, y, this.positions[di][ei].z), 1)
            return el
        })}})
        if(elapsed > duration || brake){
            this.grid = this.grid.map((d, di)=>{return {...d, elements: d.elements.map((el, ei)=>{
                el.position.lerp(this.positions[di][ei], 1)
                return el
            })}})
            this.intro = false;
            return;
        }
        requestAnimationFrame(this.animateIntro.bind(this))
    }

    copyStartPositions(){
        this.grid.forEach(d=>{
            let positions: THREE.Vector3[] = []
            d.elements.forEach(el=>{
                positions.push(el.position.clone())
            })
            this.positions.push(positions)
        })
    }

    addElementsToPlanes() {
        let elements: THREE.Mesh[] = [];
        this.grid.forEach(d => elements = [...elements, ...d.elements])
        elements.forEach(el => this.planes.add(el))
    }

    removeDiagonalFromPlanes(id: number) {
        this.grid[id].elements.forEach(el => this.planes.remove(el));
    }

    removeEdgeFromPlanes(edge: "f" | "n") {
        let l = this.interval * 2 + 1;
        if (edge == "f") {
            this.grid.forEach(d => this.planes.remove(d.elements[l - 1]))
        }
        if (edge == "n") {
            this.grid.forEach(d => this.planes.remove(d.elements[0]))
        }
    }

    addDiagonalToPlanes(elements: THREE.Mesh[]) {
        elements.forEach(el => this.planes.add(el));
    }

    getDistanceToDiagonal(id: number) {
        let A = new THREE.Vector3();
        let diagonal = this.grid.find(d => d.id == id);
        if (diagonal) {
            diagonal.line.closestPointToPoint(this.planes.position.clone().negate(), false, A);
        }
        return this.planes.position.clone().negate().distanceTo(A);
    }

    getDistanceToEdge(edge: "f" | "n") {
        let A = new THREE.Vector3();
        let line = new THREE.Line3();
        let l = this.interval * 2 + 1;
        if (edge == "f") {
            line.set(this.grid[0].elements[l - 1].position, this.grid[1].elements[l - 1].position)
                .closestPointToPoint(this.planes.position.clone().negate(), false, A);
        }
        if (edge == "n") {
            line.set(this.grid[0].elements[0].position, this.grid[1].elements[0].position)
                .closestPointToPoint(this.planes.position.clone().negate(), false, A);

        }
        return this.planes.position.clone().negate().distanceTo(A);
    }

    makeNewDiagonals() {
        if (this.getDistanceToDiagonal(this.grid[1].id) > 5) {
            this.removeDiagonalFromPlanes(0)
            this.grid.splice(0, 1)
            this.grid.splice(this.grid.length, 0, this.generateDiagonal({ id: this.grid[this.grid.length - 1].id + 1, elements: [], line: new THREE.Line3 }))
            this.addDiagonalToPlanes(this.grid[this.grid.length - 1].elements)
        }
        else if (this.getDistanceToDiagonal(this.grid[this.grid.length - 2].id) > 5) {
            this.removeDiagonalFromPlanes(this.grid.length - 1)
            this.grid.splice(this.grid.length - 1, 1)
            this.grid.splice(0, 0, this.generateDiagonal({ id: this.grid[0].id - 1, elements: [], line: new THREE.Line3 }))
            this.addDiagonalToPlanes(this.grid[0].elements)
        }
        else if (this.getDistanceToEdge("f") > 7) {
            this.removeEdgeFromPlanes("f")
            this.grid = this.grid.map(d => { 
                d.elements.splice(d.elements.length - 1, 1)
                return { ...d, elements: d.elements } })
            this.appendEdge("f")
        }
        else if (this.getDistanceToEdge("n") > 7) {
            this.removeEdgeFromPlanes("n")
            this.grid = this.grid.map(d => { 
                d.elements.splice(0, 1)
                return { ...d, elements: d.elements } })
            this.appendEdge("n")
        }
    }

    appendEdge(edge: "f" | "n") {
        if (edge == "f") {
            this.range.first = this.range.first - 1;
            this.range.last = this.range.last - 1;
            this.grid = this.grid.map(d=>{
                let {mesh, shiftX, shiftY} = this.newMesh();
                let x = dW * (this.range.first) * 1.25 - d.id / 4;
                let y = 0.8 * (dH * (this.range.first) + dH * d.id) + d.id / 4 
                mesh.position.set(-(x + shiftX), y + shiftY, 0.07 + getRandomFloat(-0.01, 0.05, 2));
                this.planes.add(mesh)
                return {...d, elements: [mesh, ...d.elements]}})
        }
        if (edge == "n") {
            this.range.first = this.range.first + 1;
            this.range.last = this.range.last + 1;
            this.grid = this.grid.map(d=>{
                let {mesh, shiftX, shiftY} = this.newMesh();
                let x = dW * (this.range.last - 1) * 1.25 - d.id / 4;
                let y = 0.8 * (dH * (this.range.last - 1) + dH * d.id) + d.id / 4 
                mesh.position.set(-(x + shiftX), y + shiftY, 0.07 + getRandomFloat(-0.01, 0.05, 2));
                this.planes.add(mesh)
                return {...d, elements: [...d.elements, mesh]}})
        }
    }

    newMesh() {
        let shuffleColors = () => {
            return this.colors
                .map(value => ({ value, sort: Math.random() }))
                .sort((a, b) => a.sort - b.sort)
                .map(({ value }) => value)
        }
        this.shuffledColors = shuffleColors();
        let last = this.shuffledColors[this.shuffledColors.length - 1]
        let sizes = [0.85, 1, 1.1, 1.1, 1.2];
        let size = sizes[getRandomInt(0, sizes.length - 1)];
        let geometry = new THREE.PlaneGeometry(size, size, 32, 32);
        if (this.shuffledColors.length < 1) {
            this.shuffledColors = shuffleColors()
            if (this.shuffledColors[0] == last) {
                this.shuffledColors[0] = this.shuffledColors[1];
                this.shuffledColors[1] = last;
                last = this.shuffledColors[this.shuffledColors.length - 1];
            }
        }
        let color = this.shuffledColors.pop() as string;
        color = color.split(", ").map(c => Number(c) / 255).join(",")
        let material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: `
                uniform vec2 uOffset;
                varying vec2 vUv;
        
                vec4 barrelDistortion(vec4 position, vec2 uv, vec2 offset) {
                    float distortion = 0.035 * offset.x;
                    float r = (position.x*position.x*.035 - 0.015) + (position.y*position.y*.15 + 0.4);
                    position.xy /= 1.01 + distortion * r + distortion * r * r;
                    return position;
                }
               
                void main() {
                  vUv = uv;
                  vec4 localPosition = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                  vec4 newPosition = barrelDistortion(localPosition, vUv, uOffset);
                  gl_Position = newPosition;
                }
                `,
            fragmentShader: `
                precision mediump float;
        
                #define color vec4(${color}, 1.0)
            
                void main() {
                    // gl_FragColor = vec4(gl_FragCoord.zxy / 400.0, 1.0);
                    gl_FragColor = color;
                } 
                `,
            transparent: true
        });
        const shift = (1.2 - size) / 4
        let shiftX = getRandomFloat(-shift, shift, 1)
        let shiftY = getRandomFloat(-shift * 4, shift * 4, 1)
        const mesh = new THREE.Mesh(geometry, material)
        mesh.userData = {link: "foo"}
        return {mesh, shiftX, shiftY}
    }

    generateDiagonal(d: Diagonal) {
        for (let i = this.range.first; i < this.range.last; i++) {
            // 0.7 | 1 , 1,5 
            let x = dW * i * 1.25 - d.id / 4;
            let y = 0.8 * (dH * i + dH * d.id) + d.id / 4 // -0,96x + 1,69 , 5.8x + 8.45
            if (i == this.range.first) {
                d.line.start = new THREE.Vector3(-x, y, 0)
            }
            if (i == this.range.last - 1) {
                d.line.end = new THREE.Vector3(-x, y, 0)
            }
            let {mesh, shiftX, shiftY} = this.newMesh();
            // mesh.position.set(-(x), y, 0.07 + getRandomFloat(-0.01, 0.05, 2));
            mesh.position.set(-(x + shiftX), y + shiftY, 0.07 + getRandomFloat(-0.01, 0.05, 2));
            d.elements.push(mesh)
        }
        return d;
    }
}