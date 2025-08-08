<template>
    <div>
        <compTitlePage :titlePage="titlePage" />
        <form>
            <h2>Thông tin cá nhân</h2>
            <!-- Nhóm họ và tên -->
            <div class="flex-row-container">
                <InputBase v-model:modelField="teddyModel.lastName" v-model:validateField="teddyValidate.lastName"
                    placeholder="Nhập họ lót" :required="true" />
                <InputBase v-model:modelField="teddyModel.firstName" v-model:validateField="teddyValidate.firstName"
                    placeholder="Nhập tên" :required="true" />
            </div>
            <!-- Giới tính và ngày sinh -->
            <div class="flex-row-container">
                <selectGender v-model:modelField="teddyModel.gender" v-model:validateField="teddyValidate.gender" />
                <InputDate v-model:modelField="teddyModel.birthday" v-model:validateField="teddyValidate.birthday"
                    :required="true" />
            </div>


            <h2>Thông tin sinh viên</h2>
            <!-- Mã sinh viên và khoa -->
            <div class="flex-row-container">
                <InputStudent v-model:modelField="teddyModel.idTeddy" v-model:validateField="teddyValidate.idTeddy"
                    placeholder="Nhập mã sinh viên" :required="true" />
                <SelectFaculty v-model:modelField="teddyModel.studentFaculty"
                    v-model:validateField="teddyValidate.studentFaculty" />
            </div>
            <!-- Số điện thoại và mail cá nhân -->
            <div class="flex-row-container">
                <InputPhone v-model:modelField="teddyModel.phone" v-model:validateField="teddyValidate.phone"
                    placeholder="Nhập số điện thoại" :required="true" />
                <InputMail v-model:modelField="teddyModel.personalMail"
                    v-model:validateField="teddyValidate.personalMail"
                    placeholder="Địa chỉ mail cá nhân (teddy@gmail.com)" :required="true" />
            </div>


            <h2>Thông tin nhân sự</h2>
            <!-- Bộ phận và chức vụ -->
            <div class="flex-row-container">
                <selectTeam v-model:modelField="teddyModel.idTeam" v-model:validateField="teddyValidate.idTeam" />
                <selectPosition v-model:modelField="teddyModel.position"
                    v-model:validateField="teddyValidate.position" />
            </div>
            <!-- Thế hệ và trạng thái -->
            <div class="flex-row-container">
                <SelectGeneration v-model:modelField="teddyModel.generation"
                    v-model:validateField="teddyValidate.generation" />
                <SelectTeddyStatus v-model:modelField="teddyModel.status"
                    v-model:validateField="teddyValidate.status" />
            </div>

            <div class="flex-row-container right">
                <button @click.prevent="cleanForm"> LÀM MỚI </button>
                <button :disabled="!isFormValid" @click.prevent="submitForm" class="primary"> TẠO MỚI </button>
            </div>
        </form>
    </div>
</template>

<script setup>
    import { ref, computed, watch } from 'vue'
    import { useRoute } from 'vue-router'

    import { connectGAS } from '@/utils/connectGAS'
    import compTitlePage from '@/components/compTitlePage.vue'

    import InputBase from '@/components/inputs/InputBase.vue'
    import InputDate from '@/components/inputs/InputDate.vue'
    import InputStudent from '@/components/inputs/InputStudent.vue'
    import InputPhone from '@/components/inputs/InputPhone.vue'
    import InputMail from '@/components/inputs/InputMail.vue'

    import SelectGender from '@/components/select/SelectGender.vue'
    import SelectTeam from '@/components/select/SelectTeam.vue'
    import SelectPosition from '@/components/select/SelectPosition.vue'
    import SelectGeneration from '@/components/select/SelectGeneration.vue'
    import SelectFaculty from '@/components/select/SelectFaculty.vue'
    import SelectTeddyStatus from '@/components/select/SelectTeddyStatus.vue'

    // Lấy route hiện tại
    const route = useRoute()

    // Dữ liệu ban đầu
    const titlePage = "Thông tin nhân sự"
    const teddyModel = ref({})
    const teddyValidate = ref({})

    // Log khi id thay đổi hoặc khi trang load lần đầu
    watch(
        () => route.params.id,
        async (newId) => {
            console.log('ID trên URL:', newId);
            if (newId) {
                try {
                    // Gọi hàm connectGAS và đợi kết quả
                    const response = await connectGAS("getTeddyByConditions", { idTeddy: newId });
                    console.log('Kết quả từ GAS:', response.data);

                    // KIỂM TRA: Dữ liệu trả về là một mảng, cần lấy phần tử đầu tiên
                    // Sử dụng 'response.data[0]' để lấy đối tượng nhân sự từ mảng
                    if (response.data && response.data.length > 0) {
                        teddyModel.value = response.data[0];
                        console.log('Dữ liệu nhân sự đã tải:', teddyModel.value);
                    } else {
                        console.warn("Không tìm thấy dữ liệu cho ID này.");
                        teddyModel.value = {};
                    }
                } catch (error) {
                    console.error("Có lỗi khi lấy dữ liệu từ Google Apps Script:", error);
                }
            } else {
                // Xử lý trường hợp không có id, ví dụ: reset teddyModel
                teddyModel.value = {};
            }
        },
        { immediate: true }
    );


    // Kiểm tra hợp lệ toàn form
    const isFormValid = computed(() =>
        Object.values(teddyValidate.value).every(v => v === true)
    )

    // Submit form
    async function submitForm() {
        await connectGAS('addTeddy', teddyModel.value)
        cleanForm()
    }

    async function cleanForm() {
        await new Promise(resolve => setTimeout(resolve, 2000))
        window.location.reload()
    }
</script>