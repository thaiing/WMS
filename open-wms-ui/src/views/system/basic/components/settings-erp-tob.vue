<template>
  <div :ref="'settings'" class="settings-sub-container">
    <el-form ref="form" v-model="state.formData" label-width="350px">
      <h2 class="sub-title">{{ $tt('TOB销售单操作') }}</h2>
      <el-form-item :label="$tt('TOB部分分配不锁库占位')">
        <el-switch v-model="state.formData.ERP_SaleOrderDistribution" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('只分配验证是否有库存不占位')">
        <el-switch v-model="state.formData.ERP_SaleOrderSortingOnlyCheck" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('销售订单允许跨货主分拣')">
        <el-switch v-model="state.formData.Erp_CrossConsignor" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('分拣商品单价是否大于0')">
        <el-switch v-model="state.formData.Erp_IsPrice" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('tob销售单是否自动生成出库单')">
        <el-switch v-model="state.formData.ERP_CreateSaleOrder" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('tob销售单是否自动生成收款单')">
        <el-switch v-model="state.formData.ERP_CreateFinanceReceive" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <!-- <el-form-item :label="$tt('确认开票是否自动审核')">
				<el-switch v-model="state.formData.ERP_ConfirmInvoiceAuditing" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item> -->
      <h2 class="sub-title">{{ $tt('TOC销售单操作') }}</h2>
      <el-form-item :label="$tt('是否开启自动分拣')">
        <el-switch v-model="state.formData.isErpActivateSorting" :active-value="1" :inactive-value="0"></el-switch>
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
import to from 'await-to-js';
import { postData } from '/@/api/common/baseApi';
import settingsHook from '../hook/settingsHook';

//#region 定义变量
const state = reactive({
  // 编辑数据对象
  formData: {
    ERP_SaleOrderDistribution: 0,
    ERP_SaleOrderSortingOnlyCheck: 0,
    Erp_CrossConsignor: 0,
    Erp_IsPrice: 0,
    ERP_CreateSaleOrder: 0,
    ERP_CreateFinanceReceive: 0,
    ERP_ConfirmInvoiceAuditing: 0,
    erp_erpSaleOrder_autoSorting: 0,
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
