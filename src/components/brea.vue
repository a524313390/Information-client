<template>
      <el-breadcrumb class="app-breadcrumb" separator-class="el-icon-arrow-right">
      
          <el-breadcrumb-item v-for="(item)  in  $route.matched" :key="item.path" >
            <!-- <router-link :to="item.redirect||item.path">{{item.meta.title}}</router-link> -->
             <router-link :to="item.path">{{item.name}}</router-link>
          </el-breadcrumb-item>
      </el-breadcrumb>
</template>
<script>
export default {
    name:'brea',
  data() {
      return {
          levelList: null
      }
  },
  methods: {
          /**
           * 生成面包屑的方法
           */
    getBreadcrumb() {
        // console.log(this.$route.matched)
      let matched = this.$route.matched.filter(item => {
         
          return item.name
      })
      console.log(matched)
      const first = matched[0]
      if (first && first.name !== '首页') {
        matched = [{path: '/home', meta: { title: '首页' }}].concat(matched)
       
      }
      
      this.levelList = matched;
    }
  },
  mounted() {
    this.getBreadcrumb();
  },
  watch: {
    $route(to, from) {
      this.getBreadcrumb();
    }
  }
}
</script>