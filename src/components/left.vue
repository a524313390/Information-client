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
                    <router-link to="/">
                        <el-menu-item index="/">
                            <i class="el-icon-menu"></i>
                            <span slot="title">首页</span>
                        </el-menu-item>
                    </router-link>
                    <template v-for=" (item,idx) in $router.options.routes ">
                        <el-submenu
                            v-if="hasOne(item.children) && !item.hidden  && showFlag(item)"
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
                                    :to="`${item.path}/${child.path}`"
                                >
                                    <el-menu-item router :index="child.path">{{child.name}}</el-menu-item>
                                </router-link>
                            </el-menu-item-group>
                        </el-submenu>
                        <router-link v-else :to="`${item.path}`" :key="idx">
                            <el-menu-item :index="item.path" v-if=" !item.hidden && showFlag(item)">
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
        ...mapGetters(["menuFlag", "users"]),
        showFlag() {
            return item => {
                if (this.users.istatus == 0) {
                    return true;
                } else {
                    return item.meta.istatus == this.users.istatus;
                }
            };
        }
    },
    data() {
        return {
            menu: [],
            isCollapse: false
        };
    },
    created() {},
    methods: {
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        },
        hasOne(paths) {
            if (paths && paths.length && paths.length == 1) {
                return false;
            } else {
                return true;
            }
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
