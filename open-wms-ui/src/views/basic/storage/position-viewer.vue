<template>
  <div id="container" ref="container" class="position-container">
    <el-form ref="form" :inline="true" :model="state.formData" class="demo-form-inline">
      <el-form-item label="仓库">
        <el-select v-model="state.formData.storageId" style="width: 120px" placeholder="请选择仓库" @change="onStorageChange(state.formData.storageId)">
          <el-option v-for="(item, index) in state.storageList" :key="index" :label="item.storageName" :value="item.storageId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="库区">
        <el-select v-model="state.formData.areaCode" style="width: 120px" placeholder="请选择库区" @change="onStorageAreaChange(state.formData.areaCode)">
          <el-option v-for="(item, index) in state.storageAreaList" :key="index" :label="item.areaCode" :value="item.areaCode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="RefreshRight" @click="refreshArea">刷新</el-button>
      </el-form-item>
      <br />

      <el-form-item label="库区">
        <span id="i_storageArea" class="area-content">{{ state.areaData.areaCode }}</span>
      </el-form-item>
      <el-form-item label="货架模式">
        <span id="i_shelveMode" class="area-content">{{ state.areaData.shelveMode }}</span>
      </el-form-item>
      <el-form-item label="货位类型">
        <span id="i_PositionType" class="area-content">{{ dropdownStore.translateText(state.areaData.positionType, 501) }}</span>
      </el-form-item>
      <el-form-item label="通道数">
        <span id="i_channelNum" class="area-content">{{ state.areaData.channelNum }}</span>
      </el-form-item>

      <template v-if="state.areaData.shelveMode !== '地堆'">
        <template v-if="state.areaData.pickMode === 'U型'">
          <el-form-item label="拣货模式">
            <span id="i_pickMode" class="area-content">{{ state.areaData.pickMode }}</span>
          </el-form-item>
          <el-form-item label="货架A面">
            <span id="i_shelveNumA_1" class="area-content">{{ state.areaData.shelveNumA_1 }}</span> ~
            <span id="i_shelveNumA_2" class="area-content">{{ state.areaData.shelveNumA_2 }}</span>
          </el-form-item>
          <el-form-item label="货架B面">
            <span id="i_shelveNumB_1" class="area-content">{{ state.areaData.shelveNumB_1 }}</span> ~
            <span id="i_shelveNumB_2" class="area-content">{{ state.areaData.shelveNumB_2 }}</span>
          </el-form-item>
        </template>
        <template v-if="state.areaData.pickMode !== 'U型'">
          <el-form-item label="拣货模式">
            <span id="i_pickMode_U" class="area-content">{{ state.areaData.pickMode }}</span>
          </el-form-item>
          <el-form-item label="货架A面">
            <span id="i_shelveNumZ_1" class="area-content">{{ state.areaData.shelveNumA_1 }}</span> ~
            <span id="i_shelveNumZ_2" class="area-content">{{ state.areaData.shelveNumA_2 }}</span>
          </el-form-item>
        </template>
      </template>

      <el-form-item label="列数">
        <span id="i_colNum" class="area-content">{{ state.areaData.columnNum }}</span>
      </el-form-item>
      <el-form-item :label="state.areaData.rowTitle">
        <span id="i_rowNum" class="area-content">{{ state.areaData.rowNum }}</span>
      </el-form-item>
    </el-form>
    <el-tabs v-model="state.tabIndex">
      <el-tab-pane label="示意图" name="示意图">
        <!-- BEGIN PAGE -->
        <div class="layoutarea">
          <div class="position-layout">
            <!--整体外框-->
            <div ref="refDraw" v-drawposition="{ areaData: state.areaData, storageData: state.storageData, shelveDataList: state.shelveDataList, channelDataList: state.channelDataList, isViewer: true, isRefresh: state.isRefresh, updateRefresh: updateRefresh, displayDetail: displayDetail, getPositionList: getPositionList }" class="table-wrap clearfix"></div>
          </div>
          <!--整体外框-->
        </div>
        <!-- END PAGE -->
      </el-tab-pane>
      <el-tab-pane label="2D图" name="2D图">
        <svg-box :svg-url="state.svgUrl" :from-data="state.formData" :position-list="state.positionList"></svg-box>
      </el-tab-pane>
    </el-tabs>

    <!-- 货位库存明细对话框 -->
    <position-storage-dialog :detail-title="state.detailTitle" v-model:visible="state.detailVisible" :data-config="state.dataConfig"></position-storage-dialog>
  </div>
