<template>
  <div>
    <h1>Gửi dữ liệu đến GAS từ GitHub Pages</h1>
    <button @click="sendDataToGAS">Gửi dữ liệu qua CORS bypass</button>

    <div v-if="gasResponse">
      <p>Phản hồi từ GAS:</p>
      <pre>{{ JSON.stringify(gasResponse, null, 2) }}</pre>
    </div>

    <p v-if="gasError">Lỗi: {{ gasError }}</p>
  </div>
</template>

<script>
  // Import hàm connectGAS từ file bạn đã tạo
  // Đảm bảo đường dẫn này đúng với vị trí file connectGAS.js của bạn
  // Ví dụ: nếu connectGAS.js nằm trong src/utils, thì đường dẫn là '@/utils/connectGAS'
  import { connectGAS } from '@/utils/connectGAS';

  export default {
    data() {
      return {
        gasResponse: null, // Để lưu trữ phản hồi thành công từ GAS
        gasError: null,    // Để lưu trữ thông báo lỗi nếu có
      };
    },
    methods: {
      /**
       * Gửi dữ liệu mẫu đến Google Apps Script bằng hàm connectGAS.
       */
      async sendDataToGAS() {
        // Dữ liệu mẫu bạn muốn gửi
        const myToken = 'YOUR_SECURE_TOKEN_OR_API_KEY'; // Thay thế bằng token thực tế của bạn
        const myAction = 'saveUser'; // Hành động bạn muốn GAS thực hiện (ví dụ: 'saveUser', 'getData', 'deleteItem')
        const myData = {
          name: 'Jane Doe',
          email: 'jane.doe@example.com',
          user_id: 'unique_id_456'
        };

        // Reset trạng thái phản hồi và lỗi trước mỗi lần gửi
        this.gasResponse = null;
        this.gasError = null;

        try {
          // Gọi hàm connectGAS và chờ kết quả
          const result = await connectGAS(myToken, myAction, myData);

          // Cập nhật trạng thái phản hồi nếu thành công
          this.gasResponse = result;
          console.log('Phản hồi từ GAS:', result);

        } catch (error) {
          // Bắt và hiển thị lỗi nếu connectGAS ném lỗi
          this.gasError = error.message;
          console.error('Đã xảy ra lỗi khi gửi dữ liệu đến GAS:', error);
        }
      },
    },
  };
</script>