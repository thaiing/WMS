<template>
  <div class="scan-container">
    <el-card class="scan-card no-print">
      <template #header>
        <div class="clearfix">
          <span>线路打包校验</span>
        </div>
      </template>
      <el-form ref="form" :model="state.formData" label-width="120px" class="scan-form">
        <el-form-item label="线路名称">
          <el-select v-model="state.formData.lineName" filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="remoteMethod" :loading="state.loading" @change="getOrderOptions">
            <el-option v-for="(item, index) in state.LineOptions" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="快递号/出库单号">
          <el-select ref="batchCode" v-model="state.formData.batchCode" filterable placeholder="请选择" @change="getData">
            <el-option v-for="(item, index) in state.OrderOptions" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <span class="sub-item">
            <span class="sub-label">商品校验：</span>
            <el-switch v-model="state.formData.isValidateProductCode" @change="onIsValidateProductCodeChange"></el-switch>
          </span>
          <span class="sub-item">
            <span class="sub-label">开启装箱：</span>
            <el-switch v-model="state.formData.isOpenCase" @change="onIsOpenCase"></el-switch>
          </span>
          <span class="sub-item">
            <span class="sub-label">开启包材：</span>
            <el-switch v-model="state.formData.isOpenWrapperBarcode" @change="onIsOpenWrapperBarcode"></el-switch>
          </span>
        </el-form-item>
        <el-form-item v-if="state.formData.isOpenCase" label="箱号">
          <el-input v-model="state.formData.caseNumber" class="input-300 margin-right-5" @keyup.enter.stop="onKeyupCaseNumber"></el-input>
          <el-radio-group v-model="state.formData.caseMode" @change="onCaseMode">
            <el-radio :label="1">一品一箱</el-radio>
            <el-radio :label="2">多品一箱</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="state.formData.isValidateProductCode" label="商品条码">
          <el-input ref="productModel" v-model="state.formData.productModel" :disabled="!state.formData.isValidateProductCode" class="input-300" @keyup.enter.stop="checkPackingBarcode"></el-input>
        </el-form-item>
        <el-form-item v-if="state.formData.isOpenWrapperBarcode" label="包材条码">
          <el-input ref="txtwrapperBarcode" v-model="state.formData.wrapperBarcode" class="w-300"></el-input>
        </el-form-item>
        <el-form-item label="扫描数量">
          <el-input-number ref="scanQty" v-model="state.formData.scanQty" :min="0" :disabled="!state.formData.isValidateProductCode" controls-position="right" class="input-120" @change="changeScanQty"></el-input-number>
          <span class="sub-item">
            <span class="sub-label">称重：</span>
            <el-input-number v-model="state.formData.weight" :min="0" controls-position="right" class="input-120"></el-input-number>
          </span>
        </el-form-item>
        <el-form-item v-if="state.formData.isOpenCase" label="选择打印机">
          <el-select v-model="state.formData.printerName" placeholder="请选择打印机" class="w-300" @change="changePrint">
            <el-option v-for="(item, index) in state.printList" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button v-if="state.formData.isOpenCase" @click="changeBox">换箱</el-button>
          <el-button type="success" @click="openPackage">复核提交</el-button>
          <el-button class="success margin-right-10" @click="printCarNum">打印箱标签</el-button>
          <el-button class="margin-right-10" @click="onReset">重置</el-button>
          <el-checkbox v-if="config.outer_printBill" v-model="state.formData.isOuter_PrintBill">打印面单</el-checkbox>
          <el-checkbox v-if="state.formData.isOpenCase" v-model="state.formData.isOuter_Packinglist" @change="outerPacking">打印装箱清单</el-checkbox>
          <el-checkbox v-if="config.outer_printOrderDetail" v-model="state.formData.isDetail_PrintBill">打印订单详情单</el-checkbox>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="scan-card body-no-padding no-print">
      <div class="clearfix">
        <span class="padding-top-10"
          >扫描结果
          <el-switch v-model="state.formData.printNumType" active-text="多品一箱标签" inactive-text="单品一箱标签"></el-switch>
        </span>
        <el-button link class="floatRight" @click="state.setting.visible = true">字段设置</el-button>
      </div>
      <el-table ref="scan-table" :data="state.tableData" :row-class-name="rowClass" stripe style="width: 100%" class="scan-table" @row-dblclick="base.setCurrent" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <template v-for="(item, index) in state.setting.fields">
          <template v-if="['unFinishedQuantity', 'finishedQuantity'].indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="item.label" :width="item.width">
              <template #common-column-slot="{ row }">
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
              <template #common-column-slot="{ row }">
                <template>
                  <el-input v-model="row[item.prop]" size="small" class="w-100pc"></el-input>
                </template>
              </template>
            </el-table-column>
          </template>
          <template v-else-if="'produceDate,limitDate'.indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="item.label" :width="item.width">
              <template #common-column-slot="{ row }">
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
    <print v-if="state.formData.isOuter_PrintBill" ref="printRef" :ids="'' + state.formData.order_Id" type="express"></print>
    <!-- 显示打印订单详情模板 -->
    <print2 v-if="state.formData.isDetail_PrintBill && state.formData.order_Id" ref="printRef2" :ids="'' + state.formData.order_Id" type="express"></print2>
    <!-- 显示打印装箱清单模板 -->
    <div id="mount-print"></div>

    <!--复核提交-->
    <el-dialog v-model:visible="state.isOpenPackage" title="复核提交" width="500px" append-to-body>
      <el-form :label-width="state.formLabelWidth">
        <el-form-item label="合计件数" style="width: 320px">
          <el-input v-model.number="state.totalPackage" type="number"></el-input>
        </el-form-item>
        <el-form-item label="合计体积" style="width: 320px">
          <el-input v-model="state.totalVolume" type="number"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createFace">按件数打印面单</el-button>
        <el-button @click="state.isOpenPackage = false">取 消</el-button>
        <el-button type="primary" @click="partialSave()">确 定</el-button>
      </div>
    </el-dialog>

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
import { BaseProperties, DetailField } from '/@/types/base-type';
import { postData } from '/@/api/common/baseApi';
import to from 'await-to-js';
import moment from 'moment';
import { getLodop } from '/@/utils/lodopFuncs.js';
import scanHook from '/@/components/hooks/scanHook';
const ScanSettingDialog = defineAsyncComponent(() => import('/@/components/common/components/scanSettingDialog.vue'));
const InputSelect = defineAsyncComponent(() => import('/@/components/base/InputSelect.vue'));
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

