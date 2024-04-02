<script lang="ts">
    export let show: boolean;
</script>

<div class="absolute z-50 right-[42px] py-[42px]">
    <button on:click={()=>show = !show} class="bg-white toolbar gap-2 overflow-hidden select-none text-[18px] drop-shadow-md h-[34px] flex items-center font-medium px-3 rounded-full">
        <div class="transition flex flex-col">
            <span>MENU</span>
            <span>MENU</span>
        </div>
        <div class="relative sticks w-[22px]">
            <div class="stick-one {show ? "stick-one-show" : "stick-one-unshow"}"></div>
            <div class="stick-two {show ? "stick-two-show" : "stick-two-unshow"}"></div>
        </div>
    </button>
</div>

<style>
    .stick-one-show{
        transform: rotate(45deg) translateY(2px);
    }
    .stick-one-unshow{
        transform: translateY(-2px);
    }
    .stick-one{
        width: 100%;
        height: 3px;
        background: black;
        transition-property: transform;
        transition-duration: 400ms;
    }
    .stick-two-show{
        transform: rotate(-45deg) translateY(-2px);
    }
    .stick-two-unshow{
        transform: translateY(2px);
    }
    .stick-two{
        width: 100%;
        height: 3px;
        background: black;
        transition-property: transform;
        transition-duration: 500ms;
    }
    .transition{
        transform: translateY(13px);
        transition-property: transform, clip-path;
        transition-duration: 500ms;
    }
    .toolbar:hover > .transition{
        transform: translateY(-13px);
    }
</style>