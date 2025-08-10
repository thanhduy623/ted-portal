<template>
    <div class="input-error-group">
        <label>Danh mục khoa</label>
        <select v-model="internalValue" v-bind="$attrs" @blur="touched = true">
            <option value="" disabled>Chọn tên khoa</option>
            <option v-for="(item, index) in options" :value="item[fieldKey]">{{item[fieldData]}}</option>
        </select>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
</template>


<script setup>
    import { ref, watch, onMounted, computed, useAttrs, toRaw } from 'vue'
    import { sessionGet } from '@/utils/sessionStore'

    const props = defineProps({
        processData: Object,
        fieldName: String,
        labelName: String
    })


    // Gán 2 trường dữ liệu và gọi danh sách
    const fieldKey = 'key'
    const fieldData = 'studentFaculty'
    const options = sessionGet("masterData")?.facultyList || []


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
        errorMessage.value = message
        updateProcessData(val, isValid)
    })


    // Khởi tạo ban đầu
    onMounted(() => {
        const val = props.processData.inputData[props.fieldName] || '';
        const isValid = !isRequired.value;
        updateProcessData(val, isValid)
    });


    // HÀM: Lấy giá trị theo key được chọn
    function dataMatchKey(key) {
        const selectedItem = options.find(o => o[fieldKey] === key)
        return selectedItem ? selectedItem[fieldData] : ''
    }


    // Lấy giá trị cũ và cập nhật mới
    function updateProcessData(val, isValid) {
        const newData = { ...props.processData };
        newData.inputData[props.fieldName] = val;
        newData.validateData[props.fieldName] = isValid;
        newData.extraData[fieldData] = dataMatchKey(val);
        emit('update:processData', newData);
    }


    // Xác thực dữ liệu và trả về
    function validateField(value) {
        // Nếu không bắt buộc thì luôn hợp lệ
        if (!isRequired.value) {
            return { isValid: true, message: '' }
        }

        // Nếu bắt buộc, kiểm tra giá trị đã chọn
        if (value === '' || value === null || value === undefined) {
            return { isValid: false, message: 'Vui lòng chọn dữ liệu' }
        }

        return { isValid: true, message: '' }
    }

</script>