<template>
    <div>

        <!-- Bảng dữ liệu -->
        <div v-show="controlShow.tableData">
            <CompTitlePage titlePage="Quản lý sự kiện" :actionsPage="actionsPage" />
            <CompTableData :columnsConfig="columnsConfig" :tablesConfig="tablesConfig" />
        </div>

        <!-- Trang tạo mới -->
        <div v-if="controlShow.addEvent">
            <CompTitlePage titlePage="Thêm sự kiện" />
            <AddEvent :setControl="setControl" />
        </div>

        <!-- Trang cập nhật -->
        <div v-if="controlShow.updateEvent">
            <CompTitlePage titlePage="Cập nhật sự kiện" />
            <UpdateEvent :dataSelected="dataSelected" :setControl="setControl" />
        </div>

        <!-- Trang lập ban tổ chức -->
        <div v-if="controlShow.addOrganization">
            <CompTitlePage titlePage="Lập ban tổ chức" />
            <AddOrganization :dataSelected="dataSelected" :setControl="setControl" />
        </div>

        <!-- Trang lập ca chạy -->
        <div v-if="controlShow.addShift">
            <CompTitlePage titlePage="Ghi nhận ca chạy" />
            <AddShift :dataSelected="dataSelected" :setControl="setControl" />
        </div>

        <!-- Trang lập vi phạm -->
        <div v-if="controlShow.addMistake">
            <CompTitlePage titlePage="Ghi nhận vi phạm" />
            <AddMistake :dataSelected="dataSelected" :setControl="setControl" />
        </div>

    </div>
</template>


<script setup>
    import { ref, onMounted } from 'vue'
    import { connectGAS } from '@/utils/connectGAS'

    import CompTitlePage from '@/components/CompTitlePage.vue'
    import CompTableData from '@/components/CompTableData.vue'

    import AddEvent from '@/views/event/AddEvent.vue'
    import UpdateEvent from '@/views/event/UpdateEvent.vue'

    import AddShift from '@/views/shift/AddShift.vue'
    import AddMistake from '@/views/mistake/AddMistake.vue'
    import AddOrganization from '@/views/organization/AddOrganization.vue'

    // XÓA
    import { sessionGet } from '@/utils/sessionStore'


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
    })
    const actionsPage = [
        { name: 'Thêm mới', icon: 'bi bi-plus-lg', action: () => setControl('addEvent') },
        { name: 'Xuất Excel', icon: 'bi bi-file-earmark-excel' }
    ]

    // HÀM: Hiển thị form cập nhật
    const showElement = (key, row = {}) => {
        setControl(key)
        dataSelected.value = row
    }


    // HÀM: Set đối tượng hiển thị
    const setControl = (activeKey = "tableData") => {
        Object.keys(controlShow.value).forEach(key => {
            controlShow.value[key] = key === activeKey
        })
    }



    // Khởi tạo: Các action sẽ thao tác
    const actions = [
        {
            label: 'Xem thông tin', icon: 'bi bi-file-earmark-text-fill',
            action: row => showElement('addEvent', row)
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
    ]


    // Khởi tạo: Định nghĩa các cột
    const columnsConfig = [
        { label: 'Mã sự kiện', key: 'idEvent' },
        { label: 'Năm sự kiện', key: 'nameSchoolYear' },
        { label: 'Tên sự kiện', key: 'eventName' },
        { label: 'Trạng thái', key: 'statusEvent' },
        { label: 'PD hỗ trợ', key: 'fullName' },
        { label: 'Chức năng', key: 'actions', actions: actions }
    ]


    // Khởi tạo ban đầu: Lấy dữ liệu sự kiện
    onMounted(async () => {
        const res = await connectGAS("getAllEvent", {})
        tablesConfig.value = res.success ? res.data : {}
    })

</script>