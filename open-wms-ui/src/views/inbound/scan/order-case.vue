<template>
  <div class="scan-container">
    <el-card class="scan-card">
      <template #header>
        <div class="clearfix">
          <span>装箱扫描入库</span>
        </div>
      </template>
      <el-row>
        <el-col :xl="11" :md="14" :xs="24">
          <el-form ref="form" :model="state.formData" label-width="120px" class="scan-form">
            <el-form-item label="商品条码">
              <el-input ref="productModel" v-model="state.formData.productModel" class="input-300" autofocus @keyup.enter.stop="getPurchaseOrderData"></el-input>
              <!-- <span class="sub-item">
                <span class="sub-label">商品校验：</span>
                <el-switch v-model="state.formData.isValidateProductCode" @change="onIsValidateProductCodeChange"></el-switch>
              </span> -->
              <!-- <span class="sub-item">
                <span class="sub-label">开启SN：</span>
                <el-switch v-model="state.formData.isScanSn" @change="onIsScanSnChange"></el-switch>
              </span> -->
            </el-form-item>
            <el-form-item label="预到货单号">
              <el-input ref="orderCode" v-model="state.formData.orderCode" class="input-300" @keyup.enter.stop="getData"></el-input>
            </el-form-item>
            <el-form-item :label="state.formData.isOnShelve ? '上架货位' : '收货位'">
              <el-input v-if="state.formData.isOnShelve" ref="positionName" v-model="state.formData.positionName" placeholder="请输入上架货位" class="input-300" @keyup.enter="positionNameKeyup"></el-input>
              <el-select v-else ref="positionName" v-model="state.formData.positionName" placeholder="请选择收货位" class="input-300">
                <el-option v-for="(item, index) in state.positionList" :key="index" :label="item.positionName" :value="item.positionName" @click="positionNameClick(item)"></el-option>
              </el-select>
              <span class="sub-item">
                <span class="sub-label">直接上架：</span>
                <el-switch v-model="state.formData.isOnShelve" @change="onIsOnShelveCaseChange"></el-switch>
              </span>
            </el-form-item>
            <!-- <el-form-item label="商品条码">
          <el-input ref="productModel" v-model="state.formData.productModel" :disabled="!state.formData.isValidateProductCode" class="input-300" @keyup.enter.stop="checkPackingBarcode"></el-input>
          <span class="sub-item">
            <span class="sub-label">扫描数量：</span>
            <el-input-number ref="scanQty" v-model.number="state.formData.scanQty" :min="0" :disabled="!state.formData.isValidateProductCode" class="input-100" controls-position="right" @change="changeScanQty"></el-input-number>
          </span>
        </el-form-item> -->
            <el-form-item>
              <el-button type="primary" @click="saveCheck">确认入库</el-button>
              <el-button @click="onReset">重置</el-button>
              <el-button type="primary" @click="printCaseNumber">打印条码</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col v-if="state.formData.isScanSn" :xl="12" :md="10" :xs="24">
          <el-form ref="formSn" :model="state.formData" label-position="top" label-width="120px" class="scan-sn-form">
            <el-form-item label="扫描SN">
              <el-input ref="snList" v-model="state.formData.snList" type="textarea" :rows="6" class="input-500"></el-input>
              <div class="color-666">
                SN条数：
                <span>{{ state.formData.scanQty }}</span>
                <span class="color-red margin-left-20">扫描SN时需要先双击选中明细</span>
              </div>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="scan-card body-no-padding mt-5">
      <template #header>
        <div class="clearfix">
          <span class="padding-top-10">扫描结果</span>
          <el-button link class="floatRight" @click="state.setting.visible = true">字段设置</el-button>
        </div>
      </template>

      <el-table ref="scan-table" :data="base.state.tableData" :row-class-name="base.rowClass" :span-method="objectSpanMethod" stripe style="width: 100%" class="scan-table" @row-dblclick="base.setCurrent" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <template v-for="(item, index) in state.setting.fields">
          <template v-if="['unFinishedQuantity', 'finishedQuantity'].indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="item.label" :width="item.width">
              <template #default="scope">
                <template v-if="!state.formData.isValidateProductCode">
                  <!-- && !scope.row.isMain -->
                  <el-input-number v-model="scope.row[item.prop]" :disabled="scope.row['disabled']" :min="0" :max="scope.row['quantity']" size="small" class="w-100pc" controls-position="right" @keyup.enter="updateBoxQty(scope.row)"></el-input-number>
                  <!-- @change="(currentValue, oldValue)=>rowChangeQty(currentValue, oldValue, scope.row, scope.$index)" -->
                </template>
                <template v-else>
                  {{ scope.row[item.prop] }}
                </template>
              </template>
            </el-table-column>
          </template>
          <template v-else-if="['arriveQuantity'].indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="item.label" :width="item.width">
              <template #default="scope">
                <el-input-number v-model="scope.row[item.prop]" :min="0" :max="scope.row['quantity']" size="small" class="w-100pc" controls-position="right"></el-input-number>
                <!-- @change="(currentValue, oldValue)=>rowArriveQuantity(currentValue, oldValue, scope.row, scope.$index)" -->
              </template>
            </el-table-column>
          </template>
          <template v-else-if="['caseNum'].indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="item.label" :width="item.width">
              <template #default="scope">
                <el-input-number v-model="scope.row[item.prop]" :min="1" size="small" class="w-100pc" controls-position="right"></el-input-number>
              </template>
            </el-table-column>
          </template>
          <template v-else-if="'plateCode,positionName,scanWeight'.indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="item.label" :width="item.width">
              <template #default="scope">
                <el-input v-model="scope.row[item.prop]" size="small" class="w-100pc"></el-input>
              </template>
            </el-table-column>
          </template>
          <template v-else-if="'produceDate,limitDate'.indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="item.label" :width="item.width">
              <template #default="scope">
                <el-date-picker v-model="scope.row[item.prop]" size="small" type="date" placeholder="选择日期" class="w-110" value-format="YYYY-MM-DD"></el-date-picker>
              </template>
            </el-table-column>
          </template>
          <!--SN序列号-->
          <template v-else-if="'singleSignCode'.indexOf(item.prop) >= 0 && state.formData.isScanSn">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="item.label" :width="item.width">
              <template #default="{ row }">
                <span class="sn-text">{{ row.singleSignCode }}</span>
                <span class="sn-count">[SN数：{{ row.singleSignCode ? row.singleSignCode.split(',').length : 0 }}]</span>
              </template>
            </el-table-column>
          </template>
          <template v-else>
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :min-width="item.minWidth"></el-table-column>
          </template>
        </template>
        <el-table-column fixed="right" label="操作" width="100">
          <template #default="{ row, $index }">
            <el-button link size="small" @click="showSplitDialog(row, $index)">拆分</el-button>
            <el-button link size="small" @click="deleteRow(row, $index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <scan-setting-dialog ref="setting-dialog" v-model:visible="state.setting.visible" :fields="state.setting.fields" :name="state.setting.name"></scan-setting-dialog>

    <!-- 预到货单选择器 -->
    <purchase-order-dialog ref="purchaseOrderDialog" v-model="state.purchaseOrderVisible" @click-select="clickSelect"></purchase-order-dialog>

    <el-dialog draggable v-model="state.formSplit.isOpenPackage" :close-on-click-modal="false" title="拆分箱数" width="520px" append-to-body>
      <el-form label-width="120px">
        <el-form-item label="拆分箱数" style="width: 320px">
          <el-input v-model.number="state.formSplit.splitQty" type="number" @keyup.enter.stop="getboxQty"></el-input>
        </el-form-item>
        <el-form-item label="每箱数量" style="width: 320px">
          <el-input v-model="state.formSplit.boxQty" type="number"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer flex-end">
        <el-button @click="state.formSplit.isOpenPackage = false">取 消</el-button>
        <el-button type="primary" @click="splitRow()">确定</el-button>
      </span>
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

