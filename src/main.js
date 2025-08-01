import "@/assets/css/style.css"


import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Import các component UI toàn cục mà bạn vừa tạo
import GlobalLoader from '@/components/globalLoader.vue';
import GlobalNotification from '@/components/globalNotification.vue';
import GlobalConfirmDialog from '@/components/globalConfirmDialog.vue';

// Import Event Bus và Auth Store (đã tạo ở các bước trước)
import eventBus from '@/utils/eventBus';

const app = createApp(App)

// Đăng ký các component UI toàn cục.
// Sau khi đăng ký, bạn có thể sử dụng chúng trực tiếp trong bất kỳ template nào
// mà không cần import chúng vào từng component con.
app.component('GlobalLoader', GlobalLoader);
app.component('GlobalNotification', GlobalNotification);
app.component('GlobalConfirmDialog', GlobalConfirmDialog);


// Gán Event Bus và Auth Store vào globalProperties của ứng dụng.
// Điều này cho phép bạn truy cập chúng từ bất kỳ component nào bằng 'this.$eventBus' và 'this.$auth'.
app.config.globalProperties.$eventBus = eventBus;

app.use(router)

app.mount('#app')
