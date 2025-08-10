<template>
    <div>
        <compTitlePage :titlePage="titlePage" />
        <form>
            <!-- Niên khóa, phân loại -->
            <div class="flex-row-container">
                <SelectSchoolYear v-model:processData="processData" fieldName="idSchoolYear" required />
                <SelectEventType v-model:processData="processData" fieldName="eventType" required />
            </div>

            <!-- Tên sự kiện -->
            <InputBase v-model:processData="processData" fieldName="eventName" labelName="Tên sự kiện" required />

            <!-- Ngày bắt đầu, ngày kết thúc -->
            <div class="flex-row-container">
                <InputDate v-model:processData="processData" fieldName="startDate" labelName="Ngày bắt đầu" />
                <InputDate v-model:processData="processData" fieldName="endDate" labelName="Ngày kết thúc" />
            </div>

            <!-- Trạng thái, PD hỗ trợ -->
            <div class="flex-row-container">
                <SelectEventStatus v-model:processData="processData" fieldName="statusEvent" required />
                <SelectTeddyByTeam v-model:processData="processData" fieldName="idSuporter" labelName="PD hỗ trợ" />
            </div>

            <!-- Tên sự kiện -->
            <InputBase v-model:processData="processData" fieldName="takeNote" labelName="Ghi chú" required />

            <!-- Nhóm các nút chức năng -->
            <div class="flex-row-container right">
                <button type="reset">LÀM MỚI</button>
                <button type="submit" @click.prevent="submitForm" class="primary"> TẠO MỚI</button>
            </div>
        </form>
    </div>
</template>

<script setup>
    import { ref, computed, onMounted } from 'vue'
    import { useRouter, useRoute } from 'vue-router'
    import { connectGAS } from '@/utils/connectGAS'

    import compTitlePage from '@/components/compTitlePage.vue'

    import InputBase from '@/components/inputs/InputBase.vue'
    import InputDate from '@/components/inputs/InputDate.vue'

    import SelectSchoolYear from '@/components/selects/SelectSchoolYear.vue'
    import SelectEventType from '@/components/selects/SelectEventType.vue'
    import SelectEventStatus from '@/components/selects/SelectEventStatus.vue'
    import SelectTeddyByTeam from '@/components/selects/SelectTeddyByTeam.vue'


    const titlePage = 'Thêm sự kiện'

    // Data tập trung
    const processData = ref({
        inputData: {},
        validateData: {},
        extraData: {},
        isFormSubmitted: false
    })


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

    async function submitForm() {
        console.clear();
        processData.value.isFormSubmitted = true;
        console.table(processData.value.validateData)
        console.table(processData.value.finalData)
        if (isFormValid.value) {
            console.table(finalData.value)
            processData.value.isFormSubmitted = false;
            await connectGAS('addEvent', finalData.value)
        }
    }
</script>