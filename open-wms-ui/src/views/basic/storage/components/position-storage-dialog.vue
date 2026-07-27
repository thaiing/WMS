<template>
  <div>
    <!-- 货位库存明细对话框 -->
    <el-dialog draggable v-model="currentDialogVisible" :top="common.getDialogTop()" :title="detailTitle" class="dialog-container" width="1100px" append-to-body>
      <el-tabs v-model="state.tabIndex">
        <el-tab-pane label="库存详情" name="库存详情">
          <el-table ref="detailTable" :data="productPositionList" :max-height="'300px'" size="small" style="width: 100%">
            <el-table-column prop="sourceType" label="来源类别" width="120"> </el-table-column>
            <el-table-column prop="positionName" label="货位名称" width="100"> </el-table-column>
            <el-table-column prop="consignorName" label="货主名称" width="130"> </el-table-column>
            <el-table-column prop="productCode" label="商品编号"> </el-table-column>
            <el-table-column prop="productName" label="商品名称" width="140"> </el-table-column>
            <el-table-column prop="productStorage" label="库存量" width="90"> </el-table-column>
            <el-table-column prop="batchNumber" label="批次号" width="120"> </el-table-column>
            <el-table-column prop="plateCode" label="拍号" width="120"> </el-table-column>
            <el-table-column prop="inStorageDate" label="入库时间" width="140">
              <template #default="{ row, column, $index }">
                {{ common.formatDate(row.inStorageDate, 'YYYY-MM-DD HH:mm:ss') }}
              </template>
            </el-table-column>
            <el-table-column prop="produceDate" label="生产日期" width="140">
              <template #default="{ row, column, $index }">
                {{ common.formatDate(row.produceDate, 'YYYY-MM-DD HH:mm:ss') }}
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- <el-tab-pane label="图形入库" name="图形入库">
          <el-table ref="detailTable" :data="enterProductPosition" :max-height="'300px'" size="small" style="width: 100%">
            <el-table-column prop="storageName" label="仓库" width="120">
              <template #default="{ row }">
                <el-select v-model="row.storageName" :disabled="row.productStorage" filterable placeholder="请选择仓库" style="width: 120px">
                  <el-option v-for="item in state.storageNames" :key="item.storageId" :label="item.storageName" :value="item.storageName" @click="row.storageId = item.storageId"> </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="consignorName" label="货主名称" width="140">
              <template #default="{ row }">
                <el-select v-model="row.consignorName" :disabled="row.productStorage" filterable placeholder="请选择货主" style="width: 120px">
                  <el-option v-for="item in state.consignorNames" :key="item.consignorId" :label="item.consignorName" :value="item.consignorName" @click="row.consignorId = item.consignorId"> </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="providerShortName" label="供应商" width="140">
              <template #default="{ row }">
                <el-select v-model="row.providerShortName" :disabled="row.productStorage" filterable placeholder="请选择供应商" style="width: 120px">
                  <el-option v-for="item in state.providerShortNames" :key="item.providerId" :label="item.providerShortName" :value="item.providerId"> </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="productCode" label="商品编号"> </el-table-column>
            <el-table-column prop="productModel" label="商品条码" width="90"> </el-table-column>
            <el-table-column prop="productName" label="商品名称" width="180"> </el-table-column>
            <el-table-column prop="produceDate" label="生产日期" width="180">
              <template #default="{ $idnex, row }">
                <el-date-picker v-model="row.produceDate" :disabled="row.productStorage" type="date" placeholder="选择日期" style="width: 170px"> </el-date-picker>
              </template>
            </el-table-column>
            <el-table-column prop="productStorage" label="库存量" width="90"> </el-table-column>
            <el-table-column prop="orignStorage" label="入库数量" width="100">
              <template #default="{ row }">
                <el-input v-model="row.orignStorage"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="productSpec" label="商品规格" width="80"> </el-table-column>
            <el-table-column prop="smallUnit" label="单位" width="80"> </el-table-column>
            <el-table-column prop="weight" label="单位毛重" width="80"> </el-table-column>
            <el-table-column prop="totalWeight" label="小计毛重" width="80"> </el-table-column>
            <el-table-column prop="totalWeight" label="合计重量吨" width="80"> </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="图形出库" name="图形出库">
          <el-table ref="detailTable" :data="saleProductPosition" :max-height="'300px'" size="small" style="width: 100%">
            <el-table-column prop="storageName" label="仓库" width="120"> </el-table-column>
            <el-table-column prop="consignorName" label="货主名称" width="140"> </el-table-column>
            <el-table-column prop="providerShortName" label="供应商" width="110"> </el-table-column>
            <el-table-column prop="clientShortName" label="客户名称" width="130">
              <template #default="{ row }">
                <el-select v-model="row.clientShortName" filterable placeholder="请选择客户" style="width: 120px">
                  <el-option v-for="item in state.clientShortNames" :key="item.label" :label="item.value" :value="item.label"> </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="productCode" label="商品编号"> </el-table-column>
            <el-table-column prop="productModel" label="商品条码" width="90"> </el-table-column>
            <el-table-column prop="productName" label="商品名称" width="140"> </el-table-column>
            <el-table-column prop="produceDate" label="生产日期" width="120">
              <template #default="{ row, column, $index }">
                {{ common.formatDate(row.produceDate, 'YYYY-MM-DD HH:mm:ss') }}
              </template>
            </el-table-column>
            <el-table-column prop="productStorage" label="库存量" width="90"> </el-table-column>
            <el-table-column prop="finishedQuantity" label="出库数量" width="100">
              <template #default="{ row }">
                <el-input v-model="row.finishedQuantity"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="productSpec" label="商品规格" width="80"> </el-table-column>
            <el-table-column prop="smallUnit" label="单位" width="80"> </el-table-column>
            <el-table-column prop="weight" label="单位毛重" width="80"> </el-table-column>
            <el-table-column prop="totalWeight" label="小计毛重" width="80"> </el-table-column>
          </el-table>
        </el-tab-pane> -->
      </el-tabs>
      <template #footer>
        <el-button v-if="state.tabIndex === '库存详情'" @click="currentDialogVisible = false">关闭</el-button>
        <el-button v-if="state.tabIndex === '图形入库'" @click="openSelected">添加商品</el-button>
        <el-button v-if="state.tabIndex === '图形入库'" @click="noBillScanEnter">确认入库</el-button>
        <el-button v-if="state.tabIndex === '图形出库'" @click="noBillScanSale">确认出库</el-button>
      </template>
    </el-dialog>

    <!--明细选择器-->
    <yrt-selector ref="selector-dialog" :config="state.selectorConfig" :visible.sync="state.selectorConfig.visible" @on-selected="onSelected"></yrt-selector>
  </div>
