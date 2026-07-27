<template>
  <div class="scan-container">
    <el-card class="scan-card">
      <template #header>
        <div class="clearfix">
          <span>{{ $tt('无单扫描入库') }}</span>
        </div>
      </template>
      <el-row>
        <el-col :xl="11" :md="14" :xs="24">
          <el-form ref="form" :model="state.formData" label-width="120px" class="scan-form">
            <el-form-item :label="$tt('仓库名称')">
              <el-select v-model="state.formData.storageId" :placeholder="$tt('请选择仓库')" class="input-300" @change="getPositionName()">
                <el-option v-for="item in state.storageNames" :key="item.storageId" :label="item.storageName" :value="item.storageId" @click="() => (state.formData.storageName = item.storageName)"></el-option>
              </el-select>
              <span class="sub-item">
                <span class="sub-label">{{ $tt('显示货主') }}：</span>
                <el-switch v-model="state.formData.showConsignorAndProvider" @change="onshowConsignorAndProvider"></el-switch>
              </span>
            </el-form-item>
            <el-form-item v-if="state.formData.showConsignorAndProvider" :label="$tt('货主名称')">
              <el-select v-model="state.formData.consignorId" :placeholder="$tt('请选择')" class="input-300" @change="(consignorId:any) => onchangeConsignor(consignorId)">
                <el-option v-for="(item, index) in state.consignorNames" :key="item.consignorId" :label="item.consignorName" :value="item.consignorId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="state.formData.showConsignorAndProvider" :label="$tt('供应商')">
              <el-select v-model="state.formData.providerId" :placeholder="$tt('请选择')" class="input-300" @change="(providerId:any) => onchangeProvider(providerId)">
                <el-option v-for="item in state.providerShortNames" :key="item.providerId" :label="item.providerShortName" :value="item.providerId"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item :label="$tt(state.formData.isOnShelve ? '上架货位' : '收货位')">
              <template v-if="config.noBillscan_positionName_text">
                <el-input ref="positionName" v-model="state.formData.positionName" class="input-300" autofocus :placeholder="$tt(state.formData.isOnShelve ? '上架货位' : '收货位')" @keyup.enter.stop="getPositionName()"></el-input>
              </template>
              <template v-else>
                <table-select ref="positionName" v-model="state.formData.positionName" :input-width="300" :table-data="state.positionList" :popover-width="300" :table-max-height="500" label-field="positionName" :label="$tt('货位名称')" @on-key-up="(ref:any, val:any, event:any, positionList:any) => onPositionKeyup(ref, val, event, positionList)">
                  <template #column>
                    <el-table-column property="positionName" :label="$tt('货位名称')" width="230"></el-table-column>
                  </template>
                </table-select>
              </template>
              <span class="sub-item">
                <span class="sub-label">{{ $tt('开启SN') }}：</span>
                <el-switch v-model="state.formData.isScanSn" @change="onIsScanSnChange"></el-switch>
                <span class="sub-label">{{ $tt('直接上架') }}：</span>
                <el-switch v-model="state.formData.isOnShelve" @change="onIsOnShelveChange"></el-switch>
              </span>
            </el-form-item>
            <el-form-item :label="$tt('商品条码')">
              <template v-if="config.noBillscan_productModel_text">
                <el-input ref="productModel" v-model="state.formData.productModel" autofocus class="input-300" @keyup.enter.stop="checkPackingBarcode"></el-input>
              </template>
              <template v-else>
                <table-select ref="productModel" v-model="state.formData.productModel" :input-width="300" :table-data="state.productDataList" :popover-width="600" :table-max-height="250" label-field="productName" :label="$tt('商品名称')" @on-key-up="(ref:any, val:any, event:any, productDataList:any) => onProductKeyup(ref, val, event, productDataList)" @on-row-click="(ref:any, rowData:any) =>onProductRowClick(ref, rowData)" @keyup.enter="checkPackingBarcode">
                  <template #column>
                    <el-table-column property="productName" :label="$tt('商品名称')"></el-table-column>
                    <el-table-column property="productCode" :label="$tt('编号')" width="100"></el-table-column>
                    <el-table-column property="productModel" :label="$tt('条码')" width="120"></el-table-column>
                    <el-table-column property="smallUnit" :label="$tt('单位')" width="60"></el-table-column>
                    <el-table-column property="purchasePrice" :label="$tt('成本价')" width="70"></el-table-column>
                    <el-table-column property="productSpec" :label="$tt('规格')" width="70"></el-table-column>
                  </template>
                </table-select>
              </template>
              <span class="sub-item">
                <span class="sub-label">{{ $tt('扫描数量') }}：</span>
                <el-input-number ref="scanQty" v-model="state.formData.scanQty" :min="1" class="input-100" controls-position="right" @change="base.setScanQty"></el-input-number>
              </span>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="noBillEnterSave">{{ $tt('确认入库') }}</el-button>
              <el-button @click="onReset">{{ $tt('重置') }}</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col v-if="state.formData.isScanSn" :xl="12" :md="10" :xs="24">
          <el-form ref="formSn" :model="state.formData" label-position="top" label-width="120px" class="scan-sn-form">
            <el-form-item :label="$tt('扫描SN')">
              <el-input ref="snList" v-model="state.formData.snList" type="textarea" :rows="6" class="input-500" @blur="base.scanSn()" @keyup.stop="base.scanSn()"></el-input>
              <div class="color-666">
                {{ $tt('SN条数') }}：
                <span>{{ state.formData.scanQty }}</span>
              </div>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="scan-card body-no-padding">
      <div class="clearfix">
        <span class="padding-top-10">{{ $tt('扫描结果') }}</span>
        <el-button link class="floatRight" @click="state.setting.visible = true">{{ $tt('字段设置') }}</el-button>
      </div>
      <el-table ref="scan-table" :data="base.state.tableData" :row-class-name="base.rowClass" stripe style="width: 100%" class="scan-table" @row-dblclick="base.setCurrent">
        <template v-for="(item, index) in state.setting.fields">
          <template v-if="'produceDate,limitDate'.indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width" :min-width="item.minWidth" header-align="center" align="center">
              <template #default="{ row }">
                <el-date-picker v-model="row[item.prop]" size="small" type="date" placeholder="选择日期" class="w-110" value-format="YYYY-MM-DD" @change="datePickerChange(row, item.prop)"></el-date-picker>
              </template>
            </el-table-column>
          </template>
          <template v-else-if="'productModel'.indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width" header-align="center" align="center">
              <template #default="{ row, $index }">
                <span class="txt">{{ row[item.prop] }}</span>
                <el-button link @click="handleDelete($index, row)">删</el-button>
              </template>
            </el-table-column>
          </template>
          <!--SN序列号-->
          <template v-else-if="'singleSignCode'.indexOf(item.prop) >= 0 && state.formData.isScanSn">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width" header-align="center" align="center">
              <template #default="{ row, col }">
                <span class="sn-text">{{ row.singleSignCode }}</span>
                <span class="sn-count">[{{ $tt('SN数') }}：{{ row.singleSignCode ? row.singleSignCode.split(',').length : 0 }}]</span>
              </template>
            </el-table-column>
          </template>
          <template v-else-if="'carrier_plate_number'.indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width" header-align="center" align="center">
              <template #default="{ row, col }">
                <template>
                  <el-input v-model="row[item.prop]" size="small" class="w-100pc" @keyup.enter.stop="getVehicleAccessInfo(row)"></el-input>
                </template>
              </template>
            </el-table-column>
          </template>
          <template v-else-if="'forkliftWorker'.indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width" header-align="center" align="center">
              <template #default="{ row }">
                <template>
                  <el-select v-model="row[item.prop]" multiple :placeholder="$tt('请选择')" class="w-130">
                    <el-option v-for="i in state.setting.forkliftWorkerList" :key="i.value01" :label="i.value01" :value="i.value01"></el-option>
                  </el-select>
                </template>
              </template>
            </el-table-column>
          </template>
          <template v-else>
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width" :min-width="item.minWidth" header-align="center" align="center">
              <template #default="{ row, column, $index }">
                <template v-if="item.type === 'input'">
                  <template v-if="['int', 'int32', 'int64'].indexOf(item.dataType) >= 0">
                    <el-input-number v-model.number="row[item.prop]" controls-position="right" size="small" class="w-100pc"></el-input-number>
                  </template>
                  <template v-else-if="['decimal', 'float', 'double'].indexOf(item.dataType) >= 0">
                    <el-input-number v-model="row[item.prop]" :precision="2" controls-position="right" size="small" class="w-100pc"></el-input-number>
                  </template>
                  <template v-else>
                    <el-input v-model="row[item.prop]" size="small" class="w-100pc"></el-input>
                  </template>
                </template>
                <template v-else-if="item.type === 'date'">
                  <el-date-picker v-model="row[item.prop]" size="small" type="date" :placeholder="$tt('选择日期')" class="w-110" value-format="YYYY-MM-DD"></el-date-picker>
                </template>
                <template v-else-if="item.type === 'select'">
                  <el-select v-model="row[item.prop]" :placeholder="$tt('请选择')" class="input-300">
                    <el-option v-for="m in item.options" :key="m.value" :label="m.label" :value="m.value"></el-option>
                  </el-select>
                </template>
                <template v-else>
                  {{ row[item.prop] }}
                </template>
              </template>
            </el-table-column>
          </template>
          <!-- <template v-else>
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width">
            </el-table-column>
          </template> -->
        </template>
      </el-table>
    </el-card>

    <el-dialog v-model:visible="state.dialogVisible" :title="$tt('选择SKU')" width="700px" append-to-body>
      <el-table :data="state.findProductList" class="scan-table" style="width: 100%" @row-click="rowClick" @row-dblclick="(row:any, column:any, event:any) => changeProduct(row)">
        <el-table-column prop="productCode" :label="$tt('商品编号')" width="180"></el-table-column>
        <el-table-column prop="productModel" :label="$tt('条码')" width="180"></el-table-column>
        <el-table-column prop="productName" :label="$tt('商品名称')"></el-table-column>
        <el-table-column prop="productSpec" :label="$tt('商品规格')"></el-table-column>
      </el-table>

      <template #footer>
        <span class="flex-end">
          <el-button @click="state.dialogVisible = false">{{ $tt('取消') }}</el-button>
          <el-button type="primary" @click="changeProduct(state.multiProductSelected)">{{ $tt('确定') }}</el-button>
        </span>
      </template>
    </el-dialog>
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

