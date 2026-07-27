<template>
  <div class="scan-container">
    <el-card class="scan-card">
      <template #header>
        <div class="clearfix">
          <span>{{ $tt('Lpn号扫描上架') }}</span>
        </div>
      </template>
      <el-form ref="form" :model="state.formData" label-width="120px" class="scan-form">
        <el-form-item label="LPN号">
          <el-input ref="lpnCode" v-model="state.formData.lpnCode" class="input-300" autofocus @keyup.enter.stop="getData"></el-input>
          <span class="sub-item">
            <span class="sub-label">商品校验：</span>
            <el-switch v-model="state.formData.isValidateProductCode" @change="onIsValidateProductCodeChange"></el-switch>
          </span>
        </el-form-item>
        <!-- <el-form-item label="上架货位">
          <el-input v-if="state.formData.isOnShelve" ref="lpnCode" v-model="state.formData.lpnCode" placeholder="请输入Lpn号" class="input-300" @keyup.enter="positionNameKeyup">
          </el-input>
          <el-select v-else ref="lpnCode" v-model="state.formData.lpnCode" placeholder="请选择Lpn号" class="input-300">
            <el-option v-for="(item, index) in positionList" :key="index" :label="item.lpnCode" :value="item.lpnCode" @click="positionNameClick(item)"></el-option>
          </el-select>
          <span class="sub-item">
            <span class="sub-label">直接上架：</span>
            <el-switch v-model="state.formData.isOnShelve" @change="onIsOnShelveChange"></el-switch>
          </span>
        </el-form-item> -->
        <el-form-item label="商品条码">
          <el-input ref="productModel" v-model="state.formData.productModel" :disabled="!state.formData.isValidateProductCode" class="input-300" @keyup.enter.stop="checkPackingBarcode"></el-input>
          <span class="sub-item">
            <span class="sub-label">扫描数量：</span>
            <!-- :min="1" -->
            <el-input-number ref="scanQty" v-model.number="state.formData.scanQty" :min="0" :disabled="!state.formData.isValidateProductCode" class="input-100" controls-position="right" @change="changeScanQty"></el-input-number>
          </span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">确认上架</el-button>
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

      <el-table ref="scan-table" :data="base.state.tableData" :row-class-name="base.rowClass" size="small" stripe style="width: 100%" class="scan-table" @row-dblclick="base.setCurrent">
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
          <template v-else-if="['positionName'].indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width" header-align="center" align="center">
              <template #default="{ row }">
                <input-select ref="positionName" v-model="row.positionName" :options="row.waitPositionNames" label="货位" input-width="110px" trigger="click" @on-item-click="(ref:any, data:any)=>elDropdownSelect(row, data)" @on-row-change="(ref:any, data:any)=>elDropdownChange(row, data)" @on-key-up="(ref:any, data:any)=>elDropdownKeyup(row, data)"></input-select>
              </template>
            </el-table-column>
          </template>
          <template v-else-if="'scanWeight'.indexOf(item.prop) >= 0">
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

<script setup lang="ts" name="inbound-scan-shelveLpn">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';
import { postData } from '/@/api/common/baseApi';
import to from 'await-to-js';
import moment from 'moment';
import scanHook from '/@/components/hooks/scanHook';
import { ElMenu } from 'element-plus';
const ScanSettingDialog = defineAsyncComponent(() => import('/@/components/common/components/scanSettingDialog.vue'));
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