</template>

<script setup lang="ts" name="basic-storage-position-viewer">
import PositionStorageDialog from './components/position-storage-dialog.vue';
const svgBox = defineAsyncComponent(() => import('./components/svg-box.vue'));
const PositionDialog = defineAsyncComponent(() => import('./components/position-dialog.vue'));
import { vDrawposition } from './directives/drawposition';
// import ImportDialog from '@/components/common/components/import-common-dialog';
import { BaseProperties } from '/@/types/base-type';
import to from 'await-to-js';
import { postData } from '/@/api/common/baseApi';
import { ComponentInternalInstance, ref, unref } from 'vue';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
// 引用下拉框状态管理组件
import useDropdownStore from '/@/stores/modules/dropdown';
const dropdownStore = useDropdownStore();

//#region 定义变量
const state = reactive({
  isLoading: false,
  // 表单数据
  formData: {
    storageId: undefined,
    storageName: '',
    areaCode: '',
  },
  // 仓库下拉框值
  storageList: [] as any[],
  // 库区下拉框值
  storageAreaList: [] as any[],
  // 库区数据
  areaData: {
    storageId: undefined,
    storageName: '',
    positionType: null,
    areaCode: 'A',
    pickMode: 'U型',
    shelveMode: '立体货架',
    maxCapacity: 100,
    channelNum: 0,
    rowNum: 0,
    columnNum: 0,
    shelveNumA_1: 0,
    shelveNumA_2: 0,
    shelveNumB_1: 0,
    shelveNumB_2: 0,
    positionRegular: null,
    channelRegular: null,
    shelvesRegular: null,
    rowRegular: null,
    columnRegular: null,
    action: 'add',
    rowTitle: '层数',
    maxWeight: 0,
    maxBeatNumber: 0,
    channelNumDidui: 0,
    rowNumDidui: 0,
    columnNumDidui: 0,
    shelveNumZ1: 0,
    shelveNumZ2: 0,
    shelveNumA1: 0,
    shelveNumA2: 0,
    svgUrl: '',
  },
  // 仓库数据
  storageData: {
    positionRegular: null,
    channelRegular: null,
    shelvesRegular: null,
    rowRegular: null,
    columnRegular: null,
    action: 'add',
    storageName: '',
  },
  // 货架信息
  shelveDataList: [],
  // 通道货架数
  channelDataList: [],
  // 刷新货位数据
  isRefresh: false,
  // 显示货位库存详情对话框
  detailVisible: false,
  detailTitle: '货位库存详情',
  // 货位库存详情数据列表
  dataConfig: {
    productPositionList: [],
  },
  // 当前选中tab
  tabIndex: '示意图',
  // svg内容
  svgUrl: '',
  positionList: [] as any[],
});
//#endregion

onMounted(() => {
  dropdownStore.loadDropDownById([501]);
  getStorageList();
});

// 获得仓储列表
const getStorageList = async () => {
  const url = '/basic/storage/storage/getList';
  const params = {
    searchFields: 'storageId,storageCode,storageName,positionRegular',
  };
  const [err, res] = await to(postData(url, params));
  if (res?.result) {
    state.storageList = res.data;
  }
};

// 仓库选择改变后，获得库区列表
const onStorageChange = async (storageId: any) => {
  state.storageAreaList = [];
  if (state.formData.storageId !== storageId) {
    state.formData.areaCode = '';
  }
  state.storageData = state.storageList.find((item: any) => item.storageId === storageId);
  state.formData.storageName = state.storageData.storageName;

  let url = '/basic/storage/storageArea/getAreaList';
  let params = {
    storageId: storageId,
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    proxy.$message.error(err.message);
    return;
  }
  if (res.result) {
    state.storageAreaList = res.data;
  }
};

