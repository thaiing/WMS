<template>
  <div>
    <el-steps :active="currentActive" process-status="success" finish-status="success">
      <el-step v-for="(item, index) in state.stepList" :key="index" :title="item.step"></el-step>
    </el-steps>
  </div>
</template>

<script setup lang="ts" name="order-tob-statusflow">
import { ComponentInternalInstance } from 'vue';

import { BaseProperties } from '/@/types/base-type';
import { postData } from '/@/api/common/baseApi';
import to from 'await-to-js';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
const emit = defineEmits(['update:visible', 'on-closed']);
import _ from 'lodash';
import { computed, ref } from 'vue';
import { cloneDeep } from 'lodash';

//#region 定义变量
const state = reactive({
  active: 0,
  stepList: [] as any[],
  stepsInfo: {
    status: '', //单据状态
    mainId: 0, //单据ID
    mainCode: '', // 单据编号
    storageId: 0, // 仓库Id
    consignorId: 0, //货主Id
    clientId: 0, // 客户Id
  },
});

// 计算当前激活的步骤
const currentActive = computed(() => {
  let active = 0;
  let info = state.stepList.find((item) => item.step == state.stepsInfo.status);
  if (info) {
    active = info.active;
  }
  return active;
});

const initData = async (stepsInfo: any) => {
  state.stepsInfo = cloneDeep(stepsInfo);
  //查询状态节点配置信息
  const url = '/tms/biz/clockInBusiness/getConfigList';
  let params = [] as any[];
  if (state.stepsInfo.clientId) {
    params.push({
      column: 'clientId',
      values: state.stepsInfo.clientId,
    });
  }
  if (state.stepsInfo.storageId) {
    params.push({
      column: 'storageId',
      values: state.stepsInfo.storageId,
    });
  }

  if (state.stepsInfo.consignorId) {
    params.push({
      column: 'consignorId',
      values: state.stepsInfo.consignorId,
    });
  }
  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }

  if (res.result) {
    state.stepList = res.data?.map((item: any, index: any) => {
      return {
        step: item.nodalName,
        active: index,
      };
    });
  }
};

// 对外暴露属性和方法
defineExpose({
  initData,
});
</script>
