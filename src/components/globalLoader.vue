<template>
    <!-- Sử dụng Teleport để đảm bảo loader luôn nằm trên cùng của DOM -->
    <Teleport to="body">
        <transition name="fade">
            <div v-if="isLoading" class="global-loader-overlay">
                <div class="spinner"></div>
            </div>
        </transition>
    </Teleport>
</template>

<script>
    import eventBus from '@/utils/eventBus'; // Import eventBus để lắng nghe sự kiện

    export default {
        name: 'GlobalLoader',
        data() {
            return {
                isLoading: false, // Trạng thái hiển thị loader
            };
        },
        mounted() {
            // Đăng ký lắng nghe các sự kiện từ eventBus khi component được mount
            eventBus.on('show-global-loading', this.showLoader);
            eventBus.on('hide-global-loading', this.hideLoader);
        },
        beforeUnmount() {
            // Hủy đăng ký lắng nghe sự kiện khi component bị unmount để tránh rò rỉ bộ nhớ
            eventBus.off('show-global-loading', this.showLoader);
            eventBus.off('hide-global-loading', this.hideLoader);
        },
        methods: {
            // Phương thức để hiển thị loader
            showLoader() {
                this.isLoading = true;
            },
            // Phương thức để ẩn loader
            hideLoader() {
                this.isLoading = false;
            },
        },
    };
</script>

<style scoped>
    /* Lớp phủ toàn màn hình cho loader */
    .global-loader-overlay {
        position: fixed;
        /* Cố định trên màn hình */
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        /* Nền mờ */
        display: flex;
        /* Sử dụng flexbox để căn giữa spinner */
        justify-content: center;
        align-items: center;
        z-index: 999;
        /* Đảm bảo nằm trên hầu hết các phần tử khác */
    }

    /* Kiểu dáng của spinner */
    .spinner {
        border: 8px solid #f3f3f3;
        /* Màu xám nhạt cho phần nền */
        border-top: 8px solid #007bff;
        /* Màu xanh dương cho phần quay */
        border-radius: 50%;
        /* Tạo hình tròn */
        width: 60px;
        height: 60px;
        animation: spin 1s linear infinite;
        /* Áp dụng animation quay */
    }

    /* Keyframes cho animation quay */
    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }

        100% {
            transform: rotate(360deg);
        }
    }

    /* Transition cho hiệu ứng mờ dần khi xuất hiện/biến mất */
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.5s;
    }

    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }

    .fade-enter-to,
    .fade-leave-from {
        opacity: 1;
    }
</style>