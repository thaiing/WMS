<template>
  <div class="scan-container">
    <el-card class="scan-card">
      <template #header>
        <div class="clearfix">
          <span>{{ $tt('按拍扫描入库') }}</span>
        </div>
      </template>
      <el-form ref="form" :model="state.formData" label-width="120px" class="scan-form">
        <el-form-item label="仓库名称">
          <el-select v-model="state.formData.storageId" placeholder="请选择仓库" class="input-300" @change="getPositionName()">
            <el-option v-for="item in state.storageNames" :key="item.storageId" :label="item.storageName" :value="item.storageId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="state.formData.isOnShelve ? '上架货位' : '收货位'">
          <el-input v-if="state.formData.isOnShelve" ref="positionName" v-model="state.formData.positionName" placeholder="请输入上架货位" class="input-300" @keyup.enter="positionNameKeyup">
            <template #suffix>
              <SvgIcon name="icon-iconfontcolor32" size="15" class="cursor-pointer mr-10" @click="base.showPositionSelector" />
            </template>
          </el-input>
          <el-select v-else ref="positionName" v-model="state.formData.positionName" placeholder="请选择收货位" class="input-300">
            <el-option v-for="(item, index) in state.positionList" :key="index" :label="item.positionName" :value="item.positionName" @click="positionNameClick(item)"></el-option>
          </el-select>
          <span class="sub-item">
            <span class="sub-label">直接上架：</span>
            <el-switch v-model="state.formData.isOnShelve" @change="onIsOnShelveChange"></el-switch>
          </span>
        </el-form-item>
        <el-form-item label="收货托盘号">
          <el-input ref="plateCode" v-model="state.formData.plateCode" class="input-300" @keyup.enter.stop="getData"></el-input>
          <!-- <span class="sub-item">
            <span class="sub-label">扫描数量：</span>
            <el-input-number v-model="formData.scanQty" :min="1" class="input-100" controls-position="right" @change="setScanQty"></el-input-number>
          </span> -->
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">确认入库</el-button>
          <el-button @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!--扫描结果明细-->
    <el-card class="scan-card body-no-padding mt-5">
      <template #header>
        <div class="clearfix">
          <span class="padding-top-10">扫描结果</span>
          <el-button link class="floatRight" @click="state.setting.visible = true">字段设置</el-button>
        </div>
      </template>

      <el-table ref="scan-table" :data="base.state.tableData" :row-class-name="base.rowClass" stripe style="width: 100%" class="scan-table" size="small" @row-dblclick="setCurrent">
        <template v-for="(item, index) in state.setting.fields">
          <template v-if="['unFinishedQuantity', 'finishedQuantity'].indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="item.label" :width="item.width">
              <template #default="{ row }">
                <template v-if="!state.formData.isValidateProductCode">
                  <el-input-number v-model="row[item.prop]" :min="0" :max="row['totalQuantity']" size="small" class="w-100pc" controls-position="right" @change="base.rowChangeQty(item.prop, row, 'totalQuantity')"></el-input-number>
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

    <!-- 货位选择器 -->
    <yrt-selector ref="selector-dialog" :config="base.state.positionSelector" v-model:visible="base.state.positionSelector.visible" @on-selected="(rows:any[])=>base.onPositionSelected(rows, 'plateCode')"></yrt-selector>
  </div>
</template>

<script setup lang="ts" name="inbound-scan-order">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';
import { postData } from '/@/api/common/baseApi';
import to from 'await-to-js';
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
});
//#endregion

const base = scanHook({
  config,
});

