<template>
  <div class="navbar">
    <RouterLink v-for="(item, index) in menuLists" :key="index" :to="item.url" class="url-menu">
      <div class="navbar-item">
        <img :src="item.icon" alt="icon" />
        <h2 class="menu-item-title">{{ item.name }}</h2>
      </div>
    </RouterLink>
  </div>
</template>


<script>
  import { mapState } from "vuex";
  import menuList from "../data/menuList.js";

  export default {
    name: "CompNavbar",
    data() {
      return {
        menuLists: menuList
      }
    }
  };
</script>


<style>
  .navbar {
    width: 250px;
    background: var(--theme-color-2);
  }

  .navbar-item {
    padding: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .navbar-item img {
    width: 32px;
    height: 32px;
  }

  .menu-item-title {
    color: var(--theme-color-white);
  }
</style>