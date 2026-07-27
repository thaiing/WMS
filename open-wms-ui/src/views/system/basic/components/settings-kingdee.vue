<template>
  <div :ref="'settings'" class="settings-sub-container">
    <el-form ref="form" v-model="state.formData" label-width="150px">
      <h2 class="sub-title">{{ $tt('金蝶自动任务') }}</h2>

      <el-form-item :label="$tt('品牌')">
        <el-switch v-model="state.formData.isKingdeeBrand" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('商品')">
        <el-switch v-model="state.formData.isKingdeeProductInfo" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('供应商')">
        <el-switch v-model="state.formData.isKingdeeProvider" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('仓库')">
        <el-switch v-model="state.formData.isKingdeeStorage" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('客户')">
        <el-switch v-model="state.formData.isKingdeeClient" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('其他出库')">
        <el-switch v-model="state.formData.isKingdeeStorageOuter" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('版本')">
        <el-switch v-model="state.formData.isKingdeeEdition" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('仓库分组')">
        <el-switch v-model="state.formData.isKingdeeStorageGroup" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('客户分组')">
        <el-switch v-model="state.formData.isKingdeeClientGroup" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('客户类别')">
        <el-switch v-model="state.formData.isKingdeeClientType" :active-value="1" :inactive-value="0"></el-switch>
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
    isKingdeeBrand: 0,
    isKingdeeProductInfo: 0,
    isKingdeeProvider: 0,
    isKingdeeStorage: 0,
    isKingdeeClient: 0,
    isKingdeeStorageOuter: 0,
    isKingdeeEdition: 0,
    isKingdeeStorageGroup: 0,
    isKingdeeClientGroup: 0,
    isKingdeeClientType: 0,
  },
  // 接口数据
  valueList: [] as any[],
});
//#endregion
var base = settingsHook({ state });
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
    margin-bottom: 20px;
  }

  .form-footer {
    margin-top: 30px;
  }
}
</style>
