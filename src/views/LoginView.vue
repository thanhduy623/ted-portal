<template>
    <!-- Form có @submit.prevent để xử lý việc gửi form và ngăn tải lại trang -->
    <form id="login-form" @submit.prevent="login">
        <img id="logo" src="@/assets/picture/logo.png" alt="TED Portal Logo">
        <h1>TED PORTAL</h1>
        <h3>CỔNG THÔNG TIN ĐỘI TỔ CHỨC SỰ KIỆN</h3>
        <br>

        <input type="text" v-model="username" placeholder="Mã số sinh viên">
        <input type="password" v-model="password" placeholder="Mật khẩu được cung cấp">

        <p v-if="loginError" class="error-message">{{ loginError }}</p>

        <button type="submit">ĐĂNG NHẬP</button>
    </form>
</template>


<script>
    import { connectGAS } from '@/utils/connectGAS.js'

    export default {
        name: "LoginView",
        data() {
            return {
                username: '',
                password: '',
                loginError: null // Thuộc tính để lưu trữ thông báo lỗi đăng nhập
            }
        },
        methods: {
            async login() {
                // Reset lỗi trước mỗi lần thử đăng nhập
                this.loginError = null;

                const data = {
                    username: this.username,
                    password: this.password
                };

                try {
                    const response = await connectGAS(null, "login", data);
                    if (response.success) {
                        sessionStorage.setItem("tokenAccess", response.accessToken);
                        sessionStorage.setItem("user", JSON.stringify(response.user));

                        this.$router.push('/');
                    } else {
                        // Hiển thị thông báo lỗi từ GAS
                        this.loginError = response.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
                    }
                } catch (error) {
                    // Bắt và hiển thị lỗi nếu có vấn đề khi kết nối GAS
                    this.loginError = error.message || 'Có lỗi xảy ra khi kết nối. Vui lòng kiểm tra mạng.';
                    console.error('Lỗi đăng nhập:', error);
                }
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