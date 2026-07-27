<template>
  <div class="scan-container">
    <el-card class="scan-card">
      <template #header>
        <div class="clearfix">
          <span>{{ state.formData.isNoBill ? $tt('无单扫描上架') : $tt('码盘上架扫描') }}</span>
        </div>
      </template>
      <el-row>
        <el-col :xl="11" :md="14" :xs="24">
          <el-form ref="form" :model="state.formData" label-width="120px" class="scan-form">
            <el-form-item :label="$tt('仓库')">
              <el-select v-model="state.formData.storageId" :placeholder="$tt('请选择仓库')" class="input-300" @change="getPositionList">
                <el-option v-for="item in state.storageNames" :key="item.storageId" :label="item.storageName" :value="item.storageId"></el-option>
              </el-select>
              <span class="sub-item">
                <span class="sub-label">{{ $tt('开启SN') }}：</span>
                <el-switch v-model="state.formData.isScanSn" @change="onIsScanSnChange"></el-switch>
              </span>
            </el-form-item>
            <el-form-item :label="$tt('收货位')">
              <el-select ref="positionName" v-model="state.formData.positionName" :placeholder="$tt('请选择收货位')" class="input-300">
                <el-option v-for="(item, index) in state.positionList" :key="index" :label="item.positionName" :value="item.positionName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$tt('上架货位')">
              <el-input ref="shelvePosition" v-model="state.formData.shelvePosition" class="input-300" autofocus @keyup.enter.stop="checkShelvePositionkeyup"></el-input>
            </el-form-item>
            <el-form-item v-if="!state.formData.isNoBill" :label="$tt('托盘号')">
              <el-input ref="plateCode" v-model="state.formData.plateCode" class="input-300" autofocus @keyup.enter.stop="checkPlateCodekeyup"></el-input>
            </el-form-item>
            <el-form-item v-if="!state.formData.isScanSn" :label="$tt('商品条码')">
              <el-input ref="productModel" v-model="state.formData.productModel" :disabled="!state.formData.isValidateProductCode" class="input-300" @keyup.enter.stop="checkPackingBarcode"></el-input>
              <span class="sub-item">
                <span class="sub-label">{{ $tt('扫描数量') }}：</span>
                <!-- :min="1" -->
                <el-input-number v-model="state.formData.scanQty" :disabled="!state.formData.isValidateProductCode" class="input-100" controls-position="right" @change="base.setScanQty"></el-input-number>
              </span>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveCheck">{{ $tt('确认上架') }}</el-button>
              <el-button @click="onReset">{{ $tt('重置') }}</el-button>
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
            <el-form-item>
              <el-button type="primary" @click="parseSn">{{ $tt('解析SN') }}</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="scan-card body-no-padding mt-5">
      <template #header>
        <div class="clearfix">
          <span class="padding-top-10">{{ $tt('扫描结果') }}</span>
          <el-button link class="floatRight" @click="state.setting.visible = true">{{ $tt('字段设置') }}</el-button>
        </div>
      </template>

      <el-table ref="scan-table" :data="base.state.tableData" :row-class-name="base.rowClass" stripe style="width: 100%" class="scan-table" size="small">
        <template v-for="(item, index) in state.setting.fields">
          <template v-if="['finishedQuantity'].indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width">
              <template #default="{ row }">
                <template v-if="!state.formData.isValidateProductCode">
                  <el-input-number v-model="row[item.prop]" :min="0" size="small" class="w-100pc" controls-position="right" @change="base.rowChangeQty(item.prop, row)"></el-input-number>
                </template>
                <template v-else>
                  {{ row[item.prop] }}
                </template>
              </template>
            </el-table-column>
          </template>
          <template v-else-if="'shelvePosition,scanWeight'.indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width">
              <template #default="{ row }">
                <el-input v-model="row[item.prop]" size="small" class="w-100pc"></el-input>
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
          <template v-else-if="'produceDate,limitDate'.indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width">
              <template #default="{ row }">
                <el-date-picker v-model="row[item.prop]" size="small" type="date" :placeholder="$tt('选择日期')" class="w-110" value-format="YYYY-MM-DD"></el-date-picker>
              </template>
            </el-table-column>
          </template>
          <template v-else>
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width"></el-table-column>
          </template>
        </template>
      </el-table>
    </el-card>

    <!--SKU列表-->
    <el-dialog v-model="state.dialogVisible" title="选择SKU" width="1200px" append-to-body>
      <el-table
        :data="state.findProductList"
        class="scan-table"
        style="width: 100%"
        @row-click="rowClick"
        @row-dblclick="
          (row, column, event) => {
            changeProduct(row);
          }
        "
      >
        <el-table-column prop="productCode" :label="$tt('商品编号')" width="180"></el-table-column>
        <el-table-column prop="productModel" :label="$tt('条码')" width="180"></el-table-column>
        <el-table-column prop="productName" :label="$tt('商品名称')"></el-table-column>
        <el-table-column prop="productSpec" :label="$tt('商品规格')"></el-table-column>
        <el-table-column prop="inStorageDate" :label="$tt('入库时间')"></el-table-column>
        <el-table-column prop="produceDate" :label="$tt('生产日期')"></el-table-column>
        <el-table-column prop="batchNumber" :label="$tt('批次号')"></el-table-column>
      </el-table>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="state.dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="changeProduct(state.saveProductInfo)">确 定</el-button>
        </div>
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

