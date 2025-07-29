<template>
    <form id="login-form">
        <img id="logo" src="@/assets/picture/logo.png" alt="">
        <h1>TED PORTAL</h1>
        <h3>CỔNG THÔNG TIN ĐỘI TỔ CHỨC SỰ KIỆN</h3>
        <br>

        <input type="text" placeholder="Mã số sinh viên">
        <input type="text" placeholder="Mật khẩu được cung cấp">

        <button>ĐĂNG NHẬP</button>
    </form>
</template>


<script>
    export default {
        name: "LoginView"
    }
</script>


<style>
    #login-form {
        width: 360px;

        display: block;
        align-items: center;
        text-align: center;
        background-color: rgba(128, 128, 128, 0.5);


        margin: auto;
        padding: 16px;
        border-radius: 16px;
        border: solid 3px var(--theme-color-1);
        box-shadow: 10px 10px 50px var(--theme-color-1);
    }

    #logo {
        height: 60px;
    }
</style>