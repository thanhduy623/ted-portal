<!-- src/layouts/AuthLayout.vue -->
<template>
    <div class="auth-layout">
        <router-view />
    </div>
</template>

<script>
    export default {
        name: "AuthLayout",
    };
</script>


<style>
    .auth-layout {
        width: 100%;
        height: 100%;
        display: flex;

        background-color: var(--theme-color-gray);
        background-image: url("../assets/picture/bg-login.jpg");
        background-repeat: unset;
        background-repeat: no-repeat;
        background-position: center bottom;
        background-size: cover;
    }
</style>