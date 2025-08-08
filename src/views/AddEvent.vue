<template>
    <div>
        <compTitlePage :titlePage="titlePage" />
        <form>
            <h2>Thông tin chung</h2>
            <!-- Năm học và phân loại -->
            <div class="flex-row-container">
                <selectYear v-model:modelField="eventModel.idSchoolYear"
                    v-model:validateField="eventValidate.idSchoolYear" />

                <SelectEventType v-model:modelField="eventModel.typeEvent"
                    v-model:validateField="eventValidate.typeEvent" />
            </div>
            <!-- Tên sự kiện và tên tắt -->
            <InputBase v-model:modelField="eventModel.nameEvent" v-model:validateField="eventValidate.nameEvent"
                placeholder="Tên đầy đủ của sự kiện" :required="true" />
            <hr>


            <h2>Thời gian bắt đầu và kết thúc</h2>
            <!-- Ngày bắt đầu và ngày kết thúc -->
            <div class="flex-row-container">
                <InputDate v-model:modelField="eventModel.startDate" v-model:validateField="eventValidate.startDate" />
                <InputDate v-model:modelField="eventModel.endDate" v-model:validateField="eventValidate.endDate" />
            </div>

            <!-- Trạng thái và ghi chú -->
            <div class="flex-row-container">
                <SelectEventStatus v-model:modelField="eventModel.status"
                    v-model:validateField="eventValidate.status" />
                <InputBase v-model:modelField="eventModel.takeNote" v-model:validateField="eventValidate.takeNote"
                    placeholder="Ghi chú" :required="false" />
            </div>


            <!-- Nhóm nút chức năng -->
            <div class="flex-row-container right">
                <button @click.prevent="cleanForm"> LÀM MỚI </button>
                <button :disabled="!isFormValid" @click.prevent="submitForm" class="primary"> TẠO MỚI </button>
            </div>
        </form>
    </div>
</template>

<script setup>
    import { ref, computed } from 'vue'
    import { connectGAS } from '@/utils/connectGAS'
    import compTitlePage from '@/components/compTitlePage.vue'

    import SelectYear from '@/components/select/SelectYear.vue'
    import SelectEventType from '@/components/select/SelectEventType.vue'
    import SelectEventStatus from '@/components/select/SelectEventStatus.vue'

    import InputDate from '@/components/inputs/InputDate.vue'
    import InputBase from '@/components/inputs/InputBase.vue'


    const titlePage = "Thêm sự kiện năm học"
    const eventModel = ref({})
    const eventValidate = ref({})

    // Kiểm tra hợp lệ toàn form
    const isFormValid = computed(() =>
        Object.values(eventValidate.value).every(v => v === true)
    )

    // Submit form
    async function submitForm() {
        await connectGAS('addEvent', eventModel.value);
        cleanForm();
    }

    async function cleanForm() {
        await new Promise(resolve => setTimeout(resolve, 2000))
        window.location.reload();
    }
</script>