<script setup lang="ts" name="inbound-scan-order">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';
import { postData } from '/@/api/common/baseApi';
import to from 'await-to-js';
import moment from 'moment';
import scanHook from '/@/components/hooks/scanHook';
const ScanSettingDialog = defineAsyncComponent(() => import('/@/components/common/components/scanSettingDialog.vue'));
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

//#region 配置参数
const config = ref({
  // 自动生成上架单
  in_generateShelve: true,
  // 是否启用装箱操作
  in_caseNumber: false,
  // 支持一品多码
  sku_productToMultiBarcode: true,
  caseMode: 0,
});
//#endregion

const base = scanHook({
  config,
});

//#region 定义变量
const state = reactive({
  formData: {
    ...toRefs(base.state.formData),
    shelvePosition: null, // 上架货位
    // 是否校验商品
    isNoBill: false, // 无单扫描上架
  },
  // 仓库
  storageNames: [] as any[],
  // 是否弹出
  isDisplay: false,
  // 收货位候选项
  positionList: [] as any[],
  // 是否展示SKU
  dialogVisible: false,
  // SKU列表
  findProductList: [] as any[],
  // 装箱新增行
  saveProductInfo: {},
  // 扫描列设置对话框参数
  setting: {
    visible: false,
    name: 'scan-purchase-noBillscan',
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
        order: 4,
      },
      {
        prop: 'positionName',
        label: '收货位',
        visible: true,
        width: 120,
        order: 8,
      },
      {
        prop: 'shelvePosition',
        label: '上架货位',
        visible: true,
        width: 120,
        order: 8,
      },
      {
        prop: 'singleSignCode',
        label: '序列号(SN)',
        visible: true,
        width: 240,
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
        prop: 'batchNumber',
        label: '批次号',
        visible: false,
        width: 100,
        order: 6,
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
        prop: 'purchasePrice',
        label: '单价',
        visible: false,
        width: 80,
        order: 11,
      },
      {
        prop: 'plateCode',
        label: '托盘号',
        visible: true,
        width: 120,
        order: 12,
      },
      {
        prop: 'productSpec',
        label: '商品规格',
        visible: true,
        width: 120,
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
        prop: 'sumTotalWeight',
        label: '合计重量',
        visible: false,
        width: 80,
        order: 14,
      },
      {
        prop: 'scanWeight',
        label: '已扫重量',
        visible: false,
        width: 80,
        order: 15,
      },
      {
        prop: 'productName',
        label: '商品名称',
        visible: true,
        order: 16,
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
  state.formData.isNoBill = proxy.$route.fullPath.indexOf('nobill') >= 0;
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
  // 加载仓库下拉框
  getStorageList();
});
//#endregion

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
// 上架货位回车
const checkShelvePositionkeyup = () => {
  var shelvePosition = state.formData.shelvePosition;
  if (!shelvePosition) {
    proxy.$message.error('上架货位不能为空！');
    return;
  }
  if (!state.formData.isNoBill) {
    base.focus('plateCode');
  } else {
    if (state.formData.isScanSn) {
      base.focus('snList');
    } else {
      base.focus('productModel');
    }
  }
};
// 托盘回车
const checkPlateCodekeyup = () => {
  var plateCode = state.formData.plateCode;
  if (!plateCode) {
    proxy.$message.error('托盘不能为空！');
    return;
  }
  if (state.formData.isScanSn) {
    base.focus('snList');
  } else {
    base.focus('productModel');
  }
};
// 获取仓库
const getStorageList = async () => {
  const url = '/basic/storage/storage/getList';
  const params = {};
  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }
  if (res.result) {
    state.storageNames = res.data;
  }
};
// 获得仓库和货位信息
const getPositionList = async (storageId: any) => {
  state.formData.storageName = state.storageNames.find((item) => item.storageId === storageId).storageName;
  var url = '/basic/storage/position/getPositionList';
  var params = {
    storageId: state.formData.storageId,
    positionType: 4, // 4=收货位
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
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
  base.focus('shelvePosition');
};
// 判断扫描包装条码
const checkPackingBarcode = (evt: any) => {
  base.checkPackingProductModel(base.state.tableData, null, getProductInfo);
};
// 获取商品信息
const getProductInfo = async () => {
  var productModel = state.formData.productModel; // masterData.productModel;
  var storageId = state.formData.storageId;
  var positionName = state.formData.positionName;
  if (!productModel) {
    proxy.$message.error('条码不能为空！');
    return;
  }
  if (!positionName) {
    proxy.$message.error('收货位不能为空！');
    return;
  }
  var url = '/composite/in/inScan/getEnterStackingData';
  var params = {
    storageId: storageId,
    positionName: positionName,
    productModel: productModel,
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }
  if (res.result) {
    for (var index in res.data) {
      res.data[index].shelveQuantity = 0;
      res.data[index].scanQty = 0;
      res.data[index].plateCode = state.formData.plateCode;
      res.data[index].produceDate = moment(res.data[index].produceDate).format('YYYY-MM-DD');
      res.data[index].shelvePosition = state.formData.shelvePosition;
    }
    state.findProductList = res.data;
    if (res.data.length) {
      if (res.data.length === 1) {
        changeProduct(state.findProductList[0].productId);
      } else {
        state.isDisplay = true;
        state.dialogVisible = true;
      }
    }
  } else {
    base.playError(); // 播放声音
  }
}; // 选择商品
const changeProduct = (row: any) => {
  state.dialogVisible = false;
  var positionName = state.formData.positionName;
  var productModel = state.formData.productModel;
  var count = 1;

  if (state.isDisplay) {
    for (var index in state.findProductList) {
      if (state.findProductList[index].productId === row.productId) {
        base.state.currentRow = state.findProductList[index];
        break;
      }
    }
  } else {
    for (var index1 in state.findProductList) {
      if (state.findProductList[index1].productId === row) {
        base.state.currentRow! = state.findProductList[index1];
      }
    }
  }

  if (base.state.currentRow!.middleBarcode === productModel) {
    // 中包装条码
    count = base.state.currentRow!.middleUnitConvert;
  } else if (base.state.currentRow!.bigBarcode === productModel) {
    // 大包装条码
    count = base.state.currentRow!.unitConvert;
  }
  base.state.currentRow!.positionName = positionName;
  base.state.currentRow!.finishedQuantity = count;
  base.state.currentRow!.scanWeight = count * base.state.currentRow!.weight;
  base.state.tableData[base.state.tableData.length] = base.state.currentRow;

  base.state.existRows.push(base.state.currentRow);
  sortRow();
};

// 排序高亮行靠前
const sortRow = () => {
  base.state.tableData.forEach((element) => {
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
const saveCheck = async () => {
  var dataList = base.state.tableData.filter((item) => item.finishedQuantity > 0);
  var emptyPositionName = base.state.tableData.filter((item) => !item.positionName).map((item) => item.productModel);
  if (!state.formData.shelvePosition) {
    proxy.$message.error('上架货位不能为空！');
    return;
  }
  if (dataList.length === 0) {
    proxy.$message.error('至少录入一条数据！');
    return;
  }

  if (emptyPositionName.length) {
    proxy.$message.error('条形码[' + emptyPositionName.join(',') + ']货位不能为空！');
    base.playError(); // 播放声音
    return;
  }

  const total = dataList.reduce(
    (totalItem, currItem) => {
      totalItem.qty += currItem.finishedQuantity;
      return totalItem;
    },
    { qty: 0 }
  );
  if (dataList.length === 0) {
    base.showError('至少录入一条数据');
    base.state.saving = false;
    return;
  }
  if (state.formData.isScanSn && total.qty !== base.snCount.value) {
    proxy.$message.error('扫描SN个数和明细结果个数不相等，请点击【SN解析】按钮！');
    return;
  }
  var url = '/api/inbound/shelveScan/stackingSave';
  var params = {
    dataList: dataList,
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }
  if (res.result) {
    onReset();
    base.play(); // 播放声音
  } else {
    base.playError(); // 播放声音
  }
};
// 解析SN
const parseSn = async () => {
  if (!state.formData.storageId) {
    proxy.$message.error('仓库不能为空！');
    return;
  }
  if (!state.formData.positionName) {
    proxy.$message.error('收货位不能为空！');
    return;
  }
  if (!state.formData.plateCode && !state.formData.isNoBill) {
    proxy.$message.error('托盘号不能为空！');
    return;
  }
  if (!state.formData.snList) {
    proxy.$message.error('扫描SN不能为空！');
    return;
  }
  let snList = state.formData.snList;
  snList = snList ? snList.replace(/\\r/gi, '') : '';

  var url = '/api/inbound/shelveScan/parseSn';
  var params = {
    storageId: state.formData.storageId,
    positionName: state.formData.positionName,
    snList: snList,
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }
  if (res.result) {
    res.data.map((m: any) => {
      m.shelvePosition = state.formData.shelvePosition;
      m.plateCode = state.formData.plateCode;
      return m;
    });
    base.state.tableData = res.data;
  }
};
const onReset = () => {
  state.formData.storageId = 0;
  state.formData.positionName = '';
  state.formData.shelvePosition = null;
  state.formData.productModel = '';
  state.formData.plateCode = '';
  state.formData.scanQty = 0;
  state.formData.snList = '';
  base.state.tableData = [];
};
// 选中行
const rowClick = (row: any, column: any, event: any) => {
  state.saveProductInfo = row;
};
</script>

<style lang="scss" scoped>
@import '/@/theme/scan.scss';
</style>
