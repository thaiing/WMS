<template>
  <div :ref="'settings'" class="settings-sub-container">
    <el-form ref="form" v-model="state.formData" label-width="350px">
      <h2 class="sub-title">{{ $tt('出库单配置') }}</h2>
      <el-form-item :label="$tt('允许参与分拣货位类型')">
        <el-checkbox-group v-model="state.formData.sorting_positionType"
          >>
          <el-checkbox :label="1">{{ $tt('常规货位') }}</el-checkbox>
          <el-checkbox :label="2">{{ $tt('残品货位') }}</el-checkbox>
          <el-checkbox :label="4">{{ $tt('收货位') }}</el-checkbox>
          <el-checkbox :label="6">{{ $tt('暂存货位') }}</el-checkbox>
          <el-checkbox :label="7">{{ $tt('虚拟货位') }}</el-checkbox>
          <el-checkbox :label="8">{{ $tt('次品货位') }}</el-checkbox>
          <el-checkbox :label="12">{{ $tt('高架货位') }}</el-checkbox>
          <el-checkbox :label="13">{{ $tt('存储货位') }}</el-checkbox>
          <el-checkbox :label="15">{{ $tt('拣货位') }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$tt('审核后自动生成波次单')">
            <el-switch v-model="state.formData.batch_onlyExamineAfter" :active-value="1" :inactive-value="0"></el-switch>
            <span class="remark">{{ $tt('开启后，将实现一单一拣一波次') }}</span>
          </el-form-item>
          <el-form-item :label="$tt('按区生成子波次')">
            <el-switch v-model="state.formData.batch_onlySubBatch" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item :label="$tt('只允许有快递单号进入波次生成')">
            <el-switch v-model="state.formData.batch_onlyHasExpressCode" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item :label="$tt('只允许CIQ状态（海关状态）为放行的进入波次')">
            <el-switch v-model="state.formData.batch_onlyHasCiqStatus" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item :label="$tt('出库单分拣时不区分货主，跨货主分拣')">
            <el-switch v-model="state.formData.sorting_crossConsignor" :active-value="1" :inactive-value="0"></el-switch>

            <el-input v-model="state.formData.sorting_crossConsignorDays" class="w-100"></el-input>天（设置允许跨货主分拣时长）
          </el-form-item>
          <el-form-item :label="$tt('出库单分拣时拆分整箱拣配单')">
            <el-switch v-model="state.formData.sorting_isFullContainerLoad" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item :label="$tt('是否按集装箱分拣')">
            <el-switch v-model="state.formData.sorting_isContainerNo" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item :label="$tt('拆分订单同步增加转运数据')">
            <el-switch v-model="state.formData.batch_isToTransfer" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item :label="$tt('不同快递公司拆分生成波次单')">
            <el-switch v-model="state.formData.batch_differenceExpressSplitWave" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$tt('开启货主库区分拣策略')">
            <el-switch v-model="state.formData.batch_openStorageArea_regular" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item :label="$tt('分拣订单时启用停售提前时长')">
            <el-switch v-model="state.formData.batch_sorting_stopSaleday" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item :label="$tt('分拣时货位顺序优先于入库时间')">
            <el-switch v-model="state.formData.sorting_positionPriorIndate" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item :label="$tt('出库按照唯一码进行分拣')">
            <el-switch v-model="state.formData.sorting_singleSignCode" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item :label="$tt('编辑页面客户下拉框关联货主')">
            <el-switch v-model="state.formData.orderEdit_clientRelationConsignor" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item :label="$tt('出库单未审核时不能打印')">
            <el-switch v-model="state.formData.sale_retail_noAuditng_noPrint" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item :label="$tt('开启客户(门店)权限')">
            <el-switch v-model="state.formData.sale_openClientAuth" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item :label="$tt('开启供应商权限')">
            <el-switch v-model="state.formData.sale_openProviderAuth" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <h2 class="sub-title">{{ $tt('出库单') }}</h2>
      <el-form-item :label="$tt('关闭拆分出库单中的ERP单号尾部递增序号')">
        <el-switch v-model="state.formData.sale_order_erpcode_close_increasing" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('新建和接口推送自动生成货主过户单')">
        <el-switch v-model="state.formData.sale_order_autoCreateConsignorTransfer" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>

      <h2 class="sub-title">{{ $tt('分拣规则') }}</h2>
      <el-form-item :label="$tt('货位最小数量满足优先分拣')">
        <el-switch v-model="state.formData.sorting_positionGreaterQty" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('添加明细时增加分拣规则')">
        <el-switch v-model="state.formData.sorting_autoAddRegular" :active-value="1" :inactive-value="0"></el-switch>
        <span class="remark">{{ $tt('自动把商品编号，拣货货位，批次号，生产日期，托盘号，唯一码插入到缺货规则内') }}</span>
      </el-form-item>

      <el-form-item class="form-footer fixed-footer">
        <el-button type="primary" @click="onSave">{{ $tt('保存') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts" name="settings-out-biz">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
import settingsHook from '../hook/settingsHook';

//#region 定义变量
const state = reactive({
  // 编辑数据对象
  formData: {
    sorting_positionType: [],
    // 只允许出库订单审核后生成波次单
    batch_onlyExamineAfter: 0,
    batch_onlySubBatch: 0, // 按区生成子波次
    batch_onlyHasExpressCode: 0, // 只允许有快递单号进入波次生成
    batch_onlyHasCiqStatus: 0,
    sorting_crossConsignor: 0,
    sorting_crossConsignorDays: 0,
    sorting_isFullContainerLoad: 0,
    sorting_isContainerNo: 0,
    batch_isToTransfer: 0,
    batch_differenceExpressSplitWave: 0, // 不同快递公司拆分生成波次单

    batch_openStorageArea_regular: 0,
    batch_sorting_stopSaleday: 0,
    sorting_positionPriorIndate: 0,
    sorting_singleSignCode: 0,
    orderEdit_clientRelationConsignor: 0, // 编辑页面客户下拉框关联货主
    sale_retail_noAuditng_noPrint: 0,
    sale_openClientAuth: 0,
    sale_openProviderAuth: 0, // 开启供应商权限

    sale_order_erpcode_close_increasing: 0, // 关闭拆分出库单中的ERP单号尾部递增序号
    sale_order_autoCreateConsignorTransfer: 0, // 新建和接口推送自动生成货主过户单
    sorting_positionGreaterQty: 0,
    sorting_autoAddRegular: 0,
  } as any,
  // 接口数据
  valueList: [] as any[],
});
//#endregion

let base = settingsHook({ state });
onMounted(() => {
  let callback = (configKey: string, configValue: string) => {
    if (['sorting_positionType'].indexOf(configKey) >= 0) {
      state.formData[configKey] = configValue ? ('' + configValue).split(',').map((m) => Number(m)) : [];
    } else {
      state.formData[configKey] = configValue;
    }
  };
  base.loadParam(callback);
});

//#region 保存数据
const onSave = () => {
  let callback = (configKey: string, item: any) => {
    let configValue = state.formData[configKey];
    if (['sorting_positionType'].indexOf(configKey) >= 0) {
      configValue = configValue.join(',');
    }

    if (item) {
      item.configValue = configValue;
    } else {
      state.valueList.push({
        configKey: configKey,
        configType: 'N',
        configValue: configValue,
      });
    }
  };

  base.onSave(callback);
};
//#endregion
</script>

<style lang="scss" scoped>
.settings-sub-container {
  margin-bottom: 90px;

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
    margin-left: 10px;
  }

  ::v-deep .el-form-item {
    margin-bottom: 0px;
  }

  .form-footer {
    margin-top: 30px;

    &.fixed-footer {
      position: fixed;
      bottom: 0;
      left: 472px;
      right: 10px;
      background-color: white;
      border-top: 1px solid #ebeef5;
      padding: 20px;
    }
  }

  ::v-deep .el-checkbox {
    margin-right: 15px;
  }

  ::v-deep .el-checkbox__label {
    padding-left: 2px;
  }
}
</style>
