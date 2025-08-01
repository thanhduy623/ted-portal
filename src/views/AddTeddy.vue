<template>
    <div>
        <compTitlePage :titlePage="titlePage" />

        <form>
            <h2>Thông tin cá nhân</h2>
            <div class="flex-row-container">
                <input v-model="infoTeddy.lastName" type="text" placeholder="Nhập họ, chữ lót">
                <input v-model="infoTeddy.firstName" type="text" placeholder="Nhập tên nhân sự">
                <select v-model="infoTeddy.gender">
                    <option value="Nam" selected>Nam</option>
                    <option value="Nữ">Nữ</option>
                </select>
                <input v-model="infoTeddy.birthday" type="date" placeholder="Nhập ngày sinh">
            </div>
            <hr>

            <h2>Thông tin thành viên</h2>
            <div class="flex-row-container">
                <select v-model="infoTeddy.idTeam">
                    <option v-for="team in selectTeam" :key="team.key" :value="team.key">
                        {{ team.key }} - {{ team.name }}
                    </option>
                </select>
                <select v-model="infoTeddy.position">
                    <option v-for="gender in selectGender" :key="gender.key" :value="gender.key">
                        {{ gender.name }}
                    </option>
                </select>
                <input v-model="infoTeddy.generation" type="text" placeholder="Nhập thế hệ">
                <input v-model="infoTeddy.phone" type="text" placeholder="Nhập số điện thoại">
            </div>
            <hr>

            <h2>Thông tin sinh viên</h2>
            <div class="flex-row-container">
                <input v-model="infoTeddy.idTeddy" type="text" placeholder="Nhập mã sinh viên">
                <select v-model="infoTeddy.studentFaculty">
                    <option v-for="fac in selectFaculty" :key="fac.key" :value="fac.key">
                        {{ fac.name }}
                    </option>
                </select>
                <input :value="studentMail" type="text" placeholder="Nhập email sinh viên" readonly />
                <input v-model="infoTeddy.personalMail" type="text" placeholder="Nhập email cá nhân">
            </div>

            <div class="flex-row-container">
                <button type="reset" @click="clearData">Làm mới</button>
                <button type="submit" @click="submitData" class="primary">TẠO MỚI</button>
            </div>
        </form>

    </div>
</template>


<script>
    import { connectGAS } from '@/utils/connectGAS.js'

    import eventBus from '@/utils/eventBus.js'
    import compTitlePage from '@/components/compTitlePage.vue'

    import teamList from '@/data/teamList.js'
    import genderList from '@/data/genderList.js'
    import facultyList from '@/data/facultyList.js'

    export default {

        components: {
            compTitlePage
        },
        data() {
            return {
                titlePage: "Thêm nhân sự",

                // Danh sách select
                selectTeam: teamList,
                selectGender: genderList,
                selectFaculty: facultyList,

                infoTeddy: {
                    idTeddy: "",
                    lastName: "",
                    firstName: "",
                    fullName: "",
                    gender: "Nam",
                    idTeam: "PD",
                    position: "Thành viên",
                    generation: "09",
                    studentFaculty: "0",
                    studentMail: "",
                    personalMail: "",
                    phone: "",
                },
            }
        },
        computed: {
            studentMail() {
                return this.infoTeddy.idTeddy ? `${this.infoTeddy.idTeddy}@student.tdtu.edu.vn` : "ted@tdtu.edu.vn"
            },
        },
        methods: {
            async submitData(e) {
                e.preventDefault()
                console.log(this.infoTeddy);
                const result = await connectGAS("addTeddy", this.infoTeddy);
                console.log(result.data);
            },
            clearData(e) {
                e.preventDefault()
                this.infoTeddy.firstName = "";
                this.infoTeddy.lastName = "";
                this.infoTeddy.gender = "Nam";
                this.infoTeddy.birthday = "";
                this.infoTeddy.idTeddy = "";
                this.infoTeddy.studentFaculty = "0";
                this.infoTeddy.personalMail = "";
                eventBus.notify("success", "Đã làm mới dữ liệu");
            }
        },
    }
</script>


<style>

</style>