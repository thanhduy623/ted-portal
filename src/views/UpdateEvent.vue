<template>
    <div>
        <compTitlePage :titlePage="titlePage" />
        <form>
            <h2>Thông tin chung</h2>
            <!-- Năm học và phân loại -->
            <div class="flex-row-container">
                <selectYear v-model:modelField="dataModel.idSchoolYear"
                    v-model:validateField="dataValidate.idSchoolYear" disabled />

                <SelectEventType v-model:modelField="dataModel.typeEvent" v-model:validateField="dataValidate.typeEvent"
                    disabled />
            </div>
            <!-- Tên sự kiện và tên tắt -->
            <InputBase v-model:modelField="dataModel.nameEvent" v-model:validateField="dataValidate.nameEvent"
                placeholder="Tên đầy đủ của sự kiện" :required="true" />
            <hr>


            <h2>Thời gian bắt đầu và kết thúc</h2>
            <!-- Ngày bắt đầu và ngày kết thúc -->
            <div class="flex-row-container">
                <InputDate v-model:modelField="dataModel.startDate" v-model:validateField="dataValidate.startDate" />
                <InputDate v-model:modelField="dataModel.endDate" v-model:validateField="dataValidate.endDate" />
            </div>

            <!-- Trạng thái và ghi chú -->
            <div class="flex-row-container">
                <SelectEventStatus v-model:modelField="dataModel.status" v-model:validateField="dataValidate.status" />
                <InputBase v-model:modelField="dataModel.takeNote" v-model:validateField="dataValidate.takeNote"
                    placeholder="Ghi chú" :required="false" />
            </div>

            <!-- Nhóm nút chức năng -->
            <div class="flex-row-container right">
                <button v-if="isDisable" @click.prevent="changeData"> THAY ĐỔI </button>
                <button v-if="!isDisable" :disabled="!isFormValid" @click.prevent="submitForm" class="primary"> CẬP NHẬT
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
    import { ref, computed, watch } from 'vue'
    import { useRoute } from 'vue-router'

    import { connectGAS } from '@/utils/connectGAS'
    import formLock from '@/utils/formLockUtils'
    import compTitlePage from '@/components/compTitlePage.vue'

    import SelectYear from '@/components/select/SelectYear.vue'
    import SelectEventType from '@/components/select/SelectEventType.vue'
    import SelectEventStatus from '@/components/select/SelectEventStatus.vue'

    import InputDate from '@/components/inputs/InputDate.vue'
    import InputBase from '@/components/inputs/InputBase.vue'

    // Lấy route hiện tại
    const route = useRoute()

    // Dữ liệu ban đầu
    const titlePage = "Thông tin sự kiện"
    const dataModel = ref({})
    const dataValidate = ref({})
    const isDisable = ref(true)

    // Log khi id thay đổi hoặc khi trang load lần đầu
    watch(
        () => route.params.id,
        async (idParam) => {
            const response = await connectGAS("getEventByConditions", { idEvent: idParam })
            dataModel.value = response.data[0];
            formLock.lockForm()
        },
        { immediate: true }
    );


    // Kiểm tra hợp lệ toàn form
    const isFormValid = computed(() =>
        Object.values(dataValidate.value).every(v => v === true)
    )


    // Change Data event
    function changeData() {
        isDisable.value = false;
        formLock.unlockForm();
    }

    // Submit form
    async function submitForm() {
        isDisable.value = true;
        formLock.lockForm();
        await connectGAS("updateEvent", dataModel.value);
    }

</script>