<template>
  <div :ref="'settings'" class="settings-sub-container">
    <el-form ref="form" v-model="state.formData" label-width="350px">
      <h2 class="sub-title">{{ $tt('流程审核UI设置') }}</h2>
      <el-form-item :label="$tt('显示抄送人')">
        <el-switch v-model="state.formData.flowable_copyUser" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('指定审批人')">
        <el-switch v-model="state.formData.flowable_designatedApprover" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('委派')">
        <el-switch v-model="state.formData.flowable_delegate" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('转办')">
        <el-switch v-model="state.formData.flowable_transfer" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('退回')">
        <el-switch v-model="state.formData.flowable_return" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('拒绝')">
        <el-switch v-model="state.formData.flowable_reject" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>

      <el-form-item class="form-footer">
        <el-button type="primary" @click="base.onSave">{{ $tt('保存') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts" name="settings-consignor">
import settingsHook from '../hook/settingsHook';

//#region 定义变量
const state = reactive({
  // 编辑数据对象
  formData: {
    flowable_copyUser: 0,
    flowable_designatedApprover: 0,
    flowable_delegate: 0,
    flowable_transfer: 0,
    flowable_return: 0,
    flowable_reject: 0,
    wcsUrl: '',
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
