<template>
    <div>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column label="日期" width="180">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.date | fromTime }}</span>
                </template>
            </el-table-column>
            <el-table-column label="用户ID" width="180" prop="_id"></el-table-column>
            <el-table-column label="姓名" width="180" prop="name"></el-table-column>
            <el-table-column label="用户头像" width="180">
                <template slot-scope="scope">
                    <img
                        :src="scope.row.avatar"
                        alt
                        width="80px"
                        height="80px"
                        style="border-radius: 50%;"
                    />
                </template>
            </el-table-column>
            <el-table-column label="用户邮箱" width="180" prop="email"></el-table-column>
            <el-table-column label="用户身份" width="180" prop="email">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.istatus==0" type="text">管理员</el-button>
                    <el-button v-if="scope.row.istatus==1" type="text">普通用户</el-button>
                    <el-button v-if="scope.row.istatus==3" type="text">小助手</el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button
                        size="mini"
                        type="danger"
                        @click="handleDelete(scope.$index, scope.row)"
                    >删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            style="float: right;margin: 20px 0;"
            background
            layout="prev, pager, next"
            @current-change="changePageSize"
            :total="total"
            :page-size="pageSize"
        ></el-pagination>

        <!--编辑-->
        <el-dialog title="用户信息修改" :visible.sync="dialogVisible" width="30%">
            <el-form
                :model="ruleForm"
                status-icon
                :rules="rules"
                ref="ruleForm"
                label-width="100px"
                class="demo-ruleForm"
            >
                <el-form-item label="用户ID" prop="_id">
                    <el-input type="text" readonly v-model="ruleForm._id" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="账户名" prop="name">
                    <el-input type="text" readonly v-model="ruleForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="用户身份" prop="istatus">
                    <el-select v-model="ruleForm.istatus" placeholder="请选择身份">
                        <el-option label="普通用户" value="1"></el-option>
                        <el-option label="管理员" value="0"></el-option>
                        <el-option label="小助手" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input type="text" v-model="ruleForm.email" autocomplete="off"></el-input>
                </el-form-item>
                <!-- <el-form-item label="旧密码" prop="oldPwd">
                    <el-input type="password" v-model="ruleForm.oldPwd" autocomplete="off"></el-input>
                </el-form-item>-->
                <el-form-item label="密码" prop="pass">
                    <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPass">
                    <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
                </el-form-item>
                <!--<el-form-item label="用户身份" prop="istatus">
			    <el-input v-model="ruleForm.istatus"></el-input>
                </el-form-item>-->
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
var bcrypt = require("bcryptjs");

export default {
    name: "admins",
    data() {
        var validatePass = (rule, value, callback) => {
            if (value != "") {
                this.ruleForm.pass = value;
                callback();
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value != "" && this.ruleForm.pass == value) {
                this.ruleForm.checkPass = value;
                callback();
            } else {
                return callback(new Error("两次密码不一致"));
            }
        };
        var oldPwds = (rule, value, callback) => {
            console.log(value);
            if (value) {
                bcrypt.compare(value, this.ruleForm.password, function(
                    err,
                    pwd
                ) {
                    if (!pwd) {
                        return callback(
                            new Error("输入的密码与原始密码不一致")
                        );
                    } else {
                        callback();
                    }
                });
            } else {
                callback();
            }
        };
        return {
            page: 1,
            pageSize: 10,
            total: 0,
            istatus: null,
            tableData: [],
            dialogVisible: false,
            ruleForm: {
                pass: "",
                checkPass: "",
                oldPwd: ""
            },
            rules: {
                name: [
                    {
                        required: true,
                        message: "用户名不能为空",
                        trigger: "blur"
                    }
                ],

                email: [
                    { required: true, message: "邮箱不能为空", trigger: "blur" }
                ],
                pass: [{ validator: validatePass, trigger: "blur" }],
                checkPass: [{ validator: validatePass2, trigger: "blur" }],
                oldPwd: [{ validator: oldPwds, trigger: "blur" }]
            }
        };
    },
    created() {
        this.getList();
    },
    methods: {
        getList() {
            this.$axios
                .get("/api/users", {
                    params: {
                        page: this.page,
                        pageSize: this.pageSize,
                        istatus: this.istatus
                    }
                })
                .then(res => {
                    if (res.data.status == 0) {
                        this.tableData = res.data.result.docs;
                        this.total = res.data.result.total;
                    }
                });
        },
        handleEdit(index, row) {
            this.dialogVisible = true;

            this.ruleForm = Object.assign({}, row);
            console.log(this.ruleForm.istatus);
        },
        handleDelete(index, row) {
            this.$confirm("是否删除该账户?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$axios
                        .get("/api/users/delete", {
                            params: {
                                id: row._id
                            }
                        })
                        .then(res => {
                            if (res.data.status == 0) {
                                this.getList();
                                this.$message.success("删除成功");
                            }
                        })
                        .catch(error => {
                            this.$message.error(error);
                        });
                })
                .catch(() => {});
        },
        changePageSize(index) {
            this.page = index;
            this.getList();
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    //

                    this.$axios
                        .post("/api/users/update", this.ruleForm)
                        .then(res => {
                            if (res.data.status == 0) {
                                this.dialogVisible = false;
                                this.getList();
                                this.$message.success("修改成功");
                            } else {
                                this.$message.error("修改失败");
                            }
                        });
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        }
    }
};
</script>

<style>
</style>