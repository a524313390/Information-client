<template>
    <div>
        <brea></brea>

        <el-row>
            <el-col :span="18" :offset="3">
                <el-form
                    :model="ruleForm"
                    status-icon
                    :rules="rules"
                    ref="ruleForm"
                    label-width="100px"
                    class="demo-ruleForm"
                >
                    <el-form-item label="公司名称" prop="companyname">
                        <el-input type="text" v-model="ruleForm.companyname" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="认证来源" prop="source">
                        <el-select v-model="ruleForm.source" placeholder="请选择认证来源">
                            <el-option
                                v-for="(item,index) in regio"
                                :label="item"
                                key="item"
                                :value="item"
                            ></el-option>
                        </el-select>
                        <!--<el-input type="text" v-model="ruleForm.source" autocomplete="off"></el-input>-->
                    </el-form-item>
                    <el-form-item label="认证方式" prop="mode">
                        <el-select
                            v-model="ruleForm.mode"
                            placeholder="请选择认证来源"
                            @change="changeSource"
                        >
                            <el-option
                                v-for="(item,index) in source"
                                :label="item"
                                key="item"
                                :value="item"
                            ></el-option>
                        </el-select>
                        <!--<el-input v-model="ruleForm.mode"></el-input>-->
                    </el-form-item>
                    <el-form-item label="姓名" prop="names">
                        <el-input type="text" v-model="ruleForm.names" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码" prop="phone">
                        <el-input type="text" v-model.number="ruleForm.phone" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="部门" prop="bumen">
                        <el-input type="text" v-model.number="ruleForm.bumen" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="职位" prop="zhiwei">
                        <el-input type="text" v-model.number="ruleForm.zhiwei" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="认证方式" prop="mode">
                        <el-radio v-model="radio" label="1">名片方式认证</el-radio>
                        <el-radio v-model="radio" label="2">身份证+营业执照认证</el-radio>
                        <template>
                            <el-upload
                                action="#"
                                :http-request="uploadFile"
                                :multiple="false"
                                ref="upload"
                                :on-success="uploadSuccess"
                                :auto-upload="false"
                                list-type="picture-card"
                                :on-preview="handlePictureCardPreview"
                                name="file"
                                enctype="multipart/form-data"
                                :limit="num"
                                :on-exceed="handleExceed"
                                accept="image/jpeg, image/gif, image/png, image/bmp"
                            >
                                <i class="el-icon-plus"></i>
                            </el-upload>
                            <el-dialog :visible.sync="dialogVisible">
                                <img width="100%" :src="dialogImageUrl" alt />
                            </el-dialog>
                        </template>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                        <el-button @click="resetForm('ruleForm')">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import brea from "../components/brea";
import { mapGetters } from "vuex";
export default {
    name: "companys",
    computed: {
        ...mapGetters(["isAuth"])
    },
    components: {
        brea
    },
    data() {
        var checkPhone = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入手机号码"));
            } else {
                if (this.ruleForm.phone !== "") {
                    if (typeof value == "string") {
                        callback(new Error("请正确的手机号码"));
                    } else {
                        callback();
                    }
                    //
                }
            }
        };
        return {
            radio: "1",
            ruleForm: {
                companyname: "",
                source: "",
                mode: "",
                names: "",
                phone: "",
                bumen: "",
                zhiwei: ""
            },
            regio: ["百度", "新浪", "微博"],
            source: ["名片", "营业执照+身份证"],
            rules: {
                companyname: [
                    {
                        required: true,
                        message: "请输入公司名称",
                        trigger: "blur"
                    }
                ],
                source: [
                    {
                        required: true,
                        message: "请输入认证来源",
                        trigger: "blur"
                    }
                ],
                names: [
                    {
                        required: true,
                        message: "请输入认证姓名",
                        trigger: "blur"
                    }
                ],
                phone: [
                    {
                        validator: checkPhone,
                        trigger: "blur",
                        required: true
                    }
                ],
                mode: [
                    {
                        required: true,
                        message: "请输输入类型",
                        trigger: "blur"
                    }
                ],
                bumen: [
                    {
                        required: true,
                        message: "请输输入部门",
                        trigger: "blur"
                    }
                ],
                zhiwei: [
                    {
                        required: true,
                        message: "请输输入职位",
                        trigger: "blur"
                    }
                ]
            },
            dialogImageUrl: "",
            dialogVisible: false,
            headers: {
                Authorization: localStorage.getItem("Admintokens")
            },
            num: 1,
            formDate: ""
        };
    },
    watch: {
        radio(newVal, oldVal) {
            this.$refs.upload.clearFiles();
            this.ruleForm.fromData = [];
            this.num = Number(newVal);
        }
    },
    methods: {
        //提交数据
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    //new 一个FormData对象,uploadFile事件会把把图片的数据添加到this.formDate
                    this.formDate = new FormData();
                    this.$refs.upload.submit();
                    //添加额外的数据
                    this.formDate.append(
                        "companyname",
                        this.ruleForm.companyname
                    );
                    this.formDate.append("source", this.ruleForm.source);
                    this.formDate.append("names", this.ruleForm.names);
                    this.formDate.append("phone", this.ruleForm.phone);
                    this.formDate.append("mode", this.ruleForm.mode);
                    this.formDate.append("bumen", this.ruleForm.bumen);
                    this.formDate.append("zhiwei", this.ruleForm.zhiwei);
                    //设置头部发送格式
                    let config = {
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    };
                    this.$axios
                        .post("/api/company/uploads", this.formDate, config)
                        .then(res => {
                            if (res.data.status == 0) {
                                this.$message.success("提交成功");
                                this.$refs.upload.clearFiles();
                                this.$refs[formName].resetFields();
                            } else {
                                this.$message.success("提交失败");
                            }
                        })
                        .catch(res => {});
                } else {
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },

        //查看图片
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;

            this.dialogVisible = true;
        },
        //接受服务器返回的数据
        uploadSuccess(response, file, fileList) {},
        //上传失败触发
        handleError(err, file, fileList) {
            this.$message.error("上传失败");
        },
        //超出限制触发
        handleExceed(files, fileList) {
            this.$message({
                type: "error",
                message: "上传文件的数量超出最大限制"
            });
        },
        uploadFile(file, fileList) {
            //重写element的请求 把图片的数据添加到this.formDate
            this.formDate.append("file", file.file);

            return false;
        },
        //
        changeSource(index) {
            if (index == "名片") {
                this.radio = "1";
            } else {
                this.radio = "2";
            }
        }
    }
};
</script>

<style>
</style>