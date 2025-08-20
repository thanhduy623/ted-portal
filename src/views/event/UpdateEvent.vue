<template>
    <div>
        <form>
            <!-- Niên khóa, phân loại -->
            <div class="flex-row-container">
                <SelectSchoolYear v-model:processData="processData" fieldName="idSchoolYear" required disabled />
                <SelectEventType v-model:processData="processData" fieldName="eventType" required disabled />
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
                <SelectTeddyActive v-model:processData="processData" fieldName="idSuporter" labelName="PD hỗ trợ"
                    idTeamFilter="PD" />
            </div>

            <!-- Tên ghi chú -->
            <InputBase v-model:processData="processData" fieldName="takeNote" labelName="Ghi chú" />

            <!-- Nhóm các nút chức năng -->
            <div class="flex-row-container right">
                <button v-if="isLock" type="reset" @click.prevent="changeForm">CHỈNH SỬA</button>
                <button v-if="!isLock" type="submit" @click.prevent="submitForm" class="primary">CẬP NHẬT</button>
            </div>
        </form>
    </div>
</template>

<script setup>
    import { ref, computed, onMounted, watch, nextTick } from 'vue'
    import { useRouter, useRoute } from 'vue-router'
    import { connectGAS } from '@/utils/connectGAS'
    import { lockForm, unlockForm } from '@/utils/formLockUtils'

    import compTitlePage from '@/components/compTitlePage.vue'

    import InputBase from '@/components/inputs/InputBase.vue'
    import InputDate from '@/components/inputs/InputDate.vue'

    import SelectSchoolYear from '@/components/selects/SelectSchoolYear.vue'
    import SelectEventType from '@/components/selects/SelectEventType.vue'
    import SelectEventStatus from '@/components/selects/SelectEventStatus.vue'
    import SelectTeddyActive from '@/components/selects/SelectTeddyActive.vue'


    //PROPS: Các biến nhận vào
    const props = defineProps({
        dataSelected: { type: Object, required: true },
    })


    // DATA: Khai báo dữ liệu ban đầu
    const isLock = ref(true)
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


    // WATCH: Theo dõi dataSelected và cập nhật lại form
    watch(() => props.dataSelected, async newVal => {
        processData.value.inputData = { ...newVal }
        isLock.value = true
        await nextTick()
        lockForm()
    }, { immediate: true, deep: true })



    // HÀM: Chỉnh sửa form
    function changeForm() {
        unlockForm();
        isLock.value = false;
    }

    // HÀM: Gửi dữ liệu form
    async function submitForm() {
        console.clear();
        processData.value.isFormSubmitted = true;

        if (!isFormValid.value) { return }

        processData.value.isFormSubmitted = false;
        await connectGAS('updateEvent', finalData.value)
        isLock.value = true;
        lockForm();
    }
</script>