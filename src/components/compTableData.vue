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
                <tr v-if="safeTablesConfig.length === 0">
                    <td :colspan="columnsConfig.length">Không có dữ liệu</td>
                </tr>

                <!-- CASE 2: CÓ DỮ LIỆU -->
                <tr v-else v-for="(row, rowIndex) in paginatedTablesConfig" :key="rowIndex">
                    <td v-for="(col, colIndex) in columnsConfig" :key="col.key || colIndex">
                        <!-- Nếu là cột chức năng -->
                        <template v-if="col.key === 'actions' && col.actions">
                            <div class="action-cell">
                                <template v-for="(action, i) in col.actions" :key="i">
                                    <i v-if="action.show == null || action.show" :class="action.icon"
                                        :title="action.label" @click="action.action(row[primaryKey])"></i>
                                </template>

                            </div>
                        </template>

                        <!-- Nếu không phải cột chức năng -->
                        <template v-else>
                            {{ row[col.key] }}
                        </template>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Footer + phân trang -->
        <div v-if="safeTablesConfig.length" class="footer-table">
            <p>Danh sách có {{ safeTablesConfig.length }} dữ liệu.</p>

            <div class="pagination">
                <button v-for="page in totalPages" :key="page" class="btn-page-table"
                    :class="{ active: currentPage === page }" @click="currentPage = page">
                    {{ page }}
                </button>
            </div>
        </div>
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
            },
        },
        data() {
            return {
                currentPage: 1,
                pageSize: 20, // 20 dòng mỗi trang
            };
        },
        computed: {
            // Luôn đảm bảo tablesConfig là mảng
            safeTablesConfig() {
                return Array.isArray(this.tablesConfig) ? this.tablesConfig : [];
            },
            totalPages() {
                return Math.ceil(this.safeTablesConfig.length / this.pageSize) || 1;
            },
            paginatedTablesConfig() {
                const start = (this.currentPage - 1) * this.pageSize;
                const end = start + this.pageSize;
                return this.safeTablesConfig.slice(start, end);
            },
        },
    };
</script>

<style scoped>
    .action-cell {
        align-items: center;
        justify-content: center;
        display: flex;
        gap: 10px;
    }

    .footer-table {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;
    }

    .pagination {
        display: flex;
        gap: 5px;
    }

    .btn-page-table {
        width: 30px;
        height: 30px;
        padding: 6px;
        font-size: 14px;
        cursor: pointer;
        border: 1px solid #ccc;
        background-color: white;
    }

    .btn-page-table.active {
        background-color: var(--theme-color-1);
        color: white;
        font-weight: bold;
    }
</style>