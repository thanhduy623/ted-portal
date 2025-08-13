<template>
    <div>
        <CompTitlePage :titlePage="titlePage" />

        <form class="filter-container">
            <!-- Bộ lọc, ngày bắt đầu, ngày kết thúc -->
            <div class="flex-row-container">
                <div class="input-error-group">
                    <label>Chọn phân bộ lọc (bắt buộc)</label>
                    <select v-model="filterSelect">
                        <option :value="0">Tổng quát</option>
                        <option :value="1">Chi tiết</option>
                        <option :value="2">Tính lỗi</option>
                        <option :value="3">Ca chạy</option>
                        <option :value="4">Ban tổ chức</option>
                    </select>
                </div>
                <InputDate v-model:processData="processData" fieldName="startDate" labelName="Ngày bắt đầu" />
                <InputDate v-model:processData="processData" fieldName="endDate" labelName="Ngày kết thúc" />
            </div>

            <!-- Nhân sự và sự kiện -->
            <div class="flex-row-container">
                <SelectTeddyActive v-model:processData="processData" fieldName="idTeddy" labelName="Nhân sự" />
                <SelectEventActive v-model:processData="processData" fieldName="idEvent" labelName="Sự kiện" />
                <div class="input-error-group"></div>
            </div>


            <!-- Nhóm các nút chức năng -->
            <div class="flex-row-container right">
                <button type="reset" @click.prevent="cleanForm">LÀM MỚI</button>
                <button type="button" @click.prevent="handleExport"> XUẤT EXCEL </button>
                <button type="submit" @click.prevent="submitForm" class="primary">TRUY XUẤT</button>
            </div>
        </form>
        <br>

        <!-- Component bảng để hiển thị dữ liệu -->
        <CompTableData v-if="processData.isFormSubmitted" :columnsConfig="columnsConfig" :tablesConfig="tablesConfig"
            style="white-space: pre-line;" />

    </div>
</template>

<script setup>
    import { ref, computed, watch, onMounted, nextTick } from 'vue'
    import { useRouter, useRoute } from 'vue-router'
    import { exportToExcel } from '@/utils/exportExcel'
    import { connectGAS } from '@/utils/connectGAS'
    import { filterSOM } from './filterSOM.js';

    import CompTitlePage from '@/components/CompTitlePage.vue'
    import CompTableData from '@/components/CompTableData.vue'

    import InputBase from '@/components/inputs/InputBase.vue'
    import InputDate from '@/components/inputs/InputDate.vue'

    import SelectTeddyActive from '@/components/selects/SelectTeddyActive.vue'
    import SelectEventActive from '@/components/selects/SelectEventActive.vue'


    const titlePage = 'Thống kê S-O-M'

    // Dữ liệu trả về từ GAS
    const shiftsData = ref([])
    const organizationData = ref([])
    const mistakesData = ref([])


    // Dữ liệu quản lý bảng
    const filterSelect = ref(0)
    const tablesConfig = ref([])
    const columnsConfig = ref([])

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

    // HÀM: Làm mới form
    function cleanForm() {
        processData.value.inputData.idTeddy = ''
        processData.value.inputData.idEvent = ''
        processData.value.inputData.startDate = ''
        processData.value.inputData.endDate = ''
    }

    // HÀM: Gửi form
    async function submitForm() {
        console.clear();
        processData.value.isFormSubmitted = true;
        await nextTick();

        if (isFormValid.value) {
            const res = await connectGAS('filterSOM', finalData.value)
            if (!res.success) { return }

            shiftsData.value = res.data.shiftData || []
            organizationData.value = res.data.organizationData || []
            mistakesData.value = res.data.mistakeData || []

            updateTable()
        }
    }


    // HÀM: Cập nhật bảng
    function updateTable() {
        const { columnsConfig: cols, tablesConfig: tbl } = filterSOM(
            filterSelect.value,
            shiftsData.value,
            organizationData.value,
            mistakesData.value
        )
        columnsConfig.value = cols
        tablesConfig.value = tbl
    }

    function handleExport() {
        exportToExcel(columnsConfig.value, tablesConfig.value, "teddy_data.xlsx");
    }

    // Watch: Khi đổi filterSelect
    watch(filterSelect, () => {
        if (shiftsData.value.length || organizationData.value.length || mistakesData.value.length) {
            updateTable()
        }
    })
</script>