</template>

<script setup lang="ts" name="position-storage-dialog">
const yrtSelector = defineAsyncComponent(() => import('/@/components/common/yrtSelector.vue'));
const emit = defineEmits(['update:visible', 'on-closed']);
import to from 'await-to-js';
import { postData } from '/@/api/common/baseApi';
import { BaseProperties } from '/@/types/base-type';
import { ComponentInternalInstance } from 'vue';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

//#region 定义属性
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  // 对话框标题
  detailTitle: {
    type: String,
    default: null,
  },
  // 货位数据列表
  dataConfig: {
    type: Object,
    default: () => {
      return {};
    },
  },
  // 仓库ID
  storageId: {
    type: Number,
    default: null,
  },
  // 仓库名称
  storageName: {
    type: String,
    default: null,
  },
});
//#endregion

//#region 定义变量
const state = reactive({
  clientShortNames: [] as any[],
  // 供应商
  providerShortNames: [] as any[],
  // 货主 列表
  consignorNames: [] as any[],
  // 仓库 列表
  storageNames: [] as any[],
  tabIndex: '库存详情',
  // 选择器配置参数
  selectorConfig: {
    title: '商品选择器',
    width: '1000px',
    visible: false,
    // 配置路由
    router: '/selector/product',
  },
  // 隐藏金额
  hiddenMoney: false,
});
//#endregion

// 是否显示dialog
const currentDialogVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val); // 双向绑定prop.action，通知父级组件变量值同步更新
  },
});

// 货位详细数据
const productPositionList = computed(() => {
  return props.dataConfig.productPositionList;
});
const enterProductPosition = computed(() => {
  return props.dataConfig.enterProductPosition;
});
const saleProductPosition = computed(() => {
  return props.dataConfig.saleProductPosition;
});

onMounted(() => {
  // getStorageList();
  // getConsignorList();
  // getProvider();
  // getClientList();
  // getAuth(); // 获取权限点
});

