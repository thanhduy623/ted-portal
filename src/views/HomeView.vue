<template>
  <div>
    <compTitlePage :titlePage="titlePage" />
    <form>
      <h2>Thông tin cá nhân</h2>
      <div class="flex-row-container">
        <InputBase v-model:processData="processData" fieldName="lastName" labelName="Họ, chữ lót" required />
        <InputBase v-model:processData="processData" fieldName="firstName" labelName="Tên gọi" required />
      </div>

      <div class="flex-row-container">
        <InputDate v-model:processData="processData" fieldName="birthday" labelName="Ngày sinh" required />
        <InputMail v-model:processData="processData" fieldName="personalMail" labelName="Mail cá nhân" required />
      </div>

      <div class="flex-row-container right">
        <button @click.prevent="cleanForm">LÀM MỚI</button>
        <button @click.prevent="submitForm" class="primary"> TẠO MỚI</button>
      </div>
    </form>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { connectGAS } from '@/utils/connectGAS'

  import compTitlePage from '@/components/compTitlePage.vue'

  import InputBase from '@/components/inputs/InputBase.vue'
  import InputDate from '@/components/inputs/InputDate.vue'
  import InputMail from '@/components/inputs/InputMail.vue'


  const titlePage = 'Thêm nhân sự'

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
    console.log(isFormValid.value);
    console.table(processData.value.validateData)



    if (isFormValid.value) {
      console.table(finalData.value)
      processData.value.isFormSubmitted = false;

      // await connectGAS('addTeddy', finalData.value)
      // cleanForm()
    }
  }


  function cleanForm() {
    window.location.reload()
  }


  onMounted(() => {
    console.table(processData.value.validateData)
  });
</script>