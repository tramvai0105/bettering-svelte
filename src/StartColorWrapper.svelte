<script lang="ts">
    import { onMount } from "svelte";

    export let bgColor: string;
    export let fontColor: string;
    export let titles: string[];
    export let progress: number;

    let scrolls : HTMLElement[] = [];
    let wrapper : HTMLElement;
    let titleScroll : HTMLDivElement;

    onMount(()=>{
        if(wrapper){
            wrapper.style.backgroundColor = bgColor;
            wrapper.style.color = fontColor
        }
    })

    $:{
        if(progress == 1){
            scrolls.forEach((el)=>{
                el.style.transform = "translate(0px, 0px)"
                el.style.clipPath = "polygon(0% 0px, 900px 0px, 900px 62px, 0% 62px)"
            })
        }
        if(progress == 2){
            titleScroll.style.transform = "translate(136px, -62px)"
            titleScroll.style.clipPath = "polygon(0% 62px, 100% 62px, 100% 124px, 0% 124px)"
            wrapper.style.clipPath = "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)";
        }
        if(progress == 3){
            titleScroll.style.transform = "translate(136px, -124px)"
            titleScroll.style.clipPath = "polygon(0% 124px, 100% 124px, 100% 198px, 0% 198px)"
        }
    }
</script>

<div bind:this={wrapper} id="color-wrapper"
class="wrapper-transition clip-path w-full h-full flex items-center absolute">
    <div class="h-[200px] flex relative w-full mx-6 justify-center flex-col">
        <span bind:this={scrolls[0]}  style="transform: translateY(66px);" class="bg-text startScroll-clip-path duration-[1050ms] will-change-transform w-fit">ELVIS</span>
        <div bind:this={scrolls[1]} style="transform: translateY(66px);" class="bg-text flex relative flex-row startScroll-clip-path duration-[1090ms] will-change-transform 
        w-fit">
            <div class="relative">THE</div>
            <div bind:this={titleScroll} id="titleScroll" style="transform: translate(136px,0px);"
                class="flex titleScroll-clip-path whitespace-pre absolute flex-col">
                {#each titles as title}
                    <span>{title}</span>
                {/each}
            </div>
        </div>
        <span bind:this={scrolls[2]} style="transform: translateY(66px);" class="bg-text startScroll-clip-path duration-[1050ms] will-change-transform 
        w-fit">PIGSLEY</span>
    </div>
</div>