<script lang="ts">
    import { mask } from "./stores";
    import { onMount } from "svelte";

    let value: number;
    let div: HTMLDivElement;
    let svg: SVGSVGElement;

    mask.subscribe((m) => value = m);

    $:if(value == 1){
        if(div && svg){
            div.style.transform = "translateY(-50px)"
            div.style.opacity = "1"
            svg.style.transform = "translateY(12px) scaleY(1)"
        }
        setTimeout(()=>{
            mask.set(0);
        },1100)
    }
    $:if(value == 0){
        if(div && svg){
            div.style.transform = ""
            div.style.opacity = "0"
            svg.style.transform = ""
        }
    }
</script>

<div bind:this={div} class="pos flex flex-col div-transition div-hidden">
    <svg bind:this={svg} class="svg-transform" width={"100%"} height={50} xmlns="http://www.w3.org/2000/svg">
        <ellipse cx={"50%"} cy="250" fill="white" rx={"100%"} ry="250" />
    </svg>
    <div class="bg-white w-full h-full"></div>
</div>

<style>
    .div-transition{
        transition-property: transform;
        transition-duration: 900ms;
        transition-timing-function: ease-in-out;
    }
    .div-hidden{
        transform: translateY(100%);
    }
    .svg-transform{
        transform: translateY(22px) scaleY(0.2);
        transition-property: transform;
        transition-duration: 700ms;
        transition-timing-function: ease;
    }
    .pos{
        position: absolute;
        z-index: 41;
        height: 150vh;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
    }
</style>