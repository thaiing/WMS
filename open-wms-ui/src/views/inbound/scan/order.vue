<template>
  <div class="scan-container">
    <el-card class="scan-card">
      <template #header>
        <div class="clearfix">
          <span>{{ $tt('按单扫描入库') }}</span>
        </div>
      </template>
      <el-row>
        <el-col :xl="11" :md="14" :xs="24">
          <el-form ref="form" :model="state.formData" label-width="120px" class="scan-form">
            <el-form-item :label="$tt('扫描单号')">
              <el-input ref="orderCode" v-model="state.formData.orderCode" class="input-300" autofocus :placeholder="$tt('预到货单号/来源单号')" @keyup.enter.stop="getData" @focus="base.focus('orderCode')"></el-input>
              <span class="sub-item">
                <span class="sub-label">{{ $tt('商品校验') }}：</span>
                <el-switch v-model="state.formData.isValidateProductCode" @change="onIsValidateProductCodeChange"></el-switch>
              </span>
              <span class="sub-item">
                <span class="sub-label">{{ $tt('开启SN') }}：</span>
                <el-switch v-model="state.formData.isScanSn" @change="onIsScanSnChange"></el-switch>
              </span>
            </el-form-item>
            <el-form-item :label="state.formData.isOnShelve ? $tt('上架货位') : $tt('收货位')">
              <el-input v-if="state.formData.isOnShelve" ref="positionName" v-model="state.formData.positionName" :placeholder="$tt('请输入上架货位')" class="input-300" @keyup.enter="positionNameKeyup" @focus="base.focus('positionName')">
                <template #suffix>
                  <SvgIcon name="icon-iconfontcolor32" size="15" class="cursor-pointer mr-10" @click="base.showPositionSelector" />
                </template>
              </el-input>
              <el-select v-else ref="positionName" v-model="state.formData.positionName" :placeholder="$tt('请选择收货位')" class="input-300">
                <el-option v-for="(item, index) in state.positionList" :key="index" :label="item.positionName" :value="item.positionName" @click="positionNameClick(item)"></el-option>
              </el-select>
              <span class="sub-item">
                <span class="sub-label">{{ $tt('直接上架') }}：</span>
                <el-switch v-model="state.formData.isOnShelve" @change="onIsOnShelveChange"></el-switch>
              </span>
            </el-form-item>
            <el-form-item :label="$tt('商品条码')">
              <el-input ref="productModel" v-model="state.formData.productModel" :disabled="!state.formData.isValidateProductCode" class="input-300" @keyup.enter.stop="checkPackingBarcode" @focus="base.focus('productModel')"></el-input>
              <span v-if="!state.formData.isScanSn" class="sub-item">
                <span class="sub-label">{{ $tt('扫描数量') }}：</span>
                <!-- :min="1" -->
                <el-input-number ref="scanQty" v-model.number="state.formData.scanQty" :min="0" :disabled="!state.formData.isValidateProductCode" class="input-100" controls-position="right" @change="base.setScanQty"></el-input-number>
              </span>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveCheck">{{ $tt('确认入库') }}</el-button>
              <el-button @click="onReset">{{ $tt('重置') }}</el-button>
              <!-- <el-button type="primary" @click="showSerialDialog">序列号录入</el-button> -->
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
          <el-form ref="formSn" :model="state.formData" label-position="top" label-width="120px" class="scan-sn-form">
            <el-form-item :label="$tt('核验SN列表')">
              <el-input ref="checkSnList" v-model="state.formData.checkSnList" type="textarea" :disabled="true" :rows="6" class="input-500" @blur="base.scanSn()" @keyup.stop="base.scanSn"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="scan-card body-no-padding mt-10">
      <template #header>
        <div class="clearfix">
          <span class="padding-top-10">{{ $tt('扫描结果') }}</span>
          <el-button link class="floatRight" @click="state.setting.visible = true">{{ $tt('字段设置') }}</el-button>
        </div>
      </template>
      <el-table ref="scan-table" :data="base.state.tableData" :row-class-name="base.rowClass" size="small" stripe style="width: 100%" class="scan-table" @row-dblclick="base.setCurrent" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <template v-for="(item, index) in state.setting.fields">
          <template v-if="['unFinishedQuantity', 'finishedQuantity'].indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width" :min-width="item.minWidth" header-align="center" align="center">
              <template #default="{ row }">
                <template v-if="!state.formData.isValidateProductCode">
                  <el-input-number v-model="row[item.prop]" :min="0" :max="row['quantity']" size="small" class="w-100pc" controls-position="right" @change="base.rowChangeQty(item.prop, row, 'quantity')"></el-input-number>
                </template>
                <template v-else>
                  {{ row[item.prop] }}
                </template>
              </template>
            </el-table-column>
          </template>
          <template v-else-if="['positionName'].indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width" header-align="center" align="center">
              <template #default="{ row }">
                <input-select ref="positionName" v-model="row.positionName" :options="row.waitPositionNames" label="货位" input-width="110px" trigger="click" size="small" @on-item-click="(ref:any, data:any)=>elDropdownSelect(row, data)" @on-row-change="(ref:any, data:any)=>elDropdownChange(row, data)" @on-key-up="(ref:any, data:any)=>elDropdownKeyup(row, data)"></input-select>
              </template>
            </el-table-column>
          </template>
          <template v-else-if="'scanWeight,batchNumber,defectiveQty,parcelQuantity'.indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width" :min-width="item.minWidth" header-align="center" align="center">
              <template #default="{ row }">
                <el-input v-model="row[item.prop]" size="small" class="w-100pc" @change="base.calculateAverageWeight(item.prop, row)"></el-input>
              </template>
            </el-table-column>
          </template>
          <template v-else-if="'carrier_plate_number'.indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width" header-align="center" align="center">
              <template #default="scope">
                <el-input v-model="scope.row[item.prop]" size="small" class="w-100pc" @keyup.enter.stop="getVehicleAccessInfo(scope.row)"></el-input>
              </template>
            </el-table-column>
          </template>
          <template v-else-if="'produceDate,limitDate'.indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width" :min-width="item.minWidth" header-align="center" align="center">
              <template #default="{ row }">
                <el-date-picker v-model="row[item.prop]" size="small" type="date" placeholder="选择日期" class="w-110" value-format="YYYY-MM-DD" @change="datePickerChange(row, item.prop)"></el-date-picker>
              </template>
            </el-table-column>
          </template>
          <!--SN序列号-->
          <template v-else-if="'singleSignCode'.indexOf(item.prop) >= 0 && state.formData.isScanSn">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width" :min-width="item.minWidth" header-align="center" align="center">
              <template #default="{ row }">
                <span class="sn-text">{{ row.singleSignCode }}</span>
                <span class="sn-count">[SN数：{{ row.singleSignCode ? row.singleSignCode.split(',').length : 0 }}]</span>
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
                  <el-date-picker v-model="row[item.prop]" size="small" type="date" placeholder="选择日期" class="w-110" value-format="YYYY-MM-DD"></el-date-picker>
                </template>
                <template v-else-if="item.type === 'select'">
                  <el-select v-model="row[item.prop]" placeholder="请选择" class="input-300">
                    <el-option v-for="(m, index) in item.options" :key="m.value" :label="m.label" :value="m.value"></el-option>
                  </el-select>
                </template>
                <template v-else>
                  {{ row[item.prop] }}
                </template>
              </template>
            </el-table-column>
          </template>
        </template>
        <el-table-column fixed="right" :label="$tt('操作')" width="100">
          <template #default="{ row, $index }">
            <el-button link size="small" @click="splitShow(row, $index)">{{ $tt('拆分') }}</el-button>
            <el-button link size="small" @click="deleteRow(row, $index)">{{ $tt('删除') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <scan-setting-dialog ref="setting-dialog" v-model:visible="state.setting.visible" :fields="state.setting.fields" :name="state.setting.name" @field-change="fieldChange"></scan-setting-dialog>
    <!-- 拆分序列号录入对话框 -->
    <el-dialog draggable v-model:visible="state.singleSignCodeVisible" width="560px" :title="$tt('序列号录入')" append-to-body>
      <el-form label-width="100px" class="position-config">
        <el-form-item :label="$tt('序列号:')">
          <el-input v-model="state.singleSignCodeText" type="textarea" :rows="5" :placeholder="$tt('请输入内容')"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="state.singleSignCodeVisible = false">{{ $tt('取 消') }}</el-button>
        <el-button type="primary">{{ $tt('确 定') }}</el-button>
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

    <!-- 货位选择器 -->
    <yrt-selector ref="selector-dialog" :config="base.state.positionSelector" v-model:visible="base.state.positionSelector.visible" @on-selected="(rows:any[])=>base.onPositionSelected(rows, 'productModel')"></yrt-selector>
  </div>
</template>

<script setup lang="ts" name="inbound-scan-order">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';
import { getPositionList, postData } from '/@/api/common/baseApi';
import to from 'await-to-js';
import moment from 'moment';
import scanHook from '/@/components/hooks/scanHook';
import { AxiosResponse, FailedResult } from 'axios';
import { ResultEnum } from '/@/enums/httpEnum';
const ScanSettingDialog = defineAsyncComponent(() => import('/@/components/common/components/scanSettingDialog.vue'));
const InputSelect = defineAsyncComponent(() => import('/@/components/base/InputSelect.vue'));
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

const config = ref({
  // 自动生成上架单
  in_generateShelve: true,
  // 是否启用装箱操作
  in_caseNumber: false,
  // 支持一品多码
  sku_productToMultiBarcode: true,
  // 同商品同条码存在多条时默认选中第一条
  global_scanSameProductCodeAndModel: false,
});

const base = scanHook({ config });

//#region 定义变量
const state = reactive({
  // 拆分序列号值
  singleSignCodeText: '',
  // 显示拆分序列号
  singleSignCodeVisible: false,
  // 收货位候选项
  positionList: [] as any[],
  // 配置参数
  config: config.value,
  // 扫描列设置对话框参数
  setting: {
    visible: false,
    name: 'inbound-order-scan',
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
        prop: 'quantity',
        label: '清单数量',
        visible: true,
        width: 80,
        order: 2,
      },
      {
        prop: 'enterQuantity',
        label: '已入库数量',
        visible: true,
        width: 90,
        order: 3,
      },
      {
        prop: 'finishedQuantity',
        label: '已扫描数量',
        visible: true,
        width: 90,
        order: 4,
      },
      {
        prop: 'unFinishedQuantity',
        label: '未扫描数量',
        visible: true,
        width: 90,
        order: 5,
      },
      {
        prop: 'productCode',
        label: '商品编号',
        visible: false,
        width: 130,
        order: 6,
      },
      {
        prop: 'smallUnit',
        label: '单位',
        visible: true,
        width: 50,
        order: 7,
      },
      {
        prop: 'singleSignCode',
        label: '序列号(SN)',
        visible: true,
        width: 180,
        order: 8,
      },
      {
        prop: 'positionName',
        label: '收货位',
        visible: true,
        width: 130,
        order: 8,
      },
      {
        prop: 'produceDate',
        label: '生产日期',
        visible: true,
        width: 130,
        order: 9,
      },
      {
        prop: 'limitDate',
        label: '到期日期',
        visible: false,
        width: 130,
        order: 10,
      },
      {
        prop: 'purchasePrice',
        label: '单价',
        visible: false,
        width: 80,
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
        prop: 'defectiveQty',
        label: '次品数量',
        visible: true,
        width: 80,
        order: 12,
      },
      {
        prop: 'batchNumber',
        label: '批次号',
        visible: true,
        width: 180,
        order: 13,
      },
      {
        prop: 'weight',
        label: '单位毛重',
        visible: false,
        width: 80,
        order: 14,
      },
      {
        prop: 'totalWeight',
        label: '合计重量',
        visible: false,
        width: 80,
        order: 15,
      },
      {
        prop: 'scanWeight',
        label: '已扫重量',
        visible: false,
        width: 80,
        order: 16,
      },
      {
        prop: 'parcelQuantity',
        label: '包数',
        visible: true,
        width: 80,
        order: 17,
      },
      {
        prop: 'parcelAverageWeight',
        label: '均重',
        visible: true,
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
    orginFields: [] as any[], // 记录原始列
  },
  formData: {
    ...toRefs(base.state.formData),

    orderId: 0,
    orderCode: '',
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
  }
  const detailField = state.setting.fields.find((item: any) => item.prop === 'positionName');
  detailField!.label = state.formData.isOnShelve ? '上架货位' : '收货位';

  // 校验商品
  const isValidateProductCode = localStorage['isValidateProductCode'];
  if (isValidateProductCode) {
    state.formData.isValidateProductCode = isValidateProductCode === 'true';
  }

  // 开启SN扫描
  const isScanSn = localStorage['isScanSn'];
  if (isScanSn) {
    state.formData.isScanSn = isScanSn === 'true';
  }

  state.setting.orginFields = state.setting.fields; // 备份原始列
  fieldChange();
});
//#endregion

const fieldChange = () => {
  // 字段设置
  const setting = localStorage[state.setting.name + '-setting'];
  if (setting) {
    state.setting.fields = JSON.parse(setting);
  } else {
    state.setting.fields = state.setting.orginFields;
  }
};

// 拆分弹框
const splitShow = (row: any, index: any) => {
  const qty = 2;
  proxy
    .$prompt('请输入拆分数量', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputValue: qty.toString(),
    })
    .then(({ value }) => {
      if (value > row.unFinishedQuantity) {
        proxy.$message.error('拆分行数不能大于当前行数量！');
        return false;
      }
      splitRow2(row, index, Number(value));
    })
    .catch(() => {});
};

// 拆分明细
const splitRow2 = (row: any, index: any, value: any) => {
  var allNum = row.arriveQuantity;
  const newRow = proxy.common.deepCopy(row);
  newRow.unFinishedQuantity = value;
  newRow.quantity = value;
  newRow.arriveQuantity = value;
  newRow.validQuantity = value;
  newRow.isMain = 0;
  newRow.finishedQuantity = 0;
  base.state.tableData.splice(index + 1, 0, newRow);

  row.unFinishedQuantity = allNum - value - row.finishedQuantity;
  row.quantity = allNum - value;
  row.validQuantity = allNum - value;
  row.arriveQuantity = allNum - value;
};

// 显示拆分序列号窗口
const showSerialDialog = () => {
  if (!base.state.multipleSelection.length) {
    proxy.$message.error('至少勾选一项');
    return;
  }
  state.singleSignCodeVisible = true;
};

// 删除明细
const deleteRow = (row: any, index: any) => {
  if (row.isMain) {
    proxy.$message.error('主商品不允许删除！');
    return;
  }
  const arriveQuantity = row.arriveQuantity;
  const mainRow = base.state.tableData.find((item) => item.isMain && item.orderList_Id === row.orderList_Id);
  // mainRow.finishedQuantity = 0;
  mainRow.arriveQuantity += Number(arriveQuantity);
  mainRow.unFinishedQuantity += Number(arriveQuantity);
  mainRow.quantity += Number(arriveQuantity);
  mainRow.validQuantity += Number(arriveQuantity);
  base.state.tableData.splice(index, 1);
};

// 商品校验设置
const onIsValidateProductCodeChange = () => {
  localStorage['isValidateProductCode'] = state.formData.isValidateProductCode;
  base.state.tableData.forEach((row) => {
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
const onIsOnShelveChange = () => {
  localStorage['isOnShelve'] = state.formData.isOnShelve;
  const detailField = state.setting.fields.find((item) => item.prop === 'positionName');
  detailField!.label = state.formData.isOnShelve ? '上架货位' : '收货位';
};

// 开启SN
const onIsScanSnChange = () => {
  localStorage['isScanSn'] = state.formData.isScanSn;
  // base.state.tableData.forEach(row => {
  //   // 非SN操作，清空条码信息
  //   if (state.formData.isScanSn) {
  //     row.singleSignCode = row.singleSignCodeOrigin;
  //   } else {
  //     row.singleSignCode = "";
  //   }
  // });
};

// 获得明细数据
const getData = async () => {
  base.state.currentRow = null;
  base.state.tableData = [];
  var orderCode = state.formData.orderCode;
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
    state.formData.productModel = '';
    state.formData.scanQty = 0;
    state.formData.orderId = res.data.orderId;
    state.formData.storageId = res.data.storageId;
    state.formData.storageName = res.data.storageName;

    base.state.tableData = res.data.orderList.map((row: any) => {
      row.quantity = Math.Round(row.quantity, 4);
      row.enterQuantity = Math.Round(row.enterQuantity, 4);

      row.unFinishedQuantity = Math.Round(row.quantity - (row.enterQuantity || 0), 4);
      row.arriveQuantity = Math.Round(row.quantity - (row.enterQuantity || 0), 4);
      row.finishedQuantity = 0;
      row.sortIndex = 0;
      row.scanWeight = 0;
      row.isMain = 1; // 用于拆分，是否为源数据
      row.singleSignCodeOrigin = row.singleSignCode; // 备份源SN
      row.validQuantity = row.unFinishedQuantity; // 原始可扫描数量
      row.isManageSn = Number(row.isManageSn);
      // row.produceDate = moment(row.produceDate).format("YYYY-MM-DD");
      if (row.produceDate) {
        row.produceDate = moment(row.produceDate).format('YYYY-MM-DD');
      } else {
        row.produceDate = null;
      }
      // 清空条码信息
      row.singleSignCode = '';
      row.waitPositionNames = [];
      if (typeof row.expandFields === 'string') {
        row.expandFields = JSON.parse(row.expandFields);
        row = Object.assign(row, row.expandFields);
      }

      return row;
    });
    if (!state.formData.isValidateProductCode) {
      base.state.tableData.forEach((row) => {
        row.finishedQuantity = Math.Round(row.unFinishedQuantity, 4);
        row.scanWeight = row.totalWeight;
        row.unFinishedQuantity = 0;
      });
    }
    if (!state.formData.isOnShelve) {
      await getPositionList(state, base);
    } else {
      base.focus('positionName');
    }
  } else {
    base.focus('orderCode');
  }
};

// 判断扫描包装条码
const checkPackingBarcode = (evt: any) => {
  base.checkPackingProductModel(() => {
    if (state.formData.positionName) {
      base.state.currentRow!.positionName = state.formData.positionName;
    }
  });
  if (base.state.currentRow) {
    const sn = base.state.currentRow.singleSignCodeOrigin;
    let snList = [];
    if (sn) {
      snList = sn.split(',');
    }
    let validSnList = snList.filter((item: any) => item); // 有效SN
    validSnList = validSnList.map((item: any) => item.trim());
    validSnList.push('');
    state.formData.checkSnList = validSnList.join('\n');
  }
  if (base.state.currentRow!.isManageSn) {
    const productId = base.state.currentRow!.productId;
    base.state.tableData.forEach((row) => {
      row.sortIndex = 0;
      if (row.productId === productId) {
        row.sortIndex = 1;
      }
    });
    // 置顶排序
    base.state.tableData.sort(function (a, b) {
      return b.sortIndex - a.sortIndex;
    });
  }
};

// 重置onReset
const onReset = () => {
  state.formData.scanQty = 0;
  state.formData.orderCode = '';
  state.formData.positionName = '';
  state.formData.productModel = '';
  state.formData.snList = '';
  state.formData.checkSnList = '';

  base.state.tableData = [];
  proxy.$refs.orderCode.focus();
};

// 入库时保质期如果超过一定时长（可设定）需要预警提示是否入库
const saveCheck = async () => {
  if (!state.formData.orderCode) {
    proxy.$message.error('请扫描预到货单号！');
    base.focus('orderCode');
    base.playError(); // 播放声音
    return;
  }

  const dataList = proxy.common.deepCopy(
    base.state.tableData.filter((item) => {
      return item.finishedQuantity > 0;
    })
  );

  if (!dataList.length) {
    proxy.$message.error('没有扫描可用的数据！');
    return;
  }
  const items = dataList.filter((item: any) => item.isManageSn && !item.singleSignCode).map((item: any) => item.productModel);
  if (items.length) {
    proxy.$message.error(`条码为【${items.join(',')}】需要验证SN`);
    return;
  }

  proxy
    .$confirm('当前扫描要确认入库吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(async () => {
      await confirm();
    })
    .catch(() => {
      proxy.$message.info('已取消');
    });

  const confirm = async () => {
    // 此接口和一键入库同一个
    const url = '/inbound/in/inScanOrder/saveCheck';
    const params = {
      scanInType: 'PC_RECEIVE_IN', // 标记为PC常规扫描入库
      orderId: state.formData.orderId,
      dataList: dataList.map((item: any) => {
        item.productId = item.productId;
        item.enterQuantity = item.finishedQuantity;
        item.produceDate = item.produceDate === 'Invalid date' ? '' : item.produceDate;
        delete item.waitPositionNames;
        return item;
      }),
    };
    const [err, res] = await to<AxiosResponse<any, any>, FailedResult>(postData(url, params));
    if (err) {
      await continueSubmit(err.code, err.message);

      return;
    }
    if (res.result) {
      await normalScanSave();
    }
  };
};

// 入库保质期超期，强行收货
const continueSubmit = async (code: number, msg: string) => {
  if (code !== ResultEnum.WARN) return;

  proxy
    .$confirm(msg, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(async () => {
      await normalScanSave();
    })
    .catch(() => {
      proxy.$message.info('已取消');
    });
};

const handleSelectionChange = (val: Array<any>) => {
  base.state.multipleSelection = val;
};

// 确认入库并自动生成上架单
const normalScanSave = async () => {
  if (!state.formData.orderCode) {
    proxy.$message.error('请扫描预到货单号！');
    proxy.$refs.orderCode.focus();
    base.playError(); // 播放声音
    return;
  }

  var emptypositionName = base.state.tableData
    .filter((item) => {
      return !item.positionName && item.finishedQuantity > 0;
    })
    .map((item) => {
      return item.productModel;
    });
  if (emptypositionName.length) {
    proxy.$message.error('条形码[' + emptypositionName.join(',') + ']货位不能为空！ ');
    base.playError(); // 播放声音
    return;
  }

  var dataList = proxy.common.deepCopy(base.state.tableData.filter((rowData) => rowData.finishedQuantity));
  if (!dataList.length) {
    proxy.$message.error('没有可提交的数据！');
    base.playError(); // 播放声音
    return;
  }
  // dataList = dataList.map((item: any) => {
  //   const expandFields: EmptyObjectType = {};
  //   state.setting.fields.forEach((f: any) => {
  //     if (f.isExpandField) {
  //       expandFields[f.prop] = item[f.prop];
  //     }
  //   });
  //   item.expandFields = expandFields;
  //   delete item.waitPositionNames;
  //   return item;
  // });
  state.formData.positionName = dataList[0].positionName;
  var url = '/inbound/in/inScanOrder/normalScanSave';
  var params = {
    scanInType: 'PC_RECEIVE_IN', // 标记为PC常规扫描入库
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
  }
};

// 收货位
const positionNameClick = (item: any) => {
  const positionName = item.name;
  base.state.tableData.forEach((rowData) => {
    rowData.positionName = positionName;
  });
};

// 输入上架货位
const positionNameKeyup = (val: any) => {
  base.focus('productModel');
};

const getVehicleAccessInfo = async (row: any) => {
  const url = '/api/inbound/inScanOrder/getVehicleAccessInfo';
  const params = {
    truckNumber: row.carrier_plate_number,
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    proxy.$message.error(err.message);
    return;
  }
  proxy.common.showMsg(res);
  if (res.result) {
    const expandFields = JSON.parse(res.data.expandFields);

    row.warehouse_type = 1;
    row.carrier_driver_name = res.data.carrier_driver_name;
    row.carrier_driver_idcard = res.data.carrier_driver_idcard;
    row.escort = res.data.escort;
    row.escort_idcard = res.data.escort_idcard;
    row.carrier_name = res.data.carrierName;
    row.way_bill_code = res.data.way_bill_code;
    row.report_time = new Date();
  }
};

const elDropdownSelect = (row: any, data: any) => {
  row.positionName = data;
};

const elDropdownChange = (row: any, data: any) => {
  row.positionName = data;
};

const elDropdownKeyup = async (row: any, val: any) => {
  try {
    if (!val) {
      row.waitPositionNames = [];
      return;
    }
    const url = '/basic/storage/position/getPositionList';
    const params = {
      storageId: state.formData.storageId,
      name: val,
      isOnShelve: state.formData.isOnShelve,
      positionTypes: '13,12,8,1,2,14', //存储货位,高架货位,次品货位,常规货位,残品货位,临期货位
    };
    const [err, res] = await to(postData(url, params));
    if (err) {
      return;
    }
    if (res.result) {
      row.waitPositionNames = res.data.map((m: any) => {
        m.value = m.positionName;
        m.label = m.positionName;
        return m;
      });
    }
  } catch (error: any) {
    proxy.$message.error(error.message);
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
