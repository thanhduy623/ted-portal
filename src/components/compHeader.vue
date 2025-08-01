<template>
    <header>
        <img id="ic-hambuger" @click="$emit('toggle-menu')" src="../assets/picture/ic-buger-menu.png" alt="">
        <div id="group-logo">
            <div id="group-title">
                <h1 id="title">TED TEAM PORTAL</h1>
                <h3 id="title">CỔNG THÔNG TIN ĐỘI TỔ CHỨC SỰ KIỆN</h3>
            </div>
            <img id="logo" src="@/assets/picture/logo.png" alt="">
        </div>
    </header>
</template>


<style>
    header {
        background-color: var(--theme-color-1);
        width: 100%;
        height: 65px;
        padding: 5px 10px;

        display: flex;
        align-items: center;
        gap: 10px;
    }

    #ic-hambuger {
        height: 36px;
        flex-shrink: 0;
    }

    #group-logo {
        display: flex;
        align-items: center;
        flex: 1;
        gap: 10px;
        overflow: hidden;
    }

    #group-title {
        display: inline;
        flex: 1;
    }

    #title {
        text-align: right;
        color: var(--theme-color-white);
        line-height: 1.2;
        flex: 1;
        white-space: normal;
        word-break: break-word;
        filter: drop-shadow(0 0 1px var(--theme-color-black));
    }

    #logo {
        height: 50px;
        flex-shrink: 0;
        filter: drop-shadow(0 0 1px var(--theme-color-black));
    }
</style>