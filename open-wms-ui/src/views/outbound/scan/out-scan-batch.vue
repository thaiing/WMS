<template>
  <div class="scan-container">
    <el-card class="scan-card">
      <template #header>
        <div class="clearfix">
          <span>{{ $tt('波次打包校验扫描') }}</span>
        </div>
      </template>
      <el-form ref="form" :model="state.formData" label-width="120px" class="scan-form">
        <el-form-item label="波次号">
          <el-input ref="orderWaveCode" v-model="state.formData.orderWaveCode" autofocus class="input-300" @keyup.enter.stop="getData"></el-input>
          <span class="sub-item">
            <span class="sub-label">开启装箱：</span>
            <el-switch v-model="state.formData.isOpenCase" @change="onIsOpenCase"></el-switch>
          </span>
        </el-form-item>
        <el-form-item v-if="state.formData.isOpenCase" label="箱号">
          <el-input v-model="state.formData.caseNumber" class="input-300" @keyup.enter.stop="onKeyupCaseNumber"></el-input>
          <el-radio-group v-model="state.formData.caseMode" @change="onCaseMode">
            <el-radio :label="1">一品一箱</el-radio>
            <el-radio :label="2">多品一箱</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="商品条码">
          <el-input ref="productModel" v-model="state.formData.productModel" class="input-300" @keyup.enter.stop="checkPackingBarcode"></el-input>
          <span v-if="!(state.formData.isOpenCase && state.formData.caseMode === 1)" class="sub-item">
            <span class="sub-label">扫描数量：</span>
            <el-input-number v-model="state.formData.scanQty" :min="0" controls-position="right" class="input-100" @change="base.setScanQty"></el-input-number>
          </span>
        </el-form-item>
        <el-form-item label="称重">
          <el-input v-model="state.formData.weight" autofocus class="input-300"></el-input>
        </el-form-item>
        <el-form-item v-if="state.formData.isOpenCase" label="选择打印机">
          <el-select v-model="state.formData.printerName" placeholder="请选择打印机" class="w-300" @change="changePrint">
            <el-option v-for="(item, index) in state.printList" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button v-if="state.formData.isOpenCase" @click="changeBox">换箱</el-button>
          <el-button type="primary" @click="onSubmit">复核提交</el-button>
          <el-button @click="onReset">重置</el-button>
          <el-checkbox v-if="state.formData.isOpenCase" v-model="state.formData.isOuter_Packinglist" @change="outerPacking">打印装箱清单</el-checkbox>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="scan-card body-no-padding mt-10">
      <template #header>
        <div class="clearfix">
          <span class="padding-top-10">扫描结果</span>
          <el-button link class="floatRight" @click="state.setting.visible = true">字段设置</el-button>
        </div>
      </template>
      <el-table ref="scan-table" :data="base.state.tableData" :row-class-name="base.rowClass" stripe style="width: 100%" class="scan-table" size="small" @row-click="setCurrent">
        <template v-for="(item, index) in state.setting.fields">
          <template v-if="['unFinishedQuantity', 'finishedQuantity'].indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="item.label" :width="item.width">
              <template #default="{ row }">
                <template v-if="!state.formData.isValidateProductCode">
                  <el-input-number v-model="row[item.prop]" :min="0" :max="row['Quantity']" :precision="config.global_qtyPrecision" :step="config.global_step" size="small" class="w-100pc" controls-position="right" @change="base.rowChangeQty(item.prop, row)"></el-input-number>
                </template>
                <template v-else>
                  {{ row[item.prop] }}
                </template>
              </template>
            </el-table-column>
          </template>
          <template v-else-if="'positionName,scanWeight'.indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="item.label" :width="item.width">
              <template #default="{ row }">
                <el-input v-model="row[item.prop]" size="small" class="w-100pc"></el-input>
              </template>
            </el-table-column>
          </template>
          <template v-else-if="'produceDate,limitDate'.indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="item.label" :width="item.width">
              <template #default="{ row }">
                <el-date-picker v-model="row[item.prop]" size="small" type="date" placeholder="选择日期" class="w-110" value-format="YYYY-MM-DD"></el-date-picker>
              </template>
            </el-table-column>
          </template>
          <template v-else-if="'caseNumber'.indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible && state.formData.isOpenCase" :key="index" :prop="item.prop" :label="item.label" :width="item.width"></el-table-column>
          </template>
          <template v-else>
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="item.label" :width="item.width"></el-table-column>
          </template>
        </template>
      </el-table>
    </el-card>

    <scan-setting-dialog ref="setting-dialog" v-model:visible="state.setting.visible" :fields="state.setting.fields" :name="state.setting.name"></scan-setting-dialog>
    <!-- 显示打印装箱清单模板 -->
    <div id="mount-print"></div>

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

