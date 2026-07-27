<template>
  <div class="scan-container">
    <el-card class="scan-card">
      <template #header>
        <div class="clearfix">
          <span>{{ $tt('按拍扫描上架') }}</span>
        </div>
      </template>
      <el-form ref="form" :model="state.formData" label-width="120px" class="scan-form">
        <el-form-item label="收货托盘号">
          <el-input ref="plateCode" v-model="state.formData.plateCode" class="input-300" @focus="base.focus('plateCode')" @keyup.enter.stop="getData"></el-input>
        </el-form-item>
        <el-form-item label="上架货位">
          <el-input ref="positionName" v-model="state.formData.positionName" placeholder="请输入上架货位" class="input-300" @focus="base.focus('positionName')" @keyup.enter="positionNameKeyup"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="shelveSave">确认上架</el-button>
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

      <el-table ref="scan-table" :data="base.state.tableData" :row-class-name="base.rowClass" stripe style="width: 100%" size="small" class="scan-table" @row-dblclick="setCurrent">
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

          <template v-else-if="['shelvePositionName'].indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width" align="center">
              <template #default="{ row }">
                <input-select ref="shelvePositionName" v-model="row.shelvePositionName" :options="row.waitPositionNames" :label="$tt('货位')" input-width="110px" trigger="click" @on-item-click="(ref:any, data:any)=>elDropdownSelect(row, data)" @on-row-change="(ref:any, data:any)=>elDropdownChange(row, data)" @on-key-up="(ref:any, data:any)=>elDropdownKeyup(row, data)"></input-select>
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

<script setup lang="ts" name="inbound-scan-shelve-pai">
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
  formData: {
    ...toRefs(base.state.formData),
    orderCode: null,
    shelveCode: '',
  },
  // 仓库列表
  storageNames: [] as any[],
  // 扫描列设置对话框参数
  setting: {
    visible: false,
    name: 'inbound-scan-shelve-pai',
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
        width: 80,
        order: 2,
      },
      {
        prop: 'unFinishedQuantity',
        label: '未扫描数量',
        visible: true,
        width: 90,
        order: 3,
      },
      {
        prop: 'enterQuantity',
        label: '入库数量',
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
        prop: 'shelvePositionName',
        label: '上架货位',
        visible: true,
        width: 120,
        order: 8,
      },
      {
        prop: 'positionName',
        label: '推荐货位',
        visible: true,
        width: 120,
        order: 8,
      },
      {
        prop: 'batchNumber',
        label: '批次号',
        visible: true,
        width: 130,
        order: 9,
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
        prop: 'singleSignCode',
        label: 'SN号',
        visible: true,
        width: 150,
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
  const isOnShelve = localStorage['isOnShelve-pai'];
  if (isOnShelve) {
    state.formData.isOnShelve = isOnShelve === 'true';
  }

  // 字段设置
  const setting = localStorage[state.setting.name + '-setting'];
  if (setting) {
    state.setting.fields = JSON.parse(setting);
  }
  base.focus('plateCode');
});
//#endregion

// 明细点击数据
const setCurrent = (row: any) => {
  base.state.tableData
    .filter((rowData) => rowData.productModel === row.productModel)
    .map((rowData) => {
      rowData.sortIndex = 1;
    });
  base.state.tableData
    .filter((rowData) => rowData.productModel !== row.productModel)
    .map((rowData) => {
      rowData.sortIndex = 0;
    });
  base.state.currentRow! = base.state.tableData.filter((rowData) => rowData.sortIndex === 1)[0];
  base.state.currentRow!.sortIndex = 1;
};

// 获得明细数据
const getData = async () => {
  var plateCode = state.formData.plateCode;
  const url = '/inbound/in/InScanPai/getShelvePlateData';
  const params = {
    plateCode: plateCode,
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }
  if (res.result) {
    // 构建数据
    base.state.currentRow = null;
    state.formData.scanQty = 0;

    base.state.tableData = res.data.map((row: any) => {
      row.produceDate = moment(row.produceDate).format('YYYY-MM-DD');
      row.unFinishedQuantity = 0;
      row.enterQuantity = row.shelvedQuantity - row.onShelveQuantity;
      if (row.enterQuantity <= 0) {
        row.enterQuantity = 0;
      }

      row.finishedQuantity = Math.Round(row.quantity - row.enterQuantity, 4);
      row.sortIndex = 1;
      row.scanWeight = row.totalWeight;
      row.shelvePositionName = row.positionName;
      if (typeof row.expandFields === 'string') {
        row.expandFields = JSON.parse(row.expandFields);
      }
      return row;
    });
    state.formData.shelveCode = base.state.tableData[0].shelveCode;

    if (!state.formData.isValidateProductCode) {
      base.state.tableData.forEach((row) => {
        row.finishedQuantity = row.unFinishedQuantity;
        row.unFinishedQuantity = 0;
      });
    }
    base.focus('positionName');
  } else {
    base.focus('plateCode');
  }
  proxy.$refs['form'];
};
// 重置onReset
const onReset = () => {
  state.formData = {
    orderCode: null,
    isValidateProductCode: true, // 是否校验商品
    positionName: null,
    plateCode: '',
    scanQty: 0,
  } as any;
  base.state.tableData = [];
  proxy.$refs.plateCode.focus();
};
// 确认入库
const shelveSave = async () => {
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
  dataList.forEach((element) => {
    delete element.waitPositionNames;
  });

  let url = '/inbound/in/inScanShelve/shelveSave';
  var params = {
    scanInType: 'PC_PLATE_SHELVE_IN', // PC扫拍上架
    shelveCode: state.formData.shelveCode,
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
// 输入上架货位
const positionNameKeyup = (val: any) => {
  base.state.tableData.forEach((item) => {
    item.shelvePositionName = state.formData.positionName;
  });
  base.focus('plateCode');
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
      storageId: row.storageId,
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