<script setup lang="ts" name="inbound-scan-order-case">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
import { postData } from '/@/api/common/baseApi';
import to from 'await-to-js';
import scanHook from '/@/components/hooks/scanHook';
const ScanSettingDialog = defineAsyncComponent(() => import('/@/components/common/components/scanSettingDialog.vue'));
const PurchaseOrderDialog = defineAsyncComponent(() => import('./components/purchase-order-dialog.vue'));

let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

const config = ref({
  // 自动生成上架单
  in_generateShelve: true,
  // 是否启用装箱操作
  in_caseNumber: false,
  // 支持一品多码
  sku_productToMultiBarcode: true,
  // 装箱扫描商品条码只带出自己
  in_caseScanProductModelOnly: false,
});

const base = scanHook({ config });

//#region 定义变量
const state = reactive({
  multipleSelection: [],
  purchaseOrderVisible: false,
  formData: {
    ...toRefs(base.state.formData),
    orderCode: null,
    orderId: 0,
  },
  // 备份明细集合
  originalTableData: [],
  // 收货位候选项
  positionList: [] as any[],
  // 配置参数
  config: config.value,
  // 扫描列设置对话框参数
  setting: {
    visible: false,
    name: 'inbound-order-scan-case',
    fields: [
      {
        prop: 'productModel',
        label: '条形码',
        visible: true,
        width: 130,
        order: 1,
      },
      {
        prop: 'quantity',
        label: '清单数量',
        visible: true,
        width: 80,
        order: 2,
      },
      {
        prop: 'arriveQuantity',
        label: '到货数量',
        visible: true,
        width: 90,
        order: 3,
      },
      {
        prop: 'unFinishedQuantity',
        label: '未扫描数量',
        visible: false,
        width: 90,
        order: 4,
      },
      {
        prop: 'finishedQuantity',
        label: '装箱数量',
        visible: true,
        width: 90,
        order: 5,
      },
      {
        prop: 'caseNum',
        label: '箱数',
        visible: true,
        width: 90,
        order: 6,
      },
      {
        prop: 'enterQuantity',
        label: '已入库数量',
        visible: false,
        width: 90,
        order: 7,
      },
      {
        prop: 'productCode',
        label: '商品编号',
        visible: false,
        width: 130,
        order: 8,
      },
      {
        prop: 'smallUnit',
        label: '单位',
        visible: false,
        width: 50,
        order: 9,
      },
      {
        prop: 'plateCode',
        label: '箱号',
        visible: true,
        width: 160,
        order: 10,
      },
      {
        prop: 'positionName',
        label: '收货位',
        visible: true,
        width: 120,
        order: 11,
      },
      {
        prop: 'produceDate',
        label: '生产日期',
        visible: true,
        width: 130,
        order: 12,
      },
      {
        prop: 'limitDate',
        label: '到期日期',
        visible: false,
        width: 130,
        order: 13,
      },
      {
        prop: 'purchasePrice',
        label: '单价',
        visible: false,
        width: 80,
        order: 14,
      },
      {
        prop: 'productSpec',
        label: '商品规格',
        visible: true,
        width: 80,
        order: 15,
      },
      {
        prop: 'singleSignCode',
        label: '序列号(SN)',
        visible: true,
        width: 180,
        order: 8,
      },
      {
        prop: 'weight',
        label: '单位毛重',
        visible: false,
        width: 80,
        order: 16,
      },
      {
        prop: 'totalWeight',
        label: '合计重量',
        visible: false,
        width: 80,
        order: 17,
      },
      {
        prop: 'scanWeight',
        label: '已扫重量',
        visible: false,
        width: 80,
        order: 18,
      },
      {
        prop: 'productName',
        label: '商品名称',
        visible: true,
        width: undefined,
        minWidth: 200,
        order: 19,
      },
      {
        prop: 'shelfLifeDay',
        label: '保质期',
        visible: true,
        width: undefined,
        order: 20,
      },
    ],
  },
  spanArr: [] as any[],
  pos: 0,
  formSplit: {
    isOpenPackage: false, // 弹出框
    splitQty: 2, // 拆分箱数
    boxQty: 0, // 每箱数量
    row: {} as any,
    index: 0,
  },
});
//#endregion

