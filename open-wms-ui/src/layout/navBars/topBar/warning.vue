<template>
  <div class="warning-box">
    <div class="font-14 warning-box" @click="showDrawer">
      <i class="yrt-xiaoxi2" />
      <span>预警</span>
    </div>
    <el-drawer title="预警弹窗" v-model="drawer" :size="550" direction="rtl" append-to-body>
      <el-card class="box-card">
        <div slot="header" class="clearfix">业务量（收）异常预警</div>
        <el-table :data="gridData1">
          <el-table-column prop="date" label="日期" width="100">
            <template #default="{ row }">
              <el-link type="primary" @click="link('/sys/dev-tools/bi-viewer?isviewer=true&id=112&name=业务量（收）异常预警')">{{ row.date }}</el-link>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="仓库" width="120"></el-table-column>
          <el-table-column prop="address" label="预警类型"></el-table-column>
        </el-table>
      </el-card>

      <el-card class="box-card">
        <div slot="header" class="clearfix">资源瓶颈预警</div>
        <el-table :data="gridData1">
          <el-table-column prop="date" label="日期" width="100">
            <template #default="{ row }">
              <el-link type="primary" @click="link('/sys/dev-tools/bi-viewer?isviewer=true&id=113&name=资源瓶颈预警')">{{ row.date }}</el-link>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="仓库" width="120"></el-table-column>
          <el-table-column prop="address" label="预警类型"></el-table-column>
        </el-table>
      </el-card>

      <el-card class="box-card">
        <div slot="header" class="clearfix">运营质量预警</div>
        <el-table :data="gridData1">
          <el-table-column prop="date" label="日期" width="100">
            <template #default="{ row }">
              <el-link type="primary" @click="link('/sys/dev-tools/bi-viewer?isviewer=true&id=114&name=运营质量预警')">{{ row.date }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="仓库" width="120"></el-table-column>
          <el-table-column prop="address" label="预警类型"></el-table-column>
        </el-table>
      </el-card>
    </el-drawer>
  </div>
</template>

<script>
import { postData } from '/@/api/common/baseApi';
import to from 'await-to-js';
export default {
  data() {
    return {
      drawer: false,
      gridData1: [
        {
          date: '2023-10-02',
          name: '北京仓',
          address: '运输预警、入库预警',
        },
        {
          date: '2023-10-04',
          name: '北京仓',
          address: '运输预警、入库预警、出库预警',
        },
        {
          date: '2023-11-01',
          name: '上海仓',
          address: '运输预警',
        },
        {
          date: '2023-11-03',
          name: '上海仓',
          address: '运输预警、入库预警、出库预警',
        },
      ],
    };
  },
  methods: {
    // 显示drawer
    showDrawer() {
      this.drawer = true;
    },
    link(url) {
      try {
        this.$router.push({ path: url });
      } catch (error) {
        console.log(error);
      }
      this.drawer = false;
    },
    async getGridData() {
      const url = '/composite/basic/baseStorageComposite/getGridData';
      var params = {};
      const [err, res] = await to(postData(url, params));
      if (res?.result) {
        state.printCaseVueData = res.data;
      }
    },
  },
};
</script>

<style scoped>
.warning-box {
  color: #5a5e66;
  cursor: pointer;
}
.international-icon {
  font-size: 20px;
  cursor: pointer;
  height: 20px;
  vertical-align: -5px !important;
}
.international {
  vertical-align: -12px !important;
  cursor: pointer;
}
.box-card {
  margin: 10px;
}
</style>
