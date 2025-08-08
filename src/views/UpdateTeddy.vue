<template>
    <div>
        <compTitlePage :titlePage="titlePage" />
        <form>
            <h2>Thông tin cá nhân</h2>
            <!-- Nhóm họ và tên -->
            <div class="flex-row-container">
                <InputBase v-model:modelField="dataModel.lastName" v-model:validateField="dataValidate.lastName"
                    placeholder="Nhập họ lót" :required="true" />
                <InputBase v-model:modelField="dataModel.firstName" v-model:validateField="dataValidate.firstName"
                    placeholder="Nhập tên" :required="true" />
            </div>
            <!-- Giới tính và ngày sinh -->
            <div class="flex-row-container">
                <selectGender v-model:modelField="dataModel.gender" v-model:validateField="dataValidate.gender" />
                <InputDate v-model:modelField="dataModel.birthday" v-model:validateField="dataValidate.birthday"
                    :required="true" />
            </div>


            <h2>Thông tin sinh viên</h2>
            <!-- Mã sinh viên và khoa -->
            <div class="flex-row-container">
                <InputStudent v-model:modelField="dataModel.idTeddy" v-model:validateField="dataValidate.idTeddy"
                    placeholder="Nhập mã sinh viên" :required="true" disabled />
                <SelectFaculty v-model:modelField="dataModel.studentFaculty"
                    v-model:validateField="dataValidate.studentFaculty" />
            </div>
            <!-- Số điện thoại và mail cá nhân -->
            <div class="flex-row-container">
                <InputPhone v-model:modelField="dataModel.phone" v-model:validateField="dataValidate.phone"
                    placeholder="Nhập số điện thoại" :required="true" />
                <InputMail v-model:modelField="dataModel.personalMail" v-model:validateField="dataValidate.personalMail"
                    placeholder="Địa chỉ mail cá nhân (teddy@gmail.com)" :required="true" />
            </div>


            <h2>Thông tin nhân sự</h2>
            <!-- Bộ phận và chức vụ -->
            <div class="flex-row-container">
                <selectTeam v-model:modelField="dataModel.idTeam" v-model:validateField="dataValidate.idTeam" />
                <selectPosition v-model:modelField="dataModel.position" v-model:validateField="dataValidate.position" />
            </div>
            <!-- Thế hệ và trạng thái -->
            <div class="flex-row-container">
                <SelectGeneration v-model:modelField="dataModel.generation"
                    v-model:validateField="dataValidate.generation" />
                <SelectTeddyStatus v-model:modelField="dataModel.status" v-model:validateField="dataValidate.status" />
            </div>

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

    import InputBase from '@/components/inputs/InputBase.vue'
    import InputDate from '@/components/inputs/InputDate.vue'
    import InputStudent from '@/components/inputs/InputStudent.vue'
    import InputPhone from '@/components/inputs/InputPhone.vue'
    import InputMail from '@/components/inputs/InputMail.vue'

    import SelectGender from '@/components/select/SelectGender.vue'
    import SelectTeam from '@/components/select/SelectTeam.vue'
    import SelectPosition from '@/components/select/SelectPosition.vue'
    import SelectGeneration from '@/components/select/SelectGeneration.vue'
    import SelectFaculty from '@/components/select/SelectFaculty.vue'
    import SelectTeddyStatus from '@/components/select/SelectTeddyStatus.vue'

    // Lấy route hiện tại
    const route = useRoute()

    // Dữ liệu ban đầu
    const titlePage = "Thông tin nhân sự"
    const dataModel = ref({})
    const dataValidate = ref({})
    const isDisable = ref(true)

    // Log khi id thay đổi hoặc khi trang load lần đầu
    watch(
        () => route.params.id,
        async (idParam) => {
            const response = await connectGAS("getTeddyByConditions", { idTeddy: idParam })
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
        await connectGAS("updateTeddy", dataModel.value);
    }

</script>