<script setup lang="ts" name="inbound-scan-order">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
import { postData } from '/@/api/common/baseApi';
import to from 'await-to-js';
import { getLodop } from '/@/utils/lodopFuncs.js';
import scanHook from '/@/components/hooks/scanHook';
const ScanSettingDialog = defineAsyncComponent(() => import('/@/components/common/components/scanSettingDialog.vue'));
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

//#region 配置参数
const config = ref({
  // 是否启用装箱操作
  in_caseNumber: false,
  // 支持一品多码
  sku_productToMultiBarcode: true,
  caseMode: 0,
  // 称重阈值
  outer_weightWhreshold: 0,
  global_qtyPrecision: 2, // 数量精度（小数位数）
  global_step: 1, // 计数器步长
});
//#endregion

const base = scanHook({
  config,
  // 配置参数自定义处理
  doData: (item: any, hookOptions: any) => {
    let configKey = item.configKey; // 字段名称
    let configValue = item.configValue;

    if (proxy.common.isNumber(item.configValue)) {
      configValue = parseInt(item.configValue);
    }

    // 称重阈值不需要转为boolean
    if (['outer_weightWhreshold'].indexOf(item.value02) >= 0) {
      hookOptions.config.value[configKey] = configValue;
    } else {
      hookOptions.config.value[configKey] = !!configValue;
    }
  },
});

//#region 定义变量
const state = reactive({
  formData: {
    ...toRefs(base.state.formData),
    orderWaveCode: '',
    weight: null,
    allotPositionName: null, // 配货位
    caseNumber: '', // 箱号
    isOpenCase: false, // 开启装箱
    // 装箱方式：0：常规扫描，1：一品一箱，2：多品一箱
    caseMode: 0,
    // 打印面单
    isOuter_PrintBill: false,
    // 打印装箱清单
    isOuter_Packinglist: false,
    wrapperBarcode: '',
    printerName: '',
  },
  // 订单信息
  orderInfo: [],
  // 装箱方式：0：常规扫描，1：一品一箱，2：多品一箱
  caseMode: 0,
  // 一次扫描的数量
  scanCount: 1,
  // 装箱新增行
  caseNewRows: [],
  // 打印机设备列表
  printList: [] as any[],
  // 扫描列设置对话框参数
  // 装箱打印模板
  printCaseVueData: {},
  setting: {
    visible: false,
    name: 'outbound-scan-out-scan-batch',
    fields: [
      {
        prop: 'orderCode',
        label: '订单号',
        visible: true,
        width: 140,
        order: 1,
      },
      {
        prop: 'productModel',
        label: '条形码',
        visible: true,
        width: 140,
        order: 2,
      },
      {
        prop: 'quantityOrder',
        label: '商品数量',
        visible: true,
        width: 90,
        order: 3,
      },
      {
        prop: 'quantityOuted',
        label: '已出库数量',
        visible: true,
        width: 100,
        order: 4,
      },
      {
        prop: 'finishedQuantity',
        label: '已扫描数量',
        visible: true,
        width: 120,
        order: 5,
      },
      {
        prop: 'unFinishedQuantity',
        label: '未扫描数量',
        visible: true,
        width: 130,
        order: 6,
      },
      {
        prop: 'salePrice',
        label: '单价',
        visible: true,
        width: 100,
        order: 7,
      },

      {
        prop: 'caseNumber',
        label: '箱号',
        visible: true,
        width: 90,
        order: 8,
      },
      {
        prop: 'productSpec',
        label: '商品规格',
        visible: true,
        width: 130,
        order: 9,
      },
      {
        prop: 'productCode',
        label: '商品编号',
        visible: true,
        width: 130,
        order: 10,
      },
      {
        prop: 'weight',
        label: '单位毛重',
        visible: false,
        width: 90,
        order: 11,
      },
      {
        prop: 'scanWeight',
        label: '已扫重量',
        visible: false,
        width: 80,
        order: 12,
      },
      {
        prop: 'productName',
        label: '商品名称',
        visible: true,
        order: 13,
      },
    ],
  },
});
//#endregion

//#region  wacth监听数据
watch(
  // 当前行扫描数据改变后，将扫描数量也改变
  () => base.state.currentRow,
  (rowData: any) => {
    if (rowData) {
      state.formData.scanQty = rowData.finishedQuantity;
    }
  },
  { deep: true, immediate: true }
);
//#endregion