// 确认入库
const noBillScanEnter = async () => {
  let positionName = props.detailTitle;
  if (positionName) {
    positionName = positionName.replace('货位库存详情-', '');
  }
  var enterProductPosition = props.dataConfig.enterProductPosition
    .filter((item: any) => item.product_Id && item.orignStorage > 0 && !item.productStorage)
    .map((item: any) => {
      return {
        storageId: item.storageId,
        storageName: item.storageName,
        consignorId: item.consignorId,
        consignorCode: item.consignorCode,
        consignorName: item.consignorName,
        providerId: item.providerId,
        providerCode: item.providerCode,
        providerShortName: item.providerShortName,

        product_Id: item.product_Id,
        finishedQuantity: item.orignStorage,
        positionName: positionName,
        produceDate: item.produceDate,
        purchasePrice: item.purchasePrice,
        batchNumber: item.batchNumber,
        productSpec: item.productSpec,
        plateCode: item.plateCode,
        weight: item.weight || 0,
        totalWeight: item.scanWeight || 0,
        singleSignCode: item.singleSignCode,
      };
    });
  if (enterProductPosition.length === 0) {
    proxy.$message.error('至少录入一条数据');
    return;
  }
  var url = '/api/inbound/inScan/purchaseEnterNoBillSave';
  var params = {
    dataList: enterProductPosition,
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    proxy.$message.error(err.message);
    return;
  }
  if (res?.result) {
    proxy.common.showMsg(res);
  }
};

// 确认出库
const noBillScanSale = async () => {
  let positionName = props.detailTitle;
  if (positionName) {
    positionName = positionName.replace('货位库存详情-', '');
  }
  const enterProductPosition = props.dataConfig.saleProductPosition.filter((item: any) => item.finishedQuantity > 0);
  var emptyPositionName = enterProductPosition
    .filter((item: any) => {
      return !item.positionName;
    })
    .map((item: any) => {
      return item.productModel;
    })
    .join(',');

  if (emptyPositionName) {
    proxy.$message.error('条形码[' + emptyPositionName + ']货位不能为空！');
    return;
  }
  if (!enterProductPosition.length) {
    proxy.$message.error('请扫描需要出库的商品！');
    return;
  }
  var url = '/api/outbound/noBillScan/saleOuterNoBillSaveByConsignor';
  var params = {
    positionName: positionName,
    dataList: enterProductPosition,
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    proxy.$message.error(err.message);
    return;
  }
  if (res?.result) {
    proxy.common.showMsg(res);
  }
};

const openSelected = () => {
  const selector = proxy.$refs['selector-dialog'];
  selector.setReadOnly('consignorId', true); // 设为只读
  selector.loadData();
  state.selectorConfig.visible = true;
};

// 将商品选择器 选择中的数据 填充到明细表中
const onSelected = (rows: any[]) => {
  rows.forEach((row: any) => {
    row.storageId = props.storageId;
    row.storageName = props.storageName;
    props.dataConfig.enterProductPosition.push(row);
  });
  state.selectorConfig.visible = false;
};

// 获取仓库
const getStorageList = async () => {
  const url = '/api/basicInfo/base/storage/getList';
  const params = {};
  const [err, res] = await to(postData(url, params));
  if (err) {
    proxy.$message.error(err.message);
    return;
  }
  if (res?.result) {
    state.storageNames = res.data;
  }
};

// 获取供应商列表
const getProvider = async () => {
  const url = '/api/basicInfo/base/provider/getList';
  const params = {};
  const [err, res] = await to(postData(url, params));
  if (err) {
    proxy.$message.error(err.message);
    return;
  }
  if (res?.result) {
    state.providerShortNames = res.data;
  }
};

// 获取货主名称下拉框
const getConsignorList = async () => {
  const url = '/api/basicInfo/base/consignor/getList';
  const params = {};
  const [err, res] = await to(postData(url, params));
  if (err) {
    proxy.$message.error(err.message);
    return;
  }
  if (res?.result) {
    state.consignorNames = res.data;
  }
};

// 获取货主名称下拉框
const getClientList = async () => {
  const url = '/api/basicInfo/base/client/getList';
  const params = {};
  const [err, res] = await to(postData(url, params));
  if (err) {
    proxy.$message.error(err.message);
    return;
  }
  if (res?.result) {
    state.clientShortNames = res.data.map((item: any) => {
      item.value = item.clientId;
      item.label = item.clientShortName;
      return item;
    });
  }
};

// 获取权限点
const getAuth = async () => {
  const url = '/api/auth/getAuth';
  const params = { id: 1546 };
  const [err, res] = await to(postData(url, params));
  if (err) {
    proxy.$message.error(err.message);
    return;
  }
  if (res?.result) {
    if (res.data && res.data.indexOf('hiddenMoney=1') >= 0) {
      state.hiddenMoney = true;
    } else {
      state.hiddenMoney = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.position-dialog-container {
  ::v-deep .el-dialog__body {
    padding-top: 0px;
  }
  .form-wrap {
    margin-top: 20px;
  }
}
</style>
