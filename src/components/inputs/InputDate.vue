<template>
    <div class="input-error-group">
        <input v-model="internalValue" :placeholder="placeholder" :required="required" @blur="validate" v-bind="$attrs"
            type="date" />
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
        if (!props.modelField) {
            if (props.required) {
                const today = new Date()
                const yyyy = today.getFullYear()
                const mm = String(today.getMonth() + 1).padStart(2, '0')
                const dd = String(today.getDate()).padStart(2, '0')
                internalValue.value = `${yyyy}-${mm}-${dd}`

                emit('update:modelField', internalValue.value)
            } else {
                internalValue.value = ''  // hoặc null
                emit('update:modelField', '') // hoặc không emit gì cả nếu muốn cha rỗng hoàn toàn
            }
        }

        emit('update:validateField', !props.required)
    })


    // Hàm kiểm tra hợp lệ
    function validate() {
        const isValid = props.required
            ? internalValue.value?.trim() !== ''
            : true

        errorMessage.value = isValid || !props.required ? '' : 'Không được để trống'
        emit('update:validateField', isValid)
    }

</script>