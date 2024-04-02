<script>
    import PigList from "./PigList.svelte";

</script>

<div class="bg-[#F6F6F2] w-full h-full flex flex-col overflow-y-scroll">
    <div class="p-8">
        <a href="/" class="flex logo-animation cursor-pointer logo flex-col">
            <span>ELVIS</span>
            <span>THE KING</span>
            <span>PIGSLEY</span>
        </a>
    </div>
    <div class="mx-auto mb-56 mt-44 whitespace-pre main-text flex flex-row">
        <span>King Is The Best</span>
    </div>
    <PigList/>
</div>

<style>
    .logo {
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
        white-space: pre-line;
        font-weight: bold;
        color: black;
        font-size: 28px;
        line-height: 26px;
        letter-spacing: 1.5px;
        font-family: "Fabrica Regular";
        position: relative;
        font-kerning: auto;
    }
    .main-text{
        white-space: pre-line;
        font-weight: bold;
        color: black;
        font-size: 78px;
        line-height: 76px;
        letter-spacing: 1.5px;
        font-family: "Fabrica Regular";
        position: relative;
        font-kerning: auto;
    }
    ::selection{
        background-color: black;
        color: white;
    }

</style>