//#region wacth
watch(
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
  // 直接上架
  const isOnShelve = localStorage['isOnShelve'];
  if (isOnShelve) {
    state.formData.isOnShelve = isOnShelve === 'true';
    let positionField = state.setting.fields.find((field) => field.prop === 'positionName');
    if (positionField) {
      positionField.label = state.formData.isOnShelve ? '上架货位' : '收货位';
    }
  }

  // 开启SN扫描
  const isScanSn = localStorage['isScanSn'];
  if (isScanSn) {
    state.formData.isScanSn = isScanSn === 'true';
  }

  // 字段设置
  const setting = localStorage[state.setting.name + '-setting'];
  if (setting) {
    state.setting.fields = JSON.parse(setting);
  }
  state.formData.isValidateProductCode = false;
});

//#endregion

const clickSelect = (data: any) => {
  state.formData.orderCode = data.orderCode;
  state.formData.orderId = data.orderId;
  state.purchaseOrderVisible = false;
  getData();
};

const handleSelectionChange = (val: any) => {
  base.state.multipleSelection = val;
};
// 打印箱条码
const printCaseNumber = () => {
  if (!base.state.multipleSelection.length) {
    proxy.$message.error('至少勾选一项');
    return;
  }
  let productIds = base.state.multipleSelection.map((m) => m.productId).join(',');
  let data = base.state.multipleSelection.map((m) => {
    m.quantity = m.finishedQuantity;
    return m;
  });

  let key = proxy.common.getGUID();
  sessionStorage.setItem('static_' + key, JSON.stringify(data));
  let url = `/system/print/base-template-id/12001/0/${productIds}?key=${key}&autoPrint=false`;
  window.open(url);
};
// 商品校验设置
const onIsValidateProductCodeChange = () => {
  localStorage['isValidateProductCode'] = state.formData.isValidateProductCode;
  base.state.tableData.forEach((row: any) => {
    if (!state.formData.isValidateProductCode) {
      row.finishedQuantity = Math.Round(row.quantity - (row.enterQuantity || 0), 4);
      row.scanWeight = row.totalWeight;
      row.unFinishedQuantity = 0;
    } else {
      row.unFinishedQuantity = Math.Round(row.quantity - (row.enterQuantity || 0), 4);
      row.scanWeight = 0;
      row.finishedQuantity = 0;
    }
  });
};
// 直接上架设置
const onIsOnShelveCaseChange = () => {
  localStorage['isOnShelve'] = state.formData.isOnShelve;
  let positionField = state.setting.fields.find((field) => field.prop === 'positionName');
  if (positionField) {
    positionField.label = state.formData.isOnShelve ? '上架货位' : '收货位';
  }
};
// 根据商品条码获取预到货单数据
const getPurchaseOrderData = async () => {
  let productModel: any = state.formData.productModel;
  if (!productModel) {
    proxy.$message.error('商品条码不能为空');
    return;
  }
  productModel = productModel.trim();
  state.formData.productModel = productModel;
  const url = '/inbound/in/inScanOrder/getPurchaseOrderData';
  const params = {
    productModel: productModel,
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }
  proxy.common.showMsg(res);
  if (res.result) {
    debugger;
    if (res.data.orderList.length === 1) {
      // 单条直接获取预到货单明细
      state.formData.orderCode = res.data.orderList[0].orderCode;
      state.formData.orderId = res.data.orderList[0].orderId;

      getData();
    } else {
      proxy.$refs['purchaseOrderDialog'].reload(res.data.orderList);
      state.purchaseOrderVisible = true;
    }
  } else {
    base.focus('productModel');
  }
};
// 获得明细数据
const getData = async () => {
  base.state.currentRow = null;
  state.formData.snList = '';
  base.state.tableData = [];
  let orderCode: any = state.formData.orderCode;
  if (!orderCode) {
    proxy.$message.error('预到货单号不能为空');
    return;
  }
  orderCode = orderCode.trim();
  state.formData.orderCode = orderCode;

  const url = '/inbound/in/inScanOrder/getInOrderData';
  const params = {
    orderCode: orderCode,
    isOnShelve: state.formData.isOnShelve,
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    base.focus('orderCode');
    return;
  }

  proxy.common.showMsg(res);
  if (res.result) {
    // 构建数据
    state.formData.positionName = '';
    state.formData.scanQty = 0;
    let newCaseNumber = res.data.newCaseNumber;
    let MainIndex = 0;
    if (newCaseNumber) {
      const caseNumbers = newCaseNumber.split('-');
      MainIndex = parseInt(caseNumbers[1].replace(/\b(0+)/gi, '')) - 1;
    }
    state.formData.orderId = res.data.orderId;
    base.state.tableData = res.data.orderList.map((row: any, index: any) => {
      row.unFinishedQuantity = Math.Round(row.quantity - (row.enterQuantity || 0), 4);
      row.arriveQuantity = Math.Round(row.quantity - (row.enterQuantity || 0), 4);
      row.finishedQuantity = 0;
      row.sortIndex = 0;
      row.scanWeight = 0;
      row.isMain = 1;
      row.plateCode = state.formData.orderCode + '-' + (index + 1 + MainIndex);
      row.validQuantity = row.unFinishedQuantity; // 原始可扫描数量
      row.caseNum = 1;
      row.quantity = Number(row.quantity);
      return row;
    });
    state.originalTableData = JSON.parse(JSON.stringify(base.state.tableData));

    // 装箱扫描商品条码只带出自己
    if (state.config.in_caseScanProductModelOnly && state.formData.productModel) {
      base.state.tableData = base.state.tableData.filter((item) => item.productModel === state.formData.productModel);
    }

    if (!state.formData.isValidateProductCode) {
      base.state.tableData.forEach((row) => {
        row.finishedQuantity = Math.Round(row.unFinishedQuantity, 4);
        row.scanWeight = row.totalWeight;
        row.unFinishedQuantity = 0;
      });
    }

    base.state.tableData.map((m) => {
      m.disabled = false;
      return m;
    });

    // 直接上架选中时手工输入，未选中获取收货位
    state.formData.storageId = res.data.storageId;
    if (!state.formData.isOnShelve) {
      await getPositionList();
    } else {
      base.focus('orderCode');
    }
  } else {
    base.focus('orderCode');
  }
  // 获得合并项
  getSpanArr(base.state.tableData);
};

