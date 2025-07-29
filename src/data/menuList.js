// src/data/menuList.js

// Import các hình ảnh bạn cần
import IconTeddy from '@/assets/picture/ic-menu-teddy.png';
// Nếu có các icon khác, bạn sẽ import chúng tương tự:
// import IconEvent from '@/assets/picture/ic-menu-event.png';

export default [
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
        name: "Ghi nhận lỗi",
        url: "/mistake",
        icon: IconTeddy,
        permission: 'viewMistake'
    },
    {
        name: "Ghi ca chạy",
        url: "/shift",
        icon: IconTeddy,
        permission: 'viewShift'
    }
];