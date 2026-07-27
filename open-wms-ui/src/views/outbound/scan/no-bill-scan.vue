<template>
  <div class="scan-container">
    <el-card class="scan-card">
      <template #header>
        <div class="clearfix">
          <span>{{ $tt('无单扫描出库（支持无出库单，商品条码扫描直接出库）') }}</span>
        </div>
      </template>
      <el-form ref="form" :model="state.formData" label-width="120px" class="scan-form">
        <el-form-item :label="$tt('所属仓库')">
          <el-select v-model="state.formData.storageId" :placeholder="$tt('请选择')" class="input-300" @change="changeStorage">
            <el-option v-for="item in state.storageNames" :key="item.storageId" :label="item.storageName" :value="item.storageId"></el-option>
          </el-select>
          <span class="sub-item">
            <span class="sub-label">{{ $tt('显示货主') }}：</span>
            <el-switch v-model="state.formData.showConsignor" @change="onshowConsignorAndProvider"></el-switch>
          </span>
        </el-form-item>
        <template v-if="state.formData.showConsignor">
          <el-form-item :label="$tt('货主名称')">
            <el-select v-model="state.formData.consignorId" :placeholder="$tt('请选择')" class="input-300" @change="currentConsignorNames">
              <el-option v-for="item in state.consignorNames" :key="item.consignorId" :label="item.consignorName" :value="item.consignorId"></el-option>
            </el-select>
          </el-form-item>
        </template>

        <el-form-item :label="$tt('出库货位')">
          <template v-if="config.out_noBillScan_positionName_text">
            <el-input ref="positionName" v-model="state.formData.positionName" class="input-300" @keyup.enter="base.focus('productModel')"></el-input>
          </template>
          <template v-else>
            <table-select ref="positionName" v-model="state.formData.positionName" :input-width="300" :table-data="state.positionList" :popover-width="300" :table-max-height="500" label-field="positionName" :label="$tt('出库货位')" @on-key-up="(ref:any, val:any, event:any, positionList:any) => onPositionKeyup(ref, val, event, positionList)" @on-row-change="(ref:any, rowData:any) => onPositionRowChange(ref, rowData, state.formData)">
              <template #column>
                <el-table-column property="positionName" :label="$tt('出库货位')" width="230"></el-table-column>
              </template>
            </table-select>
          </template>
        </el-form-item>
        <el-form-item :label="$tt('商品条码')">
          <template v-if="config.out_noBillScan_productModel_text">
            <el-input ref="productModel" v-model="state.formData.productModel" autofocus class="input-300" @keyup.enter.stop="checkPackingBarcode"></el-input>
          </template>
          <template v-else>
            <table-select ref="productModel" v-model="state.formData.productModel" :input-width="300" :table-data="state.productDataList" :popover-width="600" :table-max-height="250" label-field="productModel" :label="$tt('商品名称')" trigger="focus" @on-key-up="(ref:any, val:any, event:any, productDataList:any) => onProductKeyup(ref, val, event, productDataList)" @on-key-down="(ref:any, val:any, event:any, productDataList:any) => onProductKeydown(ref, val, event, productDataList)" @on-row-click="(ref:any, rowData:any) => checkPackingBarcode(rowData)" @keyup.enter="checkPackingBarcode">
              <template #column>
                <el-table-column property="productName" :label="$tt('商品名称')" width="200"></el-table-column>
                <el-table-column property="productModel" :label="$tt('条码')" width="120"></el-table-column>
                <el-table-column property="salePrice" :label="$tt('售价')" width="80"></el-table-column>
                <el-table-column property="productSpec" :label="$tt('规格')" width="70"></el-table-column>
                <el-table-column property="validStorage" :label="$tt('有效库存')" width="80"></el-table-column>
              </template>
            </table-select>
          </template>
          <span class="sub-item">
            <span class="sub-label">{{ $tt('扫描数量') }}：</span>
            <!-- :min="1" -->
            <el-input-number ref="scanQty" v-model="state.formData.scanQty" class="input-100" controls-position="right" @change="base.setScanQty"></el-input-number>
          </span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveCheck">{{ $tt('确认出库') }}</el-button>
          <el-button @click="onReset">{{ $tt('重置') }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="scan-card body-no-padding mt-5">
      <template #header>
        <div class="clearfix">
          <span class="padding-top-10">{{ $tt('扫描结果') }}</span>
          <el-button link class="floatRight" @click="state.setting.visible = true">{{ $tt('字段设置') }}</el-button>
        </div>
      </template>
      <el-table ref="scan-table" :data="base.state.tableData" :row-class-name="base.rowClass" stripe style="width: 100%" class="scan-table" size="small" @row-dblclick="base.setCurrent">
        <template v-for="(item, index) in state.setting.fields">
          <template v-if="'productModel'.indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width">
              <template #common-column-slot="{ row, col }">
                <span class="txt">{{ row[item.prop] }}</span>
                <el-button link @click="handleDelete(row)">{{ $tt('删') }}</el-button>
              </template>
            </el-table-column>
          </template>
          <template v-else-if="'carrier_plate_number'.indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width">
              <template #common-column-slot="{ row, col }">
                <template>
                  <el-input v-model="row[item.prop]" size="small" class="w-100pc" @keyup.enter.stop="getVehicleAccessInfo(row)"></el-input>
                </template>
              </template>
            </el-table-column>
          </template>
          <template v-else-if="'forkliftWorker'.indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width">
              <template #common-column-slot="{ row, col }">
                <template>
                  <el-select v-model="row[item.prop]" multiple :placeholder="$tt('请选择')" class="w-130">
                    <el-option v-for="i in state.setting.forkliftWorkerList" :key="i.value01" :label="i.value01" :value="i.value01"></el-option>
                  </el-select>
                </template>
              </template>
            </el-table-column>
          </template>
          <template v-else-if="['finishedQuantity'].indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width">
              <template #common-column-slot="{ row, col }">
                <template v-if="!state.formData.isValidateProductCode">
                  <el-input-number v-model="row[item.prop]" :min="0" size="small" class="w-100pc" controls-position="right" @change="base.rowChangeQty(item.prop, row)"></el-input-number>
                </template>
                <template v-else>
                  {{ row[item.prop] }}
                </template>
              </template>
            </el-table-column>
          </template>
          <template v-else-if="'scanWeight'.indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width">
              <template #common-column-slot="{ row, col }">
                <template>
                  <el-input v-model="row[item.prop]" size="small" class="w-100pc"></el-input>
                </template>
              </template>
            </el-table-column>
          </template>
          <template v-else>
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width" :min-width="item.minWidth">
              <template #common-slot-scope="{ row, column, $index }">
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

<script setup lang="ts" name="inbound-scan-order">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';
import { postData } from '/@/api/common/baseApi';
import to from 'await-to-js';
import useDropdownStore from '/@/stores/modules/dropdown';
import scanHook from '/@/components/hooks/scanHook';
import { PositionTypeEnum } from '/@/enums/PositionTypeEnum';
const ScanSettingDialog = defineAsyncComponent(() => import('/@/components/common/components/scanSettingDialog.vue'));
const InputSelect = defineAsyncComponent(() => import('/@/components/base/InputSelect.vue'));
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
const dropdownStore = useDropdownStore();

//#region 配置参数
const config = ref({
  // 是否启用装箱操作
  in_caseNumber: false,
  // 支持一品多码
  sku_productToMultiBarcode: true,
  // 出库货位下拉框改为输入框
  out_noBillScan_positionName_text: true,
  // 商品条码下拉框改为输入框
  out_noBillScan_productModel_text: true,
});
//#endregion

const base = scanHook({ config });

//#region 定义变量
const state = reactive({
  // 配置参数
  config: config.value,
  formData: {
    ...toRefs(base.state.formData),
    orderCode: null,
    positionName: '',
    showConsignor: false, // 显示货主
  },
  // 货主
  consignorNames: [] as any[],
  // 仓库
  storageNames: [] as any[],
  // 明细数据
  tableData: [] as any[],
  // 仓库信息
  storageInfo: {},
  // 当前正在扫描的数据  {}
  currentRow: null,
  // 已经找到的数据
  existRows: [],
  // 装箱方式：0：常规扫描，1：一品一箱，2：多品一箱
  caseMode: 0,
  // 一次扫描的数量
  scanCount: 1,
  // 装箱新增行
  caseNewRows: [],
  // 扫描列设置对话框参数
  setting: {
    visible: false,
    name: 'scan-purchase-order',
    fields: [
      {
        prop: 'productModel',
        label: '条形码',
        visible: true,
        width: 130,
        order: 1,
        minWidth: 100,
        dataType: 'string',
        type: 'none',
        options: [] as any[],
      },
      {
        prop: 'validStorage',
        label: '有效库存量',
        visible: true,
        width: 90,
        order: 2,
      },
      {
        prop: 'finishedQuantity',
        label: '已扫描数量',
        visible: true,
        width: 90,
        order: 3,
      },
      {
        prop: 'productCode',
        label: '商品编号',
        visible: false,
        width: 130,
        order: 4,
      },
      {
        prop: 'positionName',
        label: '出库货位',
        visible: true,
        width: 120,
        order: 5,
      },
      {
        prop: 'produceDate',
        label: '生产日期',
        visible: true,
        width: 130,
        order: 6,
      },

      {
        prop: 'salePrice',
        label: '销售价',
        visible: true,
        width: 110,
        order: 7,
      },
      {
        prop: 'batchNumber',
        label: '批次号',
        visible: false,
        width: 120,
        order: 8,
      },
      {
        prop: 'productSpec',
        label: '商品规格',
        visible: true,
        width: 110,
        order: 9,
      },
      {
        prop: 'weight',
        label: '单位毛重',
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
        order: 16,
      },
    ],
    forkliftWorkerList: [] as any,
  },
  // 收货位候选项
  positionList: [],
  // 商品下拉框数据
  productDataList: [],
  searchHandle: 0 as unknown as NodeJS.Timeout,
});
//#endregion

//#region onMounted
onMounted(async () => {
  getStorageList();
  getConsignorList();
  // 获取下拉框值
  await dropdownStore.loadDropDownById([1094]);
  state.setting.forkliftWorkerList = dropdownStore.getDropdown(1094)?.value || [];

  // 字段设置
  const setting = localStorage[state.setting.name + '-setting'];
  if (setting) {
    state.setting.fields = JSON.parse(setting);
  }
  // 显示货主
  const showConsignor = localStorage['showConsignor'];
  if (showConsignor) {
    state.formData.showConsignor = showConsignor === 'true';
  }
});
//#endregion

// 获取仓库
const getStorageList = async () => {
  const url = '/basic/storage/storage/getList';
  const params = {};
  const [err, res] = await to(postData(url, params));
  if (res?.result) {
    state.storageNames = res.data;
  }
};
// 获取货主名称下拉框
const getConsignorList = async () => {
  const url = '/basic/base/consignor/getList';
  const params = {};
  const [err, res] = await to(postData(url, params));
  if (res?.result) {
    state.consignorNames = res.data;
  }
};
const onshowConsignorAndProvider = () => {
  localStorage['showConsignor'] = state.formData.showConsignor;
};
// 判断扫描包装条码
const checkPackingBarcode = (rowData: any) => {
  base.checkPackingProductModel(base.state.tableData, null, () => {
    rowData.finishedQuantity = 0;
    base.state.tableData.push(rowData);
    state.formData.productModel = rowData.productModel;
    base.state.currentRow = rowData;
    base.state.existRows.push(base.state.currentRow);
  });
};
// 选择货主之后找值
const currentConsignorNames = (value: any) => {
  state.consignorNames.forEach((item) => {
    if (item.consignorId === value) {
      state.formData.consignorCode = item.consignorCode;
      state.formData.consignorName = item.consignorName;
    }
  });
};
// 选择仓库之后找值
const changeStorage = async (value: any) => {
  state.storageNames.forEach((item) => {
    if (item.storageId === value) {
      state.formData.storageName = item.storageName;
    }
  });
  state.formData.positionName = '';
  await getPositionName();
  await loadProductInfo();
};
// 确认出库判断
const saveCheck = async () => {
  var storageId = state.formData.storageId;
  if (!storageId) {
    proxy.$message.error('请选择仓库！');
    return false;
  }

  const dataList = base.state.tableData.filter((item: any) => item.finishedQuantity > 0);
  var emptyPositionName = dataList
    .filter((item) => !item.positionName)
    .map((item) => item.productModel)
    .join(',');

  if (emptyPositionName) {
    proxy.$message.error('条形码[' + emptyPositionName + ']货位不能为空！');
    return;
  }
  if (!dataList.length) {
    proxy.$message.error('请扫描需要出库的商品！');
    return;
  }
  const url = '/outbound/out/outScanOrder/noBillOutSave';
  const params = {
    scanInType: 'PC_NO_BILL_OUT', // 标记无单扫描出库
    ...state.formData,
    dataList: dataList,
  };
  const [err, res] = await to(postData(url, params));
  if (res?.result) {
    proxy.common.showMsg(res);
    onReset();
  }
};
// 重置onReset
const onReset = () => {
  state.formData.orderCode = null;
  state.formData.positionName = '';
  state.formData.productModel = '';
  state.formData.scanQty = 0;
  state.formData.consignorId = undefined;
  state.formData.consignorCode = '';
  state.formData.consignorName = '';
  state.formData.storageId = undefined; // 仓库id
  state.formData.storageName = ''; // 仓库名称
  base.state.tableData = [];
  base.state.currentRow = null;
};
const getPositionName = async (val?: string) => {
  const url = '/basic/storage/position/getList';

  const params = {
    storageId: state.formData.storageId,
    name: val,
    positionType: PositionTypeEnum.NORMAL, // 上架货位
  };
  const [err, res] = await to(postData(url, params, false));
  if (res?.result) {
    state.positionList = res.data;
  }
};
// 货位下拉框输入改变后
const onPositionKeyup = (ref: any, val: any, event: any, positionList: any) => {
  if (!val) {
    positionList = [];
    return;
  }
  clearTimeout(state.searchHandle);
  state.searchHandle = setTimeout(() => {
    getPositionName(val);
    loadProductInfo();
  }, 800);
};
// 商品名称下拉框输入改变后
const onProductKeyup = (ref: any, val: any, event: any, productDataList: any) => {
  if (!val) {
    productDataList = [];
    return;
  }
  clearTimeout(state.searchHandle);
  state.searchHandle = setTimeout(() => {
    loadProductInfo();
  }, 800);
};
const onProductKeydown = (ref: any, val: any, event: any, productDataList: any) => {
  // tab keycode
  if (event.keyCode === 9 && proxy.$refs['productModel'].getCurrrentIndex() < 0) {
    proxy.$refs['productModel'].setCurrentIndex(0);
  } else {
    const index = proxy.$refs['productModel'].getCurrrentIndex();
    proxy.$refs['productModel'].setCurrentIndex(index);
  }
};
const onPositionRowChange = (ref: any, rowData: any, scopeRow: any) => {
  loadProductInfo();
};
// 根据类别获取商品信息
const loadProductInfo = async (productModel?: string) => {
  const url = '/outbound/out/outScanOrder/getNoBillProduct';
  const params = {
    storageId: state.formData.storageId,
    positionName: state.formData.positionName,
    productModel: productModel,
  };
  const [err, res] = await to(postData(url, params));

  if (res?.result) {
    state.productDataList = res.data.map((item: any) => {
      item.purchasePrice = Number(item.purchasePrice);
      item.salePrice = Number(item.salePrice);
      item.validStorage = Number(item.validStorage);
      item.finishedQuantity = 0;
      return item;
    });
  }
};
const handleDelete = (index: any) => {
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
    const expandFields = JSON.parse(res.data.expandFields);
    base.state.currentRow = row;
    base.state.currentRow!.carrier_name = expandFields.carrierName;
    base.state.currentRow!.carrier_driver_name = res.data.carrier_driver_name;
    base.state.currentRow!.carrier_driver_idcard = res.data.carrier_driver_idcard;
    base.state.currentRow!.escort = res.data.escort;
    base.state.currentRow!.escort_idcard = res.data.escort_idcard;
    base.state.currentRow!.way_bill_code = expandFields.way_bill_code;
  }
};
</script>

<style lang="scss" scoped>
@import '/@/theme/scan.scss';
.txt {
  margin-right: 5px;
}
</style>