//#region onMounted
onMounted(async () => {
  base.focus('orderWaveCode');
  // 获得打印模板
  // getPrintTemplate();
  // 获取打印机
  getPrintList();
  // 字段设置
  const setting = localStorage[state.setting.name + '-setting'];
  if (setting) {
    state.setting.fields = JSON.parse(setting);
  }
  // 开启装箱
  const isOpenCase = localStorage['out_isOpenCase'];
  if (isOpenCase) {
    state.formData.isOpenCase = isOpenCase === 'true';
    const caseMode = localStorage['out_caseMode'] || '0';
    state.formData.caseMode = parseInt(caseMode);
  }
  // 勾选打印装箱
  const isOuter_Packinglist = localStorage['isOuter_Packinglist'];
  if (isOuter_Packinglist) {
    state.formData.isOuter_Packinglist = isOuter_Packinglist === 'true';
  }
});
//#endregion

// 是否开启装箱
const onIsOpenCase = () => {
  localStorage['out_isOpenCase'] = state.formData.isOpenCase;
  if (state.formData.isOpenCase) {
    const caseMode = localStorage['out_caseMode'] || '0';
    state.formData.caseMode = parseInt(caseMode);
  } else {
    state.formData.caseMode = 0;
  }
};
// 切换装箱模式
const onCaseMode = () => {
  localStorage['out_caseMode'] = state.formData.caseMode;
};
// 箱号回车
const onKeyupCaseNumber = () => {
  base.focus('productModel');
};
// 获得打印机列表
const getPrintList = () => {
  window.setTimeout(() => {
    const LODOP = getLodop();
    var iPrinterCount = LODOP.GET_PRINTER_COUNT();
    for (var i = 0; i < iPrinterCount; i++) {
      state.printList.push(LODOP.GET_PRINTER_NAME(i));
    }
    // 设置默认打印机
    const printerName = localStorage['printerName'];
    if (printerName) {
      state.formData.printerName = printerName;
    }
  }, 1000);
};
// 获取运单信息和打印机名称
const getPrintTemplate = async () => {
  var url = '/api/sys/printTemplate/getPrintTemplate';
  var params = {
    menu_Id: 200013, // 打印模板MenuID
  };
  const [err, res] = await to(postData(url, params));
  if (res?.result) {
    state.printCaseVueData = res.data;
  }
};
// 打印装箱单
const printCase = () => {
  // if (!this.printCaseVueData) {
  // 	proxy.$message.error(`装箱打印模板menu_Id=200013不存在`);
  // 	return;
  // }
  // // 获取装箱数据
  // const caseDataList = base.state.tableData.filter((item) => {
  // 	item.RowTotal = item.finishedQuantity * item.salePrice;
  // 	return item.caseNumber === state.formData.caseNumber;
  // });
  // if (!caseDataList.length) {
  // 	proxy.$message.error('没有可打印的数据');
  // 	return;
  // }
  // // 箱号
  // state.orderInfo.caseNumber = state.formData.caseNumber;
  // state.orderInfo.shippingName = state.currentRow.shippingName;
  // state.orderInfo.orderCode = state.currentRow.orderCode;
  // state.orderInfo.shippingAddress = state.currentRow.shippingAddress;
  // state.orderInfo.mobile = state.currentRow.mobile;
  // state.orderInfo.createDate = moment(state.orderInfo.createDate).format('YYYY-MM-DD HH:mm:ss');
  // const billDataInfo = {
  // 	mainInfo: state.orderInfo,
  // 	detailList: {
  // 		total: caseDataList.length,
  // 		rows: caseDataList,
  // 	},
  // };
  // var Profile = Vue.extend(PrintCase);
  // var m = new Profile({
  // 	propsData: {
  // 		vueData: this.printCaseVueData,
  // 		billDataInfo: billDataInfo,
  // 		printInfo: {
  // 			printerName: state.formData.printerName,
  // 		},
  // 		billCodeField: 'orderWaveCode',
  // 	},
  // }).$mount();
  // var mountPrint = document.getElementById('mount-print');
  // var firstChild = mountPrint.firstChild;
  // mountPrint.insertBefore(m.$el, firstChild);
  // m.lodopPrint();
  // window.setTimeout(() => {
  // 	document.getElementById(state.orderInfo.orderCode).remove();
  // }, 2 * 60 * 1000);
};
// 打印机改变
const changePrint = () => {
  localStorage['printerName'] = state.formData.printerName;
};