<script setup lang="ts" name="inbound-scan-noBillscan">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';
import { postData } from '/@/api/common/baseApi';
import to from 'await-to-js';
import moment from 'moment';
import scanHook from '/@/components/hooks/scanHook';
import { PositionTypeEnum } from '/@/enums/PositionTypeEnum';
const ScanSettingDialog = defineAsyncComponent(() => import('/@/components/common/components/scanSettingDialog.vue'));
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

const config = ref({
  // 自动生成上架单
  in_generateShelve: true,
  // 是否启用装箱操作
  in_caseNumber: false,
  // 支持一品多码
  sku_productToMultiBarcode: true,
  // /收货位下拉框改为输入框
  noBillscan_positionName_text: false,
  // 商品条码下拉框改为输入框
  noBillscan_productModel_text: false,
});

// 判断所有条码是否存在
const checkProductModelExist = (productModel: any, rowData: any) => {
  let isExists = false;
  if (!productModel || !rowData) {
    return false;
  }

  isExists = productModel === rowData.productCode || productModel === rowData.productModel || productModel === rowData.relationCode || productModel === rowData.relationCode2 || productModel === rowData.relationCode3 || productModel === rowData.relationCode4 || productModel === rowData.relationCode5 || productModel === rowData.middleBarcode || productModel === rowData.singleSignCode || productModel === rowData.bigBarcode;

  const isExistPosition = state.formData.positionName === rowData.positionName;

  const isExistBatchNumber = rowData.batchNumber === undefined;

  // 条码和货位同时存在
  return isExists && isExistPosition && isExistBatchNumber;
};

