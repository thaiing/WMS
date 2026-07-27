<template>
  <div :ref="'settings'" class="settings-sub-container">
    <el-form ref="form" v-model="state.formData" label-width="350px">
      <h2 class="sub-title">{{ $tt('干线运输单操作') }}</h2>
      <el-form-item :label="$tt('卸货签收上传附件设为非必填项')">
        <el-switch v-model="state.formData.tms_SignAttachFile" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('运费载配--按承运商取运价')">
        <el-switch v-model="state.formData.tms_FreightAllocation" :active-value="1" :inactive-value="0"></el-switch>
        <span class="margin-left-10 color-666">{{ $tt('运费载配--按客户取运价') }}</span>
      </el-form-item>
      <el-form-item :label="$tt('城配费用添加')">
        <el-switch v-model="state.formData.tms_UrbanAllocationFeeAddition" :active-value="1" :inactive-value="0"></el-switch>
        <span class="margin-left-10 color-666">{{ $tt('默认打开，运输单会生成运输费用') }}</span>
      </el-form-item>
      <el-form-item class="form-footer">
        <el-button type="primary" @click="base.onSave">{{ $tt('保存') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts" name="settings-consignor">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
let ins = getCurrentInstance() as ComponentInternalInstance;
import settingsHook from '../hook/settingsHook';

//#region 定义变量
const state = reactive({
  // 编辑数据对象
  formData: {
    tms_SignAttachFile: 0,
    tms_FreightAllocation: 0,
    tms_UrbanAllocationFeeAddition: 1,
  } as any,
  valueList: [] as any[],
  providerNames: [] as any[],
});
//#endregion

let base = settingsHook({ state });
onMounted(() => {
  base.loadParam();
});
</script>

<style lang="scss" scoped>
.settings-sub-container {
  ::v-deep .sub-title {
    font-size: 14px;
    padding-bottom: 10px;
    border-bottom: 1px solid #ebeef5;
    padding-top: 20px;
    margin-bottom: 10px;
  }
  ::v-deep .el-form-item__label {
    font-weight: normal;
  }
  .remark {
    color: #888;
  }
  ::v-deep .el-form-item {
    margin-bottom: 0px;
  }
  .form-footer {
    margin-top: 30px;
  }
}
</style>
