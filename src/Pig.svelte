<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import navigateEffect from "./navigate";
    import { mask } from "./stores";
    import ButtonLink from "./ui/ButtonLink.svelte";

    export let id: string;
    console.log(id)
</script>

<div class="bg-yellow-300 flex items-center h-[100vh] justify-center text-[102px] text-purple-500 w-full ">
    <ButtonLink to="/">{id}</ButtonLink>
</div>