// 获得明细数据
const getData = async () => {
  var orderWaveCode = state.formData.orderWaveCode;
  if (!orderWaveCode) {
    proxy.$message.error('波次号不能为空');
    return;
  }
  orderWaveCode = orderWaveCode.trim();
  state.formData.orderWaveCode = orderWaveCode;
  base.state.tableData = [];
  const url = '/outbound/out/outScanOrder/getBatchPackageData';
  const params = {
    orderWaveCode,
  };
  const [err, res] = await to(postData(url, params));
  if (err) return;
  proxy.common.showMsg(res);
  if (res?.result) {
    // 构建数据
    base.state.currentRow = {};
    base.state.tableData = res.data.dataList.map((row: any) => {
      row.quantityOuted = Number(row.quantityOuted);
      row.quantityOrder = Number(row.quantityOrder);
      row.unFinishedQuantity = Math.Round(row.quantityOrder - row.matchedQuantity, 4);
      row.finishedQuantity = 0;
      row.validQuantity = row.quantityOrder; // 原始可扫描数量
      row.singleSignCodeOrigin = row.singleSignCode; // 备份源SN
      row.singleSignCode = null;
      return row;
    });
    state.formData.caseNumber = res.data.caseNumber;
    // 条码框获得焦点
    base.focus('productModel');
    base.play();
  } else {
    base.playError();
  }
};