const base = scanHook({
  config,
  checkProductModelExist,
});

//#region 定义变量
const state = reactive({
  formData: {
    ...toRefs(base.state.formData),
    positionName: '', // 货位id
    providerId: undefined as number | undefined,
    providerCode: '',
    providerShortName: '',
    showConsignorAndProvider: false,
  },
  // 配置参数
  config: config.value,
  tableDataSKU: [{}],
  positionName: null,
  // 供应商
  providerShortNames: [] as any[],
  // 货主
  consignorNames: [] as any[],
  // 仓库
  storageNames: [] as any[],
  // 收货位候选项
  positionList: [] as any[],
  dialogVisible: false,
  // SKU列表
  findProductList: [] as any[],
  // 是否弹出一码多品
  isMultiRows: false,

  // 商品下拉框数据
  productDataList: [] as any[],
  // 多个商品时需要选择一个商品
  multiProductSelected: {},
  // 扫描列设置对话框参数
  setting: {
    visible: false,
    name: 'scan-purchase-noBillscan',
    fields: [
      {
        prop: 'productModel',
        label: '条形码',
        visible: true,
        width: 140,
        order: 1,
        minWidth: 100,
        dataType: 'string',
        type: 'none',
        options: [] as any[],
      },
      {
        prop: 'finishedQuantity',
        label: '已扫描数量',
        visible: true,
        width: 100,
        order: 4,
        dataType: 'int',
      },
      {
        prop: 'positionName',
        label: '收货位',
        visible: true,
        width: 120,
        order: 8,
        dataType: 'string',
      },
      {
        prop: 'produceDate',
        label: '生产日期',
        visible: true,
        width: 140,
        order: 9,
        dataType: 'string',
      },
      {
        prop: 'limitDate',
        label: '到期日期',
        visible: false,
        width: 130,
        order: 10,
        dataType: 'string',
      },
      {
        prop: 'batchNumber',
        label: '批次号',
        visible: true,
        width: 120,
        order: 6,
        type: 'input',
        dataType: 'string',
      },
      {
        prop: 'productCode',
        label: '商品编号',
        visible: false,
        width: 130,
        order: 6,
        dataType: 'string',
      },
      {
        prop: 'smallUnit',
        label: '单位',
        visible: true,
        width: 80,
        order: 7,
        dataType: 'string',
      },
      {
        prop: 'purchasePrice',
        label: '单价',
        visible: false,
        width: 80,
        order: 11,
        dataType: 'string',
      },
      {
        prop: 'singleSignCode',
        label: '序列号(SN)',
        visible: true,
        width: 180,
        order: 8,
        dataType: 'string',
      },
      {
        prop: 'productSpec',
        label: '商品规格',
        visible: true,
        width: 100,
        order: 12,
        dataType: 'string',
      },
      {
        prop: 'weight',
        label: '单位毛重',
        visible: false,
        width: 100,
        order: 13,
        dataType: 'decimal',
      },
      {
        prop: 'scanWeight',
        label: '已扫重量',
        visible: false,
        width: 100,
        order: 15,
        dataType: 'decimal',
      },
      {
        prop: 'productName',
        label: '商品名称',
        visible: true,
        width: undefined,
        order: 16,
        dataType: 'string',
      },
    ],
    forkliftWorkerList: [] as any[],
  },
  initLoading: false,
  searchHandle: 0 as unknown as NodeJS.Timeout,
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
  }

  loadProductInfo();
  // 获取扫描数据列表
  // getScanColumnData(219, 'app扫描UI');
  await getStorageList();
  await getConsignorList();
  await getProvider();
  // 获取下拉框值
  // await dropdownStore.loadDropDownById([1094]);
  // state.setting.forkliftWorkerList = dropdownStore.getDropdown(1094)?.value || [];

  // 开启SN扫描
  const isScanSn = localStorage['isScanSn'];
  if (isScanSn) {
    state.formData.isScanSn = isScanSn === 'true';
  }
  // 显示货主
  const showConsignorAndProvider = localStorage['showConsignorAndProvider'];
  if (showConsignorAndProvider) {
    state.formData.showConsignorAndProvider = showConsignorAndProvider === 'true';
  }
  // 字段设置/供应商
  const setting = localStorage[state.setting.name + '-setting'];
  if (setting) {
    state.setting.fields = JSON.parse(setting);
  }
});

