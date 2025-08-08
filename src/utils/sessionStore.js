// sessionStore.js
import router from '@/router';
import { connectGAS } from './connectGAS';


/**
 * Lưu dữ liệu vào sessionStorage
 * @param {string} key - Tên biến cần lưu
 * @param {*} value - Dữ liệu cần lưu (object, string, number, ...)
 */
export function sessionSet(key, value) {
    try {
        const data = typeof value === 'string' ? value : JSON.stringify(value);
        sessionStorage.setItem(key, data);
    } catch (error) {
        console.error(`sessionSet error for key "${key}":`, error);
    }
}

/**
 * Lấy dữ liệu từ sessionStorage
 * @param {string} key - Tên biến cần lấy
 * @returns {*} Dữ liệu đã lưu (object nếu là JSON, hoặc string)
 */
export function sessionGet(key) {
    try {
        const data = sessionStorage.getItem(key);
        if (data === null) return null;

        // Thử parse JSON nếu có thể, nếu lỗi thì trả về string
        try {
            return JSON.parse(data);
        } catch (e) {
            return data;
        }
    } catch (error) {
        console.error(`sessionGet error for key "${key}":`, error);
        return null;
    }
}


export async function loadMasterData() {
    const response = await connectGAS("getMasterData", null)
    sessionSet("masterData", response.data);
    router.go(0);
    return
}