<template>
    <div class="input-error-group">
        <input v-model="internalValue" :placeholder="placeholder" :required="isRequired" type="date" v-bind="$attrs" />
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

    const emit = defineEmits(['update:processData'])
    const attrs = useAttrs()
    const isRequired = computed(() => 'required' in attrs)

    const internalValue = ref(props.processData?.inputData?.[props.fieldName] || '')
    const errorMessage = ref('')

    // --- Validate function ---
    function validateField(value) {
        const trimmedVal = value?.trim() || ''
        if (isRequired.value && !trimmedVal) {
            return { isValid: false, message: 'Không được để trống' }
        }
        return { isValid: true, message: '' }
    }

    // --- Đồng bộ lên cha ---
    function syncToParent(showError = true) {
        const { isValid, message } = validateField(internalValue.value)
        errorMessage.value = showError ? message : ''

        const newData = structuredClone(toRaw(props.processData || {}))
        if (!newData.inputData) newData.inputData = {}
        if (!newData.validateData) newData.validateData = {}

        newData.inputData[props.fieldName] = internalValue.value
        newData.validateData[props.fieldName] = isValid

        emit('update:processData', newData)
    }

    // --- Cha thay đổi giá trị ---
    watch(
        () => props.processData?.inputData?.[props.fieldName],
        val => (internalValue.value = val ?? '')
    )

    // --- Con thay đổi ---
    watch(internalValue, () => {
        syncToParent(true) // hiện lỗi khi user gõ
    })

    // --- Lần mount ---
    onMounted(() => {
        // Nếu cha chưa có giá trị và required => gán mặc định
        if (!internalValue.value && isRequired.value) {
            const today = new Date()
            const yyyy = today.getFullYear()
            const mm = String(today.getMonth() + 1).padStart(2, '0')
            const dd = String(today.getDate()).padStart(2, '0')
            internalValue.value = `${yyyy}-${mm}-${dd}`
        }
        // Sync nhưng không show lỗi lần đầu
        syncToParent(false)
    })
</script>