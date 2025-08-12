<template>
    <div>
        <compTitlePage :titlePage="titlePage" />
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

    const titlePage = 'Cập nhật sự kiện'
    const idParam = useRoute().params.id;
    const isLock = ref(true)

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

    // Gán thông tin ban đầu
    onMounted(() => {
        getInfoTeddy(idParam);
        lockForm()
    });

    // Lấy thông tin teddy
    async function getInfoTeddy(id) {
        const res = await connectGAS("getEventByConditions", { idEvent: id })
        processData.value.inputData = res.data[0]
    }

    // HÀM: Chỉnh sửa form
    function changeForm() {
        unlockForm();
        isLock.value = false;
    }

    // HÀM: Gửi form
    async function submitForm() {
        console.clear();
        processData.value.isFormSubmitted = true;

        if (isFormValid.value) {
            console.table(finalData.value)
            processData.value.isFormSubmitted = false;
            await connectGAS('updateEvent', finalData.value)
            isLock.value = true;
            lockForm();
        }
    }
</script>