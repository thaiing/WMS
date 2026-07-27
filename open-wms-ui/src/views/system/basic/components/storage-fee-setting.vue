<template>
  <div :ref="'settings'" class="settings-sub-container">
    <el-form ref="form" v-model="state.formData" label-width="350px">
      <h2 class="sub-title">{{ $tt('仓储费设置') }}</h2>
      <el-form-item :label="$tt('货主状态关联仓储费状态')">
        <el-switch v-model="state.formData.api_consignorRelationState" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('出入库计划单一次性费用项带入到业务单中')">
        <el-switch v-model="state.formData.api_outInToBizMustFeeItem" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('出入库单审核时必须设置一次性费用项')">
        <el-switch v-model="state.formData.api_outInMustFeeItem" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('自动生成补货单')">
        <el-switch v-model="state.formData.auto_toReplenishment" :active-value="1" :inactive-value="0"></el-switch>
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
    api_consignorRelationState: 0,
    api_outInMustFeeItem: 0,
    api_outInToBizMustFeeItem: 0,
    auto_toReplenishment: 0, // 自动生成补货单
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
