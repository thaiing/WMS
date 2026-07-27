<template>
  <div class="scan-container">
    <el-card class="scan-card">
      <template #header>
        <div class="clearfix">
          <span>{{ $tt('拣货下架') }}</span>
        </div>
      </template>
      <el-row>
        <el-col :xl="11" :md="14" :xs="24">
          <el-form ref="form" :model="state.formData" label-width="120px" class="scan-form">
            <el-form-item :label="$tt('波次号')">
              <el-input ref="orderWaveCode" v-model="state.formData.orderWaveCode" autofocus class="input-300" @keyup.enter.stop="getData"></el-input>
              <span class="sub-item">
                <span class="sub-label">{{ $tt('商品校验') }}：</span>
                <el-switch v-model="state.formData.isValidateProductCode" @change="onIsValidateProductCodeChange"></el-switch>
              </span>
              <span class="sub-item">
                <span class="sub-label">{{ $tt('开启SN') }}：</span>
                <el-switch v-model="state.formData.isScanSn" @change="onIsScanSnChange"></el-switch>
              </span>
            </el-form-item>
            <!-- <el-form-item :label="$tt('出库订单')">
							<el-input ref="orderCode" v-model="state.formData.orderCode" autofocus class="input-300" @keyup.enter.stop="getDataByOrderCode"></el-input>
						</el-form-item> -->
            <el-form-item :label="$tt('下架理货位')">
              <el-select ref="positionName" v-model="state.formData.positionName" :placeholder="$tt('请选择收货位')" class="input-300">
                <el-option v-for="(item, index) in state.offPositionList" :key="index" :label="item.positionName" :value="item.positionName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$tt('商品条码')">
              <el-input ref="productModel" v-model="state.formData.productModel" :disabled="!state.formData.isValidateProductCode" class="input-300" @keyup.enter.stop="checkPackingBarcode"></el-input>
              <span v-if="!state.formData.isScanSn" class="sub-item">
                <span class="sub-label">{{ $tt('扫描数量') }}：</span>
                <el-input-number ref="scanQty" v-model="state.formData.scanQty" :min="0" :disabled="!state.formData.isValidateProductCode" controls-position="right" class="input-100" @change="base.setScanQty"></el-input-number>
              </span>
            </el-form-item>
            <el-form-item v-if="state.config.pick_cartCode" :label="$tt('拣货车码')">
              <el-input ref="cartCode" v-model="state.formData.cartCode" autofocus class="input-300"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="btnSave">{{ $tt('确认拣货') }}</el-button>
              <el-button @click="onReset">{{ $tt('重置') }}</el-button>
              <el-button type="success" @click="printPlateCode">{{ $tt('打印单据') }}</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col v-if="state.formData.isScanSn" :xl="12" :md="10" :xs="24">
          <el-form ref="formSn" :model="state.formData" label-position="top" label-width="120px" class="scan-sn-form">
            <el-form-item :label="$tt('扫描SN')">
              <el-input ref="snList" v-model="state.formData.snList" type="textarea" :rows="6" class="input-500" @blur="checkSn()" @keyup.stop="checkSn()"></el-input>
              <div class="color-666">
                <span>{{ $tt('SN条数') }}：</span>
                <span>{{ state.formData.scanQty }}</span>
                <span ref="checkSnSpan" class="margin-left-50">
                  <el-switch v-model="state.formData.isCheckSn" :active-text="$tt('开启即时校验SN')" @change="onIsCheckSnChange"></el-switch>
                </span>
              </div>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="scan-card body-no-padding mt-5">
      <template #header>
        <div class="clearfix">
          <span class="padding-top-10">{{ $tt('扫描结果') }}</span>
          <!-- {{ state.setting }} -->
          <el-button link class="floatRight" @click="state.setting.visible = true">{{ $tt('字段设置') }}</el-button>
        </div>
      </template>
      <el-table ref="scan-table" :data="base.state.tableData" :row-class-name="base.rowClass" stripe style="width: 100%" class="scan-table" size="small" @row-dblclick="base.setCurrent">
        <template v-for="(item, index) in state.setting.fields">
          <template v-if="['unFinishedQuantity', 'finishedQuantity'].indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width">
              <template #default="{ row }">
                <template v-if="!state.formData.isValidateProductCode">
                  <el-input-number v-model="row[item.prop]" :min="0" :max="row['quantityOrder']" size="small" class="w-100pc" controls-position="right" @change="base.rowChangeQty(item.prop, row)"></el-input-number>
                </template>
                <template v-else>
                  {{ row[item.prop] }}
                </template>
              </template>
            </el-table-column>
          </template>
          <!--SN序列号-->
          <template v-else-if="'singleSignCode'.indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width">
              <template #default="{ row }">
                <span class="sn-text">{{ row.singleSignCode }}</span>
                <span class="sn-count">[{{ $tt('SN数') }}：{{ row.singleSignCode ? row.singleSignCode.split(',').length : 0 }}]</span>
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
          <template v-else>
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width" :min-width="item.minWidth"></el-table-column>
          </template>
        </template>
      </el-table>
    </el-card>
    <scan-setting-dialog ref="setting-dialog" v-model:visible="state.setting.visible" :fields="state.setting.fields" :name="state.setting.name"></scan-setting-dialog>

    <!--声音文件-->
    <audio ref="sound_error" controls style="display: none">
      <source src="/public/sounds/error2.mp3" type="audio/mpeg" />
    </audio>
    <audio ref="sound_correct" controls style="display: none">
      <source src="/public/sounds/feixin.mp3" type="audio/mpeg" />
    </audio>
    <audio controls style="display: none">
      <source ref="sound_scan" src="/public/sounds/saomiao.wav" type="audio/mpeg" />
    </audio>
  </div>
