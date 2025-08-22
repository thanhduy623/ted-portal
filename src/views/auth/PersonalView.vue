<template>
    <div>
        <form>
            <h2>Thông tin cá nhân</h2>
            <!-- Họ và tên -->
            <div class="flex-row-container">
                <InputBase v-model:processData="processData" fieldName="lastName" labelName="Họ, chữ lót" disabled />
                <InputBase v-model:processData="processData" fieldName="firstName" labelName="Tên gọi" disabled />
            </div>

            <!-- Ngày sinh, giới tính -->
            <div class="flex-row-container">
                <InputDate v-model:processData="processData" fieldName="birthday" labelName="Ngày sinh" disabled />
                <SelectGender v-model:processData="processData" fieldName="gender" disabled />
            </div>


            <h2>Thông tin sinh viên</h2>
            <!-- Mã sinh viên, khoa -->
            <div class="flex-row-container">
                <InputStudent v-model:processData="processData" fieldName="idTeddy" labelName="Mã sinh viên" disabled />
                <SelectFaculty v-model:processData="processData" fieldName="studentFaculty" disabled />
            </div>

            <!-- Số điện thoại, mail cá nhân -->
            <div class="flex-row-container">
                <InputPhone v-model:processData="processData" fieldName="phone" labelName="Số điện thoại" disabled />
                <InputMail v-model:processData="processData" fieldName="personalMail" labelName="Mail cá nhân"
                    disabled />
            </div>


            <h2>Thông tin thành viên</h2>
            <!-- Bộ phận, vai trò -->
            <div class="flex-row-container">
                <SelectTeam v-model:processData="processData" fieldName="idTeam" disabled />
                <SelectPosition v-model:processData="processData" fieldName="position" disabled />
            </div>

            <!-- Thế hệ -->
            <div class="flex-row-container">
                <SelectGeneration v-model:processData="processData" fieldName="generation" disabled />
                <SelectTeddyStatus v-model:processData="processData" fieldName="status" disabled />
            </div>
        </form>
    </div>
</template>

<script setup>
    import { ref, computed, onMounted, watch, nextTick } from 'vue'
    import { useRouter, useRoute } from 'vue-router'
    import { connectGAS } from '@/utils/connectGAS'
    import { sessionGet } from '@/utils/sessionStore'
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

    const processData = ref({
        inputData: {},
        validateData: {},
        extraData: {},
        isFormSubmitted: false
    })

    processData.value.inputData = sessionGet("user");
</script>