<template>
  <div :ref="'settings'" class="settings-sub-container">
    <el-form ref="form" v-model="state.formData" label-width="350px">
      <h2 class="sub-title">{{ $tt('WCS参数设置') }}</h2>
      <el-form-item :label="$tt('入库直接上架后自动生成WCS任务')">
        <el-switch v-model="state.formData.in_finished_to_wcs" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('扫描上架后自动生成WCS任务')">
        <el-switch v-model="state.formData.in_shelved_to_wcs" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('打包出库后自动生成WCS任务')">
        <el-switch v-model="state.formData.out_finished_to_wcs" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>

      <el-form-item :label="$tt('WCS接口地址')">
        <el-input v-model="state.formData.wcsUrl" placeholder="请输入WCS接口地址"></el-input>
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
    in_finished_to_wcs: 0,
    in_shelved_to_wcs: 0,
    out_finished_to_wcs: 0,
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