</template>

<script setup lang="ts" name="outbound-scan-order-picking">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';
import { postData } from '/@/api/common/baseApi';
import _ from 'lodash';
import scanHook from '/@/components/hooks/scanHook';
import to from 'await-to-js';
const ScanSettingDialog = defineAsyncComponent(() => import('/@/components/common/components/scanSettingDialog.vue'));
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

// 获取配置参数
const config = ref({
  // 显示拣货车码扫描
  pick_cartCode: false,
});

const base = scanHook({
  config,
});

const state = reactive({
  // 配置参数
  config: config.value,
  formData: {
    ...toRefs(base.state.formData),
    orderCode: '',
    orderWaveCode: '',
    cartCode: '',
  },
  // 收货位候选项
  offPositionList: [] as any[],
  isProductmodel: '',
  checkedSnList: [] as any[], // 已经校验成功的SN缓存
  // 扫描列设置对话框参数
  setting: {
    visible: false,
    name: 'outbound-scan-order-picking',
    fields: [
      {
        prop: 'productModel',
        label: '条形码',
        visible: true,
        width: 150,
        order: 1,
      },
      {
        prop: 'quantityOrder',
        label: '商品数量',
        visible: true,
        width: 80,
        order: 2,
      },
      // {
      //   prop: "pickQuantity",
      //   label: "已入库数量",
      //   visible: true,
      //   width: 100,
      //   order: 3
      // },
      {
        prop: 'finishedQuantity',
        label: '已扫描数量',
        visible: true,
        width: 100,
        order: 4,
      },
      {
        prop: 'unFinishedQuantity',
        label: '未扫描数量',
        visible: true,
        width: 100,
        order: 5,
      },
      {
        prop: 'productCode',
        label: '商品编号',
        visible: true,
        width: 140,
        order: 6,
      },
      {
        prop: 'bigUnit',
        label: '大单位',
        visible: true,
        width: 70,
        order: 8,
      },
      {
        prop: 'bigQty',
        label: '大单位数量',
        visible: true,
        width: 90,
        order: 8,
      },
      {
        prop: 'brandName',
        label: '品牌',
        visible: true,
        width: 100,
        order: 8,
      },
      {
        prop: 'singleSignCode',
        label: '序列号(SN)',
        visible: true,
        width: 200,
        order: 7,
      },
      {
        prop: 'positionName',
        label: '拣货位',
        visible: true,
        width: 120,
        order: 8,
      },
      {
        prop: 'productSpec',
        label: '商品规格',
        visible: true,
        width: 80,
        order: 9,
      },
      {
        prop: 'batchNumber',
        label: '批次号',
        visible: true,
        width: 120,
        order: 10,
      },
      {
        prop: 'plateCode',
        label: '托盘号',
        visible: false,
        width: 120,
        order: 10,
      },
      {
        prop: 'weight',
        label: '单位毛重',
        visible: false,
        width: 80,
        order: 11,
      },
      {
        prop: 'totalWeight',
        label: '合计重量',
        visible: false,
        width: 80,
        order: 12,
      },
      {
        prop: 'scanWeight',
        label: '已扫重量',
        visible: false,
        width: 90,
        order: 13,
      },
      {
        prop: 'productName',
        label: '商品名称',
        visible: true,
        width: undefined,
        minWidth: 250,
        order: 14,
      },
    ],
  } as any,
});

