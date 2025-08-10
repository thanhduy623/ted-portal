<template>
    <div class="input-error-group">
        <label>ahehe</label>
        <input v-model="internalValue" :placeholder="placeholder" v-bind="$attrs" @blur="touched = true" />
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
</template>


<script setup>
    import { ref, watch, onMounted, computed, useAttrs, toRaw } from 'vue'

    const props = defineProps({
        processData: Object,
        fieldName: String,
        placeholder: String
    })


    // Gán dữ liệu ban đầu và báo lỗi
    const internalValue = ref(props.processData?.inputData?.[props.fieldName] || '')
    const errorMessage = ref('')
    const touched = ref(false)


    // Xử lý sự kiện
    const attrs = useAttrs()
    const isRequired = computed(() => 'required' in attrs)
    const emit = defineEmits(['update:processData'])


    // Đồng bộ khi cha gửi form
    watch(
        () => props.processData?.isFormSubmitted,
        (isSubmitted) => {
            if (isSubmitted) {
                const { isValid, message } = validateField(internalValue.value);
                errorMessage.value = message;
                updateProcessData(internalValue.value, isValid);
            }
        }
    );


    // Đồng bộ khi cha thay đổi
    watch(
        () => props.processData?.inputData?.[props.fieldName],
        val => (internalValue.value = val ?? '')
    )



    // Đồng bộ khi con thay đổi, validate + gửi data
    watch(internalValue, val => {
        const { isValid, message } = validateField(val)
        errorMessage.value = touched.value ? message : ''
        updateProcessData(val, isValid.value)
    })


    // Khởi tạo và xử lý dữ liệu ban đầu
    onMounted(() => {
        const val = props.processData.inputData[props.fieldName] || '';
        const isValid = !isRequired.value;
        updateProcessData(val, isValid)
    });

    function updateProcessData(val, isValid) {
        const newData = { ...props.processData };
        newData.inputData[props.fieldName] = val;
        newData.validateData[props.fieldName] = isValid;
        emit('update:processData', newData);
    }


    // Xác thực dữ liệu và trả về
    function validateField(value) {
        const trimmedVal = value?.trim() || ''

        if (isRequired.value && !trimmedVal) {
            return { isValid: false, message: 'Không được để trống' }
        }

        return { isValid: true, message: '' }
    }
</script>