<script lang="ts">

    import navigateEffect from "../navigate";
    export let to: string = "/"
    let className = '';
    export { className as class };

</script>
<button class="{className}" on:click={()=>navigateEffect(to)}><slot/></button>