// 监听双向绑定值改变，用于回显
watch(
  () => base.state.currentRow,
  (val: any) => {
    if (val) {
      state.formData.scanQty = val.finishedQuantity;
    }
  },
  {
    deep: true,
  }
);

// watch(
//   () => state.formData.snList,
//   async (val: any) => {
//     await onSnChange();
//   },
//   {
//     deep: true,
//   }
// );

//#region onMounted
onMounted(async () => {
  // 校验条码
  const isValidateProductCode = localStorage['out_isValidateProductCode'];
  if (isValidateProductCode) {
    state.formData.isValidateProductCode = isValidateProductCode === 'true';
  }

  // 开启SN扫描
  const isScanSn = localStorage['isScanSn'];
  if (isScanSn) {
    state.formData.isScanSn = isScanSn === 'true';
  }

  // 开启SN实时校验
  const isCheckSn = localStorage['isCheckSn'];
  if (isCheckSn) {
    state.formData.isCheckSn = isCheckSn === 'true';
  }

  // 字段设置
  const setting = localStorage[state.setting.name + '-setting'];
  if (setting) {
    state.setting.fields = JSON.parse(setting);
  }
});
//#endregion

const getDataByOrderCode = async () => {
  let orderCode = state.formData.orderCode;
  if (!orderCode) {
    proxy.$message.error('出库单号不能为空！');
    return;
  }
  orderCode = orderCode.trim();
  state.formData.orderCode = orderCode;

  const url = '/api/outbound/orderPicking/getDataByOrderCode';
  const params = {
    orderCode: orderCode,
  };

  const [err, res] = await to(postData(url, params));
  if (err) {
    proxy.$message.error(err.message);
    return;
  }
  if (res.code !== 200) {
    proxy.$message.error(res.msg);
    return;
  }
  state.formData.orderWaveCode = res.data.orderWaveCode;
  getData();

  // this.common.ajax(url, params, callback, this.$refs["form"]);
};

