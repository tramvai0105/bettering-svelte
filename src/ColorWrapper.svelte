<script lang="ts">
    import { onMount } from "svelte";

    export let bgColor: string;
    export let fontColor: string;
    export let titles: string[];
    export let progress: number;

    let wrapper : HTMLElement;
    let titleScroll : HTMLDivElement;

    onMount(()=>{
        if(wrapper){
            wrapper.style.backgroundColor = bgColor;
            wrapper.style.color = fontColor
        }
    })

    $:{
        if(progress == 2){
            titleScroll.style.transform = "translate(136px, -62px)"
            titleScroll.style.clipPath = "polygon(0% 62px, 100% 62px, 100% 124px, 0% 124px)"
        }
        if(progress == 3){
            titleScroll.style.transform = "translate(136px, -124px)"
            titleScroll.style.clipPath = "polygon(0% 124px, 100% 124px, 100% 198px, 0% 198px)"
            wrapper.style.clipPath = "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)"
        }
    }
</script>

<div bind:this={wrapper} id="color-wrapper"
class="wrapper-transition clip-path w-full h-full flex items-center absolute">
    <div class="h-[200px] flex relative w-full mx-6 justify-center flex-col">
        <span class="bg-text timing duration-[1050ms] will-change-transform w-fit">ELVIS</span>
        <div class="bg-text flex relative flex-row timing duration-[1090ms] will-change-transform 
        w-fit">
        <div class="relative">THE</div>
        <div bind:this={titleScroll} id="titleScroll" style="transform: translate(136px,0px);"
            class="flex titleScroll-clip-path whitespace-pre absolute flex-col">
            {#each titles as title}
                <span>{title}</span>
            {/each}
        </div>
        </div>
        <span class="bg-text timing duration-[1050ms] will-change-transform 
        w-fit">PIGSLEY</span>
    </div>
</div>