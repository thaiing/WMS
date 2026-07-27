<template>
  <div class="scan-container">
    <el-card class="scan-card no-print">
      <template #header>
        <div class="clearfix">
          <span>出库单打包校验</span>
        </div>
      </template>
      <el-form ref="form" :model="state.formData" label-width="120px" class="scan-form">
        <el-form-item v-if="state.formData.isOpenCase" label="箱号">
          <el-input v-model="state.formData.caseNumber" class="input-300" @keyup.enter.stop="onKeyupCaseNumber"></el-input>
          <!-- <el-radio-group v-model="state.formData.caseMode" @change="onCaseMode">
            <el-radio :label="1">一品一箱</el-radio>
            <el-radio :label="2">多品一箱</el-radio>
          </el-radio-group> -->
        </el-form-item>
        <el-form-item label="商品条码">
          <el-input ref="productModel" v-model="state.formData.productModel" :disabled="!state.formData.isValidateProductCode" class="input-300" @keyup.enter.stop="checkPackingBarcode"></el-input>
        </el-form-item>
        <el-form-item label="出库单号">
          <el-input ref="orderWaveCode" v-model="state.formData.orderWaveCode" autofocus class="input-300" @keyup.enter.stop="getData"></el-input>
          <!-- <span class="sub-item">
            <span class="sub-label">商品校验：</span>
            <el-switch v-model="state.formData.isValidateProductCode" @change="onIsValidateProductCodeChange"></el-switch>
          </span>
          <span class="sub-item">
            <span class="sub-label">开启装箱：</span>
            <el-switch v-model="state.formData.isOpenCase" @change="onIsOpenCase"></el-switch>
          </span> -->
        </el-form-item>
        <!-- <el-form-item label="包材条码">
          <el-input ref="txtwrapperBarcode" v-model="state.formData.wrapperBarcode" class="w-300"></el-input>
        </el-form-item> -->
        <el-form-item label="扫描数量">
          <el-input-number ref="scanQty" v-model="state.formData.scanQty" :min="0" :disabled="!state.formData.isValidateProductCode" controls-position="right" class="input-120" @change="changeScanQty"></el-input-number>
          <!-- <span class="sub-item">
            <span class="sub-label">称重：</span>
            <el-input-number v-model="state.formData.weight" :min="0" controls-position="right" class="input-105"></el-input-number>
          </span> -->
        </el-form-item>
        <!-- <el-form-item v-if="state.formData.isOpenCase" label="选择打印机">
          <el-select v-model="state.formData.printerName" placeholder="请选择打印机" class="w-300" @change="changePrint">
            <el-option v-for="(item, index) in printList" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item>
          <el-button v-if="state.formData.isOpenCase" @click="changeBox">换箱</el-button>
          <el-button type="success" @click="openPackage">复核提交</el-button>
          <el-button @click="onReset">重置</el-button>
          <!-- <el-checkbox v-if="config.outer_printBill" v-model="state.formData.isOuter_PrintBill">打印面单</el-checkbox>
          <el-checkbox v-if="state.formData.isOpenCase" v-model="state.formData.isOuter_Packinglist" @change="outerPacking">打印装箱清单</el-checkbox> -->
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="scan-card body-no-padding no-print mt-5">
      <template #header>
        <div class="clearfix">
          <span class="padding-top-10">扫描结果</span>
          <el-button link class="floatRight" @click="state.setting.visible = true">字段设置</el-button>
        </div>
      </template>
      <el-table ref="scan-table" :data="base.state.tableData" :row-class-name="rowClass" stripe style="width: 100%" class="scan-table" size="small" @row-dblclick="base.setCurrent">
        <template v-for="(item, index) in state.setting.fields">
          <template v-if="['unFinishedQuantity', 'finishedQuantity'].indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="item.label" :width="item.width">
              <template #common-column-slot="{ row, col }">
                <template v-if="!state.formData.isValidateProductCode">
                  <el-input-number v-model="row[item.prop]" :min="0" :max="row['quantityOrder']" size="small" class="w-100pc" controls-position="right" @change="base.rowChangeQty(item.prop, row)"></el-input-number>
                </template>
                <template v-else>
                  {{ row[item.prop] }}
                </template>
              </template>
            </el-table-column>
          </template>
          <template v-else-if="'positionName,scanWeight'.indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="item.label" :width="item.width">
              <template #common-column-slot="{ row, col }">
                <template>
                  <el-input v-model="row[item.prop]" size="small" class="w-100pc"></el-input>
                </template>
              </template>
            </el-table-column>
          </template>
          <template v-else-if="'produceDate,limitDate'.indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="item.label" :width="item.width">
              <template #common-column-slot="{ row, col }">
                <template>
                  <el-date-picker v-model="row[item.prop]" size="small" type="date" placeholder="选择日期" class="w-110" value-format="YYYY-MM-DD"></el-date-picker>
                </template>
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
    <!-- 显示打印模板 -->
    <print v-if="state.formData.isOuter_PrintBill" ref="printRef" :ids="'' + state.formData.orderId" type="express"></print>
    <!-- 显示打印装箱清单模板 -->
    <div id="mount-print"></div>

    <!--复核提交-->
    <el-dialog v-model:visible="state.isOpenPackage" title="复核提交" width="500px" append-to-body>
      <el-form :label-width="state.formLabelWidth">
        <el-form-item label="复核件数" style="width: 320px">
          <el-input v-model="state.totalPackage" link></el-input>
        </el-form-item>
        <el-form-item label="合计体积" style="width: 320px">
          <el-input v-model="state.totalVolume" link></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="state.isOpenPackage = false">取 消</el-button>
        <el-button type="primary" @click="partialSave()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 出库单选择器 -->
    <sale-order-dialog ref="saleOrderDialog" v-model:visible="state.saleOrderVisible" @submitSale="submitSale"></sale-order-dialog>
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