// 获取供应商列表
const getProvider = async () => {
  const url = '/basic/product/provider/getList';
  const params = {};
  const [err, res] = await to(postData(url, params, false));
  if (res?.result) {
    state.providerShortNames = res.data;
  }
};

// 获取仓库
const getStorageList = async () => {
  const url = '/basic/storage/storage/getList';
  const params = {};
  const [err, res] = await to(postData(url, params, false));
  if (res?.result) {
    state.storageNames = res.data;
  }
};

// 获取货主名称下拉框
const getConsignorList = async () => {
  const url = '/basic/base/consignor/getList';
  const params = {};
  const [err, res] = await to(postData(url, params, false));
  if (res?.result) {
    state.consignorNames = res.data;
  }
};
// 获取货位名称
const getPositionName = async (val?: string) => {
  const url = '/basic/storage/position/getList';
  const params = {
    storageId: state.formData.storageId,
    name: val,
    positionType: state.formData.isOnShelve ? PositionTypeEnum.NORMAL : PositionTypeEnum.RECEIVING,
  };
  const [err, res] = await to(postData(url, params, false));
  if (res?.result) {
    state.positionList = res.data;
  }

  if (state.config.noBillscan_positionName_text) {
    base.focus('productModel');
  }
};
// 判断扫描包装条码
const checkPackingBarcode = (evt: any) => {
  base.checkPackingProductModel(base.state.tableData, null, getProductInfo);
};
// 获取商品信息
const getProductInfo = async () => {
  let productModel = state.formData.productModel; // masterData.productModel;
  if (!productModel) {
    proxy.$message.error('条码不能为空！');
    return true;
  }
  const url = '/basic/product/product/getList';
  const params = {
    name: productModel,
    searchFields: '*',
  };
  const [err, res] = await to(postData(url, params));
  if (res?.result) {
    state.findProductList = res.data;
    if (res.data.length === 1) {
      changeProduct(res.data[0]);
    } else {
      state.isMultiRows = true;
      state.dialogVisible = true;
    }
    base.focus('productModel');
  } else {
    base.playError(); // 播放声音
  }
  return true;
};
// 选中行
const rowClick = (row: any, column: any, event: any) => {
  state.multiProductSelected = row;
};
// 选择商品
const changeProduct = (row: any) => {
  state.dialogVisible = false;
  let positionName = state.formData.positionName;
  let productModel = state.formData.productModel;
  let count = 1;
  for (let index in state.findProductList) {
    if (state.findProductList[index].productId === row.productId) {
      base.state.currentRow = state.findProductList[index];
      break;
    }
  }
  if (!base.state.currentRow) {
    return;
  }

  if (base.state.currentRow.middleBarcode === productModel) {
    // 中包装条码
    count = base.state.currentRow.middleUnitConvert;
  } else if (base.state.currentRow.bigBarcode === productModel) {
    // 大包装条码
    count = base.state.currentRow.unitConvert;
  }
  base.state.currentRow.positionName = positionName;
  base.state.currentRow.finishedQuantity = count;
  base.state.currentRow.scanWeight = count * base.state.currentRow!.weight;
  base.state.tableData[base.state.tableData.length] = base.state.currentRow;
  base.state.existRows.push(base.state.currentRow);
  sortRow();
};
// 排序高亮行靠前
const sortRow = () => {
  base.state.tableData.forEach((element: any) => {
    element.sortIndex = 0;
  });
  base.state.currentRow!.sortIndex = 1;
  base.state.tableData = base.state.tableData.sort(function (a, b) {
    return b.sortIndex - a.sortIndex;
  });
  base.state.tableData.forEach((element) => {
    element.sortIndex = 0;
  });
};
// 确认入库
const noBillEnterSave = async () => {
  let emptyPositionName = base.state.tableData.filter((item) => item.productId && item.finishedQuantity > 0 && !item.positionName);
  if (emptyPositionName.length) {
    proxy.$message.error('条形码[' + emptyPositionName.join(',') + ']货位不能为空！');
    base.playError(); // 播放声音
    return;
  }

  let dataList = base.state.tableData.filter((item) => item.productId && item.finishedQuantity > 0);
  if (dataList.length === 0) {
    proxy.$message.error('至少录入一条数据');
    return;
  }
  let url = '/inbound/in/inScanOrder/noBillEnterSave';
  let params = {
    scanInType: 'PC_NO_BILL_IN', // 标记无单扫描入库
    ...state.formData,
    onShelve: state.formData.isOnShelve,
    dataList: dataList,
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }
  if (res?.result) {
    proxy.common.showMsg(res);
    onReset();
    base.play(); // 播放声音
  } else {
    base.playError(); // 播放声音
  }
};
const onReset = () => {
  state.formData.storageId = undefined;
  state.formData.storageName = '';
  state.formData.positionName = '';
  state.formData.consignorId = undefined;
  state.formData.consignorCode = '';
  state.formData.consignorCode = '';
  state.formData.consignorName = '';
  state.formData.productModel = '';
  state.formData.scanQty = 0;
  state.formData.providerId = undefined;
  state.formData.providerShortName = '';

  base.state.tableData = [];
  state.formData.snList = '';
};

