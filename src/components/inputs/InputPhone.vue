<template>
    <div class="input-error-group">
        <input v-model="internalValue" :placeholder="placeholder" :required="required" @blur="validate" type="text"
            maxlength="10" />
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
</template>

<script setup>
    import { ref, watch, onMounted } from 'vue'

    // Props
    const props = defineProps({
        modelField: String,
        validateField: Boolean,
        placeholder: String,
        required: Boolean
    })

    // Emits
    const emit = defineEmits(['update:modelField', 'update:validateField'])

    // Nội bộ
    const internalValue = ref(props.modelField)
    const errorMessage = ref('')

    // Đồng bộ từ cha
    watch(() => props.modelField, val => {
        internalValue.value = val
    })

    // Đồng bộ lên cha + validate
    watch(internalValue, val => {
        emit('update:modelField', val)
        validate()
    })

    // Đồng bộ validate từ cha
    watch(() => props.validateField, val => {
        errorMessage.value = val || !props.required ? '' : 'Không được để trống'
    })

    // onMounted: nếu không required thì valid mặc định
    onMounted(() => {
        emit('update:validateField', !props.required)
    })

    // Hàm kiểm tra hợp lệ
    function validate() {
        let isValid = true
        const val = internalValue.value?.trim() || ''

        if (!val) {
            isValid = false
            errorMessage.value = 'Không được để trống'
        } else if (!/^0\d{9}$/.test(val)) {
            isValid = false
            errorMessage.value = 'Sai định dạng só điện thoại'
        } else {
            errorMessage.value = ''
        }

        emit('update:validateField', isValid)
    }

</script>