//#region 定义变量
const state = reactive({
  formData: {
    ...toRefs(base.state.formData),
    orderCode: '',
    providerId: null,
    providerCode: null,
    providerShortName: null,
  },
  // 明细数据
  tableData: [],
  // 仓库列表
  storageNames: [] as any[],
  //货主列表
  consignorNames: [] as any[],
  // 供应商列表
  providerShortNames: [] as any[],
  // 收货位候选项
  positionList: [] as any[],
  // 扫描列设置对话框参数
  setting: {
    visible: false,
    name: 'inbound-inPai-scan',
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
        prop: 'quantity',
        label: '单据数量',
        visible: true,
        width: 90,
        order: 4,
      },
      {
        prop: 'plateCode',
        label: '收货托盘号',
        visible: true,
        width: 90,
        order: 7,
      },
      {
        prop: 'productCode',
        label: '商品编号',
        visible: false,
        width: 130,
        order: 6,
      },

      {
        prop: 'positionName',
        label: '收货位',
        visible: true,
        width: 120,
        order: 8,
      },
      {
        prop: 'batchNumber',
        label: '批次号',
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
        prop: 'totalWeight',
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
        prop: 'orderCode',
        label: '预到货单号',
        visible: true,
        width: 120,
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
  // 加载自定义数据
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
  // 字段设置
  const setting = localStorage[state.setting.name + '-setting'];
  if (setting) {
    state.setting.fields = JSON.parse(setting);
  }
  getStorageList();
  base.state.tableData = [];
});

// 手动更新数量
const setScanQty = () => {
  // 判断是否有足够扫描数量
  const totalQty = base.state.currentRow!.unFinishedQuantity + base.state.currentRow!.finishedQuantity;
  const scanQty = state.formData.scanQty;
  base.state.currentRow!.finishedQuantity = scanQty;
  base.state.currentRow!.unFinishedQuantity = Math.Round(totalQty - scanQty, 4);
};
// 明细点击数据
const setCurrent = (row: any) => {
  base.state.tableData
    .filter((rowData: any) => rowData.productModel === row.productModel)
    .map((rowData: any) => {
      rowData.sortIndex = 1;
    });
  base.state.currentRow = base.state.tableData.filter((rowData: any) => rowData.sortIndex === 1)[0];
  // base.state.currentRow.sortIndex = 1;
};
// 根据仓库获取货位
const getPositionName = async () => {
  // 仓库
  let storageItem = state.storageNames.find((item) => item.storageId === state.formData.storageId);
  state.formData.storageName = storageItem.storageName;

  if (state.formData.isOnShelve) {
    base.focus('positionName');
    return;
  }
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
    // this.storageInfo = res.data;
    state.positionList = res.data;
    if (state.positionList.length) {
      state.formData.positionName = state.positionList[0].positionName;
    }
  } else {
    // this.storageInfo = {};
    state.positionList = [];
  }
  // 条码框获得焦点
  proxy.$refs.plateCode.focus();
  proxy.$refs.plateCode.select();
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
// 直接上架设置
const onIsOnShelveChange = () => {
  localStorage['isOnShelve'] = state.formData.isOnShelve;
};
// 获得明细数据
const getData = async () => {
  var plateCode = state.formData.plateCode;
  var storageId = state.formData.storageId;
  var userInfo = proxy.common.getUserInfo();
  const url = '/inbound/in/InScanPai/getPlateCodeData';
  const params = {
    userId: userInfo.userId,
    storageId: storageId,
    isOnShelve: state.formData.isOnShelve,
    plateCode: plateCode,
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }
  if (res.result) {
    //判断是否有不同单据的明细信息，判断是否有相同明细信息
    let list: any = res.data;
    let flag = false;
    for (const item of base.state.tableData) {
      for (const info of list) {
        if (item.orderCode != info.orderCode) {
          flag = true;
          proxy.$message.error('不是同一个单据的拍号不允许扫描！');
          break;
        }
        if (item.plateCode == info.plateCode) {
          flag = true;
          proxy.$message.error('不能同时扫描同一个拍号');
          break;
        }
      }
    }
    if (flag) {
      return;
    }
    // 构建数据
    base.state.currentRow = null;
    // state.formData.positionName = null;
    // state.formData.plateCode = null;
    state.formData.scanQty = 0;

    res.data.map((row: any) => {
      row.unFinishedQuantity = 0;
      row.quantity = Number(row.quantity);
      row.finishedQuantity = row.quantity - (row.enterQuantity || 0);
      row.totalQuantity = row.quantity - (row.enterQuantity || 0);
      if (state.formData.positionName) {
        row.positionName = state.formData.positionName;
      }
      row.sortIndex = 1;
      if (typeof row.expandFields === 'string') {
        row.expandFields = JSON.parse(row.expandFields);
        row = Object.assign(row, row.expandFields);
      }

      base.state.tableData.push(row);
    });

    // if (!state.formData.isValidateProductCode) {
    //   base.state.tableData.forEach(row => {
    //     row.finishedQuantity = row.unFinishedQuantity;
    //     row.unFinishedQuantity = 0;
    //   });
    // }
    // 直接上架选中时手工输入，未选中获取收货位
    if (!state.formData.isOnShelve) {
      getPositionList();
    } else {
      base.focus('positionName');
    }
  } else {
    base.focus('plateCode');
  }
  proxy.$refs['form'];
};
// 获得仓库和货位信息
const getPositionList = async () => {
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
      base.state.tableData.forEach((row: any) => {
        row.positionName = state.formData.positionName;
      });
    }
  } else {
    state.positionList = [];
  }
  // 条码框获得焦点
  base.focus('plateCode');
};
// 重置onReset
const onReset = () => {
  state.formData.orderCode = '';
  state.formData.isValidateProductCode = true;
  state.formData.positionName = '';
  state.formData.plateCode = '';
  state.formData.scanQty = 0;
  base.state.tableData = [];
};
// 确认入库
const save = async () => {
  var positionName = state.formData.positionName;
  var plateCodeMain = state.formData.plateCode;
  var userInfo = proxy.common.getUserInfo();
  var orderCode = base.state.tableData[0].orderCode;
  var emptypositionName = base.state.tableData
    .filter((item: any) => {
      return !item.positionName && item.finishedQuantity > 0;
    })
    .map((item: any) => {
      return item.plateCode;
    });
  if (emptypositionName.length) {
    proxy.$message.error('条形码[' + emptypositionName.join(',') + ']货位不能为空！');
    base.playError(); // 播放声音
    return;
  }

  var dataList = base.state.tableData.filter((rowData: any) => rowData.finishedQuantity > 0);
  if (!dataList.length) {
    proxy.$message.error('至少扫描一条！');
    base.playError(); // 播放声音
    return;
  }
  state.formData.positionName = dataList[0].positionName;

  var url = '/inbound/in/InScanPai/enterPaiSave';
  var params = {
    scanInType: 'PC_PAI_SCAN_IN',
    userId: userInfo.userId,
    orderCode: orderCode,
    positionName: positionName,
    plateCode: plateCodeMain,
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
  proxy.$refs.form;
};
// 收货位
const positionNameClick = (item: any) => {
  const positionName = item.name;
  base.state.tableData.forEach((rowData: any) => {
    rowData.positionName = positionName;
  });
};
// 输入上架货位
const positionNameKeyup = (val: any) => {
  base.focus('plateCode');
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
      positionTypes: ' 13,12,8,1,2,14', //存储货位,高架货位,次品货位,常规货位,残品货位,临期货位
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
</script>

<style lang="scss" scoped>
@import '/@/theme/scan.scss';
</style>
