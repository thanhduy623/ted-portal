<template>
    <div>
        <!-- Component tiêu đề trang -->
        <compTitlePage :titlePage="titlePage" :linkCreatePage="linkCreatePage" />


        <!-- Component bảng để hiển thị dữ liệu -->
        <compTableData :columnsConfig="columnsConfig" :tablesConfig="tablesConfig" primaryKey="idEvent" />
    </div>
</template>


<script setup>
    import { ref, onMounted } from 'vue'
    import { useRouter } from 'vue-router'

    import compTitlePage from "@/components/compTitlePage.vue"
    import compTableData from "@/components/compTableData.vue"
    import { connectGAS } from '@/utils/connectGAS.js'

    // Router instance
    const router = useRouter()

    // Tiêu đề và link
    const titlePage = "Quản lý sự kiện"
    const linkCreatePage = "/event/add"

    // State
    const tablesConfig = ref(null)

    // Actions cho bảng
    const handleViewTeddy = (id) => {
        router.push('/event/edit/' + id)
    }

    const handleAction = (id) => {
        alert(id)
    }

    const actionsConfig = [
        {
            icon: 'fas fa-edit',
            label: 'Sửa',
            action: '/teddy/edit/:id'
        },
        {
            icon: 'fas fa-eye',
            label: 'Xem',
            action: handleAction
        }
    ]

    // Columns
    const columnsConfig = [
        { label: 'Mã sự kiện', key: 'idEvent' },
        { label: 'Năm sự kiện', key: 'idSchoolYear' },
        { label: 'Tên sự kiện', key: 'nameEvent' },
        { label: 'Trạng thái', key: 'status' },
        {
            label: 'Chức năng',
            key: 'actions',
            actions: [
                { icon: 'fas fa-edit', label: 'Sửa', action: handleViewTeddy },
                { icon: 'fas fa-eye', label: 'Xem', action: handleAction }
            ]
        }
    ]

    // Lấy dữ liệu
    const getThisYearEvent = async () => {
        const response = await connectGAS("getThisYearEvent", {})
        tablesConfig.value = response.data
    }

    // Mounted
    onMounted(() => {
        getThisYearEvent()
    })
</script>