<template>
    <div>
        <el-row>
            <el-col :span="2">
                <el-button type="danger" @click="deletesHandle">批量删除</el-button>
            </el-col>
            <el-col :span="2">
                <el-button type="primary" @click="addHandle">添加数据</el-button>
            </el-col>
            <el-col :span="4">
                <el-select v-model="value" placeholder="请选择" @change="selectUserHandle">
                    <el-option
                        v-for="item in options"
                        :key="item.name"
                        :label="item.name"
                        :value="item.name"
                    ></el-option>
                </el-select>
            </el-col>
            <el-col :span="6">
                <el-date-picker
                    @change="selectTime"
                    value-format="timestamp"
                    v-model="time"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                ></el-date-picker>
            </el-col>
            <el-col :span="3">
                <download-excel
                    class="export-excel-wrapper"
                    :data="tableData"
                    :fields="json_fields"
                    name="小助手统计数据"
                >
                    <el-button type="primary" @click="exportExcel">导出EXCEL</el-button>
                </download-excel>
            </el-col>
        </el-row>
        <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="日期" width="160">
                <template slot-scope="scope">{{ scope.row.c_time|fromTime }}</template>
            </el-table-column>
            <el-table-column prop="username" label="用户名" width="120"></el-table-column>
            <el-table-column prop="number" label="数量" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        :disabled="deleFlag(scope.row)"
                        @click="handleEdit(scope.$index, scope.row)"
                    >编辑</el-button>

                    <el-tooltip
                        class="item"
                        effect="dark"
                        content="只能删除当前账户的数据，请勿尝试删除他人数据"
                        placement="top-start"
                    >
                        <el-button
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)"
                            :disabled="deleFlag(scope.row)"
                        >删除</el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            background
            layout="prev, pager, next"
            @current-change="changHandle"
            :total="total"
        ></el-pagination>
        <el-dialog
            title="添加数据"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose"
        >
            <span>
                <el-form
                    :model="ruleForm"
                    status-icon
                    :rules="rules"
                    ref="ruleForm"
                    label-width="100px"
                    class="demo-ruleForm"
                >
                    <el-form-item label="用户名" prop="username">
                        <el-input
                            type="text"
                            readonly
                            v-model="ruleForm.username"
                            autocomplete="off"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="选择日期" prop="c_time">
                        <el-date-picker
                            v-model="ruleForm.c_time"
                            value-format="timestamp"
                            type="date"
                            placeholder="选择日期"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="数量" prop="number">
                        <el-input type="text" v-model.number="ruleForm.number" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑 -->
        <el-dialog title="提示" :visible.sync="editFlag" width="30%" :before-close="editHandleClose">
            <span>
                <el-form
                    :model="editForm"
                    status-icon
                    :rules="rules"
                    ref="editForm"
                    label-width="100px"
                    class="demo-ruleForm"
                >
                    <el-form-item label="用户名" prop="username">
                        <el-input
                            type="text"
                            readonly
                            v-model="editForm.username"
                            autocomplete="off"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="选择日期" prop="c_time">
                        <el-date-picker
                            v-model="editForm.c_time"
                            value-format="timestamp"
                            type="date"
                            placeholder="选择日期"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="数量" prop="number">
                        <el-input type="text" v-model.number="editForm.number" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editFlag = false">取 消</el-button>
                <el-button type="primary" @click="editFormHandle('editForm')">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
