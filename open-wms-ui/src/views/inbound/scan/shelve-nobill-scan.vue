<template>
  <div class="scan-container">
    <el-card class="scan-card">
      <template #header>
        <div class="clearfix">
          <span>{{ $tt('无单扫描上架') }}</span>
        </div>
      </template>
      <el-form ref="form" :model="state.formData" label-width="120px" class="scan-form">
        <el-form-item label="仓库">
          <el-select v-model="state.formData.storageId" placeholder="请选择仓库" class="input-300" @change="getPositionList">
            <el-option v-for="item in state.storageNames" :key="item.storageId" :label="item.storageName" :value="item.storageId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收货位">
          <el-select ref="positionName" v-model="state.formData.positionName" placeholder="请选择收货位" class="input-300">
            <el-option v-for="(item, index) in state.positionList" :key="index" :label="item.positionName" :value="item.positionName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上架货位">
          <el-input ref="shelvePositionName" v-model="state.formData.shelvePositionName" class="input-300" autofocus @keyup.enter.stop="checkShelvePositionkeyup"></el-input>
        </el-form-item>
        <el-form-item label="商品条码">
          <el-input ref="productModel" v-model="state.formData.productModel" :disabled="!state.formData.isValidateProductCode" class="input-300" @keyup.enter.stop="checkPackingBarcode"></el-input>
          <span class="sub-item">
            <span class="sub-label">扫描数量：</span>
            <!-- :min="1" -->
            <el-input-number v-model="state.formData.scanQty" :disabled="!state.formData.isValidateProductCode" class="input-100" controls-position="right" @change="base.setScanQty"></el-input-number>
          </span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveCheck">确认上架</el-button>
          <el-button @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="scan-card body-no-padding mt-5">
      <div class="clearfix">
        <span class="padding-top-10">扫描结果</span>
        <el-button link class="floatRight" @click="state.setting.visible = true">字段设置</el-button>
      </div>
      <el-table ref="scan-table" :data="base.state.tableData" :row-class-name="base.rowClass" stripe style="width: 100%" class="scan-table" @row-dblclick="(row:any, column:any, event:any) => changeProduct(row)" size="small">
        <template v-for="(item, index) in state.setting.fields">
          <template v-if="['finishedQuantity'].indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="item.label" :width="item.width">
              <template #common-column-slot="{ row }">
                <template v-if="!state.formData.isValidateProductCode">
                  <el-input-number v-model="row[item.prop]" :min="0" size="small" class="w-100pc" controls-position="right" @change="base.rowChangeQty(item.prop, row)"></el-input-number>
                </template>
                <template v-else>
                  {{ row[item.prop] }}
                </template>
              </template>
            </el-table-column>
          </template>
          <template v-else-if="['shelvePositionName'].indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width" align="center">
              <template #default="{ row }">
                <input-select ref="shelvePositionName" v-model="row.shelvePositionName" :options="row.waitPositionNames" :label="$tt('货位')" input-width="110px" trigger="click" @on-item-click="(ref:any, data:any)=>elDropdownSelect(row, data)" @on-row-change="(ref:any, data:any)=>elDropdownChange(row, data)" @on-key-up="(ref:any, data:any)=>elDropdownKeyup(row, data)"></input-select>
              </template>
            </el-table-column>
          </template>
          <template v-else-if="'scanWeight'.indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="item.label" :width="item.width">
              <template #common-column-slot="{ row }">
                <el-input v-model="row[item.prop]" size="small" class="w-100pc"></el-input>
              </template>
            </el-table-column>
          </template>
          <template v-else-if="'produceDate,limitDate'.indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="item.label" :width="item.width">
              <template #common-column-slot="{ row }">
                <el-date-picker v-model="row[item.prop]" size="small" type="date" placeholder="选择日期" class="w-110" value-format="YYYY-MM-DD"></el-date-picker>
              </template>
            </el-table-column>
          </template>
          <template v-else>
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="item.label" :width="item.width"></el-table-column>
          </template>
        </template>
      </el-table>
    </el-card>

    <!--SKU列表-->
    <el-dialog v-model:visible="state.dialogVisible" title="选择SKU" width="30%" append-to-body>
      <template>
        <el-table :data="state.findProductList" :row-class-name="base.rowClass" class="scan-table" style="width: 100%" @row-dblclick="base.setCurrent">
          <el-table-column prop="productCode" label="商品编号" width="180"></el-table-column>
          <el-table-column prop="productModel" label="条码" width="180"></el-table-column>
          <el-table-column prop="productName" label="商品名称"></el-table-column>
          <el-table-column prop="productSpec" label="商品规格"></el-table-column>
        </el-table>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button @click="state.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeProduct(state.saveProductInfo)">确 定</el-button>
      </span>
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
const InputSelect = defineAsyncComponent(() => import('/@/components/base/InputSelect.vue'));
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
    // 仓库ID
    shelvePositionName: null, // 上架货位
  },
  // 仓库
  storageNames: [] as any[],
  // 是否弹出
  isDisplay: false,
  // 收货位候选项
  positionList: [] as any[],
  dialogVisible: false,
  // SKU列表
  findProductList: [] as any[],

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
        prop: 'quantity',
        label: '清单数量',
        visible: true,
        width: 80,
        order: 2,
      },
      {
        prop: 'shelveQuantity',
        label: '已上架数量',
        visible: true,
        width: 80,
        order: 2,
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
        prop: 'positionName',
        label: '收货位',
        visible: true,
        width: 120,
        order: 8,
      },
      {
        prop: 'shelvePositionName',
        label: '上架货位',
        visible: true,
        width: 120,
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
        prop: 'productSpec',
        label: '商品规格',
        visible: true,
        width: 80,
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
  getStorageList();
  // 字段设置
  const setting = localStorage[state.setting.name + '-setting'];
  if (setting) {
    state.setting.fields = JSON.parse(setting);
  }
});
const checkShelvePositionkeyup = () => {
  var shelvePositionName = state.formData.shelvePositionName;
  if (!shelvePositionName) {
    proxy.$message.error('上架货位不能为空！');
    return;
  }
  proxy.$refs.productModel.focus();
  proxy.$refs.productModel.select();
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
  state.formData.storageName = state.storageNames.find((item: any) => item.storageId === storageId).storageName;
  var url = '/basic/storage/position/getPositionList';
  var params = {
    storageId: storageId,
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
  base.focus('shelvePositionName');
};
// 判断扫描包装条码
const checkPackingBarcode = (evt: any) => {
  base.state.tableData.forEach((item) => {
    item.shelvePositionName = state.formData.shelvePositionName;
  });

  base.checkPackingProductModel(base.state.tableData, null, getProductInfo);
};
// 获取商品信息
const getProductInfo = async () => {
  var productModel = state.formData.productModel; // masterData.productModel;
  var storageId = state.formData.storageId;
  var positionName = state.formData.positionName;
  state.formData.scanQty = 0;
  if (!productModel) {
    proxy.$message.error('条码不能为空！');
    return;
  }
  if (!positionName) {
    proxy.$message.error('收货位不能为空！');
    return;
  }
  var url = '/inbound/in/inScanShelve/getShelveNoBillData';
  var params = {
    storageId: storageId,
    positionName: positionName,
    productModel: productModel,
  };
  const [err, res] = await to(postData(url, params));
  if (res?.result) {
    state.findProductList = [];
    for (var index in res.data) {
      res.data[index].quantity = Number(res.data[index].quantity);
      res.data[index].shelvedQuantity = Number(res.data[index].shelvedQuantity);
      res.data[index].shelveQuantity = res.data[index].quantity - res.data[index].shelvedQuantity;
      res.data[index].unFinishedQuantity = res.data[index].shelveQuantity;
      res.data[index].finishedQuantity = 0;
      res.data[index].produceDate = moment(res.data[index].produceDate).format('YYYY-MM-DD');

      state.findProductList = res.data;

      if (res.data.length === 1) {
        changeProduct(res.data[0].productId);
      } else {
        state.isDisplay = true;
        state.dialogVisible = true;
      }
    }
  } else {
    base.playError(); // 播放声音
  }
};
//
// 选择商品
const changeProduct = (row: any) => {
  state.dialogVisible = false;
  var positionName = state.formData.positionName;
  var rows = null;
  if (state.isDisplay) {
    for (var index in state.findProductList) {
      if (state.findProductList[index].productId === row.productId) {
        rows = state.findProductList[index];
      }
    }
  } else {
    for (var index1 in state.findProductList) {
      if (state.findProductList[index1].productId === row) {
        rows = state.findProductList[index1];
      }
    }
  }

  rows.positionName = positionName;
  rows.shelvePositionName = state.formData.shelvePositionName;
  base.state.tableData = [rows];
  // base.state.currentRow = rows;
  // sortRow();
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
  const dataList: any[] = proxy.common.deepCopy(base.state.tableData.filter((f: any) => f.finishedQuantity > 0));
  if (dataList.find((f: any) => !f.shelvePositionName)) {
    proxy.$message.error('请选择货位');
    return false;
  }

  if (!dataList.length) {
    base.showError('没有可用的扫描数据！');
    base.playError();
    base.state.saving = false;
    return;
  }

  proxy
    .$confirm('您确定要[上架]扫描的数据吗？', '待上架扫描', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(async () => {
      let url = '/inbound/in/inScanShelve/shelveSave';
      let params = {
        scanInType: 'PC_NO_BILL_SHELVE_IN', // PC无单扫描上架
        shelveCode: dataList[0].shelveCode,
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
    })
    .catch(() => {
      proxy.$message.info('已取消');
    });
};
const onReset = () => {
  state.formData.storageId = undefined;
  state.formData.storageName = '';
  state.formData.positionName = '';
  state.formData.shelvePositionName = null;
  state.formData.productModel = '';
  state.formData.scanQty = 0;
  getStorageList();
  base.state.tableData = [];
  base.state.currentRow = null;
};

const elDropdownSelect = (row: any, data: any) => {
  row.shelvePositionName = data;
};

const elDropdownChange = (row: any, data: any) => {
  row.shelvePositionName = data;
};

const elDropdownKeyup = async (row: any, val: any) => {
  try {
    if (!val) {
      row.waitPositionNames = [];
      return;
    }
    const url = '/inbound/in/inScanShelve/getShelvePositionList';
    const params = {
      storageId: state.formData.storageId,
      name: val,
    };
    let headers = {
      noLoading: true,
    };
    let [err, res] = await to(postData(url, params, headers));
    if (err) {
      return;
    }
    if (res?.result) {
      row.waitPositionNames = res.data.map((m: any) => {
        return {
          value: m.positionName,
          name: m.positionName,
        };
      });
    }
  } catch (error: any) {
    proxy.$message.error(error.message);
  }
};
</script>

<style lang="scss" scoped>
@import '/@/theme/scan.scss';
</style>
