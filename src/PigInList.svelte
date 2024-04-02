<script lang="ts">
    export let image: string
</script>

<div>
    <img class="image" src={image} alt="pig"/>
</div>

<style>
    .image{
        aspect-ratio: 1 / 1;
        object-fit: cover;  
    }
</style>