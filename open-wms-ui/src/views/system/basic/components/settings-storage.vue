<template>
  <div :ref="'settings'" class="settings-sub-container">
    <el-form ref="form" v-model="state.formData" label-width="350px">
      <h2 class="sub-title">{{ $tt('库存操作设置') }}</h2>
      <el-form-item :label="$tt('库存补货单分拣时不区分货主，跨货主分拣')">
        <el-switch v-model="state.formData.storage_crossConsignor" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>

      <h2 class="sub-title">{{ $tt('调拨操作设置') }}</h2>
      <el-form-item :label="$tt('调入RSL锁定库存')">
        <el-switch v-model="state.formData.in_updateProductInfo" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('RSL入库完成解锁库存')">
        <el-switch v-model="state.formData.storage_unLockAfterFinish" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>

      <h2 class="sub-title">{{ $tt('库存盘点') }}</h2>
      <el-form-item :label="$tt('无单盘点保存后自动调整库存')">
        <el-switch v-model="state.formData.storage_checkAutoAdjust" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>

      <h2 class="sub-title">{{ $tt('货主过户') }}</h2>
      <el-form-item :label="$tt('自动过户原货主')">
        <el-select v-model="state.formData.storage_autoConsignorTransfer_origin" filterable default-first-option placeholder="请选择货主" class="consignor-select">
          <el-option v-for="(row, index) in state.consignorList" :key="index" :label="row.label" :value="row.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item class="form-footer">
        <el-button type="primary" @click="hook.onSave">{{ $tt('保存') }}</el-button>
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
import baseHook from '/@/components/hooks/baseHook';

const base = baseHook();
const { baseState } = base;

//#region 定义变量
const state = reactive({
  ...toRefs(baseState),
  // 编辑数据对象
  formData: {
    Storage_ReplenishmentCrossConsignor: 0,
    Storage_LockAfterFinish: 0,
    storage_unLockAfterFinish: 0,
    storage_autoConsignorTransfer_origin: null,
  } as any,
  // 接口数据
  valueList: [] as any[],
  consignorList: [] as any[],
});
//#endregion

// 获取下拉框值
const getDropDown = async () => {
  var url = '/system/core/common/loadDropDown';
  const params = [
    {
      column: 'dropdownId',
      dataType: 'LONG',
      queryType: 'IN',
      values: '797',
    },
  ];
  let [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }
  if (res?.result) {
    state.consignorList = res.data.dropdown797;
  }
};

let hook = settingsHook({ state });
onMounted(() => {
  hook.loadParam();
  // 获取下拉框值
  getDropDown();
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
