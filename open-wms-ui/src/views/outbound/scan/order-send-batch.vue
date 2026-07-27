<template>
  <div class="scan-container">
    <el-card class="scan-card">
      <div slot="header" class="clearfix">
        <span>闪电发货校验</span>
      </div>
      <el-form ref="form" :model="state.formData" label-width="120px" class="scan-form">
        <!-- <el-form-item label="波次号">

        </el-form-item> -->
        <el-form-item label="波次号">
          <el-input ref="orderWaveCode" v-model="state.formData.orderWaveCode" autofocus class="input-300" @keyup.enter.stop="getData"></el-input>
          <span class="sub-item">
            <span class="sub-label">商品校验：</span>
            <el-switch v-model="state.formData.isValidateProductCode" @change="onIsValidateProductCodeChange"></el-switch>
          </span>
        </el-form-item>
        <el-form-item label="包材条码">
          <el-input ref="wrapperBarcode" v-model="state.formData.wrapperBarcode" class="input-300" @keyup.enter.stop="bathSet(1)"></el-input>
        </el-form-item>
        <el-form-item label="重量(KG)">
          <el-input ref="weight" v-model.number="state.formData.weight" :step="0.01" type="number" class="input-300" @keyup.enter.stop="bathSet(2)"></el-input>
        </el-form-item>
        <el-form-item label="每单件数">
          <el-input ref="orderNumber" v-model.number="state.formData.orderNumber" :min="1" type="number" class="input-300" @change="orderNumberChange"></el-input>
        </el-form-item>
        <el-form-item v-if="state.formData.isValidateProductCode" label="商品条码">
          <el-input ref="productModel" v-model="state.formData.productModel" :disabled="state.formData.isReadonlyProductModel" class="input-300" @keyup.enter.stop="checkPackingBarcode"></el-input>
          <span class="sub-item">
            <span class="sub-label">扫描数量：</span>
            <el-input-number v-model="state.formData.scanQty" :min="1" :disabled="state.formData.isReadonlyProductModel" controls-position="right" class="input-100" @change="changeScanQty"></el-input-number>
          </span>
        </el-form-item>
        <el-form-item>
          <!-- <el-button type="primary">设置选中项的包材和重量</el-button> -->
          <el-button type="primary" @click="confirmSend">确认发货</el-button>
          <el-button @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="scan-card body-no-padding mt-5">
      <template #header>
        <div class="clearfix">
          <span class="padding-top-10">{{ $tt('扫描结果') }}</span>
          <el-button link class="floatRight" @click="state.setting.visible = true">{{ $tt('字段设置') }}</el-button>
        </div>
      </template>
      <el-table ref="scan-table" :data="base.state.tableData" :row-class-name="base.rowClass" stripe style="width: 100%" class="scan-table" size="small" @row-dblclick="base.setCurrent">
        <template v-for="(item, index) in state.setting.fields">
          <template v-if="'bigQty'.indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width">
              <template #default="{ row }">
                <!-- {{ row }} -->
                <!-- <span class="sn-text">{{ row.bigQty || 0 }}{{ row.bigUnit || '' }}{{ row.bigQty || 0 }}{{ '瓶' }}</span> -->
                <span class="sn-text">{{
                  common.formatData(row, {
                    prop: 'bigQty',
                    formatter: '大单位格式化',
                  })
                }}</span>
              </template>
            </el-table-column>
          </template>
          <template v-else>
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)"></el-table-column>
          </template>
        </template>
      </el-table>
    </el-card>

    <!--闪电发货提交-->
    <el-dialog draggable v-model:visible="state.formSave.isOpenPackage" :close-on-click-modal="false" title="闪电发货提交" width="520px" append-to-body>
      <el-form label-width="120px">
        <el-form-item label="模板选项" style="width: 320px">
          <el-select v-model="state.formSave.packageLabelType" clearable placeholder="请选择">
            <el-option v-for="item in state.packageLabelOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="打印后关闭窗口">
          <el-switch v-model="formSave.closeWindow"></el-switch>
        </el-form-item> -->
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit">按件数打印并提交</el-button>
        <el-button @click="state.formSave.isOpenPackage = false">取 消</el-button>
      </div>
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

<script setup lang="ts" name="outbound/order-send-batch">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
import { postData } from '/@/api/common/baseApi';
import to from 'await-to-js';
import scanHook from '/@/components/hooks/scanHook';
let ins = getCurrentInstance() as ComponentInternalInstance;
const ScanSettingDialog = defineAsyncComponent(() => import('/@/components/common/components/scanSettingDialog.vue'));
let proxy = ins.proxy as BaseProperties;