//#region 配置参数
const config = ref({
  outer_printOrderDetail: true,
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
});

//#region 定义变量
const state = reactive({
  formData: {
    ...toRefs(base.state.formData),
    lineName: '',
    order_Id: 0,
    orderCode: '',
    batchCode: '',
    caseNumber: '',
    productModel: '', // 包装条码
    scanQty: 0, // 扫描数量
    weight: 0, // 称重
    isValidateProductCode: false, // 是否校验商品
    isOpenWrapperBarcode: false, // 开启包材
    isOpenCase: false, // 开启装箱
    // 装箱方式：0：常规扫描，1：一品一箱，2：多品一箱
    caseMode: 2,
    // 打印面单
    isOuter_PrintBill: false,
    isDetail_PrintBill: false,
    // 打印装箱清单
    isOuter_Packinglist: false,
    wrapperBarcode: '',
    printNumType: false,
    printerName: '',
  },
  LineOptions: [] as any[],
  OrderOptions: [] as any[],
  loading: false,
  multipleSelection: [] as any[],
  // 订单信息
  orderInfo: {} as EmptyObjectType,
  // 扫描数据
  tableData: [] as any[],
  // 当前正在扫描的数据
  currentRow: {},
  // 已经找到的数据
  existRows: [] as any[],
  // 一次扫描的数量
  scanCount: 1,
  // 装箱打印模板
  printCaseVueData: {},
  // 打印机设备列表
  printList: [] as any[],
  // // 当前正在扫描的数据
  // currentRow: {},
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
        width: 130,
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

// components: {
// 	ScanSettingDialog,
// 	print,
// 	print2,
// 	// eslint-disable-next-line
// 	PrintCase,
// },

const activated = () => {
  // 校验条码
  const isValidateProductCode = localStorage['out_isValidateProductCode'];
  if (isValidateProductCode) {
    state.formData.isValidateProductCode = isValidateProductCode === 'true';
  }
  // 开启装箱
  const isOpenCase = localStorage['out_isOpenCase'];
  if (isOpenCase) {
    state.formData.isOpenCase = isOpenCase === 'true';
    const caseMode = localStorage['out_caseMode'] || '0';
    state.formData.caseMode = parseInt(caseMode);
  }
  // 开启装箱
  state.formData.isOpenWrapperBarcode = localStorage['out_isOpenWrapperBarcode'] === 'true';

  // 勾选打印装箱
  const isOuter_Packinglist = localStorage['isOuter_Packinglist'];
  if (isOuter_Packinglist) {
    state.formData.isOuter_Packinglist = isOuter_Packinglist === 'true';
  }
};

//#region onMounted
onMounted(async () => {
  // 获取配置参数
  getConfig();
  // 获得打印模板
  getPrintTemplate();
  // 获取打印机
  getPrintList();
  getOrderOptions();
  // 字段设置
  const setting = localStorage[state.setting.name + '-setting'];
  if (setting) {
    state.setting.fields = JSON.parse(setting);
  }
});
const getOrderOptions = async () => {
  let url = '/api/outbound/outScan/getLineName';
  let params = {
    query: state.formData.lineName,
  };
  const [err, res] = await to(postData(url, params));
  if (res?.result) {
    let OrderOptions = [] as any[];
    res.data.forEach((v: any) => {
      let info = { value: v.orderCode, label: v.orderCode };
      OrderOptions.push(info);
    });
    state.OrderOptions = OrderOptions;
  } else {
    state.OrderOptions = [];
  }
};
const remoteMethod = async (query: any) => {
  if (query !== '') {
    state.loading = true;

    // setTimeout(() => {
    //   this.loading = false;
    //   this.options = this.list.filter(item => {
    //     return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
    //   });
    // }, 200);

    let url = '/api/outbound/outScan/getLineName';
    let params = {
      query: query,
    };
    const [err, res] = await to(postData(url, params));
    if (res?.result) {
      let LineOptions = [] as any[];
      res.data.forEach((v: any) => {
        if (v.expandFields) {
          let lineName = JSON.parse(v.expandFields).lineName;
          if (lineName) {
            let info = { value: lineName, label: lineName };
            LineOptions.push(info);
          }
        }
      });
      const groupByres = new Map();
      let newList = LineOptions.filter((a) => !groupByres.has(a.value) && groupByres.set(a.value, 1)).map((p) => {
        return {
          value: p.value,
          label: p.value,
        };
      });
      state.LineOptions = newList;
      getOrderOptions();
    } else {
      state.LineOptions = [];
    }
  } else {
    state.LineOptions = [];
  }
};
// 是否校验商品切换
const onIsValidateProductCodeChange = () => {
  localStorage['out_isValidateProductCode'] = state.formData.isValidateProductCode;

  state.tableData = state.tableData.map((row) => {
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
// 是否开启包材
const onIsOpenWrapperBarcode = () => {
  localStorage['out_isOpenWrapperBarcode'] = state.formData.isOpenWrapperBarcode;
};
// 切换装箱模式
const onCaseMode = () => {
  localStorage['out_caseMode'] = state.formData.caseMode;
};
// 箱号回车
const onKeyupCaseNumber = () => {
  base.focus('productModel');
};
// 获得配置参数
const getConfig = async () => {
  let keys = Object.keys(base.state.config).join(',');
  let url = '/api/sys/param/getParamConfig';
  let params = {
    keys: keys,
  };
  const [err, res] = await to(postData(url, params));
  if (res?.result) {
    // base.valueList = res.data;
    // 获得参数值列表，将数字转换为对象
    res.data.forEach((item: any) => {
      let value02 = item.value02; // 字段名称
      let value03 = item.value03;

      if (proxy.common.isNumber(item.value03)) {
        value03 = parseInt(item.value03);
      }
      // 称重阈值不需要转为boolean
      if (value02 !== 'outer_weightWhreshold') {
        base.state.config = item.value02;
        // this.$set(this.config, item.value02, !!value03);
      }
    });
  }

  proxy.$refs['settings'];
};
// 获取扫描数据
const getData = async () => {
  let batchCode = state.formData.batchCode;
  if (!batchCode) {
    proxy.$message.error('快递单号不能为空!');
    return;
  }
  batchCode = batchCode.trim();
  state.formData.batchCode = batchCode;

  let url = '/api/outbound/outScan/getOutData';
  let params = {
    expressCode: batchCode,
    batchCode: batchCode,
  };
  const [err, res] = await to(postData(url, params));
  if (res?.result) {
    state.orderInfo = res.data2;
    state.tableData = res.data.map((row: any) => {
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
      return row;
    });
    if (base.state.config.outer_printBill === true) {
      state.formData.order_Id = state.tableData[0].order_Id;
    }
    state.formData.caseNumber = res.dynamic;
    // 条码框获得焦点
    if (state.formData.isValidateProductCode) {
      base.focus('productModel');
    } else if (state.formData.isOpenWrapperBarcode) {
      base.focus('txtwrapperBarcode');
    } else {
      // base.focus("batchCode");
    }
  } else {
    onReset();
  }
};
// 判断扫描包装条码
const checkPackingBarcode = () => {
  let code = state.formData.productModel;
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
    base.checkPackingProductModel(state.tableData);
  }
  base.focus('productModel');
  if (base.state.currentRow) {
    state.formData.scanQty = base.state.currentRow!.finishedQuantity;
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
    state.tableData
      .filter((item) => {
        return item.orderList_Id === base.state.currentRow!.orderList_Id;
      })
      .forEach((item) => {
        finishedQuantity += item.finishedQuantity;
      });

    // 不包含当前行完成数量
    finishedQuantity -= base.state.currentRow!.finishedQuantity;
    const unFinishedQuantity = Math.Round(base.state.currentRow!.quantityOrder - base.state.currentRow!.quantityOuter - finishedQuantity, 4);
    if (state.formData.scanQty <= unFinishedQuantity) {
      base.state.currentRow!.unFinishedQuantity = Math.Round(unFinishedQuantity - state.formData.scanQty, 4);
      base.state.currentRow!.finishedQuantity = state.formData.scanQty;
      base.state.currentRow!.scanWeight = Math.Round(base.state.currentRow!.weight * base.state.currentRow!.finishedQuantity, 2);
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
// 按件数打印面单
const createFace = () => {
  if (!state.totalPackage) {
    proxy.$message.error('请填写合计件数');
    return;
  }
  let cpbianhao = '';
  let cpmingcheng = '';
  let cpxinghao = '';
  if (state.orderInfo.expandFields) {
    let expandFields = JSON.parse(state.orderInfo.expandFields);
    cpbianhao = expandFields.cpbianhao ? expandFields.cpbianhao : '';
    cpmingcheng = expandFields.cpmingcheng ? expandFields.cpmingcheng : '';
    cpxinghao = expandFields.cpxinghao ? expandFields.cpxinghao : '';
  }
  localStorage.setItem('cpbianhao', cpbianhao);
  localStorage.setItem('cpmingcheng', cpmingcheng);
  localStorage.setItem('cpxinghao', cpxinghao);
  localStorage.setItem('clientShortName', state.orderInfo.clientShortName);
  localStorage.setItem('totalPackage', state.totalPackage);
  localStorage.setItem('outBatchCode', state.formData.batchCode);
  localStorage.setItem('printType', '按件数打印面单');

  let url = '/inbound/purchase/print-barcode';
  window.open(url);
};
// 复核提交，封箱（部分打包），然后计算已打包数量，设置 新快递单号为 “可用”
const partialSave = async () => {
  if (base.state.config.outer_openPackage) {
    if (!state.totalPackage) {
      proxy.$message.error('合计件数！');
      return false;
    }
  }
  let expressCode = state.formData.batchCode; // 快递单号
  let wrapperBarcode = state.formData.wrapperBarcode; // 包材条码
  let newExpressCode = ''; // 新快递单号
  let weight = state.formData.weight; // 重量
  if (!expressCode) {
    proxy.$message.error('快递单号不能为空!');
    return;
  }
  let dataArray = state.tableData
    .filter((item) => {
      return item.finishedQuantity > 0;
    })
    .map((rowData) => {
      return {
        caseNumber: rowData.caseNumber,
        order_Id: rowData.order_Id,
        orderCode: rowData.orderCode,
        orderList_Id: rowData.orderList_Id,
        scanCount: rowData.finishedQuantity,
        totalWeight: rowData.scanWeight,
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
    proxy.$message.error('商品实际重量与商品理论重量差值超过设定阈值' + outer_weightWhreshold + '，不允许出库');
    return;
  }

  state.tableData.map((m) => {
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
    totalVolume: state.totalVolume ? state.totalVolume : 0,
    detailList: state.tableData,
  };
  const [err, res] = await to(postData(url, params));
  if (res?.result) {
    onReset();
    // 自动打印，系统配置中心开启，且勾选打印复选框
    if (base.state.config.outer_printBill === true && state.formData.isOuter_PrintBill) {
      proxy.$refs.printRef.lodopPrint();
    }
    // 自动打印，系统配置中心开启，且勾选打印复选框
    if (base.state.config.outer_printOrderDetail === true && state.formData.isDetail_PrintBill) {
      proxy.$refs.printRef2.lodopPrint();
    }
  }
};
// 重置
const onReset = () => {
  const isValidateProductCode = localStorage['out_isValidateProductCode'];

  state.formData = {
    order_Id: 0,
    orderCode: null,
    batchCode: null,
    caseNumber: null,
    productModel: null, // 包装条码
    scanQty: 0, // 扫描数量
    weight: 0, // 称重
    isValidateProductCode: isValidateProductCode === 'true', // 是否校验商品
    isOuter_PrintBill: false,
    isOuter_Packinglist: false,
    wrapperBarcode: '',
  } as any;
  // 扫描数据
  state.tableData = [];
  // 当前正在扫描的数据
  state.currentRow = {};
  // 已经找到的数据
  state.existRows = [];
  // 一次扫描的数量
  state.scanCount = 1;
  // 配置参数
  base.state.config = {
    outer_printOrderDetail: true,
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
    outer_openPackage: 0,
  };
  // 弹出框
  state.isOpenPackage = false;
  state.formLabelWidth = '120px';
  state.totalPackage = null;
  state.totalVolume = null;
  proxy.$refs.batchCode.focus();
};
// 勾选装箱清单
const outerPacking = () => {
  localStorage['isOuter_Packinglist'] = state.formData.isOuter_Packinglist;
};
// 换箱
const changeBox = () => {
  let batchNo = state.formData.batchCode;
  if (batchNo === null) {
    proxy.$message.error('请先扫描出库单号!');
    return;
  }
  let currentRow = JSON.stringify(base.state.currentRow);
  if (currentRow === '{}') {
    proxy.$message.error('请先扫描商品信息!');
    return;
  }
  if (state.formData.isOuter_Packinglist) {
    // 打印装箱单
    printCase();
    // 重新生成箱号
    generateCaseNumber();
  } else {
    proxy.$message.error('请勾选打印装箱清单!');
    return;
  }
};
// 生成箱号
const generateCaseNumber = () => {
  let batchNo = state.formData.batchCode;
  let max = 1;
  let num = state.formData.caseNumber;
  if (num.indexOf('-') >= 0) {
    let nums = num.split('-');
    num = nums[nums.length - 1];
  } else {
    num = num.substr(num.length - 4);
  }
  let number = parseInt(num);
  ++number;
  if (number > max) max = number;
  let maxStr = '00000' + max;
  maxStr = maxStr.substring(maxStr.length - 2);
  let caseNumber = batchNo + '-' + max;
  state.formData.caseNumber = caseNumber;
};
// 一品一箱
const addRow_1 = () => {
  const rowData = state.tableData.find((item) => {
    const exist = base.checkProductModelExist(state.formData.productModel, item);
    return exist && item.unFinishedQuantity > 0;
  });
  if (!rowData) {
    proxy.$message.error('没有可扫描的商品条码');
    base.playError();
    return;
  }

  // 箱号存在
  let existCaseRow = state.tableData.find((item) => {
    return item.caseNumber === state.formData.caseNumber && item.unFinishedQuantity > 0;
  });
  if (!existCaseRow) {
    let newRow = JSON.parse(JSON.stringify(rowData));
    rowData.unFinishedQuantity = 0;

    const scanQty = base.getScanQty(); // 默认扫描数量为1
    newRow.finishedQuantity = scanQty;
    newRow.unFinishedQuantity -= scanQty;
    newRow.caseNumber = state.formData.caseNumber;
    state.tableData.splice(0, 0, newRow);
    base.state.currentRow = newRow;
  }
  base.state.currentRow!.scanWeight = Math.Round(base.state.currentRow!.weight * base.state.currentRow!.finishedQuantity, 2);
  generateCaseNumber();
  base.play();
};
// 多品一箱
const addRow_2 = () => {
  const rowData = state.tableData.find((item) => {
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
      let newRow = JSON.parse(JSON.stringify(rowData));
      rowData.unFinishedQuantity = 0;

      newRow.finishedQuantity = scanQty;
      newRow.unFinishedQuantity -= scanQty;
      newRow.caseNumber = state.formData.caseNumber;
      state.tableData.splice(0, 0, newRow);
      base.state.currentRow = newRow;
    }
  }
  base.play();

  base.state.currentRow!.sortIndex = 1;
  // 置顶排序
  state.tableData.sort(function (a, b) {
    return b.sortIndex - a.sortIndex;
  });

  state.tableData.forEach((element) => {
    element.sortIndex = 0;
  });
};
// 获得打印模板
// 获取运单信息和打印机名称
const getPrintTemplate = async () => {
  let url = '/api/sys/printTemplate/getPrintTemplate';
  let params = {
    menu_Id: 200013, // 打印模板MenuID
  };
  const [err, res] = await to(postData(url, params));
  if (res?.result) {
    state.printCaseVueData = res.data;
  }
};
// 打印装箱单
const printCase = () => {
  // 获取装箱数据
  // const caseDataList = state.tableData.filter((item) => {
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
  // let Profile = Vue.extend(PrintCase);
  // let m = new Profile({
  // 	propsData: {
  // 		vueData: state.printCaseVueData,
  // 		billDataInfo: billDataInfo,
  // 		printInfo: {
  // 			printerName: state.formData.printerName,
  // 		},
  // 		billCodeField: 'orderCode',
  // 	},
  // }).$mount();
  // let mountPrint = document.getElementById('mount-print');
  // let firstChild = mountPrint!.firstChild;
  // mountPrint!.insertBefore(m.$el, firstChild);
  // m.lodopPrint();
  // window.setTimeout(() => {
  // 	document.getElementById(state.orderInfo.orderCode).remove();
  // }, 2 * 60 * 1000);
};
// 打印机改变
const changePrint = () => {
  localStorage['printerName'] = state.formData.printerName;
};
// 获得打印机列表
const getPrintList = () => {
  window.setTimeout(() => {
    const LODOP = getLodop();
    let iPrinterCount = LODOP.GET_PRINTER_COUNT();
    for (let i = 0; i < iPrinterCount; i++) {
      state.printList.push(LODOP.GET_PRINTER_NAME(i));
    }
    // 设置默认打印机
    const printerName = localStorage['printerName'];
    if (printerName) {
      state.formData.printerName = printerName;
    }
  }, 1000);
};
// 打印箱标签
const printCarNum = () => {
  if (state.multipleSelection.length === 0) {
    proxy.$message.error('至少勾选一行打印。');
    return;
  }
  state.orderInfo.multipleSelection = state.multipleSelection;
  state.orderInfo.printNumType = state.formData.printNumType;
  let plateCarNumInfo = JSON.stringify(state.orderInfo);
  localStorage.setItem('plateCarNumInfo', plateCarNumInfo);
  localStorage.setItem('printType', '单/多品一箱标签');
  let url = '/inbound/purchase/print-barcode';
  window.open(url);
};
const handleSelectionChange = (val: any) => {
  state.multipleSelection = val;
};
</script>

<style lang="scss" scoped>
@import '/@/theme/scan.scss';
</style>