// 获得仓库和货位信息
const getPositionList = async () => {
  let url = '/basic/storage/position/getPositionList';
  let params = {
    storageId: state.formData.storageId,
    positionType: 4, // 4=收货位
  };
  const [err, res] = await to(postData(url, params));

  if (err) {
    base.focus('orderCode');
    return;
  }
  if (res.result) {
    state.positionList = res.data;
    if (state.positionList.length) {
      state.formData.positionName = state.positionList[0].positionName;
      // 明细设置默认货位
      base.state.tableData.forEach((row) => {
        row.positionName = state.formData.positionName;
      });
    }
  } else {
    state.positionList = [];
  }
  // 条码框获得焦点
  base.focus('orderCode');
};
// 判断扫描包装条码
const checkPackingBarcode = (evt: any) => {
  base.checkPackingProductModel(() => {
    if (state.formData.positionName) {
      base.state.currentRow!.positionName = state.formData.positionName;
    }
  });
};
// 扫描数量手工改变
// const changeScanQty=()=> {
// 	setScanQty();
// };
// 重置onReset
const onReset = () => {
  state.formData.orderCode = null;
  state.formData.orderId = 0;
  state.formData.isValidateProductCode = false;
  state.formData.isOnShelve = false;
  state.formData.positionName = '';
  state.formData.productModel = '';
  state.formData.scanQty = 0;

  base.state.tableData = [];
  proxy.$refs.orderCode.focus();
};

