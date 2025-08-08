<template>
    <div>
        <table>
            <thead>
                <tr>
                    <th v-for="(col, index) in columnsConfig" :key="index">
                        {{ col.label }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <!-- CASE 1: KHÔNG CÓ DỮ LIỆU -->
                <tr v-if="!tablesConfig || tablesConfig.length === 0">
                    <td :colspan="columnsConfig.length">Không có dữ liệu</td>
                </tr>

                <!-- CASE 2: CÓ DỮ LIỆU -->
                <tr v-else v-for="(row, rowIndex) in tablesConfig" :key="rowIndex">
                    <td v-for="(col, colIndex) in columnsConfig" :key="col.key || colIndex">

                        <!-- Nếu là cột chức năng -->
                        <template v-if="col.key === 'actions' && col.actions">
                            <template v-for="(action, i) in col.actions" :key="i">
                                <i :class="action.icon" @click="action.action(row[primaryKey])"></i>
                            </template>
                        </template>

                        <!-- Nếu không phải cột chức năng -->
                        <template v-else>
                            {{ row[col.key] }}
                        </template>
                    </td>
                </tr>
            </tbody>
        </table>
        <p v-if="tablesConfig">Danh sách có {{ tablesConfig.length }} dữ liệu./.</p>
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
            },
            primaryKey: {
                type: String,
                default: "id",
            }
        },
    };
</script>