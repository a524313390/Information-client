<template>
  <div>
    <el-row>
      <el-col :span="12">
        <div id="main" style="width: 100%;height:500px"></div>
      </el-col>
      <el-col :span="12">
        <div id="info" style="width: 100%;height:500px"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>


export default {
  components: {},
  data() {
    return {
      arrList: [],
      companyData: []
    };
  },

  created() {
    this.getPeoInfo();
  },
  mounted() {
    this.getCompany();
  },
  methods: {
    getPeoInfo() {
      this.$axios
        .get("/api/info")
        .then(res => {
          if (res.data.status == 0) {
            let infoChar = echarts.init(document.getElementById("info"));
            let data = res.data.result;
            let serieData = [];
            data.forEach(item => {
              if (item._id == 0) {
                serieData.push({
                  value: item.total_num,
                  name: "已审核"
                });
              } else if (item._id == 1) {
                serieData.push({
                  value: item.total_num,
                  name: "未处理"
                });
              } else if (item._id == 3) {
                serieData.push({
                  value: item.total_num,
                  name: "已拒绝"
                });
              }
            });
            let option = {
              title: {
                text: "不规范信息",

                x: "left"
              },
              tooltip: {
                trigger: "item",
                formatter: "{a} <br/>{b}: {c} ({d}%)"
              },
              legend: {
                orient: "vertical",
				x: "left",
				top:'50',
                data: ["已审核", "未处理", "已拒绝"]
              },
              series: [
                {
                  name: "不规范信息",
                  type: "pie",
                  radius: ["50%", "70%"],
                  avoidLabelOverlap: false,
                  label: {
                    normal: {
                      show: false,
                      position: "center"
                    },
                    emphasis: {
                      show: true,
                      textStyle: {
                        fontSize: "30",
                        fontWeight: "bold"
                      }
                    }
                  },
                  labelLine: {
                    normal: {
                      show: false
                    }
                  },
                  data: serieData
                }
              ]
            };
            infoChar.setOption(option);
          }
        })
        .catch(error => {
          this.$message.error("error");
        });
    },
    getCompany() {
      this.$axios
        .get("/api/company")
        .then(res => {
          if (res.data.status == 0) {
            let myChart = echarts.init(document.getElementById("main"));
            let datas = res.data.result;
            let serieData = [];
            datas.forEach(item => {
              if (item._id == 0) {
                serieData.push({
                  value: item.total_num,
                  name: "未认证"
                });
              } else if (item._id == 1) {
                serieData.push({
                  value: item.total_num,
                  name: "已认证"
                });
              } else if (item._id == 2) {
                serieData.push({
                  value: item.total_num,
                  name: "认证失败"
                });
              }
            });
            let option = {
              title: {
                text: "企业信息认证",

                x: "left"
              },
              tooltip: {
                trigger: "item",
                formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              legend: {
                orient: "vertical",
                left: "left",
                top: "50",
                data: ["未认证", "已认证", "认证失败"]
              },
              series: [
                {
                  name: "访问来源",
                  type: "pie",
                  radius: "55%",
                  center: ["50%", "60%"],
                  data: serieData,
                  itemStyle: {
                    emphasis: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: "rgba(0, 0, 0, 0.5)"
                    }
                  }
                }
              ]
            };

            myChart.setOption(option);
          }
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
    getEcharsDom() {}
  }
};
</script>

<style>
</style>
