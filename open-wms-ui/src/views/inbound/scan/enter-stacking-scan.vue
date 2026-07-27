<template>
  <div class="scan-container">
    <el-card class="scan-card">
      <template #header>
        <div class="clearfix">
          <span>{{ $tt('码盘扫描入库') }}</span>
        </div>
      </template>
      <el-form ref="form" :model="state.formData" label-width="120px" class="scan-form">
        <el-form-item :label="$tt('仓库名称')">
          <el-select v-model="state.formData.storageId" :placeholder="$tt('请选择仓库')" class="input-300" @change="getPositionName()">
            <el-option v-for="item in state.storageNames" :key="item.storageId" :label="item.storageName" :value="item.storageId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$tt('收货位')">
          <el-select ref="positionName" v-model="state.formData.positionName" :placeholder="$tt('请选择收货位')" class="input-300">
            <el-option v-for="(item, index) in state.positionList" :key="index" :label="item.positionName" :value="item.positionName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$tt('收货托盘号')">
          <el-input ref="plateCode" v-model="state.formData.plateCode" autofocus class="input-300" @keyup.enter.stop="plateCodeKeyup"></el-input>
          <span class="sub-item"></span>
        </el-form-item>
        <el-form-item :label="$tt('商品条码')">
          <el-input ref="productModel" v-model="state.formData.productModel" autofocus class="input-300" @keyup.enter.stop="checkPackingBarcode"></el-input>
          <span class="sub-item">
            <span class="sub-label">扫描数量：</span>
            <el-input-number v-model="state.formData.scanQty" :min="0" class="input-100" controls-position="right" @change="base.setScanQty"></el-input-number>
          </span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveCheck">确认码盘</el-button>
          <el-button @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="scan-card body-no-padding mt-10">
      <div class="clearfix">
        <span class="padding-top-10">扫描结果</span>
        <el-button class="floatRight" @click="state.setting.visible = true">字段设置</el-button>
      </div>
      <el-table ref="scan-table" :data="base.state.tableData" :row-class-name="base.rowClass" stripe style="width: 100%" class="scan-table" size="small" @row-dblclick="base.setCurrent">
        <template v-for="(item, index) in state.setting.fields">
          <template v-if="'positionName,scanWeight,purchasePrice,batchNumber,plateCode'.indexOf(item.prop) >= 0">
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
          <template v-else>
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="item.label" :width="item.width"></el-table-column>
          </template>
        </template>
        <el-table-column fixed="right" :label="$tt('操作')" width="70">
          <template #default="scope">
            <el-button v-if="!scope.row.isMain" link size="small" @click="deleteRow(scope.row, scope.$index)">{{ $tt('删除') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="state.dialogVisible" title="选择SKU" width="1200px" append-to-body>
      <el-table :data="state.findProductList" class="scan-table" style="width: 100%" @row-click="rowClick" @row-dblclick="(row:any, column:any, event:any) => changeProduct(row)">
        <el-table-column prop="inventoryId" :label="$tt('库存ID')" width="180"></el-table-column>
        <el-table-column prop="validStorage" :label="$tt('有效库存')" width="180"></el-table-column>
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
          <el-button type="primary" @click="changeProduct(state.multiProductSelected)">确 定</el-button>
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

<script setup lang="ts" name="inbound-scan-enter-stacking-scan">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';
import { postData } from '/@/api/common/baseApi';
import to from 'await-to-js';
import scanHook from '/@/components/hooks/scanHook';
import moment from 'moment';

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
    providerId: '',
    providerCode: '',
    providerShortName: '',
  },
  // 仓库
  storageNames: [] as any[],
  // 收货位候选项
  positionList: [] as any[],
  // 是否展示SKU
  showProduct: false,
  dialogVisible: false,
  // SKU列表
  findProductList: [] as any[],

  // 仓库信息
  storageInfo: {},

  // 是否弹出一码多拍
  isCount: false,
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
        width: 130,
        order: 1,
      },
      {
        prop: 'quantity',
        label: '单据数量',
        visible: true,
        width: 90,
        order: 4,
      },
      {
        prop: 'finishedQuantity',
        label: '扫描数量',
        visible: true,
        width: 100,
        order: 2,
      },
      {
        prop: 'unFinishedQuantity',
        label: '未扫描数量',
        visible: true,
        width: 100,
        order: 3,
      },
      {
        prop: 'positionName',
        label: '收货位',
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
        width: 120,
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
        prop: 'plateCode',
        label: '收货托盘号',
        visible: true,
        width: 120,
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
        width: 100,
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
  await getStorageList();
  // 字段设置
  const setting = localStorage[state.setting.name + '-setting'];
  if (setting) {
    state.setting.fields = JSON.parse(setting);
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
// 根据仓库获取货位
const getPositionName = async () => {
  var url = '/basic/storage/position/getPositionList';
  var params = {
    storageId: state.formData.storageId,
    positionType: 4, // 4=收货位
  };
  // 仓库
  for (var index3 in state.storageNames) {
    if (state.storageNames[index3].storageId === state.formData.storageId) {
      state.formData.storageId = state.storageNames[index3].storageId;
      state.formData.storageName = state.storageNames[index3].storageName;
    }
  }

  const [err, res] = await to(postData(url, params));
  if (res?.result) {
    state.storageInfo = {
      storageId: state.formData.storageId,
      storageName: state.formData.storageName,
    };

    state.positionList = res.data;
    if (state.positionList.length) {
      state.formData.positionName = state.positionList[0].positionName;
    } else {
      state.storageInfo = {};
      state.positionList = [];
    }
    // 托盘号框获得焦点
    base.focus('plateCode');
  }
};
// 托盘号回车
const plateCodeKeyup = () => {
  // 条码框获得焦点
  proxy.$refs.productModel.focus();
  proxy.$refs.productModel.select();
};
// 判断扫描包装条码
const checkPackingBarcode = (evt: any) => {
  splitRow(); // 拆分行
  base.checkPackingProductModel(base.state.tableData, null, getProductInfo);
};
// 获取商品信息
const getProductInfo = async () => {
  var productModel = state.formData.productModel; // 条码
  var positionName = state.formData.positionName; // 收货位
  if (!positionName) {
    proxy.$message.error('收货位不能为空');
    return;
  }
  if (!productModel) {
    proxy.$message.error('条码不能为空！');
    return;
  }
  var url = '/composite/in/inScan/getEnterStackingData';
  var params = {
    storageId: state.formData.storageId,
    productModel: productModel,
    positionName: positionName,
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }
  proxy.common.showMsg(res);
  if (res.result) {
    for (var index in res.data) {
      res.data[index].shelveQuantity = 0;
      res.data[index].scanQty = 0;
      res.data[index].plateCode = state.formData.plateCode;
      if (res.data[index].produceDate) {
        res.data[index].produceDate = moment(res.data[index].produceDate).format('YYYY-MM-DD');
      }
      if (res.data[index].inStorageDate) {
        res.data[index].inStorageDate = moment(res.data[index].inStorageDate).format('YYYY-MM-DD');
      }
      res.data[index].quantity = Number(res.data[index].validStorage);
      res.data[index].finishedQuantity = 0;
      res.data[index].unFinishedQuantity = res.data[index].quantity - 1;
      res.data[index].totalQuantity = res.data[index].quantity;

      res.data[index].isMain = 1; // 用于拆分，是否为源数据
      res.data[index].validStorage = Number(res.data[index].validStorage);
    }
    state.findProductList = res.data;
    if (res.data.length) {
      if (res.data.length === 1) {
        changeProduct(state.findProductList[0].productId);
      } else {
        state.isCount = true;
        state.dialogVisible = true;
      }
    }

    base.focus('productModel');
  } else {
    base.playError(); // 播放声音
  }
};
// 选中行
const rowClick = (row: any, column: any, event: any) => {
  state.multiProductSelected = row;
};
// 选择商品
const changeProduct = (row: any) => {
  state.dialogVisible = false;
  var positionName = state.formData.positionName;
  var count = 1;

  if (state.isCount) {
    for (var index in state.findProductList) {
      if (state.findProductList[index].inventoryId === row.inventoryId) {
        base.state.currentRow = state.findProductList[index];
        break;
      }
    }
  } else {
    for (var index1 in state.findProductList) {
      if (state.findProductList[index1].inventoryId === row) {
        base.state.currentRow! = state.findProductList[index1];
      }
    }
  }

  base.state.currentRow!.positionName = positionName;
  base.state.currentRow!.finishedQuantity = count;
  base.state.currentRow!.finishedQuantity = count;
  base.state.currentRow!.scanWeight = count * base.state.currentRow!.weight;
  base.state.tableData[base.state.tableData.length] = base.state.currentRow;

  base.state.existRows.push(base.state.currentRow);
  sortRow();
  state.showProduct = false;
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

// 入库时保质期如果超过一定时长（可设定）需要预警提示是否入库
const saveCheck = async () => {
  var dataList = base.state.tableData.filter((item) => {
    return item.finishedQuantity > 0;
  });

  if (!dataList.length) {
    proxy.$message.error('没有扫描可用的数据！');
    return;
  }
  if (!window.confirm('当前扫描要确认入库吗？')) return;
  var url = '/composite/in/inPaiScan/saveCheckPlateCode';
  var params = {
    plateCodes: dataList.map((item) => item.plateCode).join(','),
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }
  if (res.result) {
    save();
  }
};
// 确认入库
const save = async () => {
  var emptyPositionName = base.state.tableData.filter((item: any) => item.productId && item.finishedQuantity > 0 && !item.positionName);
  if (emptyPositionName.length) {
    proxy.$message.error('条形码[' + emptyPositionName.join(',') + ']货位不能为空！');
    base.playError(); // 播放声音
    return;
  }
  if (base.state.tableData.filter((item: any) => item.productId && item.finishedQuantity > 0 && !item.plateCode).length) {
    proxy.$message.error('收货托盘号不能为空');
    base.playError(); // 播放声音
    return;
  }
  var dataList = base.state.tableData
    .filter((item) => item.productId && item.finishedQuantity > 0)
    .map((item) => {
      item.storageName = state.formData.storageName;
      item.storageId = state.formData.storageId;
      if (!item.positionName) {
        item.positionName = state.formData.positionName;
      }
      item.targetPositionName = item.positionName;
      item.sourceMainId = item.mainId;
      item.sourceDetailId = item.detailId;

      item.storageId = state.formData.storageId;
      return item;
    });
  if (dataList.length === 0) {
    proxy.$message.error('至少录入一条数据');
    return;
  }
  var url = '/composite/in/inScan/saveEnterStacking';
  var params = {
    transferType: 'PC_STACKING_IN', // PC码盘入库
    storageId: state.formData.storageId,
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
const onReset = () => {
  state.formData.scanQty = 0;
  state.formData.productModel = '';
  state.formData.providerId = '';
  state.formData.providerCode = '';
  state.formData.providerShortName = '';
  state.formData.storageId = 0;
  state.formData.storageName = '';
  state.formData.positionName = '';
  state.formData.plateCode = '';
  base.state.tableData = [];
  state.findProductList = [];
  base.state.currentRow = null;
};

// 拆分明细
const splitRow = () => {
  const row = base.state.currentRow;
  if (!row || !row.plateCode) {
    return;
  }
  if (row.plateCode === state.formData.plateCode) {
    return;
  }
  // 未完成数量必须大于0
  if (row.unFinishedQuantity <= 0) {
    return;
  }
  base.state.tableData.forEach((element) => {
    element.sortIndex = 0;
  });

  const index = base.state.tableData.indexOf(base.state.currentRow);
  const newRow = proxy.common.deepCopy(row);
  newRow.finishedQuantity = 0;
  newRow.quantity = newRow.unFinishedQuantity;
  newRow.validQuantity = newRow.unFinishedQuantity;
  newRow.plateCode = state.formData.plateCode;
  newRow.isMain = 0;
  newRow.sortIndex = 1; // 置顶
  newRow.singleSignCode = null;
  base.state.tableData.splice(index + 1, 0, newRow);

  // 置顶排序
  base.state.tableData.sort(function (a, b) {
    return b.sortIndex - a.sortIndex;
  });

  // 原始行数据修改，总数量减少
  row.quantity = row.quantity - newRow.unFinishedQuantity;
  // 未完成数量改成0
  row.unFinishedQuantity = 0;
  base.state.currentRow = newRow;
  base.state.existRows = [newRow];
};
// 删除明细
const deleteRow = (row: any, index: any) => {
  if (row.isMain) {
    proxy.$message.error('主商品不允许删除！');
    return;
  }
  const quantity = row.quantity;
  const mainRow = base.state.tableData.find((item) => item.isMain && item.orderList_Id === row.orderList_Id);
  mainRow.quantity += quantity;
  mainRow.unFinishedQuantity += quantity;
  if (base.state.currentRow === row) {
    base.state.currentRow = mainRow;
  }
  base.state.tableData.splice(index, 1);
};
</script>

<style lang="scss" scoped>
@import '/@/theme/scan.scss';
</style>
