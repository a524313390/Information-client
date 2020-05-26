<template>
    <div class="menu">
        <el-row class="menu-con">
            <el-col style="height: 100%;" :span="24">
                <el-menu
                    :unique-opened="true"
                    class="el-menu-vertical-demo"
                    :collapse="menuFlag"
                    background-color="#324057"
                    text-color="#fff"
                    active-text-color="#409eff"
                >
                    <router-link to="/index/home">
                        <el-menu-item index="/index/home">
                            <i class="el-icon-menu"></i>
                            <span slot="title">首页</span>
                        </el-menu-item>
                    </router-link>
                    <template v-for=" (item,idx) in menu ">
                        <el-submenu
                            v-if="item.children && item.quan"
                            router
                            :index="item.path"
                            :key="item.path"
                        >
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>{{item.name}}</span>
                            </template>
                            <el-menu-item-group>
                                <router-link
                                    v-for="(child,index) in item.children"
                                    :key="index"
                                    :to="child.path"
                                >
                                    <el-menu-item
                                        router
                                        :index="child.path"
                                        v-if="child.quan"
                                    >{{child.name}}</el-menu-item>
                                </router-link>
                            </el-menu-item-group>
                        </el-submenu>
                        <router-link v-else :to="item.path" :key="idx">
                            <el-menu-item :index="item.path" v-if="item.quan">
                                <i class="el-icon-menu"></i>
                                <span slot="title">{{item.name}}</span>
                            </el-menu-item>
                        </router-link>
                    </template>
                </el-menu>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
    name: "left-menu",
    computed: {
        ...mapGetters(["menuFlag", "users"])
    },
    data() {
        return {
            menu: [],
            isCollapse: false
        };
    },
    created() {
        console.log(this.$router.options.routes);
        this.menu = [
            {
                icon: "fa-money",
                name: "不规范个人信息",
                path: "/index/people",
                quan:
                    this.users.istatus == 0 || this.users.istatus == 1
                        ? true
                        : false,
                children: [
                    {
                        path: "/index/liyou",
                        name: "添加拒绝理由",
                        quan: this.users.istatus == 0 ? true : false,
                        meta: {
                            title: "添加拒绝理由"
                        }
                    },
                    {
                        path: "/index/info",
                        name: "不规范个人信息处理",
                        quan: true,
                        meta: {
                            title: "不规范个人信息处理"
                        }
                    }
                ]
            },
            {
                icon: "fa-asterisk",
                name: "企业认证",
                path: "company",
                quan: this.users.istatus == 0 || this.users.istatus == 1,
                children: [
                    {
                        path: "/index/companys",
                        name: "添加企业认证拒绝理由",
                        quan: this.users.istatus == 0 ? true : false,
                        meta: {
                            title: "添加企业认证拒绝理由"
                        }
                    },
                    {
                        path: "/index/company",
                        name: "企业认证信息处理",
                        quan: true,
                        meta: {
                            title: "企业认证信息处理"
                        }
                    },
                    {
                        path: "/index/addCompany",
                        name: "添加企业认证信息",
                        quan: this.users.istatus == 0 ? true : false,
                        meta: {
                            title: "添加企业认证信息"
                        }
                    }
                ]
            },
            {
                icon: "ss",
                name: "管理员",
                path: "/index/admins",
                quan: this.users.istatus == 0 ? true : false,
                meta: {
                    title: "管理员"
                }
            }
        ];
    },
    methods: {
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        }
    }
};
</script>

<style>
.menu {
    height: 100%;
}
.menu-con,
.el-menu-vertical-demo {
    height: 100%;
}
</style>
