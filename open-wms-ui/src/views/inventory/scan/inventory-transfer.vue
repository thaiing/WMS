<template>
  <div ref="container" class="scan-container">
    <el-card class="scan-card">
      <template #header>
        <div class="clearfix">
          <span>{{ $tt('货位转移扫描') }}</span>
        </div>
      </template>
      <el-row>
        <el-col :xl="11" :md="14" :xs="24">
          <el-form ref="form" :model="state.formData" label-width="120px" class="scan-form">
            <el-form-item :label="$tt('仓库')">
              <el-select v-model="state.formData.storageId" :placeholder="$tt('请选择仓库')" class="input-300" @change="getPositionList">
                <el-option v-for="(item, index) in state.storageList" :key="index" :label="item.storageName" :value="item.storageId"></el-option>
              </el-select>
              <span class="sub-item">
                <span class="sub-label">{{ $tt('容器合并') }}</span>
                <el-switch v-model="state.formData.isContainerMerge" @change="onIsContainerMerge"></el-switch>
              </span>
              <span class="sub-item">
                <span class="sub-label">{{ $tt('开启SN') }}</span>
                <el-switch v-model="state.formData.isScanSn" @change="onIsScanSnChange"></el-switch>
              </span>
            </el-form-item>
            <el-form-item :label="$tt('原货位')">
              <el-select v-model="state.formData.originalPositionName" filterable placeholder="请选择原货位" class="input-300">
                <el-option v-for="(item, index) in state.positionNameList" :key="index" :label="item.positionName" :value="item.positionName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$tt('目标货位')">
              <el-select v-model="state.formData.targetPositionName" filterable placeholder="请选择目标货位" class="input-300" @change="scanOriginalPositionName()">
                <el-option v-for="(item, index) in state.positionNameList" :key="index" :label="item.positionName" :value="item.positionName"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item v-if="state.formData.isContainerMerge" :label="$tt('目标容器')">
              <el-input ref="targetPlateCode" v-model="state.formData.targetPlateCode" class="input-300" @keyup.enter="plateCodeEnter"></el-input>
            </el-form-item>
            <el-form-item v-if="state.formData.isCheckProductModel" :label="$tt('商品条码')">
              <el-input ref="productModel" v-model="state.formData.productModel" class="input-300" @keyup.enter.stop="checkPackingBarcode"></el-input>
              <span class="sub-item">
                <span class="sub-label">{{ $tt('扫描数量') }}</span>
                <el-input-number ref="scanQty" v-model="state.formData.scanQty" :min="0" class="input-100" controls-position="right" @change="changeScanQty"></el-input-number>
              </span>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="save">{{ $tt('确认转移') }}</el-button>
              <el-button type="primary" @click="clearData">{{ $tt('清空') }}</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col v-if="state.formData.isScanSn" :xl="12" :md="10" :xs="24">
          <el-form ref="formSn" :model="state.formData" label-position="top" label-width="120px" class="scan-sn-form">
            <el-form-item :label="$tt('扫描SN')">
              <el-input ref="snList" v-model="state.formData.snList" type="textarea" :rows="6" class="input-500" @blur="base.scanSn" @keyup.stop="base.scanSn"></el-input>
              <div class="color-666">
                {{ $tt('SN条数') }}：
                <span>{{ state.formData.scanQty }}</span>
              </div>
            </el-form-item>
          </el-form>
          <!-- <el-form ref="formSn" :model="state.formData" label-position="top" label-width="120px" class="scan-sn-form">
            <el-form-item :label="$tt('核验SN列表')">
              <el-input ref="checkSnList" v-model="state.formData.checkSnList" type="textarea" :disabled="true" :rows="6" class="input-500"></el-input>
            </el-form-item>
          </el-form> -->
        </el-col>
      </el-row>
    </el-card>

    <el-card class="scan-card body-no-padding mt-10">
      <template #header>
        <div class="clearfix">
          <span>{{ $tt('扫描结果') }}</span>
          <el-button link class="floatRight" @click="state.setting.visible = true">{{ $tt('字段设置') }}</el-button>
        </div>
      </template>
      <el-table ref="scan-table" :data="base.state.tableData" :row-class-name="base.rowClass" max-height="500" stripe style="width: 100%" class="scan-table" size="small" @row-click="base.setCurrent">
        <template v-for="(item, index) in state.setting.fields">
          <!--SN序列号-->
          <template v-if="'singleSignCode'.indexOf(item.prop) >= 0 && state.formData.isScanSn">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width">
              <template #default="{ row, col }">
                <span class="sn-text">{{ row.singleSignCode }}</span>
                <span class="sn-count">[{{ $tt('SN数') }}：{{ row.singleSignCode ? row.singleSignCode.split(',').length : 0 }}]</span>
              </template>
            </el-table-column>
          </template>
          <template v-else>
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width"></el-table-column>
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

