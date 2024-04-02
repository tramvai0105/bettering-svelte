<script lang="ts">
    import MenuToolbar from "./MenuToolbar.svelte"
    import MenuStage from "./MenuStage.svelte"
    import { mask } from "../stores";

    export let showMenu: boolean;
    let show = false;
    let value = 0;

    mask.subscribe((m) => value = m);

    $:{
        if(value == 1 && show){
            setTimeout(()=>{
                show = false;
            }, 900)
        }
    }
</script>

{#if (showMenu)}
<div class="relative">
    <MenuToolbar bind:show/>
    <MenuStage show={show}/>
</div>
{/if}