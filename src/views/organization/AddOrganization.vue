<template>
    <div>
        <compTitlePage :titlePage="titlePage" />
        <form>
            <!-- Tên và mã sự kiện -->
            <div class="flex-row-container">
                <InputBase v-model:processData="processData" fieldName="eventName" labelName="Tên sự kiện" required
                    disabled />
                <InputBase v-model:processData="processData" fieldName="idEvent" labelName="Mã sự kiện" required
                    disabled />
            </div>

            <!-- Năm học, ban -->
            <div class="flex-row-container">
                <InputDate v-model:processData="processData" fieldName="date" labelName="Ngày thành lập" required />
                <SelectOrganizationTeam v-model:processData="processData" fieldName="organizationTeam" required />
            </div>

            <!-- Tên và vai trò -->
            <div class="flex-row-container">
                <SelectTeddyActive v-model:processData="processData" fieldName="idTeddy" required />
                <SelectOrganizationPosition v-model:processData="processData" fieldName="organizationPosition"
                    required />
            </div>

            <!-- Nhóm các nút chức năng -->
            <div class="flex-row-container right">
                <button type="reset" @click.prevent="cleanForm">LÀM MỚI</button>
                <button type="submit" @click.prevent="submitForm" class="primary"> TẠO MỚI</button>
            </div>
        </form>

        <br>
        <compTableData :columnsConfig="columnsConfig" :tablesConfig="tablesConfig" />

    </div>
</template>

<script setup>
    import { ref, computed, onMounted, nextTick } from 'vue'
    import { useRouter, useRoute } from 'vue-router'
    import { connectGAS } from '@/utils/connectGAS'
    import eventBus from '@/utils/eventBus';

    import compTitlePage from '@/components/compTitlePage.vue'
    import compTableData from "@/components/compTableData.vue"

    import InputBase from '@/components/inputs/InputBase.vue'
    import InputDate from '@/components/inputs/InputDate.vue'

    import SelectSchoolYear from '@/components/selects/SelectSchoolYear.vue'
    import SelectTeddyActive from '@/components/selects/SelectTeddyActive.vue'
    import SelectOrganizationTeam from '@/components/selects/SelectOrganizationTeam.vue'
    import SelectOrganizationPosition from '@/components/selects/SelectOrganizationPosition.vue'


    const titlePage = 'Thành lập ban tổ chức'

    // Data tập trung
    const processData = ref({
        inputData: {},
        validateData: {},
        extraData: {},
        isFormSubmitted: false
    })
    processData.value.inputData.idEvent = useRoute().params.id;
    processData.value.inputData.eventName = useRoute().query.name;


    // Final data gửi đi = inputData + extraData
    const finalData = computed(() => ({
        ...processData.value.inputData,
        ...processData.value.extraData
    }))

    // Form valid = tất cả validateData đều true
    const isFormValid = computed(() => {
        const validateData = processData.value.validateData || {}
        return Object.values(validateData).length > 0 &&
            Object.values(validateData).every(v => v === true)
    })

    // HÀM: Làm mới form
    function cleanForm() {
        processData.value.inputData.idTeddy = '';
        processData.value.inputData.organizationPosition = '';
    }

    // HÀM: Gửi form
    async function submitForm() {
        console.clear();
        processData.value.isFormSubmitted = true;
        await nextTick();

        if (isFormValid.value) {
            console.table(finalData.value)
            console.log(finalData.value);
            processData.value.isFormSubmitted = false;
            const res = await connectGAS('addOrganization', finalData.value);
            if (!res.success) { return }
            tablesConfig.value = res.data?.reverse();
            cleanForm()
        }
    }



    /********************************************************************************
    ******************************** *BẢNG DỮ LIỆU **********************************
    *********************************************************************************/

    // HÀM: Xóa dữ liệu bảng
    const deleteOrganization = async row => {
        const isConfirmed = await eventBus.confirm(
            `Bạn có chắc chắn muốn xóa vai trò của "${row.fullName}"?`,
        );

        if (!isConfirmed) return;
        const res = await connectGAS("deleteOrganization", row);
        res.success
            ? tablesConfig.value = tablesConfig.value.filter(i => !(i.idEvent === row.idEvent && i.idTeddy === row.idTeddy && i.date === row.date))
            : console.error(res.message || "Xóa thất bại");
    };


    // DATA: Khởi tạo dữ liệu bảng
    const tablesConfig = ref([])
    onMounted(async () => {
        const res = await connectGAS("getOrganizationByConditions", { idEvent: useRoute().params.id }, false)
        if (res?.success && Array.isArray(res.data)) {
            tablesConfig.value = res.data
        }
    })


    // DATA: Khởi tạo cấu trúc bảng
    const columnsConfig = [
        { label: 'Mã sinh viên', key: 'idTeddy' },
        { label: 'Họ và tên', key: 'fullName' },
        { label: 'Phân ban', key: 'organizationTeam' },
        { label: 'Vai trò', key: 'organizationPosition' },
        {
            label: 'Chức năng',
            key: 'actions',
            actions: [{ label: 'Xóa lỗi', icon: 'bi bi-trash3-fill', action: deleteOrganization },]
        }
    ]
</script>