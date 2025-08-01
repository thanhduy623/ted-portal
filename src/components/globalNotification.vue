<template>
    <!-- Sử dụng Teleport để đảm bảo container thông báo luôn nằm trên cùng của DOM -->
    <Teleport to="body">
        <!-- transition-group để xử lý hiệu ứng chuyển động khi thêm/xóa/di chuyển các phần tử trong danh sách -->
        <transition-group name="notification-stack" tag="div" class="notification-container">
            <!-- Vòng lặp qua mảng notifications để hiển thị từng thông báo -->
            <div v-for="notification in notifications" :key="notification.id"
                :class="['notification', notification.type]" :style="{ bottom: notification.position + 'px' }">
                {{ notification.message }}
            </div>
        </transition-group>
    </Teleport>
</template>

<script>
    import eventBus from '@/utils/eventBus'; // Import eventBus để lắng nghe sự kiện

    export default {
        name: 'GlobalNotification',
        data() {
            return {
                notifications: [], // Mảng chứa tất cả thông báo đang hiển thị
                nextId: 0, // Biến đếm để tạo ID duy nhất cho mỗi thông báo
                notificationHeight: 60, // Chiều cao ước tính của một thông báo (bao gồm padding)
                notificationMargin: 10, // Khoảng cách giữa các thông báo khi xếp chồng
            };
        },
        mounted() {
            // Đăng ký lắng nghe sự kiện 'show-notification' từ eventBus khi component được mount
            eventBus.on('show-notification', this.showNotification);
        },
        beforeUnmount() {
            // Hủy đăng ký lắng nghe sự kiện khi component bị unmount
            eventBus.off('show-notification', this.showNotification);
            // Xóa tất cả các timeout đang chạy để tránh rò rỉ bộ nhớ
            this.notifications.forEach(n => {
                if (n.timeoutId) clearTimeout(n.timeoutId);
            });
        },
        methods: {
            /**
             * Phương thức để hiển thị một thông báo mới.
             * Được gọi khi sự kiện 'show-notification' được phát ra từ eventBus.
             * @param {Object} payload - Đối tượng chứa thông tin thông báo.
             * @param {string} payload.type - Loại thông báo ('success', 'error', 'warning').
             * @param {string} payload.message - Nội dung thông báo.
             * @param {number} payload.duration - Thời gian hiển thị thông báo (ms).
             */
            showNotification({ type, message, duration }) {
                const id = this.nextId++; // Tạo ID duy nhất cho thông báo mới

                const newNotification = {
                    id,
                    type,
                    message,
                    position: 0, // Vị trí ban đầu, sẽ được tính toán lại sau
                    timeoutId: null, // ID của setTimeout riêng cho thông báo này
                };

                this.notifications.push(newNotification); // Thêm thông báo mới vào mảng

                // Tính toán lại vị trí cho tất cả các thông báo để chúng xếp chồng đúng cách
                this.recalculatePositions();

                // Thiết lập timeout để tự động ẩn thông báo sau một khoảng thời gian
                newNotification.timeoutId = setTimeout(() => {
                    this.removeNotification(id); // Gọi hàm xóa thông báo theo ID
                }, duration);
            },

            /**
             * Xóa một thông báo khỏi danh sách dựa trên ID của nó.
             * @param {number} id - ID của thông báo cần xóa.
             */
            removeNotification(id) {
                // Lọc bỏ thông báo có ID tương ứng khỏi mảng
                this.notifications = this.notifications.filter(n => n.id !== id);
                // Tính toán lại vị trí cho các thông báo còn lại sau khi xóa
                this.recalculatePositions();
            },

            /**
             * Tính toán lại vị trí 'bottom' cho tất cả các thông báo trong danh sách.
             * Đảm bảo chúng xếp chồng lên nhau một cách chính xác.
             */
            recalculatePositions() {
                // Sắp xếp theo ID để đảm bảo thứ tự hiển thị nhất quán (thông báo mới hơn ở trên)
                this.notifications.sort((a, b) => a.id - b.id);

                // Duyệt qua từng thông báo và tính toán vị trí 'bottom' của nó
                this.notifications.forEach((notification, index) => {
                    // Vị trí = Khoảng cách ban đầu từ đáy + (Chỉ số * (Chiều cao thông báo + Khoảng cách giữa các thông báo))
                    notification.position = 20 + (index * (this.notificationHeight + this.notificationMargin));
                });
            }
        },
    };
