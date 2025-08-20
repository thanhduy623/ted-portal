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

            <!-- Năm học, ngày chạy -->
            <div class="flex-row-container">
                <SelectSchoolYear v-model:processData="processData" fieldName="idSchoolYear" required />
                <InputDate v-model:processData="processData" fieldName="date" labelName="Ngày chạy" required />
            </div>

            <!-- Tên và mã sự kiện -->
            <div class="flex-row-container">
                <SelectTeddyActive v-model:processData="processData" fieldName="idTeddy" required />
                <SelectShift v-model:processData="processData" fieldName="numberShift" required />
            </div>

            <CheckShiftPostion v-model:processData="processData" fieldName="positionShift" labelName="Ví trí chạy"
                required />


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
    import SelectShift from '@/components/selects/SelectShift.vue'

    import CheckShiftPostion from '@/components/checks/CheckShiftPostion.vue'


    //PROPS: Các biến nhận vào
    const props = defineProps({
        dataSelected: { type: Object, required: true },
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
        processData.value.inputData.numberShift = '';
        processData.value.inputData.idTeddy = '';
        processData.value.inputData.positionShift = '';
    }

    // HÀM: Gửi form
    async function submitForm() {
        console.clear();
        processData.value.isFormSubmitted = true;
        await nextTick();

        if (!isFormValid.value) { return }
        processData.value.isFormSubmitted = false;
        const res = await connectGAS('addShift', finalData.value);

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
        const res = await connectGAS('getShiftByConditions', { idEvent }, false)

        if (!res.success) { return }
        tablesConfig.value = res.data;
    })


    // HÀM: Xóa dữ liệu bảng
    const deleteRow = async row => {
        if (!await eventBus.confirm(`Bạn có muốn xóa vai trò của "${row.fullName}" ?`)) return;

        const res = await connectGAS("getShiftByConditions", row);

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
        { label: 'Ngày chạy', key: 'date' },
        { label: 'Mã sinh viên', key: 'idTeddy' },
        { label: 'Họ và tên', key: 'fullName' },
        { label: 'Số lượng', key: 'numberShift' },
        { label: 'Vị trí', key: 'positionShift' },
        {
            label: 'Chức năng',
            key: 'actions',
            actions: [{ label: 'Xóa ca chạy', icon: 'bi bi-trash3-fill', action: deleteRow },]
        }
    ]
</script>