// 获得明细数据
const getData = async () => {
  state.checkedSnList = []; // 清空已校验SN
  state.formData.snList = '';
  base.state.currentRow = null;
  let orderWaveCode = state.formData.orderWaveCode;
  if (!orderWaveCode) {
    proxy.$message.error('波次号不能为空！');
    return;
  }
  orderWaveCode = orderWaveCode.trim();
  state.formData.orderWaveCode = orderWaveCode;
  base.state.tableData = [];

  const url = '/outbound/out/outScanPicking/getPickingData';
  const params = {
    orderWaveCode: orderWaveCode,
    cartCode: state.formData.cartCode,
    scanInType: 'PC_ORDER_PICKING', // 标记为PC拣货下架
  };

  const [err, res] = await to(postData(url, params));
  if (err) return;

  // 构建数据
  base.state.currentRow = null;
  base.state.existRows = [];

  state.formData.storageId = res.data.storageId;
  state.formData.consignorId = res.data.consignorId;

  base.state.tableData = res.data.dataList.map((row: any) => {
    const quantityOrder = Math.Round(row.quantityOrder, 4);
    let unFinishedQuantity = Math.Round(quantityOrder - row.pickQuantity, 4);

    let finishedQuantity = 0;
    if (!state.formData.isValidateProductCode) {
      unFinishedQuantity = 0;
      finishedQuantity = Math.Round(quantityOrder - row.pickQuantity, 4);
      row.scanWeight = row.totalWeight;
    }
    row.quantityOrder = quantityOrder;
    row.unFinishedQuantity = unFinishedQuantity;
    row.finishedQuantity = finishedQuantity;
    row.sortIndex = 0;
    row.singleSignCodeOrigin = row.singleSignCode; // 备份源SN
    row.validQuantity = unFinishedQuantity; // 原始可扫描数量
    // 清空条码信息
    row.singleSignCode = '';

    return row;
  });
  // 获取货位
  state.offPositionList = res.data.offPositionList;
  if (state.offPositionList.length) {
    state.formData.positionName = state.offPositionList[0].positionName;
  }
  // 条码框获得焦点
  base.focus('productModel');
};

// 商品是否校验改变事件
const onIsValidateProductCodeChange = (value: any) => {
  localStorage['out_isValidateProductCode'] = state.formData.isValidateProductCode;
  base.state.tableData = base.state.tableData.map((row: any) => {
    let unFinishedQuantity = Math.Round(row.quantityOrder - row.pickQuantity, 4);
    let finishedQuantity = 0;
    row.scanWeight = 0;
    if (!state.formData.isValidateProductCode) {
      unFinishedQuantity = 0;
      finishedQuantity = Math.Round(row.quantityOrder - row.pickQuantity, 4);
      row.scanWeight = row.totalWeight;
    }
    row.unFinishedQuantity = unFinishedQuantity;
    row.finishedQuantity = finishedQuantity;
    row.sortIndex = 0;
    return row;
  });
};

// 开启SN
const onIsScanSnChange = () => {
  localStorage['isScanSn'] = state.formData.isScanSn;
};
// 开启实时校验SN
const onIsCheckSnChange = () => {
  localStorage['isCheckSn'] = state.formData.isCheckSn;
};

