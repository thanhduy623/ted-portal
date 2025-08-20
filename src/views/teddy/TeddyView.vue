<template>
    <div>
        <!-- Thanh tiêu đề -->
        <compTitlePage :titlePage="currentTitle" :actionsPage="actionsPage" />

        <!-- Bảng dữ liệu -->
        <div v-show="controlShow.tableData">
            <compTableData :columnsConfig="columnsConfig" :tablesConfig="tablesConfig" />
        </div>

        <!-- Trang tạo mới -->
        <div v-if="controlShow.addTeddy">
            <AddTeddy />
        </div>

        <!-- Trang tạo mới -->
        <div v-if="controlShow.updateTeddy">
            <UpdateTeddy :dataSelected="dataSelected" />
        </div>

    </div>
</template>

<script setup>
    import { ref, onMounted, computed } from 'vue'
    import { useRouter } from 'vue-router'
    import { connectGAS } from '@/utils/connectGAS.js'
    import { exportToExcel } from '@/utils/exportExcel'

    import compTitlePage from "@/components/compTitlePage.vue"
    import compTableData from "@/components/compTableData.vue"
    import AddTeddy from "@/views/teddy/AddTeddy.vue"
    import UpdateTeddy from "@/views/teddy/UpdateTeddy.vue"


    // Dữ liệu quản trị trang
    const tablesConfig = ref([])
    const dataSelected = ref([])

    const controlShow = ref({
        tableData: true,
        addTeddy: false,
        updateTeddy: false,
    })

    const controlTitle = ref({
        tableData: "Quản lý nhân sự",
        addTeddy: "Thêm nhân sự",
        updateTeddy: "Cập nhật thông tin",
    })


    // Hành động của trang
    const actionsPage = computed(() => [
        {
            name: 'Trở lại',
            icon: 'bi bi-arrow-left',
            action: () => setControl(),
            show: !controlShow.value.tableData
        },
        {
            name: 'Thêm mới',
            icon: 'bi bi-plus-lg',
            action: () => setControl('addTeddy'),
            show: controlShow.value.tableData
        },
        {
            name: 'Xuất Excel',
            icon: 'bi bi-file-earmark-excel',
            action: () => exportToExcel(columnsConfig.value, tablesConfig.value, "Danh-sach-nhan-su.xlsx"),
            show: controlShow.value.tableData
        }
    ])




    // HÀM: Hiển thị đối tượng và gọi đánh dấu
    const showElement = (key, row = {}) => {
        setControl(key)
        dataSelected.value = row
    }


    // HÀM: Đánh dấu đối tượng được hiển thị
    const setControl = (activeKey = "tableData") => {
        Object.keys(controlShow.value).forEach(key => {
            controlShow.value[key] = key === activeKey
        })
    }


    // Khởi tạo: Các action sẽ thao tác
    const actions = [
        {
            label: 'Xem thông tin', icon: 'bi bi-eye-fill',
            action: row => showElement('updateTeddy', row)
        },
        {
            label: 'Đặt lại mật khẩu', icon: 'bi bi-key-fill',
            action: row => connectGAS('resetPassword', row, false)
        },
    ]


    // Khởi tạo: Định nghĩa các cột
    const columnsConfig = ref([
        { label: 'MSSV', key: 'idTeddy' },
        { label: 'Họ và tên', key: 'fullName' },
        { label: 'Thế hệ', key: 'generation' },
        { label: 'Bộ phận', key: 'idTeam' },
        { label: 'Chức năng', key: 'actions', actions: actions }
    ])


    // Khởi tạo ban đầu: Lấy dữ liệu sự kiện
    onMounted(async () => {
        const res = await connectGAS("getAllTeddy", {})
        tablesConfig.value = res.success ? res.data : {}
    })

    const currentTitle = computed(() => {
        const activeKey = Object.keys(controlShow.value).find(k => controlShow.value[k])
        return controlTitle.value[activeKey] || ''
    })
</script>