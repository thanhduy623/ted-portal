// src/utils/exportExcel.js
import * as XLSX from "xlsx/dist/xlsx.full.min.js";

/**
 * Xuất file Excel từ cấu hình cột và dữ liệu bảng
 * @param {Array} columnsConfig - [{ label, key }]
 * @param {Array} tablesConfig  - [{ key1: value1, key2: value2 }]
 * @param {String} fileName     - tên file Excel
 */
export function exportToExcel(columnsConfig, tablesConfig, fileName = "data.xlsx") {
    if (!columnsConfig?.length || !tablesConfig?.length) {
        console.warn("Không có dữ liệu để xuất Excel");
        return;
    }

    // Tạo tiêu đề từ label
    const headers = columnsConfig.map(col => col.label);

    // Lấy dữ liệu theo key
    const rows = tablesConfig.map(row =>
        columnsConfig.map(col => row[col.key] ?? "")
    );

    // Ghép header và rows
    const worksheetData = [headers, ...rows];

    // Tạo worksheet và workbook
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Bật xuống dòng trong cell nếu có \n
    Object.keys(worksheet).forEach(cell => {
        if (worksheet[cell] && typeof worksheet[cell].v === "string" && worksheet[cell].v.includes("\n")) {
            worksheet[cell].s = { alignment: { wrapText: true } };
        }
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Xuất file
    XLSX.writeFile(workbook, fileName);
}
