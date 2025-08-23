// src/data/menuList.js
const baseUrl = import.meta.env.BASE_URL;


export default [
    {
        name: "Cá nhân",
        url: "/personal",
        icon: "bi bi-person", // icon chuông
    },
    {
        name: "Thông báo",
        url: "/anounce",
        icon: "bi bi-bell", // icon chuông
    },
    {
        name: "Nhân sự",
        url: "/teddy",
        icon: "bi bi-people-fill", // icon người
    },
    {
        name: "Dữ liệu",
        url: "/document",
        icon: "bi bi-file-earmark-zip", // icon lịch
    },
    {
        name: "Sự kiện",
        url: "/event",
        icon: "bi bi-calendar-event", // icon lịch
    },
    {
        name: "Đặc quyền",
        url: "/privilege",
        icon: "bi bi-incognito", // icon chìa khóa
        permission: 'viewShift'
    },
    {
        name: "Thống kê",
        url: "/statistics",
        icon: "bi bi-graph-up", // icon biểu đồ
        permission: 'viewShift'
    },
    {
        name: "Quản kho",
        url: "/warehouse",
        icon: "bi bi-shop-window", // icon biểu đồ
        permission: 'viewShift'
    },
    {
        name: "Hướng dẫn",
        url: baseUrl + "introduction.pdf",
        icon: "bi bi-book", // icon sách
        permission: 'viewShift'
    },
    {
        name: "Đăng xuất",
        url: "/login",
        icon: "bi bi-box-arrow-right", // icon logout
        permission: 'viewShift'
    }
];
