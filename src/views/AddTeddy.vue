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
                    placeholder="Nhập mã sinh viên" :required="true" />
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
            <!-- Thế hệ -->
            <div class="flex-row-container">
                <SelectGeneration v-model:modelField="dataModel.generation"
                    v-model:validateField="dataValidate.generation" />
            </div>

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


    const titlePage = "Thêm nhân sự"
    const dataModel = ref({})
    const dataValidate = ref({})

    // Kiểm tra hợp lệ toàn form
    const isFormValid = computed(() =>
        Object.values(dataValidate.value).every(v => v === true)
    )

    // Submit form
    async function submitForm() {
        await connectGAS('addTeddy', dataModel.value);
        cleanForm();
    }

    async function cleanForm() {
        await new Promise(resolve => setTimeout(resolve, 2000))
        window.location.reload();
    }
</script>