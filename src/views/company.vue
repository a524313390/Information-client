<template>
    <div>
        <div class="brea">
            <brea></brea>
        </div>
        <div v-if="!showFlag">
            <el-row>
                <el-col :span="4">
                    <el-select v-model="value" @change="changeStates" placeholder="请选择状态">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-col>
            </el-row>

            <el-table
                :data="tableData"
                stripe
                style="width: 100%"
                @row-click="selectItem"
                :row-class-name="tableRowClassName "
            >
                <el-table-column type="index" width="50"></el-table-column>
                <el-table-column prop="uid" key="1" label="用户uid" width="120">
                    <template slot-scope="scope">{{ scope.row.date|fromTime }}</template>
                </el-table-column>
                <el-table-column prop="companyname" label="公司名称" width="180"></el-table-column>
                <el-table-column prop="mode" label="认证方式"></el-table-column>
                <el-table-column prop="source" label="来源" width="120">
                    <template slot-scope="scope">{{ scope.row.source }}</template>
                </el-table-column>
                <el-table-column prop="date" label="日期" width="120">
                    <template slot-scope="scope">{{ scope.row.date|fromTime }}</template>
                </el-table-column>

                <el-table-column prop="names" label="认证人姓名" width="120"></el-table-column>
                <el-table-column prop="phone" label="手机号码"></el-table-column>
                <el-table-column prop="sname" label="审核人姓名" width="180"></el-table-column>

                <el-table-column prop="states" key="2" label="审核状态">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.states==0" plain>未处理</el-button>
                        <el-button type="success" v-if="scope.row.states==1" plain>已认证</el-button>
                        <el-button
                            type="primary"
                            v-if="scope.row.states==2"
                            plain
                        >{{scope.row.opers}}</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                style="float:right;margin: 20px 0;"
                background
                :page-size="pageSize"
                @current-change="chnageNumber"
                layout="prev, pager, next"
                :total="total"
            ></el-pagination>
        </div>
        <detail-company
            @backs="backs"
            v-if="showFlag"
            :liYouData="liYouData"
            @next="next"
            @prev="prev"
            :dataDetail="dataInfos"
        ></detail-company>
    </div>
</template>

<script>
import detailCompany from "../components/detailCompany";
import brea from "../components/brea";
export default {
    name: "companylist",
    data() {
        return {
            tableData: [],
            options: [
                {
                    value: "-1",
                    label: "全部"
                },
                {
                    value: "0",
                    label: "未处理"
                },
                {
                    value: "1",
                    label: "认证成功"
                },
                {
                    value: "2",
                    label: "认证失败"
                }
            ],
            value: "-1",
            page: 1,
            pageSize: 15,
            total: 0,
            showFlag: false,
            dataInfo: "",
            dataInfos: "",
            liYouData: [],
            states: -1
        };
    },
    watch: {
        dataInfo: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.dataInfos = newVal;
                }
            },
            immediate: true,
            deep: true
        }
    },
    created() {
        this.getList();
        this.getLiYou();
    },
    methods: {
        chnageNumber(index) {
            this.page = index;
            this.getList();
        },
        getList() {
            this.$axios
                .get("/api/company", {
                    params: {
                        page: this.page,
                        pageSize: this.pageSize,
                        states: this.states
                    }
                })
                .then(res => {
                    if (res.data.status == 0) {
                        this.tableData = res.data.result.docs;
                        this.total = parseInt(res.data.result.total);
                    }
                });
        },
        getLiYou() {
            this.$axios
                .get("/api/companys", {
                    params: {
                        page: this.page,
                        pageSize: this.pageSize
                    }
                })
                .then(res => {
                    if (res.data.status == 0) {
                        this.liYouData = res.data.result.docs;
                    }
                });
        },
        selectItem(row, column) {
            this.showFlag = true;
            this.dataInfo = row;
        },
        tableRowClassName({ row, rowIndex }) {
            row.index = rowIndex;
        },
        backs(val) {
            this.showFlag = val;
        },
        next(index) {
            if (index >= this.tableData.length - 1) {
                this.$message("已经是最后一个了");
                this.showFlag = true;
                return false;
            }
            this.dataInfos = this.tableData[index + 1];
        },
        prev(index) {
            if (index == 0) {
                this.$message("已经是第一个了");
                return false;
            }
            this.dataInfos = this.tableData[index - 1];
        },
        changeStates(index) {
            this.states = index;
            this.getList();
        }
    },
    components: {
        detailCompany,
        brea
    }
};
</script>

<style>
.brea {
    margin: 20px 0;
}
</style>