// 库区选择改变后
const onStorageAreaChange = async (areaCode: any) => {
  state.areaData = state.storageAreaList.find((item: any) => {
    return item.areaCode === areaCode;
  });
  state.areaData.maxWeight = Number(state.areaData.maxWeight);
  state.areaData.maxBeatNumber = Number(state.areaData.maxBeatNumber);
  state.areaData.maxCapacity = Number(state.areaData.maxCapacity);

  await loadArea(areaCode);
  getsvgUrl();
};

// 加载货架数据
const loadShelveList = async (areaCode: any) => {
  state.shelveDataList = []; // 初始化货架数据
  state.channelDataList = []; // 初始化通道货架数据

  let url = '/basic/storage/storageArea/loadShelveList';
  let params = {
    storageId: state.formData.storageId,
    areaCode: areaCode,
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    proxy.$message.error(err.message);
    return;
  }
  if (res.result) {
    state.shelveDataList = JSON.parse(res.data.jsonData); // 货架信息集合
    state.channelDataList = JSON.parse(res.data.channelDataList || '[]');
    state.isRefresh = true;
  }
};

// 加载库区数据
const loadArea = async (areaCode: any) => {
  let url = '/basic/storage/storageArea/getStorageAreaInfo';
  let params = {
    storageId: state.formData.storageId,
    areaCode: areaCode,
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    proxy.$message.error(err.message);
    return;
  }

  if (res.result) {
    state.areaData = res.data;
    if (state.areaData.positionType) {
      state.areaData.positionType = state.areaData.positionType;
    }
    state.areaData.rowTitle = '层数';
    if (state.areaData.shelveMode === '地堆') {
      state.areaData.channelNumDidui = state.areaData.channelNum;
      state.areaData.rowNumDidui = state.areaData.rowNum;
      state.areaData.columnNumDidui = state.areaData.columnNum;
      state.areaData.rowTitle = '行数';
    } else if (state.areaData.shelveMode === '立体货架') {
      if (state.areaData.pickMode === 'Z型') {
        state.areaData.shelveNumZ1 = state.areaData.shelveNumA1;
        state.areaData.shelveNumZ2 = state.areaData.shelveNumA2;
      }
    }
    state.storageData.action = 'modify';

    // state.isRefresh = true;
    loadShelveList(areaCode); // 加载货架
  }
};

// 刷新
const refreshArea = () => {
  state.isRefresh = true;
};

// 修改刷新状态
const updateRefresh = (isRefresh: any) => {
  state.isRefresh = isRefresh;
};

// 显示库存详情数据
const displayDetail = async (cellTarget: any, positionName: any) => {
  debugger;
  state.detailVisible = true;
  state.detailTitle = '货位库存详情-' + positionName;
  // 获得库存数据
  const url = '/inventory/core/inventory/selectValidInventoryList';
  const params = {
    storageId: state.formData.storageId,
    areaCode: state.formData.areaCode,
    positionName: positionName,
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    proxy.$message.error(err.message);
    return;
  }
  if (res.result) {
    state.dataConfig.productPositionList = res.data;
    state.dataConfig.productPositionList.forEach((item: any) => {
      item.productStorage = Number(item.productStorage);
      item.rowWeight = Number(item.rowWeight);
      item.purchasePrice = Number(item.purchasePrice);
      item.purchaseAmount = Number(item.purchaseAmount);
    });
  }
};

// 获取svg内容
const getsvgUrl = () => {
  state.svgUrl = state.areaData.svgUrl;
};

const getPositionList = async (dataList: any) => {
  state.positionList = dataList;
};
</script>

