<template>
    <!-- Sử dụng Teleport để đảm bảo dialog luôn nằm trên cùng của DOM -->
    <Teleport to="body">
        <transition name="fade">
            <div v-if="isVisible" class="confirm-overlay">
                <div class="confirm-dialog">
                    <h3>{{ title }}</h3>
                    <p>{{ message }}</p>
                    <div class="confirm-actions">
                        <button @click="cancel" class="btn btn-cancel">{{ cancelText }}</button>
                        <button @click="confirm" class="btn btn-confirm">{{ confirmText }}</button>
                    </div>
                </div>
            </div>
        </transition>
    </Teleport>
</template>

<script>
    import eventBus from '@/utils/eventBus'; // Import eventBus để lắng nghe sự kiện

    export default {
        name: 'GlobalConfirmDialog',
        data() {
            return {
                isVisible: false, // Trạng thái hiển thị dialog
                title: '', // Tiêu đề của dialog
                message: '', // Nội dung của dialog
                confirmText: '', // Văn bản nút xác nhận
                cancelText: '', // Văn bản nút hủy
                onConfirmCallback: null, // Callback khi người dùng xác nhận
                onCancelCallback: null, // Callback khi người dùng hủy
            };
        },
        mounted() {
            // Đăng ký lắng nghe sự kiện 'show-confirm-dialog' từ eventBus
            eventBus.on('show-confirm-dialog', this.showDialog);
        },
        beforeUnmount() {
            // Hủy đăng ký lắng nghe sự kiện khi component bị unmount
            eventBus.off('show-confirm-dialog', this.showDialog);
        },
        methods: {
            // Phương thức để hiển thị dialog
            showDialog({ message, title, confirmText, cancelText, onConfirm, onCancel }) {
                this.message = message;
                this.title = title;
                this.confirmText = confirmText;
                this.cancelText = cancelText;
                this.onConfirmCallback = onConfirm; // Gán callback để giải quyết Promise
                this.onCancelCallback = onCancel;
                this.isVisible = true;
            },
            // Phương thức khi người dùng xác nhận
            confirm() {
                this.isVisible = false; // Ẩn dialog
                if (this.onConfirmCallback) {
                    this.onConfirmCallback(); // Gọi callback xác nhận
                }
            },
            // Phương thức khi người dùng hủy
            cancel() {
                this.isVisible = false; // Ẩn dialog
                if (this.onCancelCallback) {
                    this.onCancelCallback(); // Gọi callback hủy
                }
            },
        },
    };
</script>

<style scoped>
    /* Lớp phủ toàn màn hình cho dialog */
    .confirm-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.6);
        /* Nền mờ hơn */
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1001;
        /* Đảm bảo nằm trên loader và notification */
    }

    /* Kiểu dáng của hộp thoại xác nhận */
    .confirm-dialog {
        background-color: white;
        padding: 30px;
        border-radius: 12px;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.25);
        text-align: center;
        max-width: 400px;
        /* Chiều rộng tối đa */
        width: 90%;
        /* Chiếm 90% chiều rộng màn hình trên mobile */
        color: #343a40;
    }

    .confirm-dialog h3 {
        margin-top: 0;
        color: #007bff;
        font-size: 1.5rem;
        margin-bottom: 15px;
    }

    .confirm-dialog p {
        margin-bottom: 25px;
        font-size: 1rem;
        line-height: 1.5;
    }

    .confirm-actions {
        display: flex;
        /* Sử dụng flexbox cho các nút */
        justify-content: center;
        gap: 15px;
        /* Khoảng cách giữa các nút */
    }

    /* Kiểu dáng chung cho các nút */
    .btn {
        padding: 10px 20px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 1rem;
        font-weight: bold;
        transition: background-color 0.3s ease, transform 0.2s ease;
    }

    .btn-cancel {
        background-color: #6c757d;
        /* Màu xám */
        color: white;
    }

    .btn-cancel:hover {
        background-color: #5a6268;
        transform: translateY(-2px);
    }

    .btn-confirm {
        background-color: #007bff;
        /* Màu xanh dương */
        color: white;
    }

    .btn-confirm:hover {
        background-color: #0056b3;
        transform: translateY(-2px);
    }

    /* Transition styles (giống notification) */
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.3s ease;
    }

    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }
</style>