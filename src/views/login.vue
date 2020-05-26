<template>
    <section class="froms-container">
        <h3 class="title">后台管理系统</h3>
        <div class="content">
            <el-form
                labelPosition="left"
                :model="login"
                status-icon
                :rules="rules"
                ref="login"
                label-width="100px"
                class="login"
                @submit.native.prevent
            >
                <el-form-item label="用户名" prop="name">
                    <el-input type="text" v-model="login.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input
                        type="password"
                        v-model="login.password"
                        @keyup.enter.native="onSubmit('login')"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>

                <el-button type="primary" @click="submitForm('login')">登陆</el-button>
                <el-button type="primary" @click="changeRouter">注册</el-button>
            </el-form>
        </div>
    </section>
</template>
<script>
import jwt_decode from "jwt-decode";
import { mapActions, mapMutations } from "vuex";
export default {
    name: "register",
    data() {
        return {
            login: {
                name: "",
                checkPass: "",
                age: ""
            },
            rules: {
                userName: [
                    {
                        required: true,
                        message: "请输入账户",
                        trigger: "blur"
                    }
                ],
                password: [
                    {
                        required: true,
                        message: "请输入密码",
                        trigger: "blur"
                    }
                ]
            }
        };
    },
    methods: {
        // ...mapActions(["setAuth", "setUser"]),
        ...mapMutations({
            setAuth: "SET_AUTH",
            setUser: "SET_USER"
        }),
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.$axios
                        .post("/api/users/login", this.login)
                        .then(respon => {
                            console.log(respon);
                            if (respon.data.status == 0) {
                                const token = respon.data.token;
                                localStorage.setItem("Admintokens", token);

                                //解析token
                                const decode = jwt_decode(token);
                                //将token和解析的token存储到vuex中
                                this.setAuth(token);
                                this.setUser(decode);
                                this.$message({
                                    message: "登陆成功",
                                    type: "success"
                                });

                                this.$router.push("/");
                            } else {
                                this.$message({
                                    message: respon.data.msg,
                                    type: "error"
                                });
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        });
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
            this.$router.push("/register");
        },
        onSubmit(formName) {
            this.submitForm(formName);
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
    margin-top: 200px;
}

.reg {
}
</style>
