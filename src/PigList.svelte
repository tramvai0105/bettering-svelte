<script>
    import PigInList from "./PigInList.svelte";
    import images from "./images/images";

</script>

<div class="list-grid w-full h-full">
    {#each images as image}
        <PigInList image={image}/>
    {/each}
</div>

<style>
    .list-grid{
        display: grid;
        gap: 3px;
        grid-template-columns: repeat(3, 1fr);
    }
</style>