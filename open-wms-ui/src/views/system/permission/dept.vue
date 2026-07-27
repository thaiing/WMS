<template>
  <div class="biz-container">
    <el-tabs v-model="state.currentTab" type="card">
      <el-tab-pane label="公司部门" name="dept">
        <dept-tab></dept-tab>
      </el-tab-pane>
      <el-tab-pane label="公司成员" name="user">
        <user-tab></user-tab>
      </el-tab-pane>
      <el-tab-pane label="已禁账号" name="fourth">
        <user-disabled-tab></user-disabled-tab>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts" name="system-permission-dept">
import deptTab from './components/dept-tab.vue';
import userTab from './components/user-tab.vue';
import userDisabledTab from './components/user-disabled-tab.vue';
import { ComponentInternalInstance } from 'vue';
let ins = getCurrentInstance() as ComponentInternalInstance;
import { BaseProperties, ResultInfo } from '/@/types/base-type';
let proxy = ins.proxy as BaseProperties;

//#region 定义变量
const state = reactive({
  currentTab: 'dept',
});
//#endregion

onMounted(() => {});
</script>

<style lang="scss" scoped>
.biz-container {
  margin: 0px;
}
</style>
