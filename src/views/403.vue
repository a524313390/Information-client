<template>
    <div>
        <section class="container">
            <img src="../assets/images/403.gif" alt />
        </section>
        <div class="goback" @click="goback">点击返回上一页</div>
    </div>
</template>
<script>
export default {
    name: "notfun",
    methods: {
        goback() {
            this.$router.go(-1); //
        }
    }
};
</script>
<style scoped>
.container {
    width: 50%;
    height: 50%;
    overflow: hidden;
    margin: auto;
}
.container img {
    width: 100%;
    height: 100%;
}
.goback {
    text-align: center;
    cursor: pointer;
}
</style>