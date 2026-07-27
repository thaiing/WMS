<template>
  <div class="scan-container">
    <el-card class="scan-card">
      <template #header>
        <div class="clearfix">
          <span>{{ $tt('出库单配货扫描') }}</span>
        </div>
      </template>
      <el-row>
        <el-col :xl="11" :md="14" :xs="24">
          <el-form ref="form" :model="state.formData" label-width="120px" class="scan-form">
            <el-form-item :label="$tt('波次号')">
              <el-input ref="orderWaveCode" v-model="state.formData.orderWaveCode" autofocus class="input-300" @keyup.enter.stop="getData"></el-input>
              <span class="sub-item">
                <span class="sub-label">{{ $tt('开启SN') }}：</span>
                <el-switch v-model="state.formData.isScanSn" @change="onIsScanSnChange"></el-switch>
              </span>
            </el-form-item>
            <el-form-item :label="$tt('商品条码')">
              <el-input ref="productModel" v-model="state.formData.productModel" class="input-300" @keyup.enter.stop="checkPackingBarcode"></el-input>
              <span class="sub-item">
                <span class="sub-label">{{ $tt('扫描数量') }}：</span>
                <el-input-number ref="scanQty" v-model="state.formData.scanQty" :min="0" controls-position="right" class="input-120" @change="base.setScanQty"></el-input-number>
              </span>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">{{ $tt('确认配货') }}</el-button>
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
          </el-form>
          <el-form ref="formSn" :model="state.formData" label-position="top" label-width="120px" class="scan-sn-form">
            <el-form-item :label="$tt('核验SN列表（拣货SN）')">
              <el-input ref="checkSnList" v-model="state.formData.checkSnList" type="textarea" :disabled="true" :rows="6" class="input-500" @blur="base.scanSn()" @keyup.stop="base.scanSn"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div v-if="state.formData.allotName" class="allot-position flex flex-row-center-between">
        <div class="title">{{ $tt('配货位') }}</div>
        <div class="value">{{ state.formData.allotName }}</div>
      </div>
    </el-card>

    <el-card class="scan-card body-no-padding mt-10">
      <template #header>
        <div class="flex flex-between">
          <span>{{ $tt('扫描结果') }}</span>
          <el-button link @click="state.setting.visible = true">{{ $tt('字段设置') }}</el-button>
        </div>
      </template>
      <el-table ref="scan-table" :data="base.state.tableData" :row-class-name="base.rowClass" size="small" stripe style="width: 100%" class="scan-table" @row-click="(row:any) => rowClick(row)">
        <template v-for="(item, index) in state.setting.fields">
          <template v-if="'positionName,scanWeight'.indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width">
              <template #default="{ row }">
                <template>
                  <el-input v-model="row[item.prop]" size="small" class="w-100pc"></el-input>
                </template>
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
import scanHook from '/@/components/hooks/scanHook';
const ScanSettingDialog = defineAsyncComponent(() => import('/@/components/common/components/scanSettingDialog.vue'));
const InputSelect = defineAsyncComponent(() => import('/@/components/base/InputSelect.vue'));
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

