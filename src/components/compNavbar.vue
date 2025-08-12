<template>
  <div class="navbar">
    <RouterLink v-for="(item, index) in menuLists" :key="index" :to="item.url" class="url-menu">
      <div class="navbar-item">
        <i :class="item.icon"></i> <!-- dùng class icon bootstrap -->
        <h2 class="menu-item-title">{{ item.name }}</h2>
      </div>
    </RouterLink>
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