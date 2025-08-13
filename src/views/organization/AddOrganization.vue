<template>
    <div>
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
                <button v-if="props.setControl" @click.prevent="props.setControl()"> TRỞ VỀ</button>
                <button type="reset" @click.prevent="cleanForm">LÀM MỚI</button>
                <button type="submit" @click.prevent="submitForm" class="primary"> TẠO MỚI</button>
            </div>
        </form>

        <br>
        <compTableData :columnsConfig="columnsConfig" :tablesConfig="tablesConfig" />

    </div>
</template>

<script setup>
    import { ref, watch, computed, onMounted, nextTick } from 'vue'
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


    //PROPS: Các biến nhận vào
    const props = defineProps({
        dataSelected: { type: Object, required: true },
        setControl: { type: Function, required: true },
    })


    // Data tập trung
    const processData = ref({
        inputData: {},
        validateData: {},
        extraData: {},
        isFormSubmitted: false
    })


    // COMPUTED: Hợp nhất dữ liệu: inputData + extraData
    const finalData = computed(() => ({
        ...processData.value.inputData,
        ...processData.value.extraData
    }))


    // VALID: Kiểm tra validateData (tất cả đều hợp lệ)
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

        if (!isFormValid.value) { return }
        processData.value.isFormSubmitted = false;
        const res = await connectGAS('addOrganization', finalData.value);

        // Gán dữ liệu cho bảng
        if (!res.success) { return }
        tablesConfig.value = res.data?.reverse();
        cleanForm()
    }



    /********************************************************************************
    ********************************* BẢNG DỮ LIỆU **********************************
    *********************************************************************************/

    // MOUNTED: Gán dữ liệu và form và tải dữ liệu
    const tablesConfig = ref([])
    onMounted(async () => {
        const { idEvent, eventName } = props.dataSelected
        processData.value.inputData.idEvent = idEvent
        processData.value.inputData.eventName = eventName
        const res = await connectGAS('getOrganizationByConditions', { idEvent }, false)

        if (!res.success) { return }
        tablesConfig.value = res.data;
    })


    // HÀM: Xóa dữ liệu bảng
    const deleteRow = async row => {
        if (!await eventBus.confirm(`Bạn có muốn xóa vai trò của "${row.fullName}" ?`)) return;

        const res = await connectGAS("deleteOrganization", row);

        if (res.success) {
            tablesConfig.value = tablesConfig.value.filter(
                i => JSON.stringify(i) !== JSON.stringify(row)
            );
        } else {
            console.error(res.message || "Xóa thất bại");
        }
    };


    // DATA: Khởi tạo cấu trúc bảng
    const columnsConfig = [
        { label: 'Mã sinh viên', key: 'idTeddy' },
        { label: 'Họ và tên', key: 'fullName' },
        { label: 'Phân ban', key: 'organizationTeam' },
        { label: 'Vai trò', key: 'organizationPosition' },
        {
            label: 'Chức năng',
            key: 'actions',
            actions: [{ label: 'Xóa', icon: 'bi bi-trash3-fill', action: deleteRow },]
        }
    ]
</script>