//#region  配置参数
const config = ref({
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
    lpnCode: '',
  },
  config: config.value,
  // 仓库ID
  storageId: 0,
  // 收货位候选项
  positionList: [] as any[],
  // 扫描列设置对话框参数
  setting: {
    visible: false,
    name: 'inbound-scan-shelve-lpn',
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
        label: '入库数量',
        visible: true,
        width: 80,
        order: 2,
      },
      {
        prop: 'shelvedQuantity',
        label: '已上架数量',
        visible: true,
        width: 80,
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
        prop: 'positionName',
        label: '上架位',
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
//#endregion

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

// 直接上架设置
const onIsValidateProductCodeChange = () => {
  localStorage['isValidateProductCode'] = state.formData.isValidateProductCode;
  base.state.tableData.forEach((row) => {
    if (!state.formData.isValidateProductCode) {
      row.finishedQuantity = Math.Round(row.quantity - (row.shelvedQuantity || 0), 4);
      row.scanWeight = row.totalWeight;
      row.unFinishedQuantity = 0;
    } else {
      row.unFinishedQuantity = Math.Round(row.quantity - (row.shelvedQuantity || 0), 4);
      row.scanWeight = 0;
      row.finishedQuantity = 0;
    }
  });
};
// 获得明细数据
const getData = async () => {
  var lpnCode = state.formData.lpnCode;
  if (!lpnCode) {
    proxy.$message.error('LPN号不能为空');
    return;
  }
  lpnCode = lpnCode.trim();
  state.formData.lpnCode = lpnCode;

  const url = '/inbound/in/inScanLpn/getShelveInfoByLpnCode';
  const params = {
    lpnCode: state.formData.lpnCode,
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }
  if (res.result) {
    // 构建数据
    base.state.currentRow = null;
    state.formData.productModel = '';
    state.formData.scanQty = 0;
    base.state.tableData = res.data.map((row: any) => {
      row.shelvedQuantity = Number(row.shelvedQuantity);
      row.quantity = Number(row.quantity) - Number(row.shelveQuantity || 0);
      row.unFinishedQuantity = Math.Round(row.quantity - (row.shelvedQuantity || 0), 4);
      row.arriveQuantity = Math.Round(row.quantity - (row.shelvedQuantity || 0), 4);
      row.produceDate = row.produceDate === null ? '' : moment(row.produceDate).format('YYYY-MM-DD');
      row.finishedQuantity = 0;
      row.isMain = 1; // 用于拆分，是否为源数据
      row.sortIndex = 0;
      row.scanWeight = 0;
      return row;
    });
    if (!state.formData.isValidateProductCode) {
      base.state.tableData.forEach((row) => {
        row.finishedQuantity = row.unFinishedQuantity;
        row.unFinishedQuantity = 0;
      });
    }
    // 直接上架选中时手工输入，未选中获取收货位
    state.formData.storageId = res[0].storageId;
    state.storageId = res[0].storageId;
    if (!state.formData.isOnShelve) {
      getPositionList();
    } else {
      base.focus('productModel');
    }
  } else {
    base.focus('lpnCode');
  }
};
// 获得仓库和货位信息
const getPositionList = async () => {
  var url = '/basic/storage/position/getPositionList';
  var params = {
    storageId: state.formData.storageId,
    positionType: 1, // 1=常规货位
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }
  proxy.common.showMsg(res);
  if (res.result) {
    state.positionList = res.data;
    if (state.positionList.length) {
      // 明细设置默认货位
      base.state.tableData.forEach((row) => {
        row.lpnCode = state.formData.lpnCode;
      });
    }
  } else {
    state.positionList = [];
  }
  // 条码框获得焦点
  base.focus('productModel');
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
  state.formData = {
    isValidateProductCode: true, // 是否校验商品
    lpnCode: '',
    productModel: null,
    scanQty: 0,
  } as any;
  base.state.tableData = [];
  proxy.$refs.lpnCode.focus();
};
// 确认入库
const save = async () => {
  const dataList: any[] = proxy.common.deepCopy(base.state.tableData.filter((f: any) => f.finishedQuantity > 0));
  if (dataList.find((f: any) => !f.positionName)) {
    proxy.$message.error('请选择货位');
    return false;
  }

  if (!dataList.length) {
    base.showError('没有可用的扫描数据！');
    base.playError();
    base.state.saving = false;
    return;
  }
  dataList.forEach((element) => {
    element.shelvePositionName = element.positionName;
    delete element.waitPositionNames;
  });

  proxy
    .$confirm('您确定要[上架]扫描的数据吗？', '待上架扫描', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(async () => {
      let url = '/inbound/in/inScanShelve/shelveSave';
      let params = {
        scanInType: 'PC_LPN_SCAN_SHELVE_IN', // PC_LPN扫描上架
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
      storageId: state.storageId,
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