const config = ref({
  // 闪电发货显示打印弹出框
  out_sendShowPrint: false,
});

const base = scanHook({ config });
//#region 定义变量
const state = reactive({
  // 配置参数
  config: config.value,
  formData: {
    ...toRefs(base.state.formData),
    orderCode: null,
    orderWaveCode: '', // 波次号
    wrapperBarcode: '', // 包装条码
    weight: '', // 重量
    orderNumber: 1,
    isValidateProductCode: false, // 是否校验商品
    outerNumber: 0,
    isReadonlyProductModel: false,
  },
  // 明细数据
  tableData: [],
  formSave: {
    isOpenPackage: false, // 弹出框
    packageLabelType: '', // 箱标签类型
    closeWindow: false, // 是否打印后自动关闭页面
  },
  packageLabelOptions: [
    {
      value: '箱标签1',
      label: '箱标签1',
    },
    {
      value: '箱标签2',
      label: '箱标签2',
    },
  ],

  // 扫描列设置对话框参数
  setting: {
    visible: false,
    name: 'outbound-scan-order-send-batch',
    fields: [
      {
        prop: 'productName',
        label: '商品名称',
        visible: true,
        width: 220,
        order: 1,
      },
      {
        prop: 'productModel',
        label: '商品条码',
        visible: true,
        width: 130,
        order: 2,
      },
      {
        prop: 'finishedQuantity',
        label: '已扫描数量',
        visible: true,
        width: 80,
        order: 4,
      },
      {
        prop: 'unFinishedQuantity',
        label: '未扫描数量',
        visible: true,
        width: 80,
        order: 5,
      },
      {
        prop: 'bigBarcode',
        label: '箱条码',
        visible: false,
        width: 140,
        order: 6,
      },
      {
        prop: 'quantityOrder',
        label: '基数量',
        visible: true,
        width: 70,
        order: 8,
      },
      {
        prop: 'bigQty',
        label: '大单位数量',
        visible: true,
        width: 90,
        order: 8,
      },
      {
        prop: 'bigUnit',
        label: '大单位',
        visible: true,
        width: 70,
        order: 8,
      },
    ],
  } as any,
});
//#endregion

onActivated(() => {
  // 校验条码
  const isValidateProductCode = localStorage['out_isValidateProductCode'];
  if (isValidateProductCode) {
    state.formData.isValidateProductCode = isValidateProductCode === 'true';
  }
});

// 获得数据
const getData = async () => {
  base.state.tableData = [];
  var orderWaveCode = state.formData.orderWaveCode;
  if (!orderWaveCode) {
    proxy.$message.error('波次号不能为空');
    return;
  }
  const url = '/outbound/out/orderScanSendBatch/getSendBatchData';
  const params = {
    orderPrintCode: orderWaveCode,
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }

  if (res.result) {
    if (res.data.dataList.length > 0) {
      base.state.tableData = res.data.dataList;
      base.state.tableData.forEach((rowData) => {
        // rowData.unFinishedQuantity = rowData.quantityOrder;
        // rowData.finishedQuantity = 0;
        rowData.outerNumber = 1;
        rowData.bigQty = rowData.unitConvert || 0;
        if (!state.formData.isValidateProductCode) {
          rowData.unFinishedQuantity = 0;
          rowData.finishedQuantity = Number(rowData.quantityOrder);
          rowData.validQuantity = Number(rowData.quantityOrder);
          rowData.quantityOrder = Number(rowData.quantityOrder);
        } else {
          rowData.unFinishedQuantity = Number(rowData.quantityOrder) || 0;
          rowData.validQuantity = Number(rowData.quantityOrder) || 0;
          rowData.quantityOrder = Number(rowData.quantityOrder);

          rowData.finishedQuantity = 0;
        }
      });

      proxy.$refs.wrapperBarcode.focus();
    } else {
      proxy.$message.error(orderWaveCode + '，没有可发货的数据！');
      return;
    }
    // the.formData.orderNumber = 1; // 获取波次后重新刷新每单件数
  }
};
// 包材条码和重量回车事件
const bathSet = (code: any) => {
  if (code === 1) {
    var wrapperBarcode = state.formData.wrapperBarcode;
    base.state.tableData.forEach((rowData) => {
      rowData.wrapperBarcode = wrapperBarcode;
    });
    proxy.$refs.weight.focus();
  }
  if (code === 2) {
    var weight = state.formData.weight;
    base.state.tableData.forEach((rowData) => {
      rowData.weight = weight;
    });
  }
};
// 提交数据
const onSubmit = async () => {
  var orderWaveCode = state.formData.orderWaveCode;
  var orderNumber = state.formData.orderNumber;
  if (!state.formData.orderWaveCode) {
    proxy.$message.error('波次号不能为空！');
    return;
  }
  if (!orderNumber) {
    proxy.$message.error('每单件数不能为空！');
    return;
  }
  if (state.config.out_sendShowPrint && !state.formSave.packageLabelType) {
    proxy.$message.error('请选择模板！');
    return;
  }
  let dataList = base.state.tableData
    .filter((f) => f.finishedQuantity)
    .map((rowData) => {
      rowData.wrapperBarcode = state.formData.wrapperBarcode;
      rowData.weight = rowData.weight || state.formData.weight;
      rowData.outerNumber = rowData.outerNumber || state.formData.outerNumber; // 合计件数

      return rowData;
    });
  if (!dataList.length) {
    proxy.$message.error('明细不能为空！');
    return;
  }

  let url = '/outbound/out/orderScanSendBatch/saveSendBatchData';
  const params = {
    orderWaveCode: orderWaveCode,
    orderNumber: orderNumber,
    dataList: dataList,
    factWeight: state.formData.weight,
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    base.focus('orderCode');
    return;
  }
  proxy.common.showMsg(res);
  if (res.result) {
    onReset();
    if (state.config.out_sendShowPrint) {
      // 闪电发货显示打印弹出框后才需要执行以下代码
      localStorage.setItem('printType', '闪电发货按件数打印面单');
      sessionStorage.setItem('packageLabelType', state.formSave.packageLabelType);
      localStorage.setItem('totalPackage', '' + state.formData.orderNumber);
      if (res.data.length > 0) {
        localStorage.setItem('printOrderDetails', JSON.stringify(res.data));
        const key = proxy.common.getGUID();
        sessionStorage.setItem(key, JSON.stringify(res.data));
        url = '/inbound/purchase/print-barcode?key=' + key;
        window.open(url);
        state.formSave.isOpenPackage = false;
      }
    }
  }
};

