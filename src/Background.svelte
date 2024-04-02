<script lang="ts">
    import ColorWrapper from "./ColorWrapper.svelte";
    import StartColorWrapper from "./StartColorWrapper.svelte";
    interface colorsList {
        font: string,
        bg: string,
    }
    let colorsList: colorsList[] = [
        { font: "#840E93", bg: "#ECDF63" },
        { font: "#2239D1", bg: "#ffca38" },
        { font: "#03b5aa", bg: "#4D0C4B" },
        { font: "#FDE139", bg: "#653492" },
        { font: "#FED8A2", bg: "#B6218C" },
        { font: "#532A8C", bg: "#E7ADC2" },
    ]
    let elvisTitlesList = ["ANTIBUTCHER", "GRAND HOG", "KEBAB", "WORLD LIDER", "ELITE", "OINK-OINK", "UKRAINE WARRIOR"]
    let titleScroll : HTMLDivElement;
    let scrolls : HTMLElement[] = [];

    export let progress: number;

    colorsList = colorsList.map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
    elvisTitlesList = elvisTitlesList.map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
    let elvisTitles: string[] = [` ${elvisTitlesList[0]}`, ` ${elvisTitlesList[1]}`, " KING"]

    $:{
        if(progress == 2){
            titleScroll.style.transform = "translate(136px, -62px)"
            titleScroll.style.clipPath = "polygon(0% 62px, 100% 62px, 100% 124px, 0% 124px)"
        }
        if(progress == 3){
            titleScroll.style.transform = "translate(136px, -124px)"
            titleScroll.style.clipPath = "polygon(0% 124px, 100% 124px, 100% 198px, 0% 198px)"
        }
        if(progress == 4){
            let w = 171
            scrolls.forEach((el)=>{
                el.style.marginLeft = "50%"
                el.style.transform = `translateX(-${w}px)`
            })
        }
    }
</script>

{#if progress < 5}
<div id="main-bg-wrapper"
class="bg-[#1C243F] wrapper-transition text-[#ffd5c2] clip-path transition-all w-full h-full flex items-center absolute">
    <div class="h-[200px] flex relative w-full mx-6 justify-center flex-col">
        <span  bind:this={scrolls[0]} class="bg-text timing duration-[1050ms] will-change-transform 
        w-fit">ELVIS</span>
        <div  bind:this={scrolls[1]} class="bg-text flex relative flex-row timing duration-[1090ms] will-change-transform 
        w-fit">
        <div class="relative">THE</div>
        <div bind:this={titleScroll} style="transform: translate(136px,0px);"
            class="flex titleScroll-clip-path whitespace-pre absolute flex-col">
            {#each elvisTitles as title}
                <span>{title}</span>
            {/each}
        </div>
        </div>
        <span  bind:this={scrolls[2]} class="bg-text timing duration-[1050ms] will-change-transform 
        w-fit">PIGSLEY</span>
    </div>
</div>
<ColorWrapper progress={progress} titles={elvisTitles} bgColor={colorsList[0].bg} fontColor={colorsList[0].font}/>
<StartColorWrapper progress={progress} titles={elvisTitles} bgColor={colorsList[1].bg} fontColor={colorsList[1].font}/>
{:else}
<div id="main-bg-wrapper"
class="bg-[#1C243F] wrapper-transition text-[#ffd5c2] clip-path transition-all w-full h-full flex items-center absolute">
    <div style="transform: translateX(-171px); margin-left: 50%;" class="h-[200px] flex relative w-full mx-6 justify-center flex-col">
        <span  bind:this={scrolls[0]} class="bg-text  
        w-fit">ELVIS</span>
        <div  bind:this={scrolls[1]} class="bg-text flex relative flex-row
        w-fit">
        <div class="relative">THE</div>
        <div bind:this={titleScroll} style="transform: translate(136px,0px);"
            class="flex whitespace-pre absolute flex-col">
            <span>{` KING`}</span>
        </div>
        </div>
        <span  bind:this={scrolls[2]} class="bg-text w-fit">PIGSLEY</span>
    </div>
</div>
{/if}
