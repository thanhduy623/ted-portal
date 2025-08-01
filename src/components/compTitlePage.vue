<template>
    <div class="group-title">
        <h1 class="title"> {{titlePage.toUpperCase()}} </h1>

        <div class="group-button">
            <!-- Button Chuyển trang tạo -->
            <RouterLink v-if="linkCreatePage" :to="linkCreatePage">
                <button>
                    <i class="bi bi-plus-lg"></i>
                    <span>Thêm mới</span>
                </button>
            </RouterLink>

            <!-- Button hiển thị SearchBox -->
            <button>
                <i class="bi bi-search"></i>
                <span>Tìm kiếm</span>
            </button>
        </div>
    </div>
</template>


<script>
    export default {
        props: {
            titlePage: {
                type: String,
                default: "Tiêu đề mặc định"
            },
            linkCreatePage: {
                type: String,
                default: null
            },
            showSearchBox: {
                type: Boolean,
                default: false
            }
        }
    }
</script>

<style>
    .group-title {
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