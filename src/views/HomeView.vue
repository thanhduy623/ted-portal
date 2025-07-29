<template>
  <div>
    <h1>Home1</h1>
    <button @click="sendDataToGAS">Gửi dữ liệu đến GAS</button>
    <p>Phản hồi từ GAS: {{ gasResponse }}</p>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        gasUrl: 'https://script.google.com/macros/s/AKfycbzItlCAlaxpgnvZ3P6p5woOuesJD-po7PgpIB6anPUNCbZajQ7XlKQZaM4lnGqiWTB1Ng/exec', // Dán URL đã sao chép ở trên vào đây
        gasResponse: null,
      };
    },
    methods: {
      async sendDataToGAS() {
        const dataToSend = {
          name: 'John Doe',
          email: 'john.doe@example.com',
          message: 'Xin chào từ frontend Vue!',
          timestamp: new Date().toISOString()
        };

        try {
          const response = await fetch(this.gasUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();
          this.gasResponse = result;
          console.log('Phản hồi từ GAS:', result);

        } catch (error) {
          console.error('Đã xảy ra lỗi khi gửi dữ liệu đến GAS:', error);
          this.gasResponse = { status: 'error', message: error.message };
        }
      },
    },
  };
</script>

<style scoped>
  /* Bạn có thể thêm CSS tại đây nếu muốn */
</style>