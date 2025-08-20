<template>
    <div>
        <form>
            <h2>Thông tin cá nhân</h2>
            <!-- Họ và tên -->
            <div class="flex-row-container">
                <InputBase v-model:processData="processData" fieldName="lastName" labelName="Họ, chữ lót" required
                    disabled />
                <InputBase v-model:processData="processData" fieldName="firstName" labelName="Tên gọi" required
                    disabled />
            </div>

            <!-- Ngày sinh, giới tính -->
            <div class="flex-row-container">
                <InputDate v-model:processData="processData" fieldName="birthday" labelName="Ngày sinh" />
                <SelectGender v-model:processData="processData" fieldName="gender" />
            </div>


            <h2>Thông tin sinh viên</h2>
            <!-- Mã sinh viên, khoa -->
            <div class="flex-row-container">
                <InputStudent v-model:processData="processData" fieldName="idTeddy" labelName="Mã sinh viên" required
                    disabled />
                <SelectFaculty v-model:processData="processData" fieldName="studentFaculty" required />
            </div>

            <!-- Số điện thoại, mail cá nhân -->
            <div class="flex-row-container">
                <InputPhone v-model:processData="processData" fieldName="phone" labelName="Số điện thoại" required />
                <InputMail v-model:processData="processData" fieldName="personalMail" labelName="Mail cá nhân" />
            </div>


            <h2>Thông tin thành viên</h2>
            <!-- Bộ phận, vai trò -->
            <div class="flex-row-container">
                <SelectTeam v-model:processData="processData" fieldName="idTeam" required />
                <SelectPosition v-model:processData="processData" fieldName="position" required />
            </div>

            <!-- Thế hệ -->
            <div class="flex-row-container">
                <SelectGeneration v-model:processData="processData" fieldName="generation" required disabled />
                <SelectTeddyStatus v-model:processData="processData" fieldName="status" required />
            </div>


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
    import InputStudent from '@/components/inputs/InputStudent.vue'
    import InputMail from '@/components/inputs/InputMail.vue'
    import InputPhone from '@/components/inputs/InputPhone.vue'

    import SelectGender from '@/components/selects/SelectGender.vue'
    import SelectFaculty from '@/components/selects/SelectFaculty.vue'
    import SelectTeam from '@/components/selects/SelectTeam.vue'
    import SelectPosition from '@/components/selects/SelectPosition.vue'
    import SelectGeneration from '@/components/selects/SelectGeneration.vue'
    import SelectTeddyStatus from '@/components/selects/SelectTeddyStatus.vue'

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

    // HÀM: Gửi form
    async function submitForm() {
        console.clear();
        processData.value.isFormSubmitted = true;
        await nextTick();

        if (isFormValid.value) {
            console.table(finalData.value)
            processData.value.isFormSubmitted = false;
            await connectGAS('updateTeddy', finalData.value)
            isLock.value = true;
            lockForm();
        }
    }
</script>