<script setup lang="ts" name="outbound-scan-order-matching-out">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';
import { postData } from '/@/api/common/baseApi';
import to from 'await-to-js';
import useDropdownStore from '/@/stores/modules/dropdown';
import scanHook from '/@/components/hooks/scanHook';
const ScanSettingDialog = defineAsyncComponent(() => import('/@/components/common/components/scanSettingDialog.vue'));
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
const dropdownStore = useDropdownStore();

//#region 配置参数
const config = ref({
  // 是否启用装箱操作
  in_caseNumber: false,
  // 支持一品多码
  sku_productToMultiBarcode: true,
  // 打印面单
  outer_printBill: true,
  // 打印装箱清单
  outer_Packinglist: true,
  // 称重阈值
  outer_weightWhreshold: 0,
  // 是否体积，件数
  outer_openPackage: false,
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
  trueProductModel: false,
  trueTotalWeight: 0,
  saleOrderVisible: false,
  formData: {
    ...toRefs(base.state.formData),
    orderId: 0,
    orderCode: null,
    orderWaveCode: '',
    caseNumber: '',
    weight: 0, // 称重
    isOpenCase: true, // 开启装箱
    // 装箱方式：0：常规扫描，1：一品一箱，2：多品一箱
    caseMode: 1,
    // 打印面单
    isOuter_PrintBill: false,
    // 打印装箱清单
    isOuter_Packinglist: false,
    wrapperBarcode: '',
  },
  // 订单信息
  orderInfo: null,
  // 当前正在扫描的数据
  scanCount: 1,
  // 装箱打印模板
  printCaseVueData: {},
  // 打印机设备列表
  printList: [],
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
        order: 1,
      },
      {
        prop: 'quantityOrder',
        label: '商品数量',
        visible: true,
        width: 90,
        order: 2,
      },
      {
        prop: 'quantityOuter',
        label: '已出库数量',
        visible: true,
        width: 90,
        order: 3,
      },
      {
        prop: 'finishedQuantity',
        label: '当前扫描数量',
        visible: true,
        width: 120,
        order: 4,
      },
      {
        prop: 'unFinishedQuantity',
        label: '未扫描数量',
        visible: true,
        width: 130,
        order: 5,
      },
      {
        prop: 'productCode',
        label: '商品编号',
        visible: true,
        width: 130,
        order: 6,
      },
      {
        prop: 'salePrice',
        label: '单价',
        visible: true,
        width: 90,
        order: 6,
      },
      {
        prop: 'caseNumber',
        label: '箱号',
        visible: true,
        width: 90,
        order: 7,
      },
      {
        prop: 'productSpec',
        label: '商品规格',
        visible: true,
        width: 130,
        order: 8,
      },
      {
        prop: 'weight',
        label: '单位毛重',
        visible: false,
        width: 90,
        order: 9,
      },
      {
        prop: 'totalWeight',
        label: '合计重量',
        visible: false,
        width: 80,
        order: 10,
      },
      {
        prop: 'scanWeight',
        label: '已扫重量',
        visible: false,
        width: 80,
        order: 11,
      },
      {
        prop: 'productName',
        label: '商品名称',
        visible: true,
        order: 12,
      },
    ],
  },
  // 弹出框
  isOpenPackage: false,
  formLabelWidth: '120px',
  totalPackage: null, // 合计件数
  totalVolume: null, // 合计体积
});
//#endregion

