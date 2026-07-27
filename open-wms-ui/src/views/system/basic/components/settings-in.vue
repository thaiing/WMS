<template>
  <div :ref="'settings'" class="settings-sub-container">
    <el-form ref="form" v-model="state.formData" label-width="350px">
      <h2 class="sub-title">{{ $tt('预到货单设置') }}</h2>
      <el-form-item :label="$tt('预到货单明细自动生成批次号')">
        <el-switch v-model="state.formData.in_autoGenerateBatchCode" :active-value="1" :inactive-value="0"></el-switch>
        <span class="margin-left-10">{{ $tt('编码规则') }}：</span>
        <el-select v-model="state.formData.in_autoGenerateBatchCodeRegular" :placeholder="$tt('请选择')" class="w-200">
          <el-option label="{GUID}" value="{GUID}"></el-option>
          <el-option label="{YYYYMMDD}" value="{YYYYMMDD}"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$tt('预到货单明细自动生成唯一码')">
        <el-switch v-model="state.formData.in_autoSingleSignCode" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('集装箱号为空时默认预到货单')">
        <el-switch v-model="state.formData.in_containerNoDefaultOrderCode" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>

      <el-form-item :label="$tt('收货质检位置')">
        <el-radio v-model="state.formData.in_inboundQualityPosition" label="INBOUND_BEFORE">{{ $tt('收货前') }}</el-radio>
        <el-radio v-model="state.formData.in_inboundQualityPosition" label="INBOUND_AFTER">{{ $tt('收货后上架前') }}</el-radio>
      </el-form-item>
      <el-form-item :label="$tt('预到货导入验证商品绑定货主')">
        <el-switch v-model="state.formData.in_purchaseImportConsignorCheck" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('预到货自动审核(开关)')">
        <el-switch v-model="state.formData.in_purchaseAuditingAuto" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('供应商根据货主筛选')">
        <el-switch v-model="state.formData.in_providerByConsignor" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>

      <h2 class="sub-title">{{ $tt('常规扫描入库配置') }}</h2>
      <el-form-item :label="$tt('预到货审核时更新SKU中的供应商和采购价')">
        <el-switch v-model="state.formData.in_updateProductInfo" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('扫描入库时同时生成上架单')">
        <el-switch v-model="state.formData.in_generateShelve" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('扫描入库时合并生成上架单')">
        <el-switch v-model="state.formData.in_generateShelveOnly" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('扫描入库时同时生成质检单')">
        <el-switch v-model="state.formData.in_generateQualityCheck" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('预到货常规扫描入库时允许超收')">
        <el-switch v-model="state.formData.in_overcharges" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('常规扫描校验时启用装箱操作')">
        <el-switch v-model="state.formData.in_caseNumber" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('入库校验托盘号')">
        <el-switch v-model="state.formData.in_checkPlateNo" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('无单入库/上架码盘默认加载收货位')">
        <el-switch v-model="state.formData.in_receivePosition" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('无单扫描入库需要扫描批号')">
        <el-switch v-model="state.formData.in_noBillScanBatchNumber" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('入库时启用禁收日期')">
        <el-switch v-model="state.formData.in_noReceivingDate" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('重量核验')">
        <el-switch v-model="state.formData.in_WeightVerification" :active-value="1" :inactive-value="0"></el-switch>
        <span class="margin-left-10 color-666">{{ $tt('如果预到货单内的重量比入库计划单高10%需要预警') }}</span>
      </el-form-item>
      <el-form-item :label="$tt('生产日期预警')">
        <el-switch v-model="state.formData.in_noEarlyWarning" :active-value="1" :inactive-value="0"></el-switch>
        <span class="margin-left-10 color-666">{{ $tt('发现早于以前批次的商品，系统进行相应的预警') }}</span>
      </el-form-item>
      <el-form-item :label="$tt('审核成功允许扫描入库')">
        <el-switch v-model="state.formData.in_auditEnableScan" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('装箱扫描商品条码只带出自己')">
        <el-switch v-model="state.formData.in_caseScanProductModelOnly" :active-value="1" :inactive-value="0"></el-switch>
        <span class="margin-left-10 color-666">{{ $tt('扫描商品条码只带出当前扫描的商品条码明细') }}</span>
      </el-form-item>
      <el-form-item :label="$tt('PDA关闭序列号录入')">
        <el-switch v-model="state.formData.in_pdaOpenSingleSignCode" :active-value="1" :inactive-value="0"></el-switch>
        <span class="margin-left-10 color-666">{{ $tt('PDA开启序列号录入') }}</span>
      </el-form-item>
      <!-- <el-form-item label="PDA生产日期必填">
        <el-switch v-model="state.formData.manufactureDate_Required" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item> -->
      <el-form-item :label="$tt('PDA收货任务商品信息校验')">
        <el-switch v-model="state.formData.Receiving_task_verification" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('PDA收货入库填写长、宽、高、体积')">
        <el-switch v-model="state.formData.in_fillLongWideHighCube" :active-value="1" :inactive-value="0"></el-switch>
        <span class="margin-left-10 color-666">{{ $tt('开启时DPA收货入库的商品明细增加长宽高体积(体积自动计算出来)，关闭不进行操作') }}</span>
      </el-form-item>
      <el-form-item :label="$tt('收货时将商品信息中的关联码带入库存')">
        <el-switch v-model="state.formData.in_bringRelationCodetheProductPosition" :active-value="1" :inactive-value="0"></el-switch>
        <span class="margin-left-10 color-666">{{ $tt('开启时才会将商品信息中的关联码带到库存，关闭时不会将商品信息的关联码带到库存') }}</span>
      </el-form-item>
      <el-form-item :label="$tt('按拍上架推荐货位根据拍数推荐')">
        <el-switch v-model="state.formData.in_shelvePaiCount" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>

      <h2 class="sub-title">{{ $tt('一键入库设置') }}</h2>
      <el-form-item :label="$tt('默认收货位')">
        <el-switch v-model="state.formData.in_isQuickEnterPositionName" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('审核后入库')">
        <el-switch v-model="state.formData.in_isAuditAfter" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <h2 class="sub-title">{{ $tt('托盘号默认为货位号') }}</h2>
      <el-form-item :label="$tt('一键入库')">
        <el-switch v-model="state.formData.in_oneClickInStorage" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('待上架单扫描')">
        <el-switch v-model="state.formData.in_waitShelveBillScan" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>

      <h2 class="sub-title">{{ $tt('无单入库扫描') }}</h2>
      <el-form-item :label="$tt('PDA显示货位扫描框')">
        <el-switch v-model="state.formData.noBillscan_shelve" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('收货位下拉框改为输入框')">
        <el-switch v-model="state.formData.noBillscan_positionName_text" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$tt('商品条码下拉框改为输入框')">
        <el-switch v-model="state.formData.noBillscan_productModel_text" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>

      <h2 class="sub-title">{{ $tt('PDA按单码盘扫描') }}</h2>
      <el-form-item :label="$tt('拍号同步到库存关联码')">
        <el-switch v-model="state.formData.in_plateToRelationCode" :active-value="1" :inactive-value="0"></el-switch>
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
    in_autoGenerateBatchCode: 0,
    in_autoGenerateBatchCodeRegular: '{YYYYMMDD}',
    in_updateProductInfo: 0,
    in_generateShelve: 0,
    in_purchaseAuditingAuto: 0,
    in_providerByConsignor: 0,
    in_productSecurity: 0,

    in_overcharges: 0,
    in_caseNumber: 0,
    in_checkPlateNo: 0,
    in_receivePosition: 0,
    in_noBillScanBatchNumber: 0,
    in_noReceivingDate: 0,
    // 重量核验
    in_WeightVerification: 0,
    // 是否生产唯一码
    in_autoSingleSignCode: 0,
    // 收货质检位置
    in_inboundQualityPosition: null,
    // 审核成功允许扫描入库
    in_auditEnableScan: 0,
    // 扫描后上架货位改成修改输入框
    noBillscan_shelve: 0,
    // 默认收货位
    in_isQuickEnterPositionName: 0,
    // 审核后入库
    in_isAuditAfter: 0,
    // 拍号同步到库存关联码
    in_plateToRelationCode: 1,
    // 收货时将商品信息中的关联码带入库存
    in_bringRelationCodetheProductPosition: 1,
    // 按拍上架推荐货位根据拍数推荐
    in_shelvePaiCount: 0,
    // /收货位下拉框改为输入框
    noBillscan_positionName_text: 0,
    // 商品条码下拉框改为输入框
    noBillscan_productModel_text: 0,
    // 无单出入库生成车辆出入信息
    nobillscan_toTMSVehicleAccess: 0,
    // 托盘号默认为货位号 - 待上架单扫描
    in_waitShelveBillScan: 0,
    // 生产日期预警
    in_noEarlyWarning: 0,
  } as any,
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
    margin-bottom: 0px;
  }
  .form-footer {
    margin-top: 30px;
  }
}
</style>
