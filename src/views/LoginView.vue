<template>
    <!-- Form có @submit.prevent để xử lý việc gửi form và ngăn tải lại trang -->
    <form id="login-form" @submit.prevent="login">
        <img id="logo" src="@/assets/picture/logo.png" alt="TED Portal Logo">
        <h1>TED PORTAL</h1>
        <h3>CỔNG THÔNG TIN ĐỘI TỔ CHỨC SỰ KIỆN</h3>
        <br>

        <input type="text" v-model="username" placeholder="Mã số sinh viên">
        <input type="password" v-model="password" placeholder="Mật khẩu được cung cấp">

        <button type="submit">ĐĂNG NHẬP</button>
    </form>
</template>


<script>
    import { connectGAS } from '@/utils/connectGAS.js'
    import { sessionSet, sessionGet } from '@/utils/sessionStore.js'

    export default {
        name: "LoginView",
        data() {
            return {
                username: '',
                password: '',
                loginError: null
            }
        },
        methods: {

            async login() {
                // Reset lỗi trước mỗi lần thử đăng nhập
                this.$eventBus.showLoading();

                const data = {
                    username: this.username,
                    password: this.password
                };

                const response = await connectGAS("login", data);
                this.$eventBus.hideLoading();

                if (!response.success) { return }

                // Lưu dữ liệu phiên đăng nhập
                sessionSet("user", response.user);
                sessionSet("token", response.token);
                sessionSet("masterData", response.masterData);

                this.$router.push('/');
            }
        }
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

    .error-message {
        color: red;
        font-weight: bold;
        font-style: italic;
        margin: 16px;
    }
</style>