// 重置数据
const onReset = () => {
  state.formData.orderCode = null;
  state.formData.orderWaveCode = '';
  state.formData.wrapperBarcode = '';
  state.formData.weight = '';
  state.formData.outerNumber = 0;
  // 明细数据
  base.state.tableData = [];
  proxy.$refs.orderWaveCode.focus();
};

// 按件数打印
const confirmSend = () => {
  if (!state.formData.orderWaveCode) {
    proxy.$message.error('波次号不能为空！');
    return;
  }
  for (const rowData of base.state.tableData) {
    if (rowData.finishedQuantity !== rowData.quantityOrder) {
      proxy.$message.error('条码【' + rowData.productModel + '】,未扫描完成!');
      base.playError();
      base.state.saving = false;
      return;
    }
  }
  if (!base.state.tableData.length) {
    proxy.$message.error('明细不能为空！');
    return;
  }
  if (state.config.out_sendShowPrint) {
    // 闪电发货显示打印弹出框
    state.formSave.isOpenPackage = true;
  } else {
    onSubmit();
  }
};
// 每单件数
const orderNumberChange = () => {
  base.state.tableData.forEach((rowData) => {
    rowData.outerNumber = state.formData.orderNumber;
  });
};
// 扫描商品条码回车
const checkPackingBarcode = (evt: any) => {
  base.checkPackingProductModel(base.state.tableData, null);
};
// 扫描手工更改扫描数量
const changeScanQty = () => {
  if (base.state.currentRow) {
    base.state.currentRow.finishedQuantity = state.formData.scanQty;
    base.state.currentRow.unFinishedQuantity = Math.Round(base.state.currentRow.quantityOrder - state.formData.scanQty, 4);
  }
};
// 是否校验商品切换
const onIsValidateProductCodeChange = () => {
  localStorage['out_isValidateProductCode'] = state.formData.isValidateProductCode;

  base.state.tableData = base.state.tableData.map((row) => {
    let unFinishedQuantity = Math.Round(row.quantityOrder, 4);
    let finishedQuantity = 0;
    if (!state.formData.isValidateProductCode) {
      unFinishedQuantity = 0;
      finishedQuantity = Math.Round(row.quantityOrder, 4);
    }
    row.unFinishedQuantity = unFinishedQuantity;
    row.finishedQuantity = finishedQuantity;
    row.sortIndex = 0;
    return row;
  });
};
</script>

<style lang="scss" scoped>
@import '/@/theme/scan.scss';
</style>
