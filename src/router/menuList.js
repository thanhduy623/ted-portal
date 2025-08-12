// src/data/menuList.js
export default [
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
        name: "Sự kiện",
        url: "/event",
        icon: "bi bi-calendar-event", // icon lịch
    },
    {
        name: "Đặc quyền",
        url: "/privilege",
        icon: "bi bi-key-fill", // icon chìa khóa
        permission: 'viewShift'
    },
    {
        name: "Thống kê",
        url: "/statistics",
        icon: "bi bi-graph-up", // icon biểu đồ
        permission: 'viewShift'
    },
    {
        name: "Hướng dẫn",
        url: "/introduction",
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
