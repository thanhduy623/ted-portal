/**
 * Sắp xếp mảng dữ liệu theo nhiều thuộc tính
 * @param {Array} data - Mảng dữ liệu cần sắp xếp
 * @param {Array<string>} keys - Danh sách các thuộc tính cần sắp xếp (theo thứ tự ưu tiên)
 * @param {string} [locale='vi'] - Ngôn ngữ sắp xếp (mặc định tiếng Việt)
 * @returns {Array} - Mảng đã sắp xếp
 */
export function sortData(data, keys, locale = 'vi') {
    if (!Array.isArray(data) || !Array.isArray(keys)) return data || [];

    return [...data].sort((a, b) => {
        for (let key of keys) {
            const valA = a?.[key] ?? '';
            const valB = b?.[key] ?? '';

            // So sánh số
            if (typeof valA === 'number' && typeof valB === 'number') {
                if (valA !== valB) return valA - valB;
            }
            // So sánh chuỗi
            else {
                const strA = String(valA);
                const strB = String(valB);
                const cmp = strA.localeCompare(strB, locale, { sensitivity: 'base' });
                if (cmp !== 0) return cmp;
            }
        }
        return 0; // Bằng nhau
    });
}


/**
 * Lọc mảng dữ liệu theo điều kiện
 * @param {Array} data - Mảng dữ liệu cần lọc
 * @param {Object} conditions - Các cặp key-value điều kiện lọc (phải khớp chính xác)
 * @returns {Array} - Mảng đã lọc
 */
export function filterData(data, conditions = {}) {
    if (!Array.isArray(data) || typeof conditions !== 'object') return data || [];

    return data.filter(item => {
        return Object.entries(conditions).every(([key, value]) => item?.[key] === value);
    });
}
