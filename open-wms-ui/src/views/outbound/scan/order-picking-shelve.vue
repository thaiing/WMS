<template>
  <div class="scan-container">
    <el-card class="scan-card">
      <template #header>
        <div class="clearfix">
          <span>{{ $tt('出库下架回拣（对下架的商品重新上架操作）') }}</span>
        </div>
      </template>
      <el-row>
        <el-col :xl="11" :md="14" :xs="24">
          <el-form ref="form" :model="state.formData" label-width="120px" class="scan-form">
            <el-form-item :label="$tt('仓库')">
              <el-select v-model="state.formData.storageId" :placeholder="$tt('请选择仓库')" class="input-120" @change="changeStorage">
                <el-option v-for="(item, index) in state.storageNames" :key="index" :label="item.storageName" :value="item.storageId"></el-option>
              </el-select>
              <span class="sub-item">
                <span class="sub-label">{{ $tt('理货位') }}：</span>
                <el-select ref="positionName" v-model="state.formData.positionName" :placeholder="$tt('选择理货位')" class="input-120">
                  <el-option v-for="(item, index) in state.positionList" :key="index" :label="item.positionName" :value="item.positionName"></el-option>
                </el-select>
              </span>
              <span class="sub-item">
                <span class="sub-label">{{ $tt('开启SN') }}：</span>
                <el-switch v-model="state.formData.isScanSn" @change="onIsScanSnChange"></el-switch>
              </span>
            </el-form-item>
            <el-form-item :label="$tt('上架货位')">
              <el-input ref="targetPositionName" v-model="state.formData.targetPositionName" class="input-120" @keydown.enter="shelvePositionEnter"></el-input>
              <span class="sub-item">
                <span class="sub-label">{{ $tt('扫描数量') }}：</span>
                <el-input-number ref="scanQty" v-model="state.formData.scanQty" :min="0" controls-position="right" class="input-120" @change="base.setScanQty"></el-input-number>
              </span>
            </el-form-item>
            <el-form-item :label="$tt('商品条码')">
              <el-input ref="productModel" v-model="state.formData.productModel" class="input-325" @keyup.enter.stop="checkPackingBarcode"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="btnSave">{{ $tt('确认上架') }}</el-button>
              <el-button @click="onReset">{{ $tt('重置') }}</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col v-if="state.formData.isScanSn" :xl="12" :md="10" :xs="24">
          <el-form ref="formSn" :model="state.formData" label-position="top" label-width="120px" class="scan-sn-form">
            <el-form-item :label="$tt('扫描SN')">
              <el-input ref="snList" v-model="state.formData.snList" type="textarea" :rows="6" class="input-500" @blur="base.scanSn()" @keyup.enter.stop="base.scanSn()"></el-input>
              <div class="color-666">
                {{ $tt('SN条数') }}：
                <span>{{ state.formData.scanQty }}</span>
              </div>
            </el-form-item>
          </el-form>
          <el-form ref="formSn" :model="state.formData" label-position="top" label-width="120px" class="scan-sn-form">
            <el-form-item :label="$tt('核验SN列表（拣货SN）')">
              <el-input ref="checkSnList" v-model="state.formData.checkSnList" type="textarea" :disabled="true" :rows="6" class="input-500"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="scan-card body-no-padding mt-10">
      <template #header>
        <span class="padding-top-10">{{ $tt('扫描结果') }}</span>
        <el-button link class="floatRight" @click="state.setting.visible = true">{{ $tt('字段设置') }}</el-button>
      </template>
      <el-table ref="scan-table" :row-class-name="base.rowClass" :data="base.state.tableData" stripe style="width: 100%" class="scan-table" size="small" @row-dblclick="base.setCurrent">
        <template v-for="(item, index) in state.setting.fields">
          <template v-if="'targetPositionName,scanWeight'.indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width">
              <template #default="{ row }">
                <el-input v-model="row[item.prop]" size="small" class="w-100pc"></el-input>
              </template>
            </el-table-column>
          </template>
          <template v-else-if="'produceDate,limitDate'.indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width">
              <template #default="{ row }">
                {{ common.formatDate(row[item.prop], 'YYYY-MM-DD') }}
              </template>
            </el-table-column>
          </template>
          <!--SN序列号-->
          <template v-else-if="'singleSignCode'.indexOf(item.prop) >= 0 && state.formData.isScanSn">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width">
              <template #default="{ row }">
                <span class="sn-text">{{ row.singleSignCode }}</span>
                <span class="sn-count">[{{ $tt('SN数') }}：{{ row.singleSignCode ? row.singleSignCode.split(',').length : 0 }}]</span>
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

