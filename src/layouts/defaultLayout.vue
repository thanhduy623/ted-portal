<!-- src/layouts/DefaultLayout.vue -->
<template>
    <div class="layout">
        <comp-header :is-visible="showMenu" @toggle-menu="showMenu = !showMenu" />


        <div class="container">
            <comp-navbar v-if="showMenu" />
            <div class="main-content"> <router-view /> </div>
        </div>
    </div>
</template>

<script>
    import compHeader from "@/components/CompHeader.vue";
    import compNavbar from "@/components/CompNavbar.vue";

    export default {
        name: "DefaultLayout",
        components: {
            compHeader,
            compNavbar
        },
        data() {
            return {
                showMenu: true,
            }
        },
    };
</script>

<style scoped>
    .container {
        display: flex;
        height: calc(100vh - 65px);
    }

    .main-content {
        flex: 1;
        overflow: auto;
        padding: 16px;
    }
</style>