<template>
  <div class="scan-container">
    <el-card class="scan-card no-print">
      <template #header>
        <div class="clearfix justify-start">
          <span class="title">{{ $tt('扫拍打包') }}</span>
        </div>
      </template>
      <el-row>
        <el-col :xl="11" :md="14" :xs="24">
          <el-form ref="form" :model="state.formData" label-width="120px" class="scan-form">
            <el-form-item :label="$tt('快递号/出库单号')">
              <el-input ref="orderCode" v-model="state.formData.orderCode" autofocus class="input-300" @keyup.enter.stop="getOutOrderPlate"></el-input>
            </el-form-item>
            <el-form-item :label="$tt('托盘号')">
              <el-input ref="plateCode" v-model="state.formData.plateCode" class="input-300" @keyup.enter.stop="checkPackingBarcode"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="success" :loading="state.isSubmiting" @click="partialSave">
                <template #icon>
                  <i class="icon-qiyong mr-5"></i>
                </template>
                {{ $tt('复核提交') }}
              </el-button>
              <el-button class="margin-right-10" @click="onReset">{{ $tt('重置') }}</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col v-if="state.formData.isScanSn" :xl="12" :md="10" :xs="24">
          <el-form ref="formSn" :model="state.formData" label-position="top" label-width="120px" class="scan-sn-form">
            <el-form-item :label="$tt('扫描SN')">
              <el-input ref="snList" v-model="state.formData.snList" type="textarea" :rows="6" class="input-500" @blur="base.scanSn()" @keyup.stop="base.scanSn"></el-input>
              <div class="color-666">
                {{ $tt('SN条数') }}：
                <span>{{ state.formData.scanQty }}</span>
              </div>
            </el-form-item>
          </el-form>
          <el-form ref="formSn-hold" :model="state.formData" label-position="top" label-width="120px" class="scan-sn-form">
            <el-form-item :label="$tt('核验SN列表（拣货SN）')">
              <el-input ref="checkSnList" v-model="state.formData.checkSnList" type="textarea" :disabled="true" :rows="6" class="input-500" @blur="base.scanSn()" @keyup.stop="base.scanSn"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="scan-result body-no-padding no-print">
      <template #header>
        <div class="scan-result-header">
          <span class="padding-top-10">
            {{ $tt('扫描结果') }}
          </span>
          <el-button link class="floatRight" @click="state.setting.visible = true">{{ $tt('字段设置') }}</el-button>
        </div>
      </template>
      <el-table ref="scan-table" :data="base.state.tableData" :row-class-name="base.rowClass" stripe style="width: 100%" size="small" max-height="500px" class="scan-table" @row-dblclick="base.setCurrent" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <template v-for="(item, index) in state.setting.fields">
          <template v-if="['length', 'width', 'height'].indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width" align="center">
              <template #default="{ row }">
                <el-input-number v-model="row[item.prop]" class="w-100pc" controls-position="right" @change="base.rowChangeQty(item.prop, row)"></el-input-number>
              </template>
            </el-table-column>
          </template>
          <template v-else-if="'positionName,scanWeight'.indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width" align="center">
              <template #default="{ row }">
                <el-input v-model="row[item.prop]" size="small" class="w-100pc"></el-input>
              </template>
            </el-table-column>
          </template>
          <template v-else-if="'produceDate,limitDate'.indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width" align="center">
              <template #default="{ row }">
                <el-date-picker v-model="row[item.prop]" size="small" type="date" :placeholder="$tt('选择日期')" class="w-110" value-format="YYYY-MM-DD"></el-date-picker>
              </template>
            </el-table-column>
          </template>
          <!--SN序列号-->
          <template v-else-if="'bigQty'.indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width">
              <template #default="{ row }">
                <!-- {{ row }} -->
                <!-- <span class="sn-text">{{ row.bigQty || 0 }}{{ row.bigUnit || '' }}{{ row.bigQty || 0 }}{{ '瓶' }}</span> -->
                <span class="sn-text">{{
                  common.formatData(row, {
                    prop: 'bigQty',
                    formatter: '大单位格式化',
                  })
                }}</span>
              </template>
            </el-table-column>
          </template>
          <!--SN序列号-->
          <template v-else-if="'singleSignCode'.indexOf(item.prop) >= 0 && state.formData.isScanSn">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width" align="center">
              <template #default="{ row }">
                <span class="sn-text">{{ row.singleSignCode }}</span>
                <span class="sn-count">[{{ $tt('SN数') }}：{{ row.singleSignCode ? row.singleSignCode.split(',').length : 0 }}]</span>
              </template>
            </el-table-column>
          </template>
          <template v-else-if="['rowPackage', 'rowWeight', 'rowCube'].indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width" align="center">
              <template #default="{ row }">
                <el-input-number v-model="row[item.prop]" :min="0" size="small" class="w-100pc" controls-position="right" @change="base.rowChangeQty(item.prop, row)"></el-input-number>
              </template>
            </el-table-column>
          </template>
          <template v-else>
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width" :min-width="item.minWidth" align="center">
              <template #default="{ row, column, $index }">
                <template v-if="item.type === 'input'">
                  <template v-if="['int', 'bigint'].indexOf(item.dataType) >= 0">
                    <el-input-number v-model.number="row[item.prop]" controls-position="right" size="small" class="w-100pc"></el-input-number>
                  </template>
                  <template v-else-if="['bigDecimal', 'float', 'double'].indexOf(item.dataType) >= 0">
                    <el-input-number v-model="row[item.prop]" :precision="2" controls-position="right" size="small" class="w-100pc"></el-input-number>
                  </template>
                  <template v-else>
                    <el-input v-model="row[item.prop]" small="mini" class="w-100pc"></el-input>
                  </template>
                </template>
                <template v-else>
                  {{ row[item.prop] }}
                </template>
              </template>
            </el-table-column>
          </template>
        </template>
      </el-table>
    </el-card>

    <scan-setting-dialog ref="setting-dialog" v-model:visible="state.setting.visible" :fields="state.setting.fields" :name="state.setting.name"></scan-setting-dialog>
  </div>