<script setup lang="ts" name="inbound-scan-order">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
import { postData } from '/@/api/common/baseApi';
import to from 'await-to-js';
import scanHook from '/@/components/hooks/scanHook';
import { PositionTypeEnum } from '/@/enums/PositionTypeEnum';
const ScanSettingDialog = defineAsyncComponent(() => import('/@/components/common/components/scanSettingDialog.vue'));
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

//#region 配置参数
const config = ref({
  // 支持一品多码
  sku_productToMultiBarcode: true,
});
//#endregion

const base = scanHook({
  config,
});

//#region 定义变量
const state = reactive({
  formData: {
    ...toRefs(base.state.formData),
    targetPositionName: '', // 上架货位
    isCheckProductModel: true,
  },
  // 仓库
  storageNames: [] as any[],
  // 理货位
  positionList: [] as any[],
  // 扫描列设置对话框参数
  setting: {
    visible: false,
    name: 'outbound-scan-order-picking-shelve',
    fields: [
      {
        prop: 'productModel',
        label: '条形码',
        visible: true,
        width: 130,
        order: 1,
      },
      {
        prop: 'finishedQuantity',
        label: '已扫描数量',
        visible: true,
        width: 90,
        order: 2,
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
        visible: false,
        width: 130,
        order: 3,
      },
      {
        prop: 'positionName',
        label: '收货位',
        visible: true,
        width: 100,
        order: 4,
      },
      {
        prop: 'targetPositionName',
        label: '上架货位',
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
        prop: 'singleSignCode',
        label: '序列号(SN)',
        visible: true,
        width: 180,
        order: 8,
      },
      {
        prop: 'purchasePrice',
        label: '成本价',
        visible: true,
        width: 90,
        order: 8,
      },
      {
        prop: 'batchNumber',
        label: '批次号',
        visible: true,
        width: 100,
        order: 9,
      },
      {
        prop: 'productSpec',
        label: '商品规格',
        visible: true,
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
        prop: 'rowWeight',
        label: '小计重量',
        visible: false,
        width: 80,
        order: 12,
      },
      {
        prop: 'scanWeight',
        label: '已扫重量',
        visible: false,
        width: 80,
        order: 13,
      },
      {
        prop: 'productName',
        label: '商品名称',
        visible: true,
        minWidth: 200,
        order: 14,
      },
    ],
  },
});
//#endregion

//#region onMounted
onMounted(async () => {
  // 字段设置
  const setting = localStorage[state.setting.name + '-setting'];
  if (setting) {
    state.setting.fields = JSON.parse(setting);
  }
  const isScanSn = localStorage['isScanSn'];
  if (isScanSn) {
    state.formData.isScanSn = isScanSn === 'true';
  }
  getStorageList();
});
//#endregion

