// src/utils/connectGAS.js

/**
 * Gửi dữ liệu đến Google Apps Script (GAS) Web App.
 *
 * @param {string} token - Token xác thực hoặc mã định danh (nếu có).
 * @param {string} action - Hành động bạn muốn GAS thực hiện (ví dụ: 'saveData', 'getData').
 * @param {object} data - Dữ liệu chính bạn muốn gửi đến GAS.
 * @returns {Promise<object>} - Một Promise giải quyết bằng phản hồi JSON từ GAS.
 * @throws {Error} - Ném lỗi nếu yêu cầu không thành công hoặc phản hồi không hợp lệ.
 */
export async function connectGAS(token, action, data) {
    // URL của Google Apps Script Web App đã triển khai
    // Được đặt cứng ở đây để tập trung cấu hình
    const gasUrl = "https://script.google.com/macros/s/AKfycbzItlCAlaxpgnvZ3P6p5woOuesJD-po7PgpIB6anPUNCbZajQ7XlKQZaM4lnGqiWTB1Ng/exec";

    const dataToSend = {
        token: token,
        action: action,
        data: data, // Dữ liệu chính của bạn
        timestamp: new Date().toISOString() // Thêm timestamp tự động
    };

    try {
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
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        return result; // Trả về phản hồi JSON từ GAS
    } catch (error) {
        // Lỗi sẽ được ném lại để component gọi có thể xử lý và hiển thị trên UI.
        console.error('Lỗi khi kết nối GAS:', error);
        throw new Error(`Không thể kết nối GAS: ${error.message}`);
    }
}
