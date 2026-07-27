<template>
  <div class="scan-container">
    <el-card class="scan-card">
      <template #header>
        <div class="clearfix">
          <span>{{ $tt('LPN号扫描入库') }}</span>
        </div>
      </template>
      <el-form ref="form" :model="state.formData" label-width="120px" class="scan-form">
        <el-form-item :label="$tt('预到货单号')">
          <el-input ref="orderCode" v-model="state.formData.orderCode" class="input-300" autofocus @keyup.enter.stop="getData"></el-input>
          <span class="sub-item">
            <span class="sub-label">{{ $tt('商品校验') }}：</span>
            <el-switch v-model="state.formData.isValidateProductCode" @change="onIsValidateProductCodeChange"></el-switch>
          </span>
        </el-form-item>
        <el-form-item :label="$tt('扫描LPN号')">
          <input-select ref="lpnCode" v-model="state.formData.lpnCode" input-width="300px" trigger="click" class="input-300" :options="state.lpnCodeArray" label="货位" @on-item-click="(ref:any, data:any)=>elDropdownSelect(state.formData, data)" @on-row-change="(ref:any, data:any)=>elDropdownChange(state.formData, data)" @on-key-up="(ref:any, data:any)=>elDropdownKeyup(state.formData, data)"></input-select>
        </el-form-item>
        <el-form-item :label="$tt('商品条码')">
          <el-input ref="productModel" v-model="state.formData.productModel" :disabled="!state.formData.isValidateProductCode" class="input-300" @keyup.enter.stop="checkPackingBarcode"></el-input>
          <span class="sub-item">
            <span class="sub-label">扫描数量：</span>
            <!-- :min="1" -->
            <el-input-number ref="scanQty" v-model.number="state.formData.scanQty" :min="0" :disabled="!state.formData.isValidateProductCode" class="input-100" controls-position="right" @change="changeScanQty"></el-input-number>
          </span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">确认入库</el-button>
          <el-button @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="scan-card body-no-padding mt-5">
      <template #header>
        <div class="clearfix">
          <span class="padding-top-10">扫描结果</span>
          <el-button link class="floatRight" @click="state.setting.visible = true">字段设置</el-button>
        </div>
      </template>

      <el-table ref="scan-table" :data="base.state.tableData" :row-class-name="base.rowClass" stripe style="width: 100%" class="scan-table" size="small" @row-dblclick="base.setCurrent">
        <template v-for="(item, index) in state.setting.fields">
          <template v-if="['unFinishedQuantity', 'finishedQuantity'].indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="item.label" :width="item.width">
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
          <template v-else-if="'batchNumber,scanWeight'.indexOf(item.prop) >= 0">
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
        <el-table-column fixed="right" label="操作" width="100">
          <template #default="{ row }">
            <el-button link size="small" @click="splitShow(row, row.$index)">拆分</el-button>
            <el-button link size="small" @click="deleteRow(row, row.$index)">删除</el-button>
          </template>
        </el-table-column>
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

<script setup lang="ts" name="inbound-order-scan-lpn">
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
});
//#endregion

const base = scanHook({
  config,
});