</template>

<script setup lang="ts" name="outbound-scan-out">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
import { postData } from '/@/api/common/baseApi';
const ScanSettingDialog = defineAsyncComponent(() => import('/@/components/common/components/scanSettingDialog.vue'));
import _ from 'lodash';
import scanHook from '/@/components/hooks/scanHook';
import to from 'await-to-js';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

const config = ref({
  // 按拣货数量打包开启
  outer_pickQuantity: true,
});

const base = scanHook({
  config,
  // 配置参数自定义处理
  doData: (item: any, hookOptions: any) => {
    let configKey = item.configKey; // 字段名称
    let configValue = item.configValue;

    if (proxy.common.isNumber(item.configValue)) {
      configValue = parseInt(item.configValue);
    }

    // 扫描明细必填项
    if (configKey === 'outer_scanDetails') {
      hookOptions.config.value[configKey] = typeof configValue === 'string' ? configValue.split(',') : [];
    }
    // 重量单位、体积单位、称重阈值，保留为字符串格式
    else if (['global_weightUnit', 'global_cubeUnit', 'outer_weightWhreshold'].indexOf(item.value02) >= 0) {
      hookOptions.config.value[configKey] = configValue;
    } else {
      hookOptions.config.value[configKey] = !!configValue;
    }
  },
});

//#region 定义变量
const state = reactive({
  // 配置参数
  config: config.value,
  formData: {
    ...toRefs(base.state.formData),
    orderId: 0,
    orderCode: '', // 扫描单号
  },
  multipleSelection: [],
  // 扫描列设置对话框参数
  setting: {
    visible: false,
    name: 'outbound-scan-out',
    fields: [
      {
        prop: 'productModel',
        label: '条形码',
        visible: true,
        width: 130,
        minWidth: 130,
        dataType: 'string',
        type: 'none',
        order: 1,
      },
      {
        prop: 'quantityOrder',
        label: '商品数量',
        visible: true,
        width: 70,
        order: 2,
      },
      {
        prop: 'pickQuantity',
        label: '拣货数量',
        visible: false,
        width: 70,
        order: 2,
      },
      {
        prop: 'matchQty',
        label: '配货数量',
        visible: false,
        width: 70,
        order: 2,
      },
      {
        prop: 'quantityOuted',
        label: '已出库数量',
        visible: true,
        width: 80,
        order: 3,
      },
      {
        prop: 'finishedQuantity',
        label: '扫描数量',
        visible: true,
        width: 70,
        order: 4,
      },
      {
        prop: 'unFinishedQuantity',
        label: '未扫描数量',
        visible: true,
        width: 80,
        order: 5,
      },
      {
        prop: 'productCode',
        label: '商品编号',
        visible: true,
        width: 100,
        order: 6,
      },
      {
        prop: 'plateCode',
        label: '收货托盘号',
        visible: true,
        width: 90,
        order: 7,
      },
      {
        prop: 'bigUnit',
        label: '大单位',
        visible: false,
        width: 70,
        order: 8,
      },
      {
        prop: 'bigQty',
        label: '大单位数量',
        visible: false,
        width: 80,
        order: 8,
      },
      {
        prop: 'brandName',
        label: '品牌',
        visible: false,
        width: 80,
        order: 8,
      },
      {
        prop: 'salePrice',
        label: '单价',
        visible: true,
        width: 90,
        order: 6,
      },
      {
        prop: 'singleSignCode',
        label: '序列号(SN)',
        visible: false,
        width: 200,
        order: 7,
      },
      {
        prop: 'rowWeight',
        label: '小计重量',
        visible: true,
        width: 90,
        order: 9,
      },
      {
        prop: 'rowCube',
        label: '小计体积',
        visible: true,
        width: 90,
        order: 10,
      },
      {
        prop: 'caseNumber',
        label: '箱号',
        visible: true,
        width: 130,
        order: 11,
      },
      {
        prop: 'productSpec',
        label: '商品规格',
        visible: true,
        width: 80,
        order: 12,
      },
      {
        prop: 'weight',
        label: '单位毛重',
        visible: false,
        width: 80,
        order: 13,
      },
      {
        prop: 'scanWeight',
        label: '已扫重量',
        visible: false,
        width: 80,
        order: 14,
      },
      {
        prop: 'productName',
        label: '商品名称',
        visible: true,
        width: undefined,
        minWidth: 200,
        order: 15,
      },
    ],
  },
  // 正在提交
  isSubmiting: false,
});
//#endregion

