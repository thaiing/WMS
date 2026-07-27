<template>
  <div class="scan-container">
    <el-card class="scan-card">
      <template #header>
        <div class="clearfix">
          <span>按拍下架</span>
        </div>
      </template>
      <el-form ref="form" :model="state.formData" label-width="120px" class="scan-form">
        <el-form-item label="波次号">
          <el-input ref="orderWaveCode" v-model="state.formData.orderWaveCode" autofocus class="input-300" @keyup.enter.stop="getData"></el-input>
          <!-- <span class="sub-item">
            <span class="sub-label">商品校验：</span>
            <el-switch v-model="state.formData.isValidateProductCode" @change="onIsValidateProductCodeChange"></el-switch>
          </span> -->
        </el-form-item>
        <el-form-item label="下架理货位">
          <el-select ref="positionName" v-model="state.formData.positionName" placeholder="请选择收货位" class="input-300">
            <el-option v-for="(item, index) in state.offPositionList" :key="index" :label="item.positionName" :value="item.positionName"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="商品条码">
          <el-input ref="productModel" v-model="state.formData.productModel" :disabled="!state.formData.isValidateProductCode" class="input-300" @keyup.enter.stop="checkPackingProductModel"></el-input>
          <span class="sub-item">
            <span class="sub-label">扫描数量：</span>
            <el-input-number ref="scanQty" v-model="state.formData.scanQty" :min="1" :disabled="!state.formData.isValidateProductCode" controls-position="right" class="input-100" @change="setScanQty"></el-input-number>
          </span>
        </el-form-item> -->
        <el-form-item label="托盘号">
          <el-input ref="plateCode" v-model="state.formData.plateCode" class="input-300" @keyup.enter.stop="checkPackingPlateCode"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="btnSave">确认拣货</el-button>
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
      <el-table ref="scan-table" :data="base.state.tableData" :row-class-name="base.rowClass" stripe style="width: 100%" size="small" class="scan-table" @row-dblclick="base.setCurrent">
        <template v-for="(item, index) in state.setting.fields">
          <template v-if="['unFinishedQuantity', 'finishedQuantity'].indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="item.label" :width="item.width">
              <template #default="{ row }">
                <template v-if="!state.formData.isValidateProductCode">
                  <el-input-number v-model="row[item.prop]" :min="0" :max="row['quantityOrder']" size="small" class="w-100pc" controls-position="right" @change="base.rowChangeQty(item.prop, row)"></el-input-number>
                </template>
                <template v-else>
                  {{ row[item.prop] }}
                </template>
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

<script setup lang="ts" name="outbound-scan-order-plate-picking">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
import { postData } from '/@/api/common/baseApi';
import to from 'await-to-js';
import scanHook from '/@/components/hooks/scanHook';
const ScanSettingDialog = defineAsyncComponent(() => import('/@/components/common/components/scanSettingDialog.vue'));
const InputSelect = defineAsyncComponent(() => import('/@/components/base/InputSelect.vue'));
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