<script setup lang="ts" name="inventory-scan-inventory-transfer">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';
import { postData } from '/@/api/common/baseApi';
import to from 'await-to-js';
import moment from 'moment';
import useDropdownStore from '/@/stores/modules/dropdown';
import scanHook from '/@/components/hooks/scanHook';
import { PositionTypeEnum } from '/@/enums/PositionTypeEnum';
const ScanSettingDialog = defineAsyncComponent(() => import('/@/components/common/components/scanSettingDialog.vue'));
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
const dropdownStore = useDropdownStore();

//#region 配置参数
let config = ref({
  // 支持一品多码
  sku_productToMultiBarcode: true,
  caseMode: 0,
});
//#endregion
const base = scanHook({
  config,
  // 自定义扫描选择过滤器
  customFindFilter: (dataRows: Array<any>, code: string) => {
    let rows = dataRows.filter((item: any) => {
      const exist = base.checkProductModelExist(code, item);
      const unFinishedQuantity = item.unFinishedQuantity || 0;
      // UnFinishedQuantity不存在或者大于0
      return exist && (item.unFinishedQuantity === undefined || unFinishedQuantity > 0);
    });
    if (rows.length) return [rows[0]]; // 返回一条
    else return []; // 返回空
  },
});

//#region 定义变量
const state = reactive({
  formData: {
    ...toRefs(base.state.formData),
    targetPositionName: '', // A-01080105
    originalPositionName: '', // A-01010102
    isCheckProductModel: true,
    isContainerMerge: false, // 容器合并
    targetPlateCode: '',
  },
  storageList: [] as any[],
  positionNameList: [] as any[],
  // 一次扫描的数量
  scanCount: 1,
  // 扫描明细数据集合
  tableData: [] as any[],
  // 已经找到的数据
  existRows: [],
  // 扫描列设置对话框参数
  setting: {
    visible: false,
    name: 'storage-position-transfer-scan',
    fields: [
      {
        prop: 'productModel',
        label: '条形码',
        visible: true,
        width: 140,
        order: 1,
      },
      {
        prop: 'storageName',
        label: '仓库',
        visible: true,
        width: 100,
        order: 3,
      },
      {
        prop: 'consignorName',
        label: '货主',
        visible: true,
        width: 100,
        order: 3,
      },
      {
        prop: 'positionName',
        label: '原货位',
        visible: true,
        width: 100,
        order: 4,
      },
      {
        prop: 'targetPositionName',
        label: '目标货位',
        visible: true,
        width: 120,
        order: 5,
      },
      {
        prop: 'finishedQuantity',
        label: '已扫数量',
        visible: true,
        width: 100,
        order: 6,
      },
      {
        prop: 'unFinishedQuantity',
        label: '未扫描数量',
        visible: true,
        width: 100,
        order: 7,
      },
      {
        prop: 'productCode',
        label: '商品编号',
        visible: true,
        width: 130,
        order: 8,
      },
      {
        prop: 'productSpec',
        label: '商品规格',
        visible: true,
        width: 100,
        order: 9,
      },
      {
        prop: 'singleSignCode',
        label: '序列号(SN)',
        visible: true,
        width: 200,
        order: 7,
      },
      {
        prop: 'produceDate',
        label: '生产日期',
        visible: true,
        width: 90,
        order: 2,
        formatter: 'YYYY-MM-DD',
      },
      {
        prop: 'relationCode',
        label: '关联码',
        visible: true,
        width: 140,
        order: 2,
      },
      {
        prop: 'targetPlateCode',
        label: '目标容器',
        visible: true,
        width: 140,
        order: 2,
      },
      {
        prop: 'weight',
        label: '单位毛重',
        visible: false,
        width: 80,
        order: 10,
      },
      {
        prop: 'sumTotalWeight',
        label: '合计重量',
        visible: false,
        width: 80,
        order: 11,
      },
      {
        prop: 'rowWeight',
        label: '已扫重量',
        visible: false,
        width: 80,
        order: 12,
      },
      {
        prop: 'productName',
        label: '商品名称',
        visible: true,
        order: 13,
      },
      {
        prop: 'storageStatus',
        label: '状态',
        visible: false,
        width: 80,
        order: 14,
      },
      {
        prop: 'productAttribute',
        label: '属性',
        visible: false,
        width: 80,
        order: 15,
      },
      {
        prop: 'plateCode',
        label: '原托盘号',
        visible: false,
        width: 80,
        order: 17,
      },
      {
        prop: 'batchNumber',
        label: '批次号',
        visible: false,
        width: 80,
        order: 18,
      },
    ],
  },
});
//#endregion

