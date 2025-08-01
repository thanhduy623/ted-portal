<template>
    <div>
        <!-- Component tiêu đề trang -->
        <compTitlePage :titlePage="titlePage" :linkCreatePage="linkCreatePage" />


        <!-- Component bảng để hiển thị dữ liệu -->
        <compTableData :columnsConfig="columnsConfig" :tablesConfig="tablesConfig" />
    </div>
</template>

<script>
    // Import các components và utilities cần thiết
    import compTitlePage from "@/components/compTitlePage.vue";
    import compTableData from "@/components/compTableData.vue";
    import { connectGAS } from '@/utils/connectGAS.js'

    export default {
        data() {
            return {
                // Thiết lập tiêu đề và liên kết
                titlePage: "Quản lý nhân sự 2",
                linkCreatePage: "/teddy/add",

                // Dữ liệu và cấu hình cho bảng
                tablesConfig: null,
                actionsConfig: [
                    { icon: 'fas fa-eye', label: 'Xem', action: this.viewUser },

                ],
                columnsConfig: [
                    { label: 'Mã sinh viên', key: 'idTeddy' },
                    { label: 'Họ và tên', key: 'fullName' },
                    { label: 'Thế hệ', key: 'generation' },
                    { label: 'Bộ phận', key: 'idTeam' },
                    { label: 'Trạng Thái', key: 'status' },
                    { label: 'Chức năng', key: 'actions', actions: this.actionsConfig }
                ],
            }
        },
        // Life-cycle hook: được gọi khi component được mount vào DOM
        mounted() {
            this.getActiveTeddy();
        },
        components: {
            compTitlePage,
            compTableData
        },
        methods: {
            // Phương thức để gọi API và lấy dữ liệu
            async getActiveTeddy() {
                const teddy = await connectGAS("getAllTeddy", {});
                this.$eventBus.hideLoading();
                this.tablesConfig = teddy.data;
            }
        },
    }
</script>