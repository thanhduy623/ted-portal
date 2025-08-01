// src/utils/eventBus.js
import { reactive } from 'vue';

// Tạo một đối tượng reactive để làm Event Bus.
// Reactive giúp Vue theo dõi các thay đổi trong 'listeners' và cập nhật nếu cần,
// mặc dù trong trường hợp này chủ yếu là để nó hoạt động như một singleton có thể import.
const eventBus = reactive({
    // 'listeners' là một đối tượng để lưu trữ các callback function cho mỗi loại sự kiện.
    // Ví dụ: { 'show-notification': [func1, func2], 'show-global-loading': [func3] }
    listeners: {},

    /**
     * Đăng ký một callback function để lắng nghe một sự kiện cụ thể.
     * @param {string} event - Tên của sự kiện.
     * @param {Function} callback - Hàm sẽ được gọi khi sự kiện được phát ra.
     */
    on(event, callback) {
        // Nếu chưa có listener nào cho sự kiện này, tạo một mảng rỗng.
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        // Thêm callback vào danh sách listeners của sự kiện đó.
        this.listeners[event].push(callback);
    },

    /**
     * Hủy đăng ký một callback function khỏi việc lắng nghe một sự kiện.
     * Quan trọng để tránh rò rỉ bộ nhớ, đặc biệt khi component bị hủy.
     * @param {string} event - Tên của sự kiện.
     * @param {Function} callback - Hàm đã đăng ký trước đó.
     */
    off(event, callback) {
        if (this.listeners[event]) {
            // Lọc bỏ callback khỏi danh sách.
            this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
        }
    },

    /**
     * Phát ra một sự kiện, gọi tất cả các callback đã đăng ký cho sự kiện đó.
     * @param {string} event - Tên của sự kiện.
     * @param {...any} args - Các đối số sẽ được truyền cho các callback.
     */
    emit(event, ...args) {
        if (this.listeners[event]) {
            // Duyệt qua tất cả các callback và gọi chúng với các đối số đã truyền.
            this.listeners[event].forEach(callback => {
                callback(...args);
            });
        }
    },

    // --- Các hàm tiện ích để đơn giản hóa việc gọi các UI toàn cục ---

    /**
     * Hiển thị một thông báo (toast).
     * Phát ra sự kiện 'show-notification' mà GlobalNotification.vue sẽ lắng nghe.
     * @param {string} type - Loại thông báo ('success', 'error', 'warning').
     * @param {string} message - Nội dung thông báo.
     * @param {number} duration - Thời gian hiển thị thông báo (ms).
     */
    notify(type, message, duration = 3000) {
        this.emit('show-notification', { type, message, duration });
    },

    /**
     * Hiển thị hiệu ứng tải toàn cục.
     * Phát ra sự kiện 'show-global-loading' mà GlobalLoader.vue sẽ lắng nghe.
     */
    showLoading() {
        this.emit('show-global-loading');
    },

    /**
     * Ẩn hiệu ứng tải toàn cục.
     * Phát ra sự kiện 'hide-global-loading' mà GlobalLoader.vue sẽ lắng nghe.
     */
    hideLoading() {
        this.emit('hide-global-loading');
    },

    /**
     * Hiển thị hộp thoại xác nhận và trả về một Promise.
     * Cho phép sử dụng async/await để chờ phản hồi từ người dùng.
     * Phát ra sự kiện 'show-confirm-dialog' mà GlobalConfirmDialog.vue sẽ lắng nghe.
     * @param {string} message - Nội dung xác nhận.
     * @param {string} [title='Xác nhận'] - Tiêu đề hộp thoại.
     * @param {string} [confirmText='Đồng ý'] - Văn bản nút xác nhận.
     * @param {string} [cancelText='Hủy'] - Văn bản nút hủy.
     * @return {Promise<boolean>} - Resolve true nếu đồng ý, false nếu hủy.
     */
    confirm(message, title = 'Xác nhận', confirmText = 'Đồng ý', cancelText = 'Hủy') {
        // Trả về một Promise để component gọi có thể dùng async/await
        return new Promise((resolve) => {
            this.emit('show-confirm-dialog', {
                message,
                title,
                confirmText,
                cancelText,
                // Truyền các hàm resolve/reject của Promise vào dialog
                // Dialog sẽ gọi chúng khi người dùng tương tác.
                onConfirm: () => resolve(true),
                onCancel: () => resolve(false),
            });
        });
    },
});

// Export eventBus để có thể import và sử dụng ở các component khác.
export default eventBus;