//#region onMounted
onMounted(async () => {
  // 获得打印模板
  // getPrintTemplate();
  // 获取打印机
  // getPrintList();
  // 字段设置
  const setting = localStorage[state.setting.name + '-setting'];
  if (setting) {
    state.setting.fields = JSON.parse(setting);
  }
});
//#endregion

// 是否校验商品切换
const onIsValidateProductCodeChange = () => {
  localStorage['out_isValidateProductCode'] = state.formData.isValidateProductCode;

  base.state.tableData = base.state.tableData.map((row: any) => {
    let unFinishedQuantity = Math.Round(row.quantityOrder - row.quantityOuter, 4);
    row.scanWeight = 0;
    let finishedQuantity = 0;
    if (!state.formData.isValidateProductCode) {
      unFinishedQuantity = 0;
      finishedQuantity = Math.Round(row.quantityOrder - row.quantityOuter, 4);
      row.scanWeight = row.totalWeight;
    }
    row.unFinishedQuantity = unFinishedQuantity;
    row.finishedQuantity = finishedQuantity;
    row.sortIndex = 0;
    return row;
  });
};
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
// 获取扫描数据
const getData = async () => {
  var orderWaveCode = state.formData.orderWaveCode;
  if (!orderWaveCode) {
    proxy.$message.error('出库单号不能为空!');
    return;
  }
  orderWaveCode = orderWaveCode.trim();
  state.formData.orderWaveCode = orderWaveCode;

  var url = '/api/outbound/outScan/getOutData';
  var params = {
    expressCode: orderWaveCode,
    orderWaveCode: orderWaveCode,
  };
  const [err, res] = await to(postData(url, params));
  if (res?.result) {
    state.orderInfo = res.data2;
    if (!state.formData.caseNumber) {
      state.formData.caseNumber = res.dynamic;
    }
    base.state.tableData = res.data.map((row: any) => {
      let unFinishedQuantity = Math.Round(row.quantityOrder - row.quantityOuter, 4);
      let finishedQuantity = 0;
      let scanWeight = 0;
      if (!state.formData.isValidateProductCode) {
        unFinishedQuantity = 0;
        finishedQuantity = Math.Round(row.quantityOrder - row.quantityOuter, 4);
        scanWeight = row.totalWeight;
      }
      row.unFinishedQuantity = unFinishedQuantity;
      row.finishedQuantity = finishedQuantity;
      row.scanWeight = scanWeight;
      row.sortIndex = 0;
      if (row.productModel === state.trueProductModel) {
        row.finishedQuantity = row.unFinishedQuantity;
        row.unFinishedQuantity = 0;
        row.caseNumber = state.formData.caseNumber;
        row.totalWeight = state.trueTotalWeight;
      }
      return row;
    });
    if (base.state.config.outer_printBill === true) {
      state.formData.orderId = base.state.tableData[0].orderId;
    }

    // 条码框获得焦点
    if (state.formData.isValidateProductCode) {
      proxy.$refs.productModel.focus();
      proxy.$refs.productModel.select();
    } else {
      proxy.$refs.txtwrapperBarcode.focus();
      proxy.$refs.txtwrapperBarcode.select();
    }
  } else {
    onReset();
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
  // state.trueProductModel = state.formData.productModel.substring(0, 7);
  // state.trueTotalWeight = parseFloat(state.formData.productModel.substring(7, 11)).toFixed(2)
  // 如果还没有明细则通过条形码去找出库单
  if (base.state.tableData.length === 0) {
    searchSaleOrder();
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
  if (base.state.currentRow) {
    state.formData.scanQty = base.state.currentRow.finishedQuantity;
  }
};
const submitSale = (data: any) => {
  state.formData.orderWaveCode = data.orderCode;
  state.saleOrderVisible = false;
  getData();
};
// 条形码找出库单
const searchSaleOrder = async () => {
  var code = state.formData.productModel;
  var url = '/api/outbound/outScan/searchSaleOrder';
  var params = { productModel: code };
  const [err, res] = await to(postData(url, params));
  if (res?.result) {
    if (res.data.length === 1) {
      state.formData.orderWaveCode = res.data[0].orderCode;
      getData();
    } else {
      proxy.$refs['saleOrderDialog'].reload(res.data);
      state.saleOrderVisible = true;
    }
  } else {
    proxy.$message.error('当前条码未找到审核成功且已分配的出库单!');
  }
};
// 设置扫描数量
const setScanCount = (barcode: any, count: any, isAdd: any) => {
  if (!count || count < 0) {
    proxy.$message.error('数量不正确!');
    return;
  }
  if (!barcode) {
    proxy.$message.error('条码不能为空!');
    return;
  }
};
// 行样式
const rowClass = (row: any, rowIndex: any) => {
  if (base.state.currentRow === row) {
    return 'row-active';
  }
};
// 扫描数量手工改变
const changeScanQty = () => {
  if (base.state.currentRow) {
    let finishedQuantity = 0; // 当前商品所有分箱的出库数量求和
    base.state.tableData
      .filter((item) => {
        return item.orderDetailId === base.state.currentRow!.orderDetailId;
      })
      .forEach((item) => {
        finishedQuantity += item.finishedQuantity;
      });

    // 不包含当前行完成数量
    finishedQuantity -= base.state.currentRow.finishedQuantity;
    const unFinishedQuantity = Math.Round(base.state.currentRow.quantityOrder - base.state.currentRow.quantityOuter - finishedQuantity, 4);
    if (state.formData.scanQty <= unFinishedQuantity) {
      base.state.currentRow.unFinishedQuantity = Math.Round(unFinishedQuantity - state.formData.scanQty, 4);
      base.state.currentRow.finishedQuantity = state.formData.scanQty;
      base.state.currentRow.scanWeight = Math.Round(base.state.currentRow.weight * base.state.currentRow.finishedQuantity, 2);
    } else {
      proxy.$message.error('没有足够的数量!');
    }
  }
};
// 校验是否显示弹出框
const openPackage = () => {
  if (base.state.config.outer_openPackage) {
    state.isOpenPackage = true;
  } else {
    partialSave();
  }
};
// 复核提交，封箱（部分打包），然后计算已打包数量，设置 新快递单号为 “可用”
const partialSave = async () => {
  if (base.state.config.outer_openPackage) {
    if (!state.totalPackage || !state.totalVolume) {
      proxy.$message.error('合计件数、合计体积不能为!');
      return false;
    }
  }
  var expressCode = state.formData.orderWaveCode; // 快递单号
  var wrapperBarcode = state.formData.wrapperBarcode; // 包材条码
  var newExpressCode = ''; // 新快递单号
  var weight = state.formData.weight; // 重量
  if (!expressCode) {
    proxy.$message.error('快递单号不能为空!');
    return;
  }
  var dataArray = base.state.tableData
    .filter((item: any) => {
      return item.finishedQuantity > 0;
    })
    .map((rowData) => {
      return {
        caseNumber: rowData.caseNumber,
        orderId: rowData.orderId,
        orderCode: rowData.orderCode,
        orderDetailId: rowData.orderDetailId,
        scanCount: rowData.finishedQuantity,
        totalWeight: rowData.totalWeight,
        weight: rowData.weight,
      };
    });
  if (!dataArray.length) {
    proxy.$message.error('请先扫描条码！!');
    return;
  }
  // 明细理论求和值
  let theoryweight = 0;
  // 明细实际求和值
  let scanWeight = 0;
  // 得到设置的阈值，阈值大于0进行校验
  const outer_weightWhreshold = base.state.config.outer_weightWhreshold;
  // 对明细已扫描数量求和算出理论值
  dataArray.forEach((item) => {
    theoryweight += item.scanCount * item.weight;
  });
  // 直接扫描重量
  dataArray.forEach((item) => {
    scanWeight += Math.Round(item.totalWeight, 2);
  });
  const absWeight = Math.abs(theoryweight - scanWeight);
  if (outer_weightWhreshold > 0 && absWeight > outer_weightWhreshold) {
    // proxy.$message.error("商品实际重量与商品理论重量差值超过设定阈值" + outer_weightWhreshold + "，不允许出库");
    // return;
  }
  base.state.tableData.map((m: any) => {
    m.scanCount = m.finishedQuantity;
    return m;
  });
  const url = '/api/outbound/outScan/orderPartialSaveScan';
  const params = {
    expressCode: expressCode,
    wrapperBarcode: wrapperBarcode,
    newExpressCode: newExpressCode,
    data: dataArray,
    weight: weight,
    totalPackage: state.totalPackage,
    totalVolume: state.totalVolume,
    backWeight: true,
    detailList: base.state.tableData,
  };
  const [err, res] = await to(postData(url, params));
  if (res?.result) {
    onReset();
    // 自动打印，系统配置中心开启，且勾选打印复选框
    if (base.state.config.outer_printBill === true && state.formData.isOuter_PrintBill) {
      proxy.$refs.printRef.lodopPrint();
    }
  }
};
// 重置
const onReset = () => {
  state.formData = {
    orderId: 0,
    orderCode: null,
    orderWaveCode: null,
    caseNumber: null,
    productModel: null, // 包装条码
    scanQty: 0, // 扫描数量
    weight: 0, // 称重
    isValidateProductCode: true, // 是否校验商品
    isOpenCase: true, // 开启装箱
    // 装箱方式：0：常规扫描，1：一品一箱，2：多品一箱
    caseMode: 1,
    // 打印面单
    isOuter_PrintBill: false,
    // 打印装箱清单
    isOuter_Packinglist: false,
    wrapperBarcode: '',
  } as any;
  // 扫描数据
  base.state.tableData = [];
  // 当前正在扫描的数据
  base.state.currentRow = {};
  // 已经找到的数据
  base.state.existRows = [];
  // 一次扫描的数量
  state.scanCount = 1;
  // 配置参数
  base.state.config = {
    // 是否启用装箱操作
    in_caseNumber: true,
    // 支持一品多码
    sku_productToMultiBarcode: true,
    // 打印面单
    outer_printBill: true,
    // 打印装箱清单
    outer_Packinglist: true,
    // 称重阈值
    outer_weightWhreshold: 0,
    // 是否体积，件数
    outer_openPackage: 0,
  };
  // 弹出框
  state.isOpenPackage = false;
  state.formLabelWidth = '120px';
  state.totalPackage = null;
  state.totalVolume = null;
  proxy.$refs.orderWaveCode.focus();
};
// 勾选装箱清单
const outerPacking = () => {
  localStorage['isOuter_Packinglist'] = state.formData.isOuter_Packinglist;
};
// 换箱
const changeBox = () => {
  var batchNo = state.formData.orderWaveCode;
  if (batchNo === null) {
    proxy.$message.error('请先扫描出库单号!');
    return;
  }
  var currentRow = JSON.stringify(base.state.currentRow);
  if (currentRow === '{}') {
    proxy.$message.error('请先扫描商品信息!');
    return;
  }
  // 重新生成箱号
  generateCaseNumber();
  // if (state.formData.isOuter_Packinglist) {
  //   // 打印装箱单
  //   this.printCase();

  // } else {
  //   this.$message({
  //     message: "请勾选打印装箱清单!",
  //     type: "warning"
  //   });
  //   return;
  // }
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
    const exist = base.checkProductModelExist(state.formData.productModel, item);
    return exist && item.unFinishedQuantity > 0;
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
  if (!existCaseRow) {
    var newRow = JSON.parse(JSON.stringify(rowData));
    rowData.unFinishedQuantity = 0;

    const scanQty = base.getScanQty(); // 默认扫描数量为1
    newRow.finishedQuantity = scanQty;
    newRow.unFinishedQuantity -= scanQty;
    newRow.caseNumber = state.formData.caseNumber;
    base.state.tableData.splice(0, 0, newRow);
    base.state.currentRow = newRow;
  }
  base.state.currentRow!.scanWeight = Math.Round(base.state.currentRow!.weight * base.state.currentRow!.finishedQuantity, 2);
  generateCaseNumber();
  base.play();
};
// 多品一箱
const addRow_2 = () => {
  const rowData = base.state.tableData.find((item) => {
    const exist = base.checkProductModelExist(state.formData.productModel, item);
    return exist && item.unFinishedQuantity > 0;
  });
  if (!rowData) {
    proxy.$message.error('没有可扫描的商品条码');
    base.playError();
    return;
  }

  const scanQty = base.getScanQty(); // 默认扫描数量为1
  if (rowData.caseNumber === state.formData.caseNumber) {
    rowData.unFinishedQuantity -= scanQty;
    rowData.finishedQuantity += scanQty;
    base.state.currentRow = rowData;
  } else {
    if (!rowData.caseNumber) {
      rowData.unFinishedQuantity -= scanQty;
      rowData.finishedQuantity += scanQty;
      rowData.caseNumber = state.formData.caseNumber;
      base.state.currentRow = rowData;
    } else {
      var newRow = JSON.parse(JSON.stringify(rowData));
      rowData.unFinishedQuantity = 0;

      newRow.finishedQuantity = scanQty;
      newRow.unFinishedQuantity -= scanQty;
      newRow.caseNumber = state.formData.caseNumber;
      base.state.tableData.splice(0, 0, newRow);
      base.state.currentRow = newRow;
    }
  }
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
// 获得打印模板
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
  // // 获取装箱数据
  // const caseDataList = base.state.tableData.filter((item:any) => {
  // 	item.rowTotal = item.finishedQuantity * item.salePrice;
  // 	return item.caseNumber === state.formData.caseNumber;
  // });
  // if (!caseDataList.length) {
  // 	proxy.$message.error('没有可打印的数据');
  // 	return;
  // }
  // // 箱号
  // state.orderInfo.caseNumber = state.formData.caseNumber;
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
  // 		billCodeField: 'orderCode',
  // 	},
  // }).$mount();
  // var mountPrint = document.getElementById('mount-print');
  // var firstChild = mountPrint.firstChild;
  // mountPrint.insertBefore(m.$el, firstChild);
  // m.lodopPrint();
  // window.setTimeout(() => {
  // 	document.getElementById(this.orderInfo.orderCode).remove();
  // }, 2 * 60 * 1000);
};
// // 打印机改变
// const changePrint = () => {
// 	localStorage['printerName'] = state.formData.printerName;
// };
// // 获得打印机列表
// const getPrintList = () => {
// 	window.setTimeout(() => {
// 		const LODOP = getLodop();
// 		var iPrinterCount = LODOP.GET_PRINTER_COUNT();
// 		for (var i = 0; i < iPrinterCount; i++) {
// 			this.printList.push(LODOP.GET_PRINTER_NAME(i));
// 		}
// 		// 设置默认打印机
// 		const printerName = localStorage['printerName'];
// 		if (printerName) {
// 			state.formData.printerName = printerName;
// 		}
// 	}, 1000);
// };
</script>

<style lang="scss" scoped>
@import '/@/theme/scan.scss';
</style>