//#region onMounted
onMounted(async () => {
  getStorage();
  // 字段设置
  const setting = localStorage[state.setting.name + '-setting'];
  if (setting) {
    state.setting.fields = JSON.parse(setting);
  }
  // 开启容器合并
  state.formData.isContainerMerge = localStorage['isContainerMerge'] === 'true';
  // 开启SN扫描
  state.formData.isScanSn = localStorage['isScanSn'] === 'true';

  // 一次扫描的数量
  state.scanCount = 1;
  // 扫描明细数据集合
  base.state.tableData = [];
  // 当前正在扫描的数据

  base.state.currentRow = null as any;
  // 已经找到的数据
  state.existRows = [];
  // 配置参数
  config = {
    // 支持一品多码
    sku_productToMultiBarcode: true,
    caseMode: 0,
  } as any;
});
//#endregion

// 获取订单数据
const getData = async () => {
  state.formData.scanQty = 0;
  if (!state.formData.storageId) {
    proxy.$message.error('仓库不能为空');
    return;
  }
  if (!state.formData.originalPositionName && !state.formData.productModel) {
    proxy.$message.error('原货位和商品条码必须填一个！');
    return;
  }

  var url = '/inventory/operation/positionTransfer/selectValidInventoryListByPosition';
  var params = {
    storageId: state.formData.storageId,
    targetPositionName: state.formData.targetPositionName,
    originalPositionName: state.formData.originalPositionName,
    productModel: state.formData.productModel,
  };

  const [err, res] = await to(postData(url, params));
  if (res?.result) {
    var dataList: any[] = res.data.map((element: any) => {
      element.targetPositionName = state.formData.targetPositionName;
      element.finishedQuantity = Math.Round(state.formData.isCheckProductModel ? 0 : element.validStorage, 4);
      element.unFinishedQuantity = Math.Round(state.formData.isCheckProductModel ? element.validStorage : 0, 4);
      element.validQuantity = element.unFinishedQuantity; // 原始可扫描数量
      element.rowWeight = Math.Round(state.formData.isCheckProductModel ? 0 : element.rowWeight, 4);
      element.produceDate = element.produceDate ? moment(element.produceDate).format('YYYY-MM-DD') : null;
      element.singleSignCodeOrigin = element.singleSignCode; // 备份源SN
      element.sortIndex = 0;
      // element.isManageSn = element.singleSignCodeOrigin ? 1 : '';
      // 清空条码信息
      element.singleSignCode = '';

      return element;
    });
    base.state.tableData = dataList;

    if (state.formData.isContainerMerge) {
      base.focus('targetPlateCode');
    } else {
      if (state.formData.isCheckProductModel) {
        base.focus('productModel');
      } else {
        base.focus('originalPositionName');
      }
    }
  }
};

const getStorage = async () => {
  var url = '/basic/storage/storage/getList';
  var params = {
    // where: '31',
    // data: JSON.stringify(state.formData),
  };

  const [err, res] = await to(postData(url, params));
  if (res?.result) {
    state.storageList = res.data;
  }
};

// 条码扫描
const checkPackingBarcode = async (evt: any) => {
  if (!base.state.tableData.length) {
    // 当明细为空时，扫描条码带出当前仓库的数据
    await getData();
    return;
  }

  if (!state.formData.targetPositionName) {
    proxy.$message.error('目标货位不能为空');
    return;
  }

  base.checkPackingProductModel();
  if (base.state.currentRow) {
    state.formData.scanQty = base.state.currentRow.finishedQuantity;
    // 设置目标容器
    base.state.currentRow.targetPlateCode = state.formData.targetPlateCode;
    base.state.currentRow.targetPositionName = state.formData.targetPositionName;

    const sn = base.state.currentRow.singleSignCodeOrigin;
    let snList = [] as any[];
    if (sn) {
      snList = sn.split(',');
    }
    let validSnList = snList.filter((item) => item); // 有效SN
    validSnList = validSnList.map((item) => item.trim());
    validSnList.push('');
    state.formData.checkSnList = validSnList.join('\n');
  }
};
// 扫描数量手工改变
const changeScanQty = () => {
  base.setScanQty();
};

