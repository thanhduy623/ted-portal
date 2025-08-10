<template>
    <div>
        <!-- Component tiêu đề trang -->
        <compTitlePage :titlePage="titlePage" :linkCreatePage="linkCreatePage" />


        <!-- Component bảng để hiển thị dữ liệu -->
        <compTableData :columnsConfig="columnsConfig" :tablesConfig="tablesConfig" />
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

    // Action: Xem thông tin
    const handleViewEvent = (data) => {
        router.push('/event/edit/' + data.idEvent)
    }

    // Action: Ghi nhận ca chạy
    const handleViewShiftEvent = (data) => {
        router.push({
            path: '/shift/add/' + data.idEvent + "/" + data.nameEvent,
            query: { name: data.eventName }
        });
    }

    const handleAction = (data) => {
        alert(data.idEvent)
    }

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
                { label: 'Xem thông tin', icon: 'bi bi-file-earmark-text-fill', action: handleViewEvent },
                { label: 'Lập ban tổ chức', icon: 'bi bi-file-earmark-person-fill', action: handleAction },
                { label: 'Ghi nhận ca chạy', icon: 'bi bi-file-earmark-plus-fill', action: handleViewShiftEvent },
                { label: 'Ghi nhận vi phạm', icon: 'bi bi-file-earmark-check-fill', action: handleAction },
            ]
        }
    ]

    // Lấy dữ liệu
    const getThisYearEvent = async () => {
        const response = await connectGAS("getThisYearEvent", {});
        tablesConfig.value = response.data.reverse();
    }

    // Mounted
    onMounted(() => {
        getThisYearEvent()
    })
</script>