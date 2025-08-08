<template>
    <div>
        <!-- Component tiêu đề trang -->
        <compTitlePage :titlePage="titlePage" :linkCreatePage="linkCreatePage" />


        <!-- Component bảng để hiển thị dữ liệu -->
        <compTableData :columnsConfig="columnsConfig" :tablesConfig="tablesConfig" primaryKey="idTeddy" />
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
    const titlePage = "Quản lý nhân sự"
    const linkCreatePage = "/teddy/add"

    // State
    const tablesConfig = ref(null)

    // Actions cho bảng
    const handleViewTeddy = (id) => {
        router.push('/teddy/edit/' + id)
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
        { label: 'Mã sinh viên', key: 'idTeddy' },
        { label: 'Họ và tên', key: 'fullName' },
        { label: 'Thế hệ', key: 'generation' },
        { label: 'Bộ phận', key: 'idTeam' },
        { label: 'Trạng Thái', key: 'status' },
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
    const getActiveTeddy = async () => {
        const teddy = await connectGAS("getActiveTeddy", {})
        tablesConfig.value = teddy.data
    }

    // Mounted
    onMounted(() => {
        getActiveTeddy()
    })
</script>