// 直接上架设置
const onIsOnShelveChange = () => {
  localStorage['isOnShelve'] = state.formData.isOnShelve;
  const detailField = state.setting.fields.find((item) => item.prop === 'positionName');
  detailField!.label = state.formData.isOnShelve ? '上架货位' : '收货位';
  state.formData.positionName = '';
  getPositionName();
};

// 开启SN
const onIsScanSnChange = () => {
  localStorage['isScanSn'] = state.formData.isScanSn;
  base.state.tableData.forEach((row: any) => {
    // 非SN操作，清空条码信息
    if (state.formData.isScanSn) {
      row.singleSignCode = row.singleSignCodeOrigin;
    } else {
      row.singleSignCode = '';
    }
  });
};
const onshowConsignorAndProvider = () => {
  localStorage['showConsignorAndProvider'] = state.formData.showConsignorAndProvider;
};
/** ***************************************
 *  商品
 ** ***************************************/
// 商品名称下拉框输入改变后
const onProductKeyup = (ref: any, val: any, event: any, productDataList: any) => {
  if (!val) {
    productDataList = [];
    return;
  }
  clearTimeout(state.searchHandle);
  state.searchHandle = setTimeout(() => {
    loadProductInfo(val);
  }, 800);
};
// 商品名称下拉框输入改变后
const onPositionKeyup = (ref: any, val: any, event: any, positionList: any) => {
  if (!val) {
    positionList = [];
    return;
  }
  clearTimeout(state.searchHandle);
  state.searchHandle = setTimeout(() => {
    getPositionName(val);
  }, 800);
};
// 根据类别获取商品信息
const loadProductInfo = async (val?: string) => {
  const url = '/basic/product/product/getList';
  const params = {
    name: val,
    searchFields: 'productId,productCode,productName,productModel,productSpec,purchasePrice,smallUnit',
  };
  const [err, res] = await to(postData(url, params));
  if (res?.result) {
    state.productDataList = res.data.map((item: any) => {
      item.purchasePrice = Number(item.purchasePrice);
      return item;
    });
  }
};

