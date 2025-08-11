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
    import { ref, computed, onMounted } from 'vue'
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


    const titlePage = 'Ghi nhận ca chạy'

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
        processData.value.inputData.numberShift = '';
        processData.value.inputData.idTeddy = '';
        processData.value.inputData.positionShift = '';
    }

    // HÀM: Gửi form
    async function submitForm() {
        console.clear();
        processData.value.isFormSubmitted = true;
        console.table(processData.value.validateData)
        console.table(processData.value.finalData)
        if (isFormValid.value) {
            console.table(finalData.value)
            console.log(finalData.value);
            processData.value.isFormSubmitted = false;
            const res = await connectGAS('addShift', finalData.value);
            tablesConfig.value = res.data?.reverse();
            cleanForm()
        }
    }



    // Dữ liệu bảng

    const deleteShift = async row => {
        const isConfirmed = await eventBus.confirm(
            `Bạn có chắc chắn muốn xóa ca chạy của "${row.fullName}" vào ngày ${row.date}?`,
        );

        if (!isConfirmed) return;
        const res = await connectGAS("deleteShift", row);
        res.success
            ? tablesConfig.value = tablesConfig.value.filter(i => !(i.idEvent === row.idEvent && i.idTeddy === row.idTeddy && i.date === row.date))
            : console.error(res.message || "Xóa ca chạy thất bại");
    };


    const tablesConfig = ref([])
    const columnsConfig = [
        { label: 'Ngày chạy', key: 'date' },
        { label: 'Mã sinh viên', key: 'idTeddy' },
        { label: 'Họ và tên', key: 'fullName' },
        { label: 'Số lượng', key: 'nameShift' },
        { label: 'Vị trí', key: 'positionShift' },
        {
            label: 'Chức năng',
            key: 'actions',
            actions: [{ label: 'Xóa ca chạy', icon: 'bi bi-trash3-fill', action: deleteShift },]
        }
    ]
</script>