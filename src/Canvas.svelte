<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import canvas3d from "./canvas3d"

    let canvas : HTMLElement;
    let cleanUp : Promise<() => void>;
    export let progress: number;
    export let showMenu;

    $:if(progress == 5){
        if(canvas){
            cleanUp = canvas3d(canvas);
        }
        }
    onMount(()=>{
        if(progress != 5){
            showMenu = false;
        }
    })
    onDestroy(async ()=>{
        (await cleanUp)()
    })
</script>

<canvas bind:this={canvas} id="c"></canvas>