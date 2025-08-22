<template>
  <div class="navbar">
    <template v-for="(item, index) in menuLists" :key="index">
      <!-- Nếu là PDF hoặc link ngoài -->
      <a v-if="item.url.endsWith('.pdf') || item.url.startsWith('http')" :href="item.url" target="_blank" rel="noopener"
        class="url-menu">
        <div class="navbar-item">
          <i :class="item.icon"></i>
          <h2 class="menu-item-title">{{ item.name }}</h2>
        </div>
      </a>

      <!-- Nếu là route trong Vue Router -->
      <RouterLink v-else :to="item.url" class="url-menu">
        <div class="navbar-item">
          <i :class="item.icon"></i>
          <h2 class="menu-item-title">{{ item.name }}</h2>
        </div>
      </RouterLink>
    </template>
  </div>
</template>




<script>
  import { mapState } from "vuex";
  import menuList from "@/router/menuList.js";

  export default {
    name: "CompNavbar",
    data() {
      return {
        menuLists: menuList
      }
    }
  };
</script>


<style scoped>
  .navbar {
    width: 250px;
    background: var(--theme-color-2);
  }

  .navbar-item {
    padding: 10px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .navbar-item i {
    font-size: 24px;
    color: white;
  }

  .menu-item-title {
    color: var(--theme-color-white);
  }
</style>