//#region 配置参数
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
    orderWaveCode: null,
  } as any,
  // 收货位候选项
  offPositionList: [] as any[],
  isProductmodel: '',
  checkedSnList: [] as any[], // 已经校验成功的SN缓存
  // 扫描列设置对话框参数
  setting: {
    visible: false,
    name: 'outbound-scan-order-picking',
    fields: [
      {
        prop: 'productModel',
        label: '条形码',
        visible: true,
        width: 150,
        order: 1,
      },
      {
        prop: 'quantityOrder',
        label: '商品数量',
        visible: true,
        width: 80,
        order: 2,
      },
      // {
      //   prop: "pickQuantity",
      //   label: "已入库数量",
      //   visible: true,
      //   width: 100,
      //   order: 3
      // },
      {
        prop: 'finishedQuantity',
        label: '已扫描数量',
        visible: true,
        width: 100,
        order: 4,
      },
      {
        prop: 'unFinishedQuantity',
        label: '未扫描数量',
        visible: true,
        width: 100,
        order: 5,
      },
      {
        prop: 'productCode',
        label: '商品编号',
        visible: false,
        width: 140,
        order: 6,
      },
      {
        prop: 'positionName',
        label: '拣货位',
        visible: true,
        width: 120,
        order: 7,
      },
      {
        prop: 'productSpec',
        label: '商品规格',
        visible: true,
        width: 80,
        order: 8,
      },
      {
        prop: 'plateCode',
        label: '托盘号',
        visible: true,
        width: 120,
        order: 9,
      },
      {
        prop: 'weight',
        label: '单位毛重',
        visible: false,
        width: 80,
        order: 10,
      },
      {
        prop: 'totalWeight',
        label: '合计重量',
        visible: false,
        width: 80,
        order: 11,
      },
      {
        prop: 'scanWeight',
        label: '已扫重量',
        visible: false,
        width: 90,
        order: 12,
      },
      {
        prop: 'productName',
        label: '商品名称',
        visible: true,
        order: 13,
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
  // 校验条码
  const isValidateProductCode = localStorage['out_isValidateProductCode'];
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

// 获得明细数据
const getData = async () => {
  state.checkedSnList = []; // 清空已校验SN
  state.formData.snList = '';
  base.state.currentRow = null;
  let orderWaveCode = state.formData.orderWaveCode;
  if (!orderWaveCode) {
    proxy.$message.error('波次号不能为空！');
    return;
  }
  orderWaveCode = orderWaveCode.trim();
  state.formData.orderWaveCode = orderWaveCode;
  base.state.tableData = [];

  const url = '/outbound/out/outScanPicking/getPickingData';
  const params = {
    orderWaveCode: orderWaveCode,
    cartCode: state.formData.cartCode,
    orderType: 'PC按拍下架',
  };

  const [err, res] = await to(postData(url, params));
  if (err) return;

  // 构建数据
  base.state.currentRow = null;
  base.state.existRows = [];

  base.state.tableData = res.data.dataList.map((row: any) => {
    const quantityOrder = Math.Round(row.quantityOrder, 4);
    let unFinishedQuantity = Math.Round(quantityOrder - row.pickQuantity, 4);

    let finishedQuantity = 0;
    if (!state.formData.isValidateProductCode) {
      unFinishedQuantity = 0;
      finishedQuantity = Math.Round(quantityOrder - row.pickQuantity, 4);
      row.scanWeight = row.totalWeight;
    }
    row.quantityOrder = quantityOrder;
    row.unFinishedQuantity = unFinishedQuantity;
    row.finishedQuantity = finishedQuantity;
    row.sortIndex = 0;
    row.singleSignCodeOrigin = row.singleSignCode; // 备份源SN
    row.validQuantity = unFinishedQuantity; // 原始可扫描数量
    // 清空条码信息
    row.singleSignCode = '';

    return row;
  });
  // 获取货位
  state.offPositionList = res.data.offPositionList;
  if (state.offPositionList.length) {
    state.formData.positionName = state.offPositionList[0].positionName;
  }
  // 条码框获得焦点
  base.focus('plateCode');
};

// 获取所属托盘号的数据
const checkPackingPlateCode = () => {
  // base.checkPackingProductModel();
  base.state.existRows = base.state.tableData.filter((item) => {
    return item.plateCode === state.formData.plateCode;
  });
  if (base.state.existRows.length <= 0) {
    proxy.$message.error(state.formData.plateCode + '不存在！');
    proxy.$refs.plateCode.focus();
    base.playError(); // 播放声音
    return;
  }
  onPlateCodeChange();
};
// 当托盘号存在改变所选数据数量
const onPlateCodeChange = () => {
  base.state.currentRow;
  // 改变当前拍扫描数量
  base.state.tableData
    .filter((item) => {
      return item.plateCode === state.formData.plateCode;
    })
    .forEach((row) => {
      if (row.unFinishedQuantity <= 0) {
        proxy.$message.error('没有可扫描数量');
        return;
      }
      row.scanWeight = row.totalWeight;
      row.finishedQuantity = row.unFinishedQuantity;
      row.unFinishedQuantity = 0;
      row.sortIndex = 0;
      return row;
    });
};
// 保存
const btnSave = async () => {
  let positionName = state.formData.positionName;
  if (!state.formData.positionName) {
    proxy.$message.error('请扫描拣货位！');
    base.focus('orderWaveCode');
    base.playError();
    return;
  }
  let dataList = base.state.tableData.filter((rowData) => rowData.finishedQuantity > 0);
  if (!dataList.length) {
    proxy.$message.error('已扫描数量必须大于0！');
    return;
  }
  let url = '/outbound/out/outScanPicking/savePickingScan';
  let params = {
    orderWaveCode: state.formData.orderWaveCode,
    positionName,
    cartCode: state.formData.cartCode, // 拣货车码
    dataList: dataList,
  };

  const [err, res] = await to(postData(url, params));
  if (err) return;
  proxy.common.showMsg(res);
  onReset();
};
// 重置
const onReset = async () => {
  state.formData.orderWaveCode = null;
  state.formData.positionName = null;
  state.formData.productModel = null;
  state.formData.scanQty = null;
  state.formData.plateCode = '';
  base.state.tableData = [];
  base.focus('orderWaveCode');
};
</script>

<style lang="scss" scoped>
@import '/@/theme/scan.scss';
</style>