// 判断扫描包装条码
const checkPackingBarcode = () => {
  var code = state.formData.productModel;
  if (!code) {
    base.focus('productModel');
    proxy.$message.error('商品条码不能为空!');
    return;
  }
  if (state.formData.isOpenCase && state.formData.caseMode <= 0) {
    base.focus('productModel');
    proxy.$message.error('请选择装箱方式!');
    return;
  }

  // 装箱操作
  if (state.formData.isOpenCase) {
    if (state.formData.caseMode === 1) {
      // 一品一箱
      addRow_1();
    } else if (state.formData.caseMode === 2) {
      // 多品一箱
      addRow_2();
    }
  } else {
    // 常规扫描
    base.checkPackingProductModel(base.state.tableData);
  }
  base.focus('productModel');
};
// 单击选择行数据
const setCurrent = (row: any, event: any, column: any) => {
  if (row.productModel === state.formData.productModel) {
    base.state.currentRow = [];
    base.state.currentRow = row;
    base.state.existRows = [];
    base.state.existRows.push(base.state.currentRow);
  }
};
// 提交数据
const onSubmit = async () => {
  var orderWaveCode = state.formData.orderWaveCode;
  var weight = state.formData.weight;
  if (!state.formData.orderWaveCode) {
    proxy.$message.error('请扫描波次单号！');
    proxy.$refs.orderWaveCode.focus();
    base.playError(); // 播放声音
    return;
  }
  var dataList = base.state.tableData.filter((rowData: any) => rowData.finishedQuantity > 0);
  if (!dataList.length) {
    proxy.$message.error('至少需要扫描一条记录');
    return;
  }

  // 明细理论求和值
  let theoryweight = 0;
  // 明细实际求和值
  let scanWeight = 0;
  // 得到设置的阈值
  const Outer_weightWhreshold = base.state.config.outer_weightWhreshold;
  // 对明细已扫描数量求和算出理论值
  dataList.forEach((item) => {
    theoryweight += item.scanCount * item.weight;
  });
  // 直接扫描重量
  dataList.forEach((item) => {
    scanWeight += Math.Round(item.totalWeight, 2);
  });
  const absWeight = Math.abs(theoryweight - scanWeight);
  if (absWeight > Outer_weightWhreshold) {
    proxy.$message.error('商品实际重量与商品理论重量差值超过设定阈值' + Outer_weightWhreshold + '，不允许出库');
    return;
  }

  const url = '/outbound/out/outScanOrder/saveBatchPackageData';
  const params = {
    scanInType: 'PC_SEND_BATCH', // PC闪电发货
    orderWaveCode: orderWaveCode,
    dataList: dataList,
    weight: weight,
    wrapperBarcode: '',
    newExpressCode: '',
  };
  const [err, res] = await to(postData(url, params));
  if (err) return;

  proxy.common.showMsg(res);
  if (res?.result) {
    onReset();
  }
};
// 重置
const onReset = () => {
  state.formData.orderWaveCode = '';
  state.formData.caseNumber = '';
  state.formData.positionName = '';
  state.formData.productModel = '';
  state.formData.scanQty = 0;
  base.state.tableData = [];
  base.focus('orderWaveCode');
};
// 勾选装箱清单
const outerPacking = () => {
  localStorage['isOuter_Packinglist'] = state.formData.isOuter_Packinglist;
};
// 换箱
const changeBox = () => {
  var batchNo = state.formData.orderWaveCode;
  if (!batchNo) {
    proxy.$message.error('请先扫描出库单号');
    return;
  }
  if (!base.state.currentRow) {
    proxy.$message.error('请先扫描商品信息');
    return;
  }
  if (state.formData.isOuter_Packinglist) {
    // 打印装箱单
    printCase();
    // 重新生成箱号
    generateCaseNumber();
  } else {
    proxy.$message.error('请勾选打印装箱清单');
    return;
  }
};
// 生成箱号
const generateCaseNumber = () => {
  let batchNo = state.formData.orderWaveCode;
  let max = 1;
  let num = state.formData.caseNumber;
  if (num.indexOf('-') >= 0) {
    const nums = num.split('-');
    num = nums[nums.length - 1];
    batchNo = nums[0];
  } else {
    num = num.substring(num.length - 4);
  }
  let _num = parseInt(num);
  ++_num;
  if (_num > max) max = _num;
  let _max = '00000' + max;
  _max = _max.substring(_max.length - 2);
  const caseNumber = batchNo + '-' + _max;
  state.formData.caseNumber = caseNumber;
};
// 一品一箱
const addRow_1 = () => {
  const rowData = base.state.tableData.find((item: any) => {
    return item.productModel === state.formData.productModel && item.unFinishedQuantity > 0;
  });
  if (!rowData) {
    proxy.$message.error('没有可扫描的商品条码');
    base.playError();
    return;
  }

  // 箱号存在
  var existCaseRow = base.state.tableData.find((item: any) => {
    return item.caseNumber === state.formData.caseNumber && item.unFinishedQuantity > 0;
  });
  base.state.existRows = [rowData];

  if (!existCaseRow) {
    let newRow: any = JSON.parse(JSON.stringify(rowData));

    newRow.finishedQuantity = 1;
    newRow.unFinishedQuantity -= 1;
    newRow.caseNumber = state.formData.caseNumber;
    base.state.currentRow = newRow;
    base.state.currentRow!.scanWeight = Math.Round(base.state.currentRow!.weight * base.state.currentRow!.finishedQuantity, 2);
  }
  generateCaseNumber();
  base.play();
};
// 多品一箱
const addRow_2 = () => {
  const rowData = base.state.tableData.find((item: any) => {
    const exist = base.checkProductModelExist(state.formData.productModel, item);
    return exist && item.unFinishedQuantity > 0;
  });
  if (!rowData) {
    proxy.$message.error('没有可扫描的商品条码');
    base.playError();
    return;
  }

  // state.currentRow = rowData;
  // state.existRows = [rowData];
  // const qty = base.getScanQty();
  // if (rowData.unFinishedQuantity < qty) {
  // 	proxy.$message.error('没有足够的数量!');
  // 	return;
  // }

  // if (rowData.caseNumber === state.formData.caseNumber) {
  // 	rowData.unFinishedQuantity -= qty;
  // 	rowData.finishedQuantity += qty;
  // } else {
  // 	if (!rowData.caseNumber) {
  // 		rowData.unFinishedQuantity -= qty;
  // 		rowData.finishedQuantity += qty;
  // 		rowData.caseNumber = state.formData.caseNumber;
  // 	} else {
  // 		var newRow = JSON.parse(JSON.stringify(rowData));
  // 		rowData.unFinishedQuantity = 0;

  // 		newRow.finishedQuantity = qty;
  // 		newRow.unFinishedQuantity -= qty;
  // 		newRow.caseNumber = state.formData.caseNumber;
  // 		base.state.tableData.splice(0, 0, newRow);
  // 		state.currentRow = newRow;
  // 		this.existRows = [newRow];
  // 	}
  // }
  base.state.currentRow!.scanWeight = Math.Round(base.state.currentRow!.weight * base.state.currentRow!.finishedQuantity, 2);
  base.play();

  base.state.currentRow!.sortIndex = 1;
  // 置顶排序
  base.state.tableData.sort(function (a: any, b: any) {
    return b.sortIndex - a.sortIndex;
  });

  base.state.tableData.forEach((element: any) => {
    element.sortIndex = 0;
  });
};
</script>

<style lang="scss" scoped>
@import '/@/theme/scan.scss';
.scan-card {
  position: relative;
  .allot-position {
    position: absolute;
    top: 65px;
    left: 700px;
    .title {
      padding: 10px;
    }
    .value {
      color: red;
      font-size: 50px;
    }
  }
}
</style>
