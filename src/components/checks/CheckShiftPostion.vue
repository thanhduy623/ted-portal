<template>
    <div class="input-error-group">
        <label>{{ labelName }}</label>
        <input class="inputMulti" type="text" :value="displayText"
            :placeholder="'Chọn ' + props.labelName.toLowerCase()" readonly @focus="openDropdown" @click="openDropdown">
        <div class="optionList" v-show="open">
            <label class="optionItem" v-for="(item, index) in options" :key="index">
                <input type="checkbox" v-model="item.checked">
                <p>{{ item[fieldData] }}</p>
            </label>
        </div>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
</template>

<script setup>
    import { ref, computed, watch, onMounted, onUnmounted, useAttrs } from 'vue'

    const props = defineProps({
        processData: Object,
        fieldName: String,
        labelName: String
    })

    const fieldKey = 'key'
    const fieldData = 'key'

    const options = ref([
        { key: "Tác nghiệp", checked: false },
        { key: "Điểm danh", checked: false },
        { key: "Điều phối ngoài", checked: false },
        { key: "Điều phối trong", checked: false },
        { key: "Quản lý MC", checked: false },
        { key: "Quản lý cánh gà", checked: false },
        { key: "Quản lý thí sinh", checked: false },
        { key: "Quản lý khách mời", checked: false },
        { key: "Chăm sóc nội bộ", checked: false },
        { key: "Kỹ thuật - Âm thanh", checked: false },
        { key: "Kỹ thuật - Ánh sáng", checked: false },
        { key: "Kỹ thuật - Màn led", checked: false },
    ])

    // ==== State ====
    const internalValue = ref(props.processData?.inputData?.[props.fieldName] || '')
    const open = ref(false)
    const touched = ref(false)
    const errorMessage = ref('')

    // ==== Common ====
    const attrs = useAttrs()
    const isRequired = computed(() => 'required' in attrs)
    const emit = defineEmits(['update:processData'])

    // ==== Khởi tạo: đồng bộ dữ liệu ban đầu vào checkbox ====
    onMounted(() => {
        const arr = internalValue.value.split(',').map(s => s.trim()).filter(Boolean)
        options.value.forEach(opt => {
            opt.checked = arr.includes(opt[fieldKey])
        })
    })

    // ==== Computed ====
    const selectedValues = computed(() =>
        options.value.filter(opt => opt.checked).map(opt => opt[fieldKey])
    )
    const displayText = computed(() => selectedValues.value.join(', '))

    // ==== Đồng bộ khi cha gửi form ====
    watch(
        () => props.processData?.isFormSubmitted,
        (isSubmitted) => {
            if (isSubmitted) {
                const { isValid, message } = validateField(internalValue.value)
                errorMessage.value = message
                updateProcessData(internalValue.value, isValid)
            }
        }
    )

    // ==== Đồng bộ khi cha thay đổi ====
    watch(
        () => props.processData?.inputData?.[props.fieldName],
        val => {
            internalValue.value = val ?? ''
            const arr = internalValue.value.split(',').map(s => s.trim()).filter(Boolean)
            options.value.forEach(opt => {
                opt.checked = arr.includes(opt[fieldKey])
            })
        }
    )

    // ==== Đồng bộ khi con thay đổi (checkbox) ====
    watch(selectedValues, val => {
        internalValue.value = val.join(', ')
        if (touched.value) {
            const { isValid, message } = validateField(internalValue.value)
            errorMessage.value = message
            updateProcessData(internalValue.value, isValid)
        } else {
            // chỉ update giá trị, không validate
            const newData = { ...props.processData }
            newData.inputData[props.fieldName] = internalValue.value
            emit('update:processData', newData)
        }
    })

    // ==== Mở dropdown ====
    function openDropdown() {
        open.value = true
    }

    // ==== Đóng dropdown khi click ra ngoài ====
    function handleClick(e) {
        if (!e.target.closest('.optionList') && !e.target.closest('.inputMulti')) {
            if (open.value) touched.value = true
            open.value = false
        }
    }
    onMounted(() => document.addEventListener('click', handleClick))
    onUnmounted(() => document.removeEventListener('click', handleClick))

    // ==== Validate ====
    function validateField(val) {
        if (!isRequired.value) {
            return { isValid: true, message: '' }
        }
        if (!val || val.trim() === '') {
            return { isValid: false, message: 'Vui lòng chọn ít nhất một mục' }
        }
        return { isValid: true, message: '' }
    }

    // ==== Update data ====
    function updateProcessData(val, isValid) {
        const newData = { ...props.processData }
        newData.inputData[props.fieldName] = val
        newData.validateData[props.fieldName] = isValid
        emit('update:processData', newData)
    }
</script>

<style>
    @import url("@/assets/css/inputMulti.css");
</style>