// 保存
const btnSave = async () => {
  // 判断拣货车码是否开启
  if (state.config.pick_cartCode) {
    if (!state.formData.cartCode) {
      proxy.$message.error('拣货车码不能为空！');
      base.focus('cartCode');
      return;
    }
  }

  let positionName = state.formData.positionName;
  if (!state.formData.positionName) {
    proxy.$message.error('请扫描拣货位！');
    base.focus('orderWaveCode');
    base.playError();
    return;
  }
  let dataList = base.state.tableData.filter((rowData) => rowData.finishedQuantity > 0);
  if (!dataList.length) {
    proxy.$message.error('已扫描数量必须大于0！');
    return;
  }

  let url = '/outbound/out/outScanPicking/savePickingScan';
  let params = {
    scanInType: 'PC_ORDER_PICKING', // PC拣货下架
    orderWaveCode: state.formData.orderWaveCode,
    positionName,
    cartCode: state.formData.cartCode, // 拣货车码
    dataList: dataList,
  };

  const [err, res] = await to(postData(url, params));
  if (err) return;
  proxy.common.showMsg(res);
  onReset();
};
// 重置
const onReset = async () => {
  state.formData.orderWaveCode = '';
  state.formData.positionName = '';
  state.formData.productModel = '';
  state.formData.scanQty = 0;
  state.formData.cartCode = '';
  state.formData.snList = '';
  base.state.tableData = [];
  base.focus('orderWaveCode');
};
// 扫描商品条码
const checkPackingBarcode = () => {
  base.checkPackingProductModel();
  if (base.state.currentRow) {
    const productModel = base.state.currentRow.productModel;
    base.state.tableData.forEach((row) => {
      row.sortIndex = 1;
      // 当前扫描行
      if (row.productModel === productModel) {
        row.sortIndex = 2;
      }
      // 当前扫描完成，则沉底
      if (row.unFinishedQuantity === 0) {
        row.sortIndex = 0;
      }
    });
    // 置顶排序
    base.state.tableData.sort(function (a, b) {
      return b.sortIndex - a.sortIndex;
    });
  }
};
// 实时校验SN
const onSnChange = async () => {
  if (!state.formData.isCheckSn) {
    return;
  }

  let snListArr = state.formData.snList ? state.formData.snList.replace(/,/gi, '\n').replace(/\\r/gi, '').split('\n') : [];
  snListArr = snListArr
    .filter((f: any) => f) // 去除空行
    .filter((f: any) => {
      const exist = state.checkedSnList.find((d) => d === f);
      return !exist;
    }); // 过滤掉已经校验的SN
  if (!snListArr.length) return;

  const url = '/outbound/out/outScanPicking/checkSn';
  const params = {
    snList: snListArr,
    productId: base.state.currentRow!.productId,
    productCode: base.state.currentRow!.productCode,
    storageId: state.formData.storageId,
    consignorId: state.formData.consignorId,
    orderWaveCode: state.formData.orderWaveCode,
  };
  const [err, res] = await to(postData(url, params, false));
  if (err) {
    return;
  }

  if (res.result) {
    state.checkedSnList = state.checkedSnList.concat(res.data);
  } else {
    const data = res.data;
    if (data) {
      let snListArr = state.formData.snList ? state.formData.snList.replace(/,/gi, '\n').replace(/\\r/gi, '').split('\n') : [];
      data.forEach((item: any) => {
        const index = snListArr.indexOf(item);
        if (index >= 0) snListArr.splice(index, 1);
        state.formData.snList = snListArr.join('\n');
      });
    }
  }
  proxy.$refs.checkSnSpan;
};

// 打印出库单
const printPlateCode = async () => {
  if (!state.formData.orderWaveCode) {
    proxy.$message.error('波次单号为空！');
    return;
  }
  var url = '/outbound/out/order/getOutIds';
  var params = {
    orderWaveCode: state.formData.orderWaveCode,
  };

  const [err, res] = await to(postData(url, params));
  if (err) {
    proxy.$message.error(err.message);
    return;
  }

  var order_Ids = [] as any[];
  res.data.dataList.forEach((item: any) => {
    order_Ids.push(item.orderId);
  });

  var url = `/system/print/base-template-id/167101/1690/${order_Ids.join(',')}?key=${proxy.common.getGUID()}&autoPrint=false`;
  window.open(url);
};

// 校验SN
const checkSn = async () => {
  await base.scanSn();
  await onSnChange();
};
</script>

<style lang="scss" scoped>
@import '/@/theme/scan.scss';
.justify-start {
  display: flex;
  justify-content: flex-start;
  position: relative;
}
.msg-tip {
  margin-left: 20px !important;
  max-width: 400px;
  position: absolute !important;
  top: -5px;
  left: 120px;
}
.dialog-footer {
  text-align: left;
}
.scan-result {
  margin-top: 10px;
  ::v-deep .el-card__header {
    padding: 8px 20px 10px;
  }
  .scan-result-header {
    font-size: 14px;
  }
  ::v-deep .el-button--medium {
    padding: 5px 20px;
  }
  ::v-deep .el-input-number.is-controls-right .el-input__inner {
    padding-left: 2px;
    padding-right: 28px;
  }
}
</style>
