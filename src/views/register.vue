<template>
    <section class="froms-container">
        <h3 class="title">后台管理系统</h3>
        <div class="content">
            <el-form
                labelPosition="left"
                :model="register"
                status-icon
                :rules="rules"
                ref="registerFrom"
                label-width="100px"
                class="registerClass"
            >
                <el-form-item label="用户名" prop="name">
                    <el-input type="text" v-model="register.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input type="text" v-model="register.email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="register.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPwd">
                    <el-input type="password" v-model="register.checkPwd" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="选择身份" prop="istatus">
                    <el-select v-model="register.istatus" placeholder="请选择身份" style="width: 100%">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :disabled="item.value==0"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-button type="primary" @click="submitForm('registerFrom')">注册</el-button>
                <el-button type="primary" @click="changeRouter">登陆</el-button>
            </el-form>
        </div>
    </section>
</template>
<script>
export default {
    name: "register",
    data() {
        var checkPwds = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请再次输入密码"));
            } else if (value !== this.register.password) {
                callback(new Error("两次输入密码不一致!"));
            } else {
                callback();
            }
        };
        return {
            register: {
                password: "",
                name: "",
                email: "",
                istatus: ""
            },
            rules: {
                name: [
                    {
                        required: true,
                        message: "请输入账户",
                        trigger: "blur"
                    },
                    {
                        min: 5,
                        max: 30,
                        message: "长度在 5 到 30个字符",
                        trigger: "blur"
                    }
                ],
                eamil: [
                    {
                        type: "email",
                        required: true,
                        message: "请输入正确的邮箱",
                        trigger: "blur"
                    }
                ],
                password: [
                    {
                        required: true,
                        message: "请输入密码",
                        trigger: "blur"
                    },
                    {
                        min: 6,
                        max: 20,
                        message: "长度在 6 到 20个字符",
                        trigger: "blur"
                    }
                ],
                checkPwd: [
                    {
                        validator: checkPwds,
                        trigger: "blur"
                    },
                    {
                        min: 6,
                        max: 20,
                        message: "长度在 6 到 20个字符",
                        trigger: "blur"
                    }
                ]
                //  status: [
                //    { required: true,message:'请选择身份', trigger: 'blur' }
                // ]
            },
            options: [
                {
                    value: "0",
                    label: "管理员"
                },
                {
                    value: "1",
                    label: "普通用户"
                },
                {
                    value: "3",
                    label: "小助手"
                }
            ],
            value: ""
        };
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    console.log(this.register);
                    this.$axios
                        .post("/api/users/register", this.register)
                        .then(res => {
                            console.log(res);
                            if (res.data.avatar) {
                                this.$message({
                                    message: "注册成功,请登陆",
                                    type: "success"
                                });

                                this.$router.push("/login");
                            } else {
                                this.$message({
                                    message: res.data.msg,
                                    type: "error"
                                });
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        });

                    // this.$router.push('/login');
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        changeRouter() {
            this.$router.push("/login");
        }
    }
};
</script>
<style scoped>
.froms-container {
    width: 100%;
    height: 100%;
    background: url("../assets/images/bg.jpg") no-repeat;
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-direction: column;
}

.content {
    width: 30%;
    margin: auto;
    text-align: center;
    background: #fff;
    padding: 50px;
    margin-top: 0;
}

.title {
    margin: 20px 0;
    color: #fff;
    font-weight: bold;
    margin-top: 100px;
}
</style>