//#region onMounted
onMounted(async () => {
  // 不校验条码
  state.formData.isValidateProductCode = false;
});
//#endregion

// 获取扫描数据
const getOutOrderPlate = async () => {
  base.state.currentRow = {};
  let orderCode = state.formData.orderCode;
  orderCode = orderCode.trim();
  state.formData.orderCode = orderCode;
  if (!orderCode) {
    proxy.$message.error('扫描单号不能为空!');
    return;
  }

  const url = '/outbound/out/outScanOrder/getOutOrderPlate';
  const params = {
    orderCode: orderCode,
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    base.focus('orderCode');
    return false;
  }
  proxy.common.showMsg(res);

  // 控制打包校验 对话框下的三个按钮
  if (res.result) {
    base.state.tableData = res.data.detailList.map((row: any) => {
      row.quantityOrder = Math.Round(row.quantityOrder);
      row.bigQty = Math.Round(row.bigQty);
      row.salePrice = Math.Round(row.salePrice);
      row.quantityOuted = Math.Round(row.quantityOuted || 0);

      let unFinishedQuantity = Math.Round(row.quantityOrder - row.quantityOuted, 4);
      let finishedQuantity = 0;
      let scanWeight = 0;

      row.unFinishedQuantity = unFinishedQuantity;
      row.finishedQuantity = finishedQuantity;
      row.scanWeight = scanWeight;
      row.sortIndex = 0;
      row.singleSignCodeOrigin = row.singleSignCode; // 备份源SN
      row.validQuantity = unFinishedQuantity; // 原始可扫描数量

      row.weight = Number(row.weight);
      row.rowWeight = Number(row.rowWeight);
      row.unitCube = Number(row.unitCube);
      row.rowCube = Number(row.rowCube);

      // 清空条码信息
      row.singleSignCode = '';

      return row;
    });
    state.formData.orderId = res.data.orderInfo.orderId; // 获取单号

    // 条码框获得焦点
    base.focus('plateCode');
  } else {
    onReset();
  }
};

// 判断扫描包装条码
const checkPackingBarcode = async () => {
  const plateCode = state.formData.plateCode;
  if (!plateCode) {
    base.focus('plateCode');
    proxy.$message.error('托盘号不能为空!');
    return;
  }
  base.state.tableData
    .filter((item) => item.plateCode === plateCode)
    .forEach((item, index) => {
      item.finishedQuantity = item.unFinishedQuantity;
      item.unFinishedQuantity = 0;
      if (index === 0) {
        base.setTop(item); // 设置为当前行
      }
    });

  base.focus('plateCode');
};

// 复核提交，封箱（部分打包）
const partialSave = async () => {
  const orderCode = state.formData.orderCode; // 扫描单号
  if (!orderCode) {
    proxy.$message.error('扫描单号不能为空!');
    return false;
  }

  const dataList = base.state.tableData.filter((item) => {
    return item.finishedQuantity > 0;
  });
  if (!dataList.length) {
    proxy.$message.error('请先扫描条码！');
    return false;
  }

  state.isSubmiting = true; // 正在提交
  const url = '/outbound/out/outScanOrder/normalOutSave';
  const params = {
    scanInType: 'PC_ORDER_OUT_PLATE', // PC扫拍出库
    orderId: state.formData.orderId,
    orderCode,
    dataList,
  };
  const [err, res] = await to(postData(url, params));
  state.isSubmiting = false; // 结束提交
  if (err) {
    base.focus('orderCode');
    return false;
  }

  proxy.common.showMsg(res);
  if (!res.result) return false;

  onReset();
  return true;
};

// 重置
const onReset = () => {
  // 初始化formData数据
  state.formData.orderId = 0;
  state.formData.orderCode = '';
  state.formData.orderCode = '';
  state.formData.productModel = '';
  state.formData.scanQty = 0;
  state.formData.snList = '';
  state.formData.checkSnList = '';
  state.formData.plateCode = '';
  // 扫描数据
  base.state.tableData = [];
  // 当前正在扫描的数据
  base.state.currentRow = {};
  base.focus('plateCode');
};

const handleSelectionChange = (val: any) => {
  state.multipleSelection = val;
};
</script>

<style lang="scss" scoped>
@import '/@/theme/scan.scss';
</style>
