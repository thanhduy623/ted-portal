<script setup>
  import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <RouterView />

  <!-- Các component UI toàn cục được teleport ra khỏi cây DOM của #app và đặt vào thẻ <body>.
       Điều này đảm bảo chúng luôn nằm trên cùng của DOM và không bị ảnh hưởng
       bởi CSS của các component cha hoặc các layout khác. -->
  <Teleport to="body">
    <GlobalLoader /> <!-- Component hiển thị hiệu ứng tải -->
    <GlobalNotification /> <!-- Component hiển thị thông báo (toast) -->
    <GlobalConfirmDialog /> <!-- Component hiển thị hộp thoại xác nhận -->
  </Teleport>
</template>