// 获取仓库数据
const getStorageList = async () => {
  const url = '/basic/storage/storage/getList';
  const params = {};
  const [err, res] = await to(postData(url, params));
  if (res?.result) {
    state.storageNames = res.data;
  }
};
// 获取理货位
const changeStorage = async (value: any) => {
  state.storageNames.forEach((item) => {
    if (item.storageId === value) {
      state.formData.storageName = item.storageName;
    }
  });
  await getPositionName();
};
const getPositionName = async (val?: string) => {
  state.formData.positionName = '';
  const url = '/basic/storage/position/getList';
  const params = {
    storageId: state.formData.storageId,
    name: val,
    positionType: PositionTypeEnum.UNLOADING, // 下架理货位
  };
  const [err, res] = await to(postData(url, params, false));
  if (res?.result) {
    state.positionList = res.data;
  }
  if (state.positionList.length) {
    state.formData.positionName = state.positionList[0].positionName;
  }
};
// 判断扫描包装条码
const checkPackingBarcode = (evt: any) => {
  base.checkPackingProductModel(base.state.tableData, null, getProductInfo);
};
// 获取商品信息
const getProductInfo = async () => {
  var storageId = state.formData.storageId; // 仓库
  var positionName = state.formData.positionName; // 理货位
  var productModel = state.formData.productModel; // 商品条码
  var targetPositionName = state.formData.targetPositionName.trim(); // 上架货位
  if (!positionName) {
    proxy.$message.error('理货位不能为空！');
    return;
  }
  if (!targetPositionName) {
    proxy.$message.error('上架货位不能为空！');
    return;
  }
  if (!productModel) {
    proxy.$message.error('条码不能为空！');
    return;
  }
  if (base.state.tableData.some((s) => s.productModel === productModel)) return;
  var url = '/outbound/out/outScanPicking/getOffPositionShelveData';
  var params = {
    storageId: storageId,
    positionName: positionName,
    productModel: productModel,
  };
  const [err, res] = await to(postData(url, params));
  if (res?.result) {
    // 修改货位
    var dataRows = res.data;
    if (dataRows.length > 0) {
      createRow(dataRows[0], res, productModel, targetPositionName);
    } else {
      proxy.$message.error('条码不存在，扫描失败！');
      return;
    }
  }
};
const createRow = (row: any, res: any, productModel: any, targetPositionName: any) => {
  base.state.tableData = res.data.map((row: any) => {
    row.validStorage = Number(row.validStorage);
    row.finishedQuantity = 0;
    row.quantity = row.validStorage;
    row.validQuantity = row.validStorage; // 原始可扫描数量
    row.targetPositionName = targetPositionName;
    row.singleSignCodeOrigin = row.singleSignCode; // 备份源SN
    row.singleSignCode = '';
    row.unFinishedQuantity = row.validStorage;

    return row;
  });
  base.state.currentRow = base.state.tableData[0];
  base.state.existRows = [base.state.currentRow] as any;
  if (base.state.currentRow) {
    state.formData.scanQty = base.state.currentRow.finishedQuantity;

    const sn = base.state.currentRow.singleSignCodeOrigin;
    let snList = [];
    if (sn) {
      snList = sn.split(',');
    }
    let validSnList = snList.filter((item: any) => item); // 有效SN
    validSnList = validSnList.map((item: any) => item.trim());
    validSnList.push('');
    state.formData.checkSnList = validSnList.join('\n');

    // 判断是否开启SN扫描
    state.formData.isScanSn = !!Number(base.state.currentRow.isManageSn);
  }
};
// 确认上架
const btnSave = async () => {
  var emptyPositionName = base.state.tableData
    .filter((item) => {
      return !item.positionName;
    })
    .map((item) => {
      return item.productModel;
    })
    .join(',');

  if (emptyPositionName) {
    proxy.$message.error('条形码[' + emptyPositionName + ']货位不能为空！');
    return;
  }
  var shelvePositionList = base.state.tableData.filter((item) => {
    return !item.targetPositionName;
  });
  if (shelvePositionList.length) {
    proxy.$message.error('上架货位不能为空');
    return;
  }

  var url = '/outbound/out/outScanPicking/saveOffPositionShelveData';
  var params = {
    transferType: 'PC_PICKING_SHELVE', // PC下架回拣
    storageId: state.formData.storageId,
    storageName: state.formData.storageName,
    dataList: base.state.tableData,
  };
  const [err, res] = await to(postData(url, params));
  if (res?.result) {
    continueScan();
  }
};
// 重置
const onReset = () => {
  state.formData = {
    storageId: null,
    targetPositionName: '',
    isCheckProductModel: true,
    productModel: '',
    scanQty: 0,
  } as any;
  base.state.tableData = [];
  // 当前正在扫描的数据
  base.state.currentRow = {};
  // 已经找到的数据
  base.state.existRows = [];
};
// 扫描成功后，接着扫描，保留仓库、理货位
const continueScan = () => {
  state.formData.targetPositionName = '';
  state.formData.scanQty = 0;
  state.formData.productModel = '';
  state.formData.snList = '';
  state.formData.checkSnList = '';
  base.state.tableData = [];
  // 当前正在扫描的数据
  base.state.currentRow = {};
  // 已经找到的数据
  base.state.existRows = [];
  base.focus('targetPositionName');
};
// 上架货位回车
const shelvePositionEnter = () => {
  if (state.formData.targetPositionName) {
    window.setTimeout(() => {
      base.focus('productModel');
    }, 500);
  }
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
</script>

<style lang="scss" scoped>
@import '/@/theme/scan.scss';
</style>
