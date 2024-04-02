<script lang="ts">
    import navigateEffect from "../navigate";
    import acorn from "./acorn.svg"

    export let show: boolean;
</script>

{#if show}
    <div class="bg-[#1C243F] px-8 py-9 flex flex-col fixed top-[0] left-[0] right-[0] bottom-[0] z-40">
        <a href="/" class="flex logo-animation cursor-pointer logo flex-col">
            <span>ELVIS</span>
            <span>THE KING</span>
            <span>PIGSLEY</span>
        </a>
        <div class="flex pages items-center m-auto flex-col">
            <a href="/pigs" on:click={(e)=>{e.preventDefault();navigateEffect("pigs")}} class="page-animation page-effect cursor-pointer">Our Pigs</a>
            <a href="/pigs" on:click={(e)=>{e.preventDefault();navigateEffect("pigs")}} class="page-animation page-effect cursor-pointer">The Grand King</a>
            <a href="/pigs" on:click={(e)=>{e.preventDefault();navigateEffect("pigs")}} class="page-animation page-effect cursor-pointer">Blog</a>
        </div>
        <div class="mt-auto flex flex-row bottom">
            <div class="flex ml-[50%] gap-6 -translate-x-[50%] flex-row">
                <span class="faq-anim move-underline">FAQ</span>
                <span class="contact-anim move-underline">CONTACT</span>
                <span class="oink-anim move-underline">OINK</span>
            </div>
            <div class="ml-auto telega-anim move-underline">TELEGRAM</div>
        </div>
    </div>
{/if}

<style>
    .logo {
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
        white-space: pre-line;
        font-weight: bold;
        color: #ffd5c2;
        font-size: 26px;
        line-height: 24px;
        letter-spacing: 1.5px;
        font-family: "Fabrica Regular";
        position: relative;
        font-kerning: auto;
    }

    .logo-animation {
        animation: showlogo 550ms ease;
    }

    @keyframes showlogo{
        from{
            transform: translateY(30px);
            opacity: 0;
        }
        to{
            opacity: 1;
        }
    }

    .pages {
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
        white-space: pre-line;
        font-weight: bold;
        color: #ffd5c2;
        font-size: 76px;
        letter-spacing: 1.5px;
        font-family: "Fabrica Regular";
        position: relative;
        font-kerning: auto;
    }

    .page-effect::after{
        content: url(acorn.svg);
        display: flex;
        width: 76px;
        height: 76px;
        transform: rotate(0deg) translateX(0px);
        opacity: 0;
        transition-property: opacity, transform;
        transition-duration: 450ms;
        transition-timing-function: ease;
    }

    .page-effect:hover:after{
        content: url(acorn.svg);
        display: flex;
        width: 76px;
        height: 76px;
        transform: rotate(20deg) translateX(15px);
        opacity: 1;
    }

    .page-effect::before{
        content: url(acorn.svg);
        display: flex;
        width: 76px;
        height: 76px;
        transform: rotate(0deg) translateX(0px);
        opacity: 0;
        transition-property: opacity, transform;
        transition-duration: 450ms;
        transition-timing-function: ease;
    }

    .page-effect:hover:before{
        content: url(acorn.svg);
        display: flex;
        width: 76px;
        height: 76px;
        transform: rotate(-20deg) translateX(-15px);
        opacity: 1;
    }
    
    .page-animation {
        display: flex;
        flex-direction: row;
        animation: showpage 750ms ease 150ms;
        animation-fill-mode: both;
    }

    @keyframes showpage{
        from{
            transform: translateY(100%);
            clip-path: polygon(0% -100%, 100% -100%, 100% 0px, 0% 0px);
        }
        to{
            clip-path: polygon(-15px 0px, calc(100% + 15px) 0px, calc(100% + 15px) 100%, -15px 100%);
        }
    }

    .move-underline::before{
        content: " ";
        display: flex;
        position: absolute;
        left: 0;
        bottom: 0;
        height: 2px;
        width: 100%;
        transform: scaleX(0);
        background: #ffd5c2;
        animation: underline 350ms ease;
        animation-fill-mode: both;
        transition-property: transform;
        transition-duration: 500ms;
        transform-origin: 100% 50%;
    }

    .move-underline:hover::before{
        transform: scaleX(1);
        transform-origin: 0% 50%;
    }

    .faq-anim{
        animation: showpage 450ms ease 350ms;
        animation-fill-mode: both;
    }

    .contact-anim{
        animation: showpage 450ms ease 400ms;
        animation-fill-mode: both;
    }

    .oink-anim{
        animation: showpage 450ms ease 450ms;
        animation-fill-mode: both;
    }

    .telega-anim{
        animation: showpage 450ms ease 500ms;
        animation-fill-mode: both;
    }

    .bottom {
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
        white-space: pre-line;
        font-weight: bold;
        color: #ffd5c2;
        font-size: 14px;
        letter-spacing: 1.5px;
        font-family: "Fabrica Regular";
        position: relative;
        font-kerning: auto;
    }
</style>