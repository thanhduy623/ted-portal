<template>
  <div>
    <compTitlePage :titlePage="titlePage" />
    <form>
      <h2>Thông tin cá nhân</h2>
      <div class="flex-row-container">
        <InputBase v-model:processData="processData" fieldName="lastName" placeholder="Nhập họ lót" required />
        <InputBase v-model:processData="processData" fieldName="firstName" placeholder="Nhập tên" />
      </div>

      <div class="flex-row-container">
        <InputDate v-model:processData="processData" fieldName="birthday" />
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
  import compTitlePage from '@/components/compTitlePage.vue'
  import InputBase from '@/components/inputs/InputBase.vue'
  import InputDate from '@/components/inputs/InputDate.vue'
  import { connectGAS } from '@/utils/connectGAS'

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

  async function submitForm() {
    console.clear();
    processData.value.isFormSubmitted = true;
    console.table(processData.value.validateData)
    console.table(finalData.value)

    // await connectGAS('addTeddy', finalData.value)
    // cleanForm()
  }

  function cleanForm() {
    window.location.reload()
  }


  onMounted(() => {
    console.table(processData.value.validateData)
  });
</script>