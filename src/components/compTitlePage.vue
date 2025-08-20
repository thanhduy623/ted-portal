<template>
    <div class="group-title">
        <h1 class="title"> {{titlePage.toUpperCase()}} </h1>

        <div class="group-button">
            <!-- Render các nút từ actionsPage -->
            <template v-for="(btn, index) in actionsPage" :key="index">
                <button v-if="btn && (btn.show === undefined || btn.show)" @click="btn.action && btn.action()">
                    <i :class="btn.icon"></i>
                    <span>{{ btn.name }}</span>
                </button>
            </template>


            <!-- Button Làm mới dữ liệu nền -->
            <button @click="loadMasterData()">
                <i class="bi bi-cloud-plus"></i>
                <span>Làm mới</span>
            </button>
        </div>
    </div>
</template>


<script>
    import { loadMasterData } from '@/utils/sessionStore.js'

    export default {
        props: {
            titlePage: {
                type: String,
                default: "Tiêu đề mặc định"
            },
            actionsPage: {
                type: Array,
                default: () => []
            }
        },

        methods: {
            loadMasterData() {
                loadMasterData();
            }
        },
    }
</script>

<style>
    .group-title {
        position: sticky;
        top: 0;
        z-index: 100;
        background-color: var(--theme-color-bg);

        display: flex;
        align-items: center;
        margin-bottom: 16px;
        gap: 10px;
    }

    .group-title .title {
        flex: 1;
    }

    .group-title .group-button {
        display: flex;
        gap: 10px;
    }

    .group-title .group-button button {
        margin-bottom: 0;
    }
</style>