// 入库时保质期如果超过一定时长（可设定）需要预警提示是否入库
const saveCheck = async () => {
  if (!state.formData.orderCode) {
    proxy.$message.error('请扫描预到货单号！');
    proxy.$refs.orderCode.focus();
    base.playError(); // 播放声音
    return;
  }
  // 箱数*装箱数量不能大于到货数量
  let flag = false;
  state.originalTableData.forEach((v: any) => {
    let filterData = base.state.tableData.filter((a) => a.orderDetailId === v.orderDetailId);
    let allNum = 0;
    filterData.forEach((z) => {
      allNum += z.finishedQuantity * z.caseNum;
    });
    if (allNum > v.arriveQuantity) {
      flag = true;
    }
  });
  if (flag) {
    proxy.$message.error('箱数总和不能超过到货数量！');
    proxy.$refs.orderCode.focus();
    base.playError(); // 播放声音
    return;
  }
  // 提交时候将明细按箱数分开
  let dataList1 = base.state.tableData.filter((item) => {
    return item.caseNum === 1;
  });
  let dataList2 = base.state.tableData.filter((item) => {
    return item.caseNum !== 1;
  });
  for (let val of dataList2) {
    let datainfo = JSON.parse(JSON.stringify(val));
    let plateCode = datainfo.plateCode + '';
    let codeNum = 1;
    for (let i = 1; i <= datainfo.caseNum; i++) {
      datainfo = JSON.parse(JSON.stringify(datainfo));
      datainfo.plateCode = plateCode + '-' + codeNum;
      dataList1.push(datainfo);
      codeNum++;
    }
  }

  let dataList = dataList1
    .filter((item) => {
      return item.finishedQuantity > 0;
    })
    .map((rowData) => {
      let orderDetailId = rowData.orderDetailId;
      let orderId = rowData.orderId;
      let finishedQuantity = rowData.finishedQuantity;
      let plateCode = rowData.productModel;
      let positionName = rowData.positionName;
      return {
        orderDetailId: orderDetailId,
        orderId: orderId,
        finishedQuantity: finishedQuantity,
        plateCode: plateCode,
        positionName: positionName,
        singleSignCode: rowData.singleSignCode,
        productId: rowData.productId,
      };
    });

  if (!dataList.length) {
    proxy.$message.error('没有扫描可用的数据！');
    return;
  }

  if (!window.confirm('当前扫描要确认入库吗？')) return;

  // 此接口和一键入库同一个
  const url = '/inbound/in/inScanOrder/saveCheck';
  const params = {
    scanInType: 'PC_CASING_IN', // 标记为PC装箱入库
    orderId: state.formData.orderId,
    dataList: dataList.map((item: any) => {
      item.enterQuantity = item.finishedQuantity;
      item.produceDate = item.produceDate === 'Invalid date' ? '' : item.produceDate;
      delete item.waitPositionNames;
      return item;
    }),
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }
  if (res.result) {
    saveAndShelve();
  } else {
    checkIn(res.message);
  }
};
// 入库保质期超期，强行收货
const checkIn = (msg: any) => {
  proxy
    .$confirm(msg + ', 是否继续?', '提示', {
      confirmButtonText: '入库保质期超期，强行收货吗？',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(async () => {
      await saveAndShelve();
    })
    .catch(() => {
      proxy.$message.info('已取消');
    });
};

// 确认入库并自动生成上架单
const saveAndShelve = async () => {
  if (!state.formData.orderCode) {
    proxy.$message.error('请扫描预到货单号！');
    proxy.$refs.orderCode.focus();
    base.playError(); // 播放声音
    return;
  }

  let emptypositionName = base.state.tableData
    .filter((item) => {
      return !item.positionName;
    })
    .map((item) => {
      return item.productModel;
    });
  if (emptypositionName.length) {
    proxy.$message.error('条形码[' + emptypositionName.join(',') + ']货位不能为空！');
    base.playError(); // 播放声音
    return;
  }

  // 提交时候将明细按箱数分开
  let dataList1 = base.state.tableData.filter((item) => {
    return item.caseNum === 1;
  });
  let dataList2 = base.state.tableData.filter((item) => {
    return item.caseNum !== 1;
  });
  for (let val of dataList2) {
    let datainfo = JSON.parse(JSON.stringify(val));
    let plateCode = datainfo.plateCode + '';
    let codeNum = 1;
    for (let i = 1; i <= datainfo.caseNum; i++) {
      datainfo = JSON.parse(JSON.stringify(datainfo));
      datainfo.plateCode = plateCode + '-' + codeNum;
      dataList1.push(datainfo);
      codeNum++;
    }
  }

  let dataList = dataList1.filter((rowData) => rowData.finishedQuantity);
  if (!dataList.length) {
    proxy.$message.error('没有可提交的数据！');
    base.playError(); // 播放声音
    return;
  }
  state.formData.positionName = dataList[0].positionName;

  let url = '/inbound/in/inScanOrder/normalScanSave';
  let params = {
    scanInType: 'PC_CASING_IN', // PC装箱入库
    orderId: state.formData.orderId,
    orderCode: state.formData.orderCode,
    positionName: state.formData.positionName,
    onShelve: state.formData.isOnShelve,
    dataList: dataList,
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }
  proxy.common.showMsg(res);
  if (res.result) {
    onReset();
    base.play(); // 播放声音
  } else {
    base.playError(); // 播放声音
  }
};
// 收货位
const positionNameClick = (item: any) => {
  base.state.tableData.forEach((rowData) => {
    rowData.positionName = item.positionName;
  });
};
// 输入上架货位
const positionNameKeyup = (val: any) => {
  base.state.tableData.forEach((rowData) => {
    rowData.positionName = state.formData.positionName;
  });
  base.focus('productModel');
};

// 拆分弹框
const showSplitDialog = (row: any, index: number) => {
  state.formSplit.splitQty = 2;
  state.formSplit.boxQty = 0;
  state.formSplit.isOpenPackage = true;

  state.formSplit.row = row;
  state.formSplit.index = index;
};

// 拆分明细
const splitRow = () => {
  let { row, index, splitQty, boxQty } = state.formSplit;

  if (splitQty * boxQty - row.finishedQuantity >= boxQty) {
    proxy.$message.error('装箱数量过多');
    return;
  }
  // 判断拆箱时商品数量是否过少
  if (splitQty * boxQty < row.finishedQuantity) {
    proxy.$message.error('装箱数量不能少于当前装箱数量');
    return;
  }

  let qty = row.finishedQuantity - boxQty;
  for (let i = 0; i < splitQty - 1; i++) {
    const newRow = proxy.common.deepCopy(row);
    if (qty - boxQty >= 0) {
      newRow.finishedQuantity = boxQty;
    } else {
      newRow.finishedQuantity = qty;
    }
    qty = qty - boxQty;
    newRow.isMain = 0;
    newRow.plateCode = getPlateCode();
    base.state.tableData.splice(index, 0, newRow);
    // 获得合并项
    getSpanArr(base.state.tableData);
  }
  state.formSplit.isOpenPackage = false;
  row.finishedQuantity = boxQty;
  // row.finishedQuantity = 0;
  base.state.tableData.map((item) => {
    if (item.productModel === row.productModel) {
      item.disabled = false;
    }
    return item;
  });
};

const rowArriveQuantity = (currentValue: any, oldValue: any, row: any, index: number) => {
  let allNum = row.arriveQuantity;

  let proData = base.state.tableData.filter((v) => v.productModel === row.productModel);
  let qty = Math.floor(allNum / proData.length);
  let splitNum = 0;
  proData
    .filter((v) => !v.isMain)
    .forEach((row) => {
      row.enterQuantity = allNum;
      row.finishedQuantity = qty;
      splitNum += qty;
    });
  proData.find((v) => v.isMain).enterQuantity = allNum;
  proData.find((v) => v.isMain).finishedQuantity = allNum - splitNum;
};
// 删除明细
const deleteRow = (row: any, index: number) => {
  if (row.isMain) {
    proxy.$message.error('主商品不允许删除！');
    return;
  }
  const finishedQuantity = Number(row.finishedQuantity);
  const mainRow = base.state.tableData.find((item) => item.isMain && item.orderDetailId === row.orderDetailId);
  mainRow.finishedQuantity = Number(mainRow.finishedQuantity) + finishedQuantity;
  base.state.tableData.splice(index, 1);
  // 获得合并项
  getSpanArr(base.state.tableData);
};
// 改变数量
const rowChangeQty = (currentValue: any, oldValue: any, row: any, index: number) => {
  const qty = oldValue - currentValue;
  const mainRow = base.state.tableData.find((item) => item.isMain && item.orderDetailId === row.orderDetailId);
  mainRow.finishedQuantity += qty;
};
// 获得箱号
const getPlateCode = () => {
  const _tableData = proxy.common.deepCopy(base.state.tableData);

  let firstPlate = _tableData.sort((a: any, b: any) => (a.plateCode > b.plateCode ? 1 : -1))[base.state.tableData.length - 1].plateCode;
  let maxVal = 0;
  _tableData.forEach((v: any) => {
    if (v.plateCode.indexOf('-')) {
      let arr = v.plateCode.split('-');
      if (parseInt(arr[arr.length - 1]) > maxVal) {
        maxVal = parseInt(arr[arr.length - 1]);
        firstPlate = v.plateCode;
      }
    }
  });
  let index = 1;
  let plateCode = '';
  if (firstPlate.indexOf('-')) {
    const plateCodes = firstPlate.split('-');
    index = plateCodes[plateCodes.length - 1];
    index = parseInt('' + index) + 1;
    plateCode = plateCodes[0] + '-' + index;
  } else {
    plateCode = firstPlate + '-' + index;
  }
  return plateCode;
};
// 获得合并项
const getSpanArr = (data: any) => {
  state.spanArr = [];
  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      state.spanArr.push(1);
      state.pos = 0;
    } else {
      // 判断当前元素与上一个元素是否相同
      if (data[i].productModel === data[i - 1].productModel) {
        state.spanArr[state.pos] += 1;
        state.spanArr.push(0);
      } else {
        state.spanArr.push(1);
        state.pos = i;
      }
    }
  }
};
// 合并单元格
const objectSpanMethod = ({ row, column, rowIndex, columnIndex }: any) => {
  if (columnIndex === 1 || columnIndex === 2 || columnIndex === 3) {
    const _row = state.spanArr[rowIndex];
    const _col = _row > 0 ? 1 : 0;
    return {
      // [0,0] 表示这一行不显示， [2,1]表示行的合并数
      rowspan: _row,
      colspan: _col,
    };
  }
};
const getboxQty = () => {
  let row: any = state.formSplit.row;
  const qty = row.arriveQuantity / state.formSplit.splitQty;
  if (qty.toString().indexOf('.') > 0) {
    state.formSplit.boxQty = parseInt('' + qty) + 1;
  } else {
    state.formSplit.boxQty = qty;
  }
};
const updateBoxQty = (row: any) => {
  let disabledQty = 0;
  const splitList = base.state.tableData.filter((m) => m.productModel === row.productModel);
  splitList.forEach((m) => {
    if (m.disabled && m.plateCode !== row.plateCode) {
      disabledQty += parseInt(m.finishedQuantity);
    }
  });
  // 获取剩余的数量
  const qty = row.quantity - row.finishedQuantity - disabledQty;

  // 获取可输入的最大数
  const maxQty = row.quantity - (splitList.filter((m) => m.disabled === false).length - 1) - disabledQty;
  if (row.finishedQuantity <= 0) {
    proxy.$message.error('箱输入最小数为：1');
    return;
  }
  if (row.finishedQuantity > maxQty) {
    proxy.$message.error('箱输入最大数为：' + maxQty);
    row.finishedQuantity = maxQty;
    return;
  }
  let sxQty = qty;
  // 标识已经修改过的行
  splitList.forEach((f) => {
    if (f.plateCode === row.plateCode) {
      // this.$set(f, "disabled", true);
      f.disabled = true;
    }
  });
  const arr = splitList.filter((f) => f.plateCode !== row.plateCode && !f.disabled);
  let arrlen = arr.length;
  for (let i = 0; i < arr.length; i++) {
    if ((sxQty / arrlen).toString().indexOf('.') > 0) {
      arr[i].finishedQuantity = parseInt('' + sxQty / arrlen) + 1;
      sxQty = sxQty - (parseInt('' + sxQty / arrlen) + 1);
    } else {
      arr[i].finishedQuantity = parseInt('' + sxQty / arrlen);
      sxQty = sxQty - parseInt('' + sxQty / arrlen);
    }
    arrlen = arrlen - 1;
  }
};
</script>

<style lang="scss" scoped>
@import '/@/theme/scan.scss';
</style>
