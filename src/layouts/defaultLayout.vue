<!-- src/layouts/DefaultLayout.vue -->
<template>
    <div class="layout">
        <comp-header />

        <div class="container">
            <comp-navbar />
            <div class="main-content">
                <router-view />
            </div>
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
        }
    };
</script>

<style scoped>
    .container {
        display: flex;
        height: calc(100vh - 60px);
    }

    .main-content {
        flex: 1;
        overflow: auto;
        padding: 16px;
    }
</style>