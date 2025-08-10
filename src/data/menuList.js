// src/data/menuList.js

// Import các hình ảnh bạn cần
import IconTeddy from '@/assets/picture/ic-menu-teddy.png';
// Nếu có các icon khác, bạn sẽ import chúng tương tự:
// import IconEvent from '@/assets/picture/ic-menu-event.png';

export default [
    {
        name: "Thông báo",
        url: "/",
        icon: IconTeddy,
    },
    {
        name: "Nhân sự",
        url: "/teddy",
        icon: IconTeddy,
    },
    {
        name: "Sự kiện",
        url: "/event",
        icon: IconTeddy,
    },
    {
        name: "Sự kiện",
        url: "/",
        icon: IconTeddy,
    },
    {
        name: "Ca chạy",
        url: "/shift",
        icon: IconTeddy,
        permission: 'viewShift'
    },
    {
        name: "Vi phạm",
        url: "/mistake",
        icon: IconTeddy,
        permission: 'viewMistake'
    },
    {
        name: "Đặc quyền",
        url: "/",
        icon: IconTeddy,
        permission: 'viewShift'
    },
    {
        name: "Đăng xuất",
        url: "/login",
        icon: IconTeddy,
        permission: 'viewShift'
    }
];