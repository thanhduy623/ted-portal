<template>
  <div class="notfound-container">
    <img src="https://www.myphukettravel.com/assets/front-end/images/404.gif" alt="Lost" class="error-gif" />
    <div class="error-text"></div>
    <router-link to="/" class="back-home">⬅ Quay lại trang chủ</router-link>
  </div>
</template>

<script setup>
</script>

<style scoped>
  .notfound-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    /* background: linear-gradient(135deg,
        var(--theme-color-3) 0%,
        var(--theme-color-3) 50%,
        var(--theme-color-5) 100%); */
    color: #fff;
    text-align: center;
    font-family: 'Poppins', sans-serif;
  }

  .error-text {
    font-size: 1.6rem;
    font-weight: 500;
    margin-bottom: 20px;
    color: white;
    padding: 10px 20px;
    border-radius: 8px;
  }

  .error-gif {
    width: 500px;
    max-width: 80%;
    height: auto;
    border-radius: 12px;
    margin-bottom: 25px;
    /* box-shadow: 0px 6px 18px rgba(0, 0, 0, 0.25); */
  }

  .back-home {
    background: var(--theme-color-2);
    color: #fff;
    padding: 12px 28px;
    border-radius: 30px;
    font-weight: bold;
    text-decoration: none;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  }

  .back-home:hover {
    background: var(--theme-color-4);
    transform: translateY(-2px);
  }
</style>