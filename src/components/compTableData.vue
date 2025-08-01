<template>
    <div class="table-responsive">
        <table>
            <thead>
                <tr>
                    <!-- Lặp qua columnsConfig để tạo các cột tiêu đề (<th>) -->
                    <th v-for="(col, index) in columnsConfig">
                        {{ col.label }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <!-- CASE 1: RỖNG -->
                <!-- Hiển thị thông báo "Không có dữ liệu" nếu tablesConfig rỗng -->
                <tr v-if="!tablesConfig || tablesConfig.length === 0">
                    <td :colspan="columnsConfig.length" class="no-data-message">Không có dữ liệu</td>
                </tr>

                <!-- CASE 2: CÓ DỮ LIỆU -->
                <!-- Lặp qua tablesConfig để tạo các hàng dữ liệu -->
                <tr v-for="(data, rowIndex) in tablesConfig">
                    <!-- Lặp qua columnsConfig để tạo các ô dữ liệu (<td>) cho mỗi hàng -->
                    <td v-for="(col, colIndex) in columnsConfig" :key="col.key || colIndex">
                        {{ data[col.key] }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    export default {
        props: {
            columnsConfig: {
                type: Array,
                required: true,
            },
            tablesConfig: {
                type: Array,
                default: () => [],
            }
        }
    }
</script>