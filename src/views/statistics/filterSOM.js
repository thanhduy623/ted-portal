// filterSOM.js

export function filterSOM(context, shiftsData = [], organizationData = [], mistakesData = []) {
    let columnsConfig = [];
    let tablesConfig = [];

    switch (context) {
        case 0: // Tổng quát
            columnsConfig = [
                { label: 'MSSV', key: 'idTeddy' },
                { label: 'Họ tên', key: 'fullName' },
                { label: 'Ban tổ chức', key: 'totalOrganization' },
                { label: 'Tổng ca chạy', key: 'totalShifts' },
                { label: 'Tổng vi phạm', key: 'totalMistakes' },
            ];
            tablesConfig = normalizeData(shiftsData, mistakesData, organizationData);
            break;

        case 1: // Chi tiết
            columnsConfig = [
                { label: 'MSSV', key: 'idTeddy' },
                { label: 'Họ tên', key: 'fullName' },
                { label: 'Danh sách ca chạy', key: 'shiftList' },
                { label: 'Danh sách lỗi', key: 'mistakeList' },
            ];
            tablesConfig = normalizeData(shiftsData, mistakesData, organizationData);
            break;

        case 2: // Tính lỗi
            columnsConfig = [
                { label: 'Tên sự kiện', key: 'eventName' },
                { label: 'Họ tên', key: 'fullName' },
                { label: 'Ngày vi phạm', key: 'date' },
                { label: 'Lỗi vi phạm', key: 'nameMistake' },
            ];
            tablesConfig = mistakesData;
            break;

        case 3: // Ca chạy
            columnsConfig = [
                { label: 'Tên sự kiện', key: 'eventName' },
                { label: 'Họ tên', key: 'fullName' },
                { label: 'Ngày chạy', key: 'date' },
                { label: 'Số ca', key: 'numberShift' },
            ];
            tablesConfig = shiftsData;
            break;

        case 4: // Ban tổ chức
            columnsConfig = [
                { label: 'Tên sự kiện', key: 'eventName' },
                { label: 'Họ tên', key: 'fullName' },
                { label: 'Phân ban', key: 'organizationTeam' },
                { label: 'Vai trò', key: 'organizationPosition' },
            ];
            tablesConfig = organizationData;
            break;
    }

    return { columnsConfig, tablesConfig };
}

// Gom dữ liệu tổng hợp
function normalizeData(shiftsData, mistakesData, organizationData) {
    const uniqueTeddyIds = [
        ...new Set([
            ...shiftsData.map(s => s.idTeddy),
            ...mistakesData.map(m => m.idTeddy),
            ...organizationData.map(o => o.idTeddy)
        ])
    ];

    return uniqueTeddyIds.map(id => {
        const fullName =
            shiftsData.find(s => s.idTeddy === id)?.fullName ||
            mistakesData.find(m => m.idTeddy === id)?.fullName ||
            organizationData.find(o => o.idTeddy === id)?.fullName ||
            "";

        const teddyShifts = shiftsData.filter(s => s.idTeddy === id);
        const teddyMistakes = mistakesData.filter(m => m.idTeddy === id);
        const teddyOrgs = organizationData.filter(o => o.idTeddy === id);

        return {
            idTeddy: id,
            fullName,
            totalOrganization: teddyOrgs.length,
            totalShifts: teddyShifts.reduce((sum, s) => sum + (Number(s.numberShift) || 0), 0),
            totalMistakes: teddyMistakes.length,
            shiftList: teddyShifts.map(s => `[${s.date}] - [${s.eventName}] - [${s.numberShift}]`).join(",\n"),
            mistakeList: teddyMistakes.map(m => `[${m.date}] - [${m.eventName}] - [${m.nameMistake}]`).join(",\n"),
            organizationList: teddyOrgs.map(o => `[${o.date}] - [${o.eventName}] - [${o.organizationPosition}]`).join(",\n")
        };
    });
}