</script>

<style scoped>
    /* Container cho các thông báo xếp chồng */
    .notification-container {
        position: fixed;
        /* Cố định trên màn hình */
        bottom: 0;
        /* Neo container vào lề dưới */
        right: 20px;
        /* Cách lề phải 20px */
        /* Sử dụng flexbox để quản lý vị trí các thông báo bên trong */
        display: flex;
        flex-direction: column;
        /* Xếp chồng theo cột */
        align-items: flex-end;
        /* Căn chỉnh các thông báo sang phải trong container */
        pointer-events: none;
        /* Cho phép click xuyên qua container để tương tác với nội dung bên dưới */
        z-index: 1000;
        /* Đảm bảo nằm trên hầu hết các phần tử khác */
        /* Để transition-group hoạt động mượt mà khi các item di chuyển */
        height: 100%;
        /* Đảm bảo container có đủ chiều cao để các thông báo xếp chồng */
        justify-content: flex-end;
        /* Đẩy các thông báo xuống dưới cùng của container */
        gap: 10px;
        /* Khoảng cách giữa các thông báo (có thể dùng margin thay cho gap) */
    }

    /* Kiểu dáng chung cho từng thông báo */
    .notification {
        position: absolute;
        /* Vị trí tuyệt đối trong container */
        right: 0;
        /* Căn chỉnh sang phải trong container */
        padding: 15px 25px;
        border-radius: 8px;
        color: white;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        /* Transition cho thuộc tính 'bottom' để thông báo di chuyển mượt mà khi xếp chồng */
        transition: bottom 0.5s ease-in-out, opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
        pointer-events: auto;
        /* Kích hoạt lại sự kiện click cho chính thông báo */
        width: 300px;
        /* Giới hạn chiều rộng tối đa */
        min-height: 50px;
        /* Chiều cao tối thiểu để đảm bảo tính nhất quán */
        box-sizing: border-box;
        /* Đảm bảo padding được tính vào chiều rộng/cao tổng thể */
    }

    /* Màu nền cho các loại thông báo */
    .notification.success {
        background-color: var(--theme-color-success);
        /* Màu xanh lá cây cho thành công */
    }

    .notification.error {
        background-color: var(--theme-color-error);
        /* Màu đỏ cho lỗi */
    }

    .notification.warning {
        background-color: var(--theme-color-warning);
        /* Màu vàng cho cảnh báo */
        /* Đổi màu chữ cho dễ đọc trên nền vàng */
    }

    /* Transition styles cho việc thêm/xóa thông báo khỏi danh sách */
    /* Các class này được Vue tự động thêm khi sử dụng transition-group */
    .notification-stack-enter-active,
    .notification-stack-leave-active {
        transition: all 0.5s ease;
        /* Hiệu ứng chung cho việc vào/ra */
    }

    .notification-stack-enter-from,
    .notification-stack-leave-to {
        opacity: 0;
        /* Bắt đầu/kết thúc với độ trong suốt 0 */
        transform: translateX(100%);
        /* Trượt vào/ra từ bên phải (ngoài màn hình) */
    }

    /* Class này được áp dụng khi các phần tử trong danh sách di chuyển vị trí */
    .notification-stack-move {
        transition: transform 0.5s ease;
        /* Hiệu ứng mượt mà khi thông báo dịch chuyển lên/xuống */
    }
</style>