const base = scanHook({
  // 自定义扫描选择过滤器，为了实现多条相同不选择明细，自动选择一条
  customFindFilter: (dataRows: Array<any>, code: string) => {
    let rows = dataRows.filter((item: any) => {
      const exist = base.checkProductModelExist(code, item);
      const overcharges = item.overcharges || 0; // 超收比例
      const overchargesQty = Math.round(((item.quantity || 0) * overcharges) / 100);
      const unFinishedQuantity = (item.unFinishedQuantity || 0) + overchargesQty;
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
    orderCode: null,
    orderWaveCode: '',
    allotPositionName: null, // 配货位
    allotName: '', // 显示的配货位
  },
  // 扫描列设置对话框参数
  setting: {
    visible: false,
    name: 'outbound-scan-order-matching',
    fields: [
      {
        prop: 'productModel',
        label: '条形码',
        visible: true,
        width: 130,
        order: 1,
      },
      {
        prop: 'allotPositionName',
        label: '配货位',
        visible: true,
        width: 90,
        order: 2,
      },
      {
        prop: 'quantityOrder',
        label: '清单数量',
        visible: true,
        width: 90,
        order: 3,
      },
      {
        prop: 'scanQuanity',
        label: '已配货数量',
        visible: true,
        width: 90,
        order: 4,
      },
      {
        prop: 'finishedQuantity',
        label: '当前扫描数量',
        visible: true,
        width: 120,
        order: 5,
      },
      {
        prop: 'unFinishedQuantity',
        label: '未配货数量',
        visible: true,
        width: 130,
        order: 6,
      },
      {
        prop: 'orderCode',
        label: '订单号',
        visible: true,
        width: 140,
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
        prop: 'weight',
        label: '单位毛重',
        visible: true,
        width: 90,
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
        prop: 'totalWeight',
        label: '合计重量',
        visible: false,
        width: 80,
        order: 10,
      },
      {
        prop: 'scanWeight',
        label: '已扫重量',
        visible: false,
        width: 80,
        order: 11,
      },
      {
        prop: 'productName',
        label: '商品名称',
        visible: true,
        order: 12,
      },
      {
        prop: 'clientCode',
        label: '门店编号',
        visible: false,
        width: 120,
        order: 15,
      },
      {
        prop: 'clientShortName',
        label: '门店名称',
        visible: false,
        width: 130,
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
});

// 获得明细数据
const getData = async () => {
  var orderWaveCode = state.formData.orderWaveCode;
  if (!orderWaveCode) {
    proxy.$message.error('波次号不能为空');
    return;
  }
  base.state.tableData = [];
  state.formData.allotName = '';
  const url = '/outbound/out/outScanMatch/getMatchData';
  const params = {
    orderWaveCode,
  };
  const [err, res] = await to(postData(url, params));
  if (err) return;
  proxy.common.showMsg(res);
  if (res?.result) {
    // 构建数据
    base.state.currentRow = {};
    base.state.tableData = res.data.dataList.map((row: any) => {
      // 后端数据FinishedQuanity写错了，应为FinishedQuantity
      row.scanQuanity = Number(row.matchedQuantity);
      row.quantityOrder = Number(row.quantityOrder);
      row.unFinishedQuantity = Math.Round(row.quantityOrder - row.matchedQuantity, 4);
      row.finishedQuantity = 0;
      row.validQuantity = row.quantityOrder; // 原始可扫描数量
      row.singleSignCodeOrigin = row.singleSignCode; // 备份源SN
      row.singleSignCode = null;
      row.weight = Number(row.weight);
      row.totalWeight = Math.Round(Number(row.weight) * Number(row.quantityOrder), 2);
      row.quantityOrder = Number(row.quantityOrder);
      return row;
    });
    // 条码框获得焦点
    base.focus('productModel');
    base.play();
  } else {
    base.playError();
  }
};

// 判断扫描包装条码
const checkPackingBarcode = (evt: any) => {
  var code = state.formData.productModel;
  if (!code) return;

  base.checkPackingProductModel(base.state.tableData, () => {
    state.formData.allotName = base.state.currentRow!.allotPositionName; // 显示的配货位值

    // 播放配货位声音
    const text = `${state.formData.allotName}配货位`;
    base.playText(text);
  });
  if (base.state.currentRow) {
    const sn = base.state.currentRow.singleSignCodeOrigin;
    let snList = [];
    if (sn) {
      snList = sn.split(',');
    }
    let validSnList = snList.filter((item: any) => item); // 有效SN
    validSnList = validSnList.map((item: any) => item.trim());
    validSnList.push('');
    state.formData.checkSnList = validSnList.join('\n');
  }

  base.state.tableData.forEach((e: any) => {
    e.sortIndex2 = 1;
  });
  base.state.tableData.forEach((e: any) => {
    if (code === e.productModel) {
      e.sortIndex2 = 0;
    }
  });
  base.state.tableData.forEach((e: any) => {
    if (e.unFinishedQuantity === 0 && code !== e.productModel) {
      e.sortIndex2 = 3;
    }
  });

  // 排序sortIndex  未配货数量==0 则将明细排到最后
  base.state.tableData = base.state.tableData.sort(function (a: any, b: any) {
    return a.sortIndex2 - b.sortIndex2;
  });
};
// 提交数据
const onSubmit = async () => {
  if (!state.formData.orderWaveCode) {
    proxy.$message.error('请扫描波次单号！');
    proxy.$refs.orderWaveCode.focus();
    base.playError(); // 播放声音
    return;
  }
  const dataList = base.state.tableData.filter((item: any) => item.finishedQuantity > 0);
  if (!dataList.length) {
    proxy.$message.error('请先扫描一条记录！');
    return;
  }
  var orderWaveCode = state.formData.orderWaveCode;
  var url = '/outbound/out/outScanMatch/saveMatchScan';
  var params = {
    scanInType: 'PC_MATCHING', // PC出库配货
    orderWaveCode,
    dataList: dataList,
  };
  const [err, res] = await to(postData(url, params));
  if (err) return;

  proxy.common.showMsg(res);
  if (res?.result) {
    onReset();
  }
};
// 重置
const onReset = () => {
  state.formData.orderWaveCode = '';
  state.formData.positionName = '';
  state.formData.productModel = '';
  state.formData.scanQty = 0;
  state.formData.allotName = '';

  state.formData.snList = '';
  state.formData.checkSnList = '';
  base.state.tableData = [];
  base.state.existRows = [];
  base.focus('orderWaveCode');
};
// 开启SN
const onIsScanSnChange = () => {
  localStorage['isScanSn'] = state.formData.isScanSn;
  base.state.tableData.forEach((row: any) => {
    // 非SN操作，清空条码信息
    if (state.formData.isScanSn) {
      row.singleSignCode = row.singleSignCodeOrigin;
    } else {
      row.singleSignCode = '';
    }
  });
};
const rowClick = (row: any) => {
  base.setCurrent(row, null, null);
};
</script>

<style lang="scss" scoped>
@import '/@/theme/scan.scss';
.scan-card {
  position: relative;
  .allot-position {
    position: absolute;
    top: 150px;
    left: 450px;
    .title {
      padding: 10px;
    }
    .value {
      color: red;
      font-size: 50px;
    }
  }
}
</style>
