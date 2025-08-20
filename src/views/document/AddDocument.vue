<template>
    <div>
        <form>
            <!-- Tên và mã sự kiện -->
            <div class="flex-row-container">
                <InputBase v-model:processData="processData" fieldName="eventName" labelName="Tên sự kiện" required
                    disabled />
                <InputBase v-model:processData="processData" fieldName="idEvent" labelName="Mã sự kiện" required
                    disabled />
            </div>

            <div class="flex-row-container">
                <input type="file" id="fileInput" multiple accept=".pdf" @change="handleFileSelect" />
                <input type="text"
                    :value="`Đã sử dụng ${memory.used} / ${memory.total} GB (Còn: ${memory.remaining} GB)`" disabled />
            </div>

            <!-- Nhóm các nút chức năng -->
            <div class="flex-row-container right">
                <button type="submit" @click.prevent="submitFile" class="primary"> TẠO MỚI</button>
            </div>

            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Tên file</th>
                            <th>Dung lượng</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(file, index) in pendingFiles" :key="file.name + index">
                            <td>{{ file.name }}</td>
                            <td>{{ (file.size / 1024 / 1024).toFixed(2) }} MB</td>
                            <td>
                                <button @click="removeFile(index)">Xóa</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </form>

        <br>
        <compTableData :columnsConfig="columnsConfig" :tablesConfig="tablesConfig" />

    </div>
</template>

<script setup>
    import { ref, computed, onMounted, nextTick } from 'vue'
    import { useRouter, useRoute } from 'vue-router'
    import { connectGAS } from '@/utils/connectGAS'
    import eventBus from '@/utils/eventBus';

    import compTitlePage from '@/components/compTitlePage.vue'
    import compTableData from "@/components/compTableData.vue"

    import InputBase from '@/components/inputs/InputBase.vue'
    import InputDate from '@/components/inputs/InputDate.vue'

    import SelectSchoolYear from '@/components/selects/SelectSchoolYear.vue'
    import SelectTeddyActive from '@/components/selects/SelectTeddyActive.vue'
    import SelectShift from '@/components/selects/SelectShift.vue'

    import CheckShiftPostion from '@/components/checks/CheckShiftPostion.vue'


    //PROPS: Các biến nhận vào
    const props = defineProps({
        dataSelected: { type: Object, required: true },
    })


    // Data tập trung
    const pendingFiles = ref([])
    const processData = ref({
        inputData: {},
        validateData: {},
        extraData: {},
        isFormSubmitted: false
    })


    // COMPUTED: Hợp nhất dữ liệu: inputData + extraData
    const finalData = computed(() => ({
        ...processData.value.inputData,
        ...processData.value.extraData
    }))


    // VALID: Kiểm tra validateData (tất cả đều hợp lệ)
    const isFormValid = computed(() => {
        const validateData = processData.value.validateData || {}
        return Object.values(validateData).length > 0 &&
            Object.values(validateData).every(v => v === true)
    })


    // HÀM: Làm mới form
    function handleFileSelect(event) {
        const files = Array.from(event.target.files)

        files.forEach(file => {
            if (file.type !== 'application/pdf') {
                alert(`File "${file.name}" không phải PDF và sẽ bị bỏ qua.`)
                return
            }
            // Tránh trùng tên file
            if (!pendingFiles.value.some(f => f.name === file.name && f.size === file.size)) {
                pendingFiles.value.push(file)
            }
        })

        // Reset input để chọn lại file lần nữa
        event.target.value = ''
    }

    // Xóa file khỏi danh sách chờ
    function removeFile(index) {
        pendingFiles.value.splice(index, 1)
    }

    // Chuyển file thành Base64
    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(',')[1]); // chỉ lấy Base64
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });
    }

    // HÀM: Gửi form
    async function submitFile() {
        console.clear();
        processData.value.isFormSubmitted = true;
        await nextTick();

        if (!isFormValid.value) {
            alert("Form chưa hợp lệ");
            return;
        }

        processData.value.isFormSubmitted = false;

        if (!pendingFiles.value.length) {
            alert("Chưa có file nào để upload");
            return;
        }

        // Chuẩn bị dữ liệu gửi lên GAS (Base64)
        const payload = {
            idEvent: processData.value.inputData.idEvent,
            listFile: await Promise.all(pendingFiles.value.map(async (f) => ({
                name: f.name,
                content: await fileToBase64(f), // gửi Base64
                mimeType: f.type
            })))
        };

        // Gọi API upload
        const res = await connectGAS('addDocument', payload);

        if (!res.success) {
            alert(res.message || "Upload thất bại");
            return;
        }

        // Cập nhật bảng và dung lượng
        tablesConfig.value = res.data?.reverse() || [];
        memory.value = res.storage || memory.value;

        // Xóa danh sách file chờ
        pendingFiles.value = [];

        alert(`Upload thành công ${res.resultsUpload?.length || 0} file`);
    }



    /********************************************************************************
    ********************************* BẢNG DỮ LIỆU **********************************
    *********************************************************************************/



    // MOUNTED: Gán dữ liệu và form và tải dữ liệu
    const tablesConfig = ref([])
    onMounted(async () => {
        const { idEvent, eventName } = props.dataSelected
        processData.value.inputData.idEvent = idEvent
        processData.value.inputData.eventName = eventName
        const res = await connectGAS('getAllDocument', { idEvent }, false)

        if (!res.success) { return }
        tablesConfig.value = res.data;
        memory.value = res.storage;
    })


    const deleteRow = async row => {
        if (!await eventBus.confirm(`Bạn có muốn xóa tài liệu "${row.fileName}" ?`)) return;

        const res = await connectGAS("deleteDocument", {
            idEvent: processData.value.inputData.idEvent,
            fileId: row.fileId,
        });

        if (res.success) {
            // Xóa khỏi bảng
            tablesConfig.value = tablesConfig.value.filter(i => i.fileId !== row.fileId);
            // Cập nhật dung lượng
            memory.value = res.storage || memory.value;
        } else {
            console.error(res.message || "Xóa thất bại");
            alert(res.message || "Xóa thất bại");
        }
    };


    // DATA: Khởi tạo cấu trúc bảng
    const memory = ref({
        used: 0,
        total: 0,
        remaining: 0
    })

    const columnsConfig = [
        { label: 'Mã tài liệu', key: 'fileId' },
        { label: 'Tên tài liệu', key: 'fileName' },
        { label: 'Kích thước', key: 'size' },
        { label: 'Ngày tạo', key: 'createdAt' },
        {
            label: 'Chức năng',
            key: 'actions',
            actions: [
                { label: 'Xem tài liệu', icon: 'bi bi-eye-fill', action: (row) => { window.open(row.url, '_blank') } },
                { label: 'Xóa tài liệu', icon: 'bi bi-trash3-fill', action: deleteRow },
            ]
        }
    ]
</script>