<script lang="ts">
    import Canvas from "./background/Canvas.svelte";
    import Background from "./background/Background.svelte";
    import { Router, Route } from "svelte-routing";
    import "./app.css";
    import { timeWrap } from "./lib/intro";
    import { onMount } from "svelte";
    import Menu from "./menu/Menu.svelte";
    import Pig from "./Pig.svelte";
    import Mask from "./Mask.svelte";
    import { mask } from "./stores";
    import Pigs from "./Pigs.svelte";
    let progress = 0;

    async function intro() {
        await timeWrap(
            () => {
                progress = 1;
            },
            250,
            1100,
        );
        await timeWrap(
            () => {
                progress = 2;
            },
            0,
            1000,
        );
        await timeWrap(
            () => {
                progress = 3;
            },
            0,
            1000,
        );
        await timeWrap(
            () => {
                progress = 4;
            },
            0,
            1090,
        );
        await timeWrap(
            () => {
                progress = 5;
                showMenu = true;
            },
            0,
            0,
        );
    }

    onMount(() => {
        // window.addEventListener("popstate", (e) => {
        //     console.log(window.history);
        // });
        intro();
    });

    let showMenu: boolean = true;
</script>

<div class="container-class relative overflow-hidden">
    <Router let:location delayFn={()=>mask.set(1)} duration={900}>
        <Mask />
        <Menu location={location} {showMenu} />
        <Route path="*">
            <Canvas bind:showMenu {progress} />
            <Background {progress} />
        </Route>
        <Route let:params path="/pigs/:id">
            <!-- svelte-ignore missing-declaration -->
            <Pig id={params.id}/>
        </Route>
        <Route path="/pigs">
            <Pigs />
        </Route>
    </Router>
</div>

<style lang="postcss">
</style>