// 商品名称下拉框行数据单击事件
const onProductRowClick = (ref: any, rowData: any) => {
  if (base.state.currentRow) {
    base.state.currentRow!.unFinishedQuantity = undefined; // 清空未扫描数量，无单扫描不需要
  }
  state.formData.productModel = rowData.productModel;
  base.checkPackingProductModel(base.state.tableData, null, getProductInfo);
};
const handleDelete = (index: any, row: any) => {
  // 删除行数
  base.state.tableData.splice(index, 1);
};
const getVehicleAccessInfo = async (row: any) => {
  const url = '/api/inbound/inScan/getVehicleAccessInfo';
  const params = {
    truckNumber: row.carrier_plate_number,
  };
  const [err, res] = await to(postData(url, params));
  if (res?.result) {
    proxy.common.showMsg(res);
    row.carrier_driver_name = res.data.carrier_driver_name; // 承运车辆驾驶员姓名
    row.carrier_driver_idcard = res.data.carrier_driver_idcard; // 承运车辆驾驶员身份证号
    row.escort = res.data.escort; // 押运员姓名
    row.escort_idcard = res.data.escort_idcard; // 押运员身份证号
    const expandFields = JSON.parse(res.data.expandFields);
    row.carrier_name = expandFields.carrierName; // 承运商
    row.way_bill_code = expandFields.way_bill_code;
  }
};

// 选择货主
const onchangeConsignor = (consignorId: number) => {
  let item = state.consignorNames.find((item) => item.consignorId === consignorId);
  if (item) {
    state.formData.consignorCode = item.consignorCode;
    state.formData.consignorName = item.consignorName;
  }
};

// 选择供应商
const onchangeProvider = (providerId: number) => {
  let item = state.providerShortNames.find((item) => item.providerId === providerId);
  if (item) {
    state.formData.providerCode = item.providerCode;
    state.formData.providerShortName = item.providerShortName;
  }
};

const datePickerChange = (row: any, prop: any) => {
  if (prop === 'produceDate') {
    const limitDate = moment(row.produceDate).add(row.shelfLifeDay, 'days').format('YYYY-MM-DD');
    row.limitDate = limitDate;
  }
};
</script>

<style lang="scss" scoped>
@import '/@/theme/scan.scss';
</style>