//#region 定义变量
const state = reactive({
  lpnCodeArray: [] as any[],
  formData: {
    ...toRefs(base.state.formData),
    orderCode: '',
    lpnCode: '',
  },
  // 明细数据
  tableData: [] as any[],
  // 仓库ID
  storageId: 0,
  // 收货位候选项
  positionList: [] as any[],

  // 扫描列设置对话框参数
  setting: {
    visible: false,
    name: 'inbound-order-scan-lpn',
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
        prop: 'batchNumber',
        label: '批次号',
        visible: true,
        width: 180,
        order: 17,
      },
      {
        prop: 'lpnCode',
        label: 'LPN号',
        visible: true,
        width: 150,
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
  getList();
  // 加载自定义数据
  // 直接上架
  const isOnShelve = localStorage['isOnShelve'];
  if (isOnShelve) {
    state.formData.isOnShelve = isOnShelve === 'true';
  }

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
});
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
const elDropdownSelect = (from: any, data: any) => {
  from.lpnCode = data;
};
const elDropdownChange = (from: any, data: any) => {
  from.lpnCode = data;
};
const elDropdownKeyup = async (from: any, val: any) => {
  getList();
  try {
    if (!val) {
      state.lpnCodeArray = [];
      return;
    }
    const url = '/inbound/in/inScanLpn/getList';
    const params = {
      plateCode: val,
    };
    const [err, res] = await to(postData(url, params));
    if (err) {
      return;
    }
    if (res.result) {
      state.lpnCodeArray = res.data.map((m: any) => {
        m.value = m.plateCode;
        m.label = m.plateCode;
        return m;
      });
    }
  } catch (error) {
    error;
    // proxy.$message.error(error.message);
  }
};
const getList = async () => {
  try {
    const url = '/inbound/in/inScanLpn/getList';
    const params = {
      plateCode: null,
    };
    const [err, res] = await to(postData(url, params));
    if (err) {
      return;
    }

    if (res.result) {
      state.lpnCodeArray = res.data.map((m: any) => {
        m.value = m.plateCode;
        m.label = m.plateCode;
        return m;
      });
    }
  } catch (error) {
    error;
    // proxy.$message.error(error.message);
  }
};
// 直接上架设置
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
};
// 获得明细数据
const getData = async () => {
  var orderCode = state.formData.orderCode;
  if (!orderCode) {
    proxy.$message.error('预到货单号不能为空');
    return;
  }
  orderCode = orderCode.trim();
  state.formData.orderCode = orderCode;
  var userInfo = proxy.common.getUserInfo();
  const url = '/inbound/in/inScanOrder/getInOrderData';
  const params = {
    userId: userInfo.userId,
    userTrueName: userInfo.nickName,
    orderCode: state.formData.orderCode,
    isOnShelve: false,
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    base.focus('orderCode');
    return;
  }
  proxy.common.showMsg(res);
  if (res.result) {
    // 构建数据
    base.state.currentRow = null;
    state.formData.lpnCode = '';
    state.formData.productModel = '';
    state.formData.scanQty = 0;
    state.formData.storageId = res.data.storageId;
    state.storageId = res.data.storageId;

    base.state.tableData = res.data.orderList.map((row: any) => {
      row.enterQuantity = Number(row.enterQuantity);
      row.quantity = Number(row.quantity);
      row.unFinishedQuantity = Math.Round(row.quantity - (row.enterQuantity || 0), 4);
      row.arriveQuantity = Math.Round(row.quantity - (row.enterQuantity || 0), 4);
      row.produceDate = row.produceDate === null ? '' : moment(row.produceDate).format('YYYY-MM-DD');
      row.isMain = 1; // 用于拆分，是否为源数据
      row.finishedQuantity = 0;
      row.sortIndex = 0;
      row.scanWeight = 0;
      row.validQuantity = row.unFinishedQuantity;
      return row;
    });
    if (!state.formData.isValidateProductCode) {
      base.state.tableData.forEach((row) => {
        row.finishedQuantity = Math.Round(row.unFinishedQuantity, 4);
        row.scanWeight = row.totalWeight;
        row.unFinishedQuantity = 0;
        row.lpnCode = '';
      });
    }
    if (!state.formData.isOnShelve) {
      getPositionList();
    } else {
      base.focus('lpnCode');
    }
  } else {
    base.focus('orderCode');
  }
};
// 获得仓库和货位信息
const getPositionList = async () => {
  var url = '/basic/storage/position/getPositionList';
  var params = {
    storageId: state.storageId,
    positionType: 4, // 4=收货位
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }
  if (res.result) {
    state.positionList = res.data;
    if (state.positionList.length) {
      state.formData.lpnCode = state.positionList[0].lpnCode;
      // 明细设置默认货位
      base.state.tableData.forEach((row) => {
        row.lpnCode = state.formData.lpnCode;
      });
    }
  } else {
    state.positionList = [];
  }
  // lpnCode获得焦点
  base.focus('lpnCode');
};
// 判断扫描包装条码
const checkPackingBarcode = (evt: any) => {
  base.checkPackingProductModel(() => {
    base.state.currentRow!.lpnCode = state.formData.lpnCode;
  });
};
// 扫描数量手工改变
const changeScanQty = () => {
  base.setScanQty();
};
// 重置onReset
const onReset = () => {
  state.formData.orderCode = '';
  state.formData.isValidateProductCode = true;
  state.formData.productModel = '';
  state.formData.scanQty = 0;
  state.formData.lpnCode = '';
  getList();
  base.state.tableData = [];
  proxy.$refs.orderCode.focus();
};
// 确认入库
const save = async () => {
  if (!state.formData.orderCode) {
    proxy.$message.error('请扫描预到货单号！');
    proxy.$refs.orderCode.focus();
    base.play(); // 播放声音
    return;
  }

  var emptypositionName = base.state.tableData
    .filter((item) => {
      return !item.lpnCode && item.finishedQuantity > 0;
    })
    .map((item) => {
      return item.productModel;
    });
  if (emptypositionName.length) {
    proxy.$message.error('条形码[' + emptypositionName.join(',') + ']LPN不能为空！');
    base.playError(); // 播放声音
    return;
  }

  var dataList = base.state.tableData.filter((rowData) => rowData.finishedQuantity > 0);
  if (!dataList.length) {
    proxy.$message.error('至少扫描一条！');
    base.play(); // 播放声音
    return;
  }

  state.formData.lpnCode = dataList[0].lpnCode;
  if (!dataList.every((item) => item.lpnCode == state.formData.lpnCode)) {
    proxy.$message.error('LPN必须保持一致！');
    return;
  }
  var url = '/inbound/in/inScanLpn/scanPlateInSave';
  var params = {
    scanInType: 'PC_LPN_SCAN_IN',
    lpnCode: state.formData.lpnCode,
    orderCode: state.formData.orderCode,
    positionName: state.formData.positionName,
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
  const lpnCode = item.name;
  base.state.tableData.forEach((rowData) => {
    rowData.lpnCode = lpnCode;
  });
};
// 输入上架货位
const positionNameKeyup = (val: any) => {
  base.state.tableData.forEach((rowData) => {
    rowData.lpnCode = state.formData.lpnCode;
  });
  base.focus('productModel');
};
</script>

<style lang="scss" scoped>
@import '/@/theme/scan.scss';
</style>
