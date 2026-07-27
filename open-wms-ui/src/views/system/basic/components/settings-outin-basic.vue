<template>
  <div :ref="'settings'" class="settings-sub-container">
    <el-form ref="form" v-model="state.formData" label-width="300px">
      <h2 class="sub-title">{{ $tt('SKU参数配置') }}</h2>
      <el-form-item :label="$tt('商品编号自动编码')">
        <el-switch v-model="state.formData.sku_autoProductCode" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('商品条码同商品编号')">
        <el-switch v-model="state.formData.sku_barcodeSyncProductCode" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('商品编号同商品条码')">
        <el-switch v-model="state.formData.sku_productCodeSyncBarcode" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <!-- <el-form-item label="SKU支持多规格管理">
        <el-switch :active-value="1" :inactive-value="0" v-model="state.formData.sku_multiSpec"></el-switch>
        <span class="remark">SKU支持子SKU</span>
      </el-form-item> -->
      <el-form-item :label="$tt('SKU支持一品多码')">
        <el-switch v-model="state.formData.sku_productToMultiBarcode" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('SKU支持一码多品')">
        <el-switch v-model="state.formData.sku_barcodeToMultiProduct" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>

      <h2 class="sub-title">{{ $tt('商品基础信息导入') }}</h2>
      <el-form-item :label="$tt('商品编号存在不更新')">
        <el-switch v-model="state.formData.sku_productCodeExistNoUpdate" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('开启供应商权限')">
        <el-switch v-model="state.formData.sku_openProviderAuth" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('货主不存在时默认第一个货主')">
        <el-switch v-model="state.formData.sku_noConsignorDefaultFirst" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('供应商不存在时默认第一个供应商')">
        <el-switch v-model="state.formData.sku_noProviderDefaultFirst" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('供应商不存在时自动创建')">
        <el-switch v-model="state.formData.sku_noProviderAutoCreate" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>

      <h2 class="sub-title">{{ $tt('商品信息选择器') }}</h2>
      <el-form-item :label="$tt('不默认货主/供应商')">
        <el-switch v-model="state.formData.sku_noDefaultConsignorProvider" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('货主/供应商可编辑')">
        <el-switch v-model="state.formData.sku_editConsignorProvider" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <h2 class="sub-title">{{ $tt('库存商品选择器') }}</h2>
      <el-form-item :label="$tt('不默认货主/供应商')">
        <el-switch v-model="state.formData.sku_noDefaultConsignorProvider_storage" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('货主/供应商可编辑')">
        <el-switch v-model="state.formData.sku_editConsignorProvider_storage" :active-value="1" :inactive-value="0"></el-switch>
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
let proxy = ins.proxy as BaseProperties;
import settingsHook from '../hook/settingsHook';

//#region 定义变量
const state = reactive({
  // 编辑数据对象
  formData: {
    sku_autoProductCode: 0,
    sku_barcodeSyncProductCode: 0,
    sku_productCodeSyncBarcode: 0,
    sku_multiSpec: 0,
    sku_productToMultiBarcode: 0,
    sku_barcodeToMultiProduct: 0,
    sku_productCodeExistNoUpdate: 0,
    sku_autoDefaultConsignorProvider: 0,
    sku_editConsignorProvider: 0,
  } as any,
  valueList: [] as any[],
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
