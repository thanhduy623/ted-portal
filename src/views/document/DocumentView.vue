<script setup>
    import { ref, computed, onMounted } from 'vue'
    import { connectGAS } from '@/utils/connectGAS'

    import CompTitlePage from '@/components/CompTitlePage.vue'
    import CompTableData from '@/components/CompTableData.vue'

    const tablesConfig = ref([])
    const showTable = ref(true)
    const activeTab = ref('organization') // tab mặc định

    // Các tab hiển thị
    const sections = {
        organization: {
            label: 'Ban tổ chức',
            columns: [
                { label: 'Mã sự kiện', key: 'idEvent' },
                { label: 'Ngày', key: 'date' },
                { label: 'Họ tên', key: 'fullName' },
                { label: 'Vai trò', key: 'organizationPosition' },
            ]
        },
        shift: {
            label: 'Ca chạy',
            columns: [
                { label: 'Mã sự kiện', key: 'idEvent' },
                { label: 'Ngày', key: 'date' },
                { label: 'Họ tên', key: 'fullName' },
                { label: 'Số ca', key: 'nameShift' },
            ]
        },
        mistake: {
            label: 'Vi phạm',
            columns: [
                { label: 'Mã sự kiện', key: 'idEvent' },
                { label: 'Ngày', key: 'date' },
                { label: 'Họ tên', key: 'fullName' },
                { label: 'Vi phạm', key: 'nameMistake' },
            ]
        },
        document: {
            label: 'Tài liệu',
            columns: [
                { label: 'Mã sự kiện', key: 'idEvent' },
                { label: 'Tên tài liệu', key: 'fileName' },
                {
                    label: 'Chức năng',
                    key: 'actions',
                    actions: [
                        { label: 'Xem tài liệu', icon: 'bi bi-eye-fill', action: (row) => window.open(row.url, '_blank') }
                    ]
                }
            ]
        }
    }

    // Action trên header
    const actionsPage = computed(() => [
        {
            name: 'Trở lại',
            icon: 'bi bi-arrow-left',
            action: () => { showTable.value = true },
            show: !showTable.value
        },
        {
            name: sections[activeTab.value].label, // hiện label tab đang chọn
            icon: 'bi bi-ui-checks',               // icon tab
            show: !showTable.value,
            action: () => {
                // đổi tab tuần tự (organization -> shift -> mistake -> document -> quay lại organization)
                const keys = Object.keys(sections)
                const idx = keys.indexOf(activeTab.value)
                activeTab.value = keys[(idx + 1) % keys.length]
            }
        }
    ])

    // Cột bảng chính
    const columnsConfig = ref([
        { label: 'Mã sự kiện', key: 'idEvent' },
        { label: 'Năm sự kiện', key: 'nameSchoolYear' },
        { label: 'Tên sự kiện', key: 'eventName' },
        { label: 'Trạng thái', key: 'statusEvent' },
        { label: 'PD hỗ trợ', key: 'fullName' },
        {
            label: 'Chức năng',
            key: 'actions',
            actions: [
                { label: 'Xem thông tin', icon: 'bi bi-eye-fill', action: () => { showTable.value = false } }
            ]
        }
    ])

    // Load dữ liệu
    onMounted(async () => {
        const res = await connectGAS("getAllEvent", {})
        tablesConfig.value = res.success ? res.data : {}
    })
</script>

<template>
    <div>
        <CompTitlePage titlePage="Dữ liệu sự kiện" :actionsPage="actionsPage" />

        <!-- Bảng chính -->
        <div v-show="showTable">
            <CompTableData :columnsConfig="columnsConfig" :tablesConfig="tablesConfig" />
        </div>

        <!-- Bảng chi tiết (theo tab) -->
        <div v-if="!showTable">
            <h2>{{ sections[activeTab].label }}</h2>
            <CompTableData :columnsConfig="sections[activeTab].columns" :tablesConfig="tablesConfig" />
        </div>
    </div>
</template>