<style lang="scss" scoped>
.position-container {
  padding: 10px;
  background-color: white;
  border-bottom: 1px solid #eee;
  ::v-deep .el-form-item__label {
    padding: 0;
    &::after {
      content: '：';
    }
  }

  .layoutarea {
    overflow-x: auto;
    overflow-y: visible;
    .position-layout {
      width: 50000px;
    }
  }

  /* table-wrap */
  ::v-deep .table-wrap {
    position: relative;
    display: inline-block;
    * {
      margin: 0;
      padding: 0;
      list-style: none;
      font-family: '微软雅黑', Arial;
    }
    .table-row {
      position: relative;
      background-color: #fff;
      min-height: 100px;
      padding: 10px 0 10px 0;
      border-bottom: 1px solid #ccc;
      .column-num {
        width: 35px;
        height: 50px;
        position: absolute;
        margin-top: -25px;
        left: 10px;
        top: 50%;
        font-size: 14px;
        color: #666;
        z-index: 100;
        cursor: pointer;
      }
    }

    .table-row.didui {
      margin: 20px 0;
    }

    .table-row .column-num p {
      font-size: 24px;
      font-family: Arial, Helvetica, sans-serif;
      font-weight: 400;
      color: #333;
    }

    .table-row .t-box {
      position: relative;
    }

    .table-row .t-box .guanlian-line {
      display: block;
      width: 20px;
      background-color: #fff;
      border: 1px solid #ccc;
      border-right: none;
      height: 10px;
      position: absolute;
      top: 50%;
      left: 60px;
    }

    .table-row .column-line {
      min-height: 100px;
      padding-left: 100px;
    }

    .table-row .column-line.didui {
      padding-left: 50px;
    }

    .table-row .column-line .nood-a,
    .table-row .column-line .nood-b {
      position: relative;
    }

    .table-row .column-line .nood-a .nood-text,
    .table-row .column-line .nood-b .nood-text {
      display: block;
      width: 18px;
      height: 40px;
      line-height: 1.5;
      position: absolute;
      top: 50%;
      margin-top: 15px;
      left: -20px;
      font-size: 12px;
      color: #666;
      border: 1px solid #ccc;
      text-align: center;
    }

    .table-row .column-line .nood-b .nood-text {
      margin-top: -50px !important;
    }

    .table-row .column-line .table-reset {
      display: inline-block;
      margin-left: 50px;
      position: relative;
      vertical-align: top;
    }

    .table-row .column-line .table-reset .table-num {
      font-size: 14px;
      color: #666;
      font-weight: 400;
      margin: 0 0 25px 0;
    }

    .table-row .column-line .table-reset .table-num.didui {
      margin: 0 0 0px 0;
    }

    .table-row .column-line .table-reset .table-num strong {
      font-size: 24px;
      font-weight: 400;
      padding-left: 5px;
      color: #333;
      cursor: pointer;
    }

    .table-row .column-line .table-reset .table-num.didui strong {
      display: none;
    }

    .table-row .column-line .table-reset .table-list-ul {
      position: relative;
      display: table;
    }

    /* .table-row .column-line .table-reset .table-list-ul:last-child{ border-bottom:1px solid #ccc;} */

    .table-row .column-line .table-reset .table-list-ul li {
      position: relative;
      min-width: 100px;
      width: 100px;
      padding-right: 5px;
      height: 30px;
      line-height: 30px;
      border: 1px solid #ccc;
      border-right: none;
      border-bottom: none;
      display: table-cell;
      font-size: 12px;
      padding-left: 5px;
      color: #666;
      cursor: pointer;
    }

    .table-row .column-line .table-reset .table-list-ul li.border-bottom {
      border-bottom: 1px solid #ccc;
    }

    .table-row .column-line .table-reset .table-list-ul li:last-child {
      border-right: 1px solid #ccc;
    }

    .table-row .column-line .table-reset .table-list-ul li .t-n {
      position: absolute;
      top: -30px;
      left: 10px;
      font-size: 12px;
      cursor: pointer;
    }

    .table-row .column-line .table-reset .table-list-ul li .b-n {
      position: absolute;
      bottom: -30px;
      left: 10px;
      font-size: 12px;
      cursor: pointer;
    }

    .table-row .column-line .table-reset .table-list-ul li .l-n {
      position: absolute;
      left: -25px;
      top: 1px;
      font-size: 12px;
      cursor: pointer;
    }

    /* B面style */

    .table-row .column-line .nood-b {
      margin-top: 20px;
    }

    .table-row .column-line .nood-b .table-num {
      font-size: 14px;
      color: #666;
      font-weight: 400;
      margin: 20px 0 0 0;
    }

    .nood-b .table-reset .table-list-ul:last-child {
      border-bottom: 10px solid #ccc !important;
      background-color: red !important;
    }

    /* 图标类型 */

    .postype-1 {
      display: inline-block;
      width: 8px;
      height: 8px;
      background: url(/static/images/type.png) no-repeat 0 0;
      vertical-align: middle;
      position: absolute;
      bottom: 3px;
      right: 3px;
    }

    .postype-2 {
      display: inline-block;
      width: 8px;
      height: 8px;
      background: url(/static/images/type.png) no-repeat -8px 0;
      vertical-align: middle;
      position: absolute;
      bottom: 3px;
      right: 3px;
    }

    .postype-3 {
      display: inline-block;
      width: 8px;
      height: 8px;
      background: url(/static/images/type.png) no-repeat -16px 0;
      vertical-align: middle;
      position: absolute;
      bottom: 3px;
      right: 3px;
    }

    .postype-4 {
      display: inline-block;
      width: 8px;
      height: 8px;
      background: url(/static/images/type.png) no-repeat -24px 0;
      vertical-align: middle;
      position: absolute;
      bottom: 3px;
      right: 3px;
    }

    .postype-5 {
      display: inline-block;
      width: 8px;
      height: 8px;
      background: url(/static/images/type.png) no-repeat -32px 0;
      vertical-align: middle;
      position: absolute;
      bottom: 3px;
      right: 3px;
    }

    .postype-6 {
      display: inline-block;
      width: 8px;
      height: 8px;
      background: url(/static/images/type.png) no-repeat -40px 0;
      vertical-align: middle;
      position: absolute;
      bottom: 3px;
      right: 3px;
    }

    .postype-7 {
      display: inline-block;
      width: 8px;
      height: 8px;
      background: url(/static/images/type.png) no-repeat -48px 0;
      vertical-align: middle;
      position: absolute;
      bottom: 3px;
      right: 3px;
    }

    .locked {
      display: inline-block;
      width: 8px;
      height: 8px;
      background: url(/static/images/type.png) no-repeat -56px 0;
      vertical-align: middle;
      position: absolute;
      top: 3px;
      right: 3px;
    }

    .isMixProduct {
      display: inline-block;
      width: 8px;
      height: 8px;
      background: url(/static/images/type.png) no-repeat -64px 0;
      vertical-align: middle;
      position: absolute;
      top: 3px;
      right: 3px;
    }

    .nostorage {
      margin: 5px;
      color: #dcdcdc;
    }
    .storageRate {
      height: 6px;
      margin-right: 3px;
      border: 1px solid #eee;
      margin-bottom: 2px;
    }
    .productStorage {
      padding: 1px;
      min-width: 16px;
      text-align: center;
      background-color: #f60;
      color: white;
      float: left;
      margin-right: 5px;
      font-size: 9px;
      line-height: 1.5;
    }
    .validStorage {
      padding: 1px;
      min-width: 16px;
      text-align: center;
      background-color: #2eade8;
      color: white;
      float: left;
      margin-right: 5px;
      font-size: 9px;
      line-height: 1.5;
    }
    .holderStorage {
      padding: 1px;
      min-width: 16px;
      text-align: center;
      background-color: #080706;
      color: white;
      float: left;
      margin-right: 5px;
      font-size: 9px;
      line-height: 1.5;
    }
    .holderStorage {
      padding: 1px;
      min-width: 16px;
      text-align: center;
      background-color: #080706;
      color: white;
      float: left;
      margin-right: 5px;
      font-size: 9px;
      line-height: 1.5;
    }
    .plateCount {
      padding: 1px;
      min-width: 16px;
      text-align: center;
      background-color: #850640;
      color: white;
      float: left;
      margin-right: 5px;
      font-size: 9px;
      line-height: 1.5;
    }
  }
}
</style>