// 重置
const reset = async () => {
  base.state.currentRow = {
    finishedQuantity: 0,
    singleSignCodeOrigin: '',
  };
  state.formData.storageId = 0;
  state.formData.targetPositionName = '';
  state.formData.originalPositionName = '';
  state.formData.scanQty = 0;
  state.formData.snList = '';
  state.formData.checkSnList = '';
  state.formData.productModel = '';
  state.formData.targetPlateCode = '';
  base.focus('targetPositionName');
  base.state.tableData = [];

  getStorage();
};
// 移动目标货位光标到原货位上
const moveCursor = async () => {
  base.focus('originalPositionName');
};
// 改变扫描商品
const onChangeCheck = async () => {
  base.state.tableData.forEach((element) => {
    element.finishedQuantity = Math.Round(state.formData.isCheckProductModel ? 0 : element.productStorage, 4);
    element.unFinishedQuantity = Math.Round(state.formData.isCheckProductModel ? element.productStorage : 0, 4);
    element.rowWeight = state.formData.isCheckProductModel ? 0 : element.sumTotalWeight;
  });
};

// 扫描目标货位
const plateCodeEnter = async () => {
  const url = 'api/storage/positionTransfer/checkTargetContainer';
  const params = {
    plateCode: state.formData.targetPlateCode,
    storageId: state.formData.storageId,
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }
  if (res?.result) {
    base.state.currentRow = base.state.existRows[0];
    if (base.state.currentRow) {
      base.state.currentRow.targetPlateCode = state.formData.targetPlateCode;
    }
    base.focus('productModel');
  }
};
// 开启容器合并
const onIsContainerMerge = async () => {
  localStorage['isContainerMerge'] = state.formData.isContainerMerge;
};
// 开启SN
const onIsScanSnChange = async () => {
  localStorage['isScanSn'] = state.formData.isScanSn;
  base.state.tableData.forEach((row) => {
    // 非SN操作，清空条码信息
    if (state.formData.isScanSn) {
      row.singleSignCode = row.singleSignCodeOrigin;
    } else {
      row.singleSignCode = '';
    }
  });
};

// 提交数据
const save = async () => {
  var dataList = base.state.tableData.filter((f) => f.finishedQuantity > 0);
  if (dataList.length <= 0) {
    proxy.$message.error('已扫描数量不能为0！');
    return;
  }
  for (const item of dataList) {
    if (item.storageStatus === '理货待上架') {
      proxy.$message.error('理货待上架不能货位转移！');
    }
  }
  proxy
    .$confirm('您确定要[转移]扫描的数据吗？', '货位转移', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(async () => {
      var url = '/inventory/operation/positionTransfer/savePositionTransfer';
      var params = {
        transferType: 'PC_POSITION_TRANSFTER', // PC货位转移
        storageId: state.formData.storageId,
        dataList: dataList,
        originalPositionName: state.formData.originalPositionName,
        targetPositionName: state.formData.targetPositionName,
      };

      const [err, res] = await to(postData(url, params));
      if (err) return;

      proxy.common.showMsg(res);
      if (res?.result) {
        reset();
      }
    })
    .catch(() => {
      proxy.$message.info('已取消删除');
    });
};
// 清空数据
const clearData = async () => {
  reset();
};

// 原货位扫描
const scanOriginalPositionName = async () => {
  if (!state.formData.targetPositionName) {
    proxy.$message.error('目标货位不能为空');
    return;
  }

  if (!state.formData.originalPositionName) {
    proxy.$message.error('原货位货位不能为空');
    return;
  }
  // 当明细为空时，扫描条码带出当前仓库的数据
  await getData();
};
// 获得仓库和货位信息
const getPositionList = async () => {
  const url = '/basic/storage/position/getPositionList';
  const params = {
    storageId: state.formData.storageId,
    name: '',
    positionTypes: '1,2,8,12,13',
  };
  const [err, res] = await to(postData(url, params, false));
  if (res?.result) {
    state.positionNameList = res.data;
  }
};
</script>

<style lang="scss" scoped>
@import '/@/theme/scan.scss';
</style>
