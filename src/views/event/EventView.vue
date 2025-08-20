<template>
    <div>
        <CompTitlePage :titlePage="currentTitle" :actionsPage="actionsPage" />

        <!-- Bảng dữ liệu -->
        <div v-show="controlShow.tableData">
            <CompTableData :columnsConfig="columnsConfig" :tablesConfig="tablesConfig" />
        </div>

        <!-- Trang tạo mới -->
        <div v-if="controlShow.addEvent">
            <AddEvent />
        </div>

        <!-- Trang cập nhật -->
        <div v-if="controlShow.updateEvent">
            <UpdateEvent :dataSelected="dataSelected" />
        </div>

        <!-- Trang lập ban tổ chức -->
        <div v-if="controlShow.addOrganization">
            <AddOrganization :dataSelected="dataSelected" />
        </div>

        <!-- Trang lập ca chạy -->
        <div v-if="controlShow.addShift">
            <AddShift :dataSelected="dataSelected" />
        </div>

        <!-- Trang lập vi phạm -->
        <div v-if="controlShow.addMistake">
            <AddMistake :dataSelected="dataSelected" />
        </div>

        <!-- Trang lập tài liệu -->
        <div v-if="controlShow.addDocument">
            <AddDocument :dataSelected="dataSelected" />
        </div>

    </div>
</template>


<script setup>
    import { ref, onMounted, computed } from 'vue'
    import { connectGAS } from '@/utils/connectGAS'
    import { exportToExcel } from '@/utils/exportExcel'

    import CompTitlePage from '@/components/CompTitlePage.vue'
    import CompTableData from '@/components/CompTableData.vue'

    import AddEvent from '@/views/event/AddEvent.vue'
    import UpdateEvent from '@/views/event/UpdateEvent.vue'

    import AddShift from '@/views/shift/AddShift.vue'
    import AddMistake from '@/views/mistake/AddMistake.vue'
    import AddOrganization from '@/views/organization/AddOrganization.vue'
    import AddDocument from '@/views/document/AddDocument.vue'


    // Dữ liệu quản trị trang
    const tablesConfig = ref([])
    const dataSelected = ref([])

    const controlShow = ref({
        tableData: true,
        addEvent: false,
        updateEvent: false,
        addShift: false,
        addMistake: false,
        addOrganization: false,
        addDocument: false,
    })

    const controlTitle = ref({
        tableData: "Quản lý sự kiện",
        addEvent: "Thêm sự kiện",
        updateEvent: "Cập nhật sự kiện",
        addShift: "Ghi nhận ca chạy",
        addMistake: "Ghi nhận vi phạm",
        addOrganization: "Thành lập tổ chức",
        addDocument: "Lưu trữ tài liệu"
    })

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
            action: () => setControl('addEvent'),
            show: controlShow.value.tableData
        },
        {
            name: 'Xuất Excel',
            icon: 'bi bi-file-earmark-excel',
            action: () => exportToExcel(columnsConfig.value, tablesConfig.value, "Danh-sach-su-kien.xlsx"),
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
            label: 'Xem thông tin', icon: 'bi bi-file-earmark-text-fill',
            action: row => showElement('updateEvent', row)
        },
        {
            label: 'Lập ban tổ chức', icon: 'bi bi-file-earmark-person-fill',
            action: row => showElement('addOrganization', row)
        },
        {
            label: 'Ghi nhận ca chạy', icon: 'bi bi-file-earmark-plus-fill',
            action: row => showElement('addShift', row)
        },
        {
            label: 'Ghi nhận vi phạm', icon: 'bi bi-file-earmark-check-fill',
            action: row => showElement('addMistake', row)
        },
        {
            label: 'Lưu trữ dữ liệu', icon: 'bi bi-file-earmark-word-fill',
            action: row => showElement('addDocument', row)
        },
    ]


    // Khởi tạo: Định nghĩa các cột
    const columnsConfig = ref([
        { label: 'Mã sự kiện', key: 'idEvent' },
        { label: 'Năm sự kiện', key: 'nameSchoolYear' },
        { label: 'Tên sự kiện', key: 'eventName' },
        { label: 'Trạng thái', key: 'statusEvent' },
        { label: 'PD hỗ trợ', key: 'fullName' },
        { label: 'Chức năng', key: 'actions', actions: actions }
    ])


    // Khởi tạo ban đầu: Lấy dữ liệu sự kiện
    onMounted(async () => {
        const res = await connectGAS("getAllEvent", {})
        tablesConfig.value = res.success ? res.data : {}
    })

    const currentTitle = computed(() => {
        const activeKey = Object.keys(controlShow.value).find(k => controlShow.value[k])
        return controlTitle.value[activeKey] || ''
    })
</script>