import fromTime from "../utils/fromTime";
export default {
    data() {
        return {
            dialogVisible: false,
            editFlag: false,
            page: 1,
            pageSize: 10,
            total: 0,
            tableData: [],
            multipleSelection: [],
            ruleForm: {
                username: "",
                c_time: "",
                number: ""
            },
            value: "全部",
            json_fields: {
                日期: {
                    field: "c_time",
                    //自定义回调函数
                    callback: value => {
                        return `${fromTime(value)}`;
                    }
                },
                用户名: "username", //支持嵌套属性
                数量: "number" //支持嵌套属性
            },
            json_meta: [
                [
                    {
                        " key ": " charset ",
                        " value ": " utf- 8 "
                    }
                ]
            ],
            options: [],

            time: "",
            editForm: {},
            rules: {
                username: [
                    {
                        required: true,
                        message: "用户名不能为空",
                        trigger: "blur"
                    }
                ],
                number: [
                    {
                        required: true,
                        message: "数量不能为空",
                        trigger: "blur"
                    },
                    { type: "number", message: "必须输入数字", trigger: "blur" }
                ]
            }
        };
    },
    computed: {
        ...mapGetters(["menuFlag", "users"]),
        deleFlag() {
            return name => {
                if (this.users.istatus == 0) {
                    return false;
                } else if (name.username == this.users.name) {
                    return false;
                } else {
                    return true;
                }
            };
        },
        selectText() {
            let val = this.users.istatus == 0 ? "全部" : this.users.name;
            return val;
        }
    },
    created() {
        this.ruleForm.username = this.users.name;
        this.ruleForm.c_time = new Date().getTime();
        let val = this.users.istatus == 0 ? "全部" : this.users.name;
        this.getData();
        this.getZhuUser();
        this.value = val;
    },
    methods: {
        toggleSelection(rows) {
            if (rows) {
                rows.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row);
                });
            } else {
                this.$refs.multipleTable.clearSelection();
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleEdit(index, row) {
            console.log(index, row);
            this.editFlag = true;
            this.editForm = { ...row };
        },
        handleDelete(index, row) {
            this.$confirm("是否删除文件?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.deleteData(row._id);
                })
                .catch(() => {});
        },
        addHandle() {
            this.dialogVisible = true;
        },
        handleClose() {
            this.dialogVisible = false;
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.$axios
                        .post("/api/show/add", { ...this.ruleForm })
                        .then(res => {
                            if (res.status == 200 && res.data.code == 0) {
                                this.$message.success("保存成功");
                                this.dialogVisible = false;
                                this.getData();
                                this.ruleForm.number = "";
                            } else {
                                this.$message.warning(res.data.data);
                            }
                        })
                        .catch(e => {
                            console.log(e);
                        });
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        deleteData(id) {
            console.log(id);
            this.$axios
                .get("/api/show/delete", {
                    params: {
                        _id: id
                    }
                })
                .then(res => {
                    if (res.status == 200 && res.data.code == 0) {
                        this.$message.success("删除成功");
                        this.dialogVisible = false;
                        this.getData();
                        return false;
                    }
                })
                .catch(e => {
                    this.$message.warning("删除失败");
                    this.$message.warning(e);
                });
        },
        editFormHandle(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.$axios
                        .post("/api/show/update", { ...this.editForm })
                        .then(res => {
                            if (res.status == 200 && res.data.code == 0) {
                                this.$message.success("更新成功");
                                this.getData();
                                this.editFlag = false;
                            }
                        })
                        .catch(e => {
                            console.log(e);
                        });
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        getData() {
            console.log(this.users);
            let state = this.users.istatus;
            let name = this.users.name;

            if (state == 0) {
                this.$axios
                    .get("/api/show/getList", {
                        params: {
                            page: this.page,
                            pageSize: this.pageSize
                        }
                    })
                    .then(res => {
                        if (res.status == 200 && res.data.code == 0) {
                            this.tableData = res.data.data;
                            this.total = res.data.total;
                        }
                    });
            } else {
                this.$axios
                    .get("/api/show/getList", {
                        params: {
                            page: this.page,
                            pageSize: this.pageSize,
                            username: name
                        }
                    })
                    .then(res => {
                        if (res.status == 200 && res.data.code == 0) {
                            this.tableData = res.data.data;
                            this.total = res.data.total;
                        }
                    });
            }
        },
        changHandle(index) {
            this.page = index;
            this.getData();
        },
        editHandleClose() {
            this.editFlag = false;
        },
        //批量删除
        deletesHandle() {
            let listData = this.multipleSelection;
            if (listData.length == 0) {
                this.$message.warning("请选择数据");
                return false;
            } else {
                this.$confirm("是否批量删除数据?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        if (this.users.istatus == 0) {
                            for (let i = 0; i <= listData.length - 1; i++) {
                                this.deleteData(listData[i]._id);
                            }
                            return false;
                        } else {
                            for (let i = 0; i <= listData.length - 1; i++) {
                                if (listData[i].username == this.users.name) {
                                    this.deleteData(listData[i]._id);
                                } else {
                                    this.$message.warning(
                                        "权限不够，只能删除自己的数据"
                                    );
                                }
                            }
                        }
                    })
                    .catch(() => {});
            }
        },
        getZhuUser() {
            this.$axios
                .get("/api/users/zhu")
                .then(res => {
                    let userAll = { name: "全部" };
                    if (res.status == 200 && res.data.code == 0) {
                        this.options = res.data.data;
                        this.options.unshift(userAll);
                        console.log(this.options);
                    }
                })
                .catch(e => {
                    this.$message.warning(e);
                });
        },
        selectUserHandle(username) {
            if (username == "全部") {
                if (this.users.istatus != 0) {
                    this.$message.warning("权限不够，无法查看全部数据");
                    this.value = this.users.name;
                    return false;
                } else {
                    this.getData();
                }
            } else {
                this.value = username;
                this.$axios
                    .get("/api/show/search", {
                        params: {
                            username
                        }
                    })
                    .then(res => {
                        if (res.status == 200 && res.data.code == 0) {
                            this.tableData = res.data.data;
                            this.total = res.data.total;
                        }
                    })
                    .catch(e => {
                        this.$message.warning(e);
                    });
            }
        },
        selectTime(timeArr) {
            var that = this;
            if (this.value == "全部") {
                this.$axios
                    .get("/api/show/search", {
                        params: {
                            startTime: timeArr[0],
                            endTime: timeArr[1]
                        }
                    })
                    .then(res => {
                        if (res.status == 200 && res.data.code == 0) {
                            this.tableData = res.data.data;
                            this.total = res.data.total;
                        }
                    })
                    .catch(e => {
                        this.$message.warning(e);
                    });
            } else {
                this.$axios
                    .get("/api/show/search", {
                        params: {
                            startTime: timeArr[0],
                            endTime: timeArr[1],
                            username: that.username
                        }
                    })
                    .then(res => {
                        if (res.status == 200 && res.data.code == 0) {
                            this.tableData = res.data.data;
                            this.total = res.data.total;
                        }
                    })
                    .catch(e => {
                        this.$message.warning(e);
                    });
            }
        },
        exportExcel() {
            console.log(1);
        }
    }
};
</script>

<style>
</style>