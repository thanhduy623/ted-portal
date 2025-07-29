<template>
  <footer>
    <div class="footer-left">
      <h2>ĐỘI TỔ CHỨC SỰ KIỆN<br>
      TRƯỜNG ĐẠI HỌC TÔN ĐỨC THẮNG</h2>
      <p>Địa chỉ: Phòng A003 - Đại học Tôn Đức Thắng <br>
      19 Nguyễn Hữu Thọ, Tân Phong, TP. Hồ Chí Minh</p>
    </div>

    <div class="footer-right">
      <div class="socials">
        <a
          v-for="(social, index) in socialLinks"
          :key="index"
          :href="social.url"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img :src="social.icon" :alt="social.name" />
        </a>
      </div>
      <p class="copyright">© 2025 Đội Tổ Chức Sự Kiện - TED</p>
      <p class="version">Phiên bản đang sử dụng {{ version }}</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
  data() {
    return {
      version: '1.0.0',
      socialLinks: [
        {
          name: 'Facebook',
          url: 'https://facebook.com',
          icon: 'https://img.icons8.com/ios-filled/24/ffffff/facebook--v1.png'
        },
        {
          name: 'Group',
          url: 'https://facebook.com/groups',
          icon: 'https://img.icons8.com/ios-filled/24/ffffff/groups.png'
        },
        {
          name: 'Instagram',
          url: 'https://instagram.com',
          icon: 'https://img.icons8.com/ios-filled/24/ffffff/instagram-new.png'
        },
        {
          name: 'Email',
          url: 'mailto:example@email.com',
          icon: 'https://img.icons8.com/ios-filled/24/ffffff/new-post.png'
        }
      ]
    }
  }
}
</script>

<style scoped>
footer {
  width: 100%;
  background-color: var(--theme-color-1);
  color: var(--theme-color-white);
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 20px;
  flex-wrap: wrap;
  gap: 20px;
}

.footer-left {
  max-width: 60%;
}

.footer-left h2 {
  color: var(--theme-color-white);
  font-size: var(--size-text-h2);
  line-height: 1.5;
}

.footer-left p {
  color: var(--theme-color-white);
  font-size: var(--size-text-normal);
}

.footer-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;
  text-align: right;
}

.socials a {
  margin: 0 6px;
  display: inline-block;
}

.socials img {
  width: 24px;
  height: 24px;
  transition: opacity 0.3s;
}

.socials img:hover {
  opacity: 0.7;
}

.footer-right p {
  margin: 6px 0 0;
  font-size: var(--size-text-small);
  color: var(--theme-color-white);
}
</style>
