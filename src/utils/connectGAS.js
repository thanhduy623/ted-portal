// src/utils/connectGAS.js
import eventBus from '@/utils/eventBus.js'
import router from '@/router';
import { sessionSet, sessionGet } from '@/utils/sessionStore';


/**
 * Gửi dữ liệu đến Google Apps Script (GAS) Web App.
 *
 * @param {string} action - Hành động bạn muốn GAS thực hiện (ví dụ: 'saveData', 'getData').
 * @param {object} data - Dữ liệu chính bạn muốn gửi đến GAS.
 * @returns {Promise<object>} - Một Promise giải quyết bằng phản hồi JSON từ GAS.
 * @throws {Error} - Ném lỗi nếu yêu cầu không thành công hoặc phản hồi không hợp lệ.
 */
export async function connectGAS(action, data, banned = true) {
    // URL của Google Apps Script Web App đã triển khai
    // Được đặt cứng ở đây để tập trung cấu hình
    console.clear()
    const gasUrl = "https://script.google.com/macros/s/AKfycbzItlCAlaxpgnvZ3P6p5woOuesJD-po7PgpIB6anPUNCbZajQ7XlKQZaM4lnGqiWTB1Ng/exec";
    const token = sessionGet('token');

    const dataToSend = {
        token: token,
        action: action,
        data: data, // Dữ liệu chính của bạn
        timestamp: new Date().toISOString() // Thêm timestamp tự động
    };

    try {
        banned ? eventBus.showLoading() : eventBus.notify("success", "Đang kết nối dữ liệu");

        const response = await fetch(gasUrl, {
            method: 'POST',
            // Sử dụng 'text/plain' để tránh lỗi CORS do yêu cầu preflight OPTIONS
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            },
            // Chuyển đổi toàn bộ đối tượng dataToSend thành chuỗi JSON
            body: JSON.stringify(dataToSend),
            redirect: 'follow', // Theo dõi các chuyển hướng nếu có
        });

        if (!response.ok) {
            const errorText = await response.text();
            eventBus.notify("error", errorText);
            console.error(response.message);
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        eventBus.hideLoading();
        const result = await response.json();
        eventBus.notify(result.status, result.message);
        console.log(result)

        if (result.message == "Token đã hết hạn" || result.message == "Thiếu token. Yêu cầu xác thực.") {
            router.push("/login");
        }

        return result;
    } catch (error) {
        console.error('Lỗi khi kết nối GAS:', error);
        eventBus.notify("error", 'Lỗi khi kết nối dữ liệu');
        throw new Error(`Không thể kết nối GAS: ${error.message}`);
    }
}
