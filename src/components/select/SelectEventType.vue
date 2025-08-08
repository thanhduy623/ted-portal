<template>
    <div class="input-error-group">
        <select v-model="internalValue" v-bind="$attrs">
            <option v-for="(opt, index) in options" :key="index" :value="opt.key">
                {{ opt.name }}
            </option>
        </select>
    </div>
</template>

<script setup>
    import { ref, watch, onMounted } from 'vue'
    import { sessionGet } from '@/utils/sessionStore'

    const emit = defineEmits(['update:modelField', 'update:validateField'])

    const props = defineProps({
        modelField: String,
        validateField: Boolean
    })

    // ✅ Dữ liệu options cố định
    const options = [
        { key: "EE", name: "Sự kiện năm học" },
        { key: "IE", name: "Sự kiện nội bộ" },
    ]

    // ✅ Gán giá trị mặc định nếu chưa có
    const internalValue = ref(props.modelField || options[0]?.key || '')

    // Truyền dữ liệu ban đầu
    onMounted(() => {
        emit('update:modelField', internalValue.value)
        emit('update:validateField', true)
    })

    // Đồng bộ từ cha → nội bộ
    watch(() => props.modelField, val => {
        internalValue.value = val
    })

    // Đồng bộ từ nội bộ → cha
    watch(internalValue, val => {
        emit('update:modelField', val)
    })
</script>