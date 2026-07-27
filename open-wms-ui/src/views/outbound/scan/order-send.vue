<template>
  <div class="scan-container">
    <el-card class="scan-card">
      <div slot="header" class="clearfix">
        <span>{{ $tt('发货校验') }}</span>
      </div>
      <el-form ref="form" :model="state.formData" label-width="120px" class="scan-form">
        <el-form-item :label="$tt('扫描类别')">
          <el-radio-group v-model="state.formData.scanType">
            <el-radio :label="$tt('快递单号')">{{ $tt('快递单号') }}</el-radio>
            <el-radio :label="$tt('出库单号')">{{ $tt('出库单号') }}</el-radio>
            <el-radio :label="$tt('波次号')">{{ $tt('波次号') }}</el-radio>
          </el-radio-group>
          <span class="sub-item">
            <span class="sub-label w-140">{{ $tt('不校验快递公司') }}：</span>
            <el-switch v-model="state.formData.noCheckExpressCorp" @change="noNoCheckExpressCorpChange"></el-switch>
          </span>
        </el-form-item>
        <!-- <el-form-item v-if="!state.formData.noCheckExpressCorp" :label="$tt('快递类别')">
					<el-select v-model="state.formData.expressCorpType" :disabled="state.formData.noCheckExpressCorp" :placeholder="$tt('选择快递类别')" class="input-300">
						<el-option v-for="(item, index) in state.dropDownExpresstype" :key="index" :label="$tt(item.value02)" :value="item.value01"></el-option>
					</el-select>
				</el-form-item> -->
        <el-form-item v-if="!state.formData.noCheckExpressCorp" :label="$tt('快递名称')">
          <el-select v-model="state.formData.expressCorpId" :disabled="state.formData.noCheckExpressCorp" :placeholder="$tt('选择快递名称')" class="input-300" @change="getExpressCorpType">
            <el-option v-for="(item, index) in state.dropDownExpressName" :key="index" :label="$tt(item.expressCorpName)" :value="item.expressCorpId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$tt(state.formData.scanType)" @keyup.enter.stop="checkPackingBarcode">
          <el-input ref="expressCode" autofocus v-model="state.formData.expressCode" class="input-300"></el-input>
        </el-form-item>
        <el-form-item :label="$tt('重量(kg)')">
          <el-input ref="weight" v-model="state.formData.weight" :disabled="state.formData.isReadonly" class="input-300" @keyup.enter.stop="onSubmit"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button :disabled="state.formData.isReadonly" type="primary" @click="onSubmit">{{ $tt('校验订单') }}</el-button>
          <el-button @click="onReset">{{ $tt('重置') }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="scan-card body-no-padding mt-10">
      <div slot="header" class="clearfix">
        <span>{{ $tt('扫描结果') }}</span>
      </div>
      <el-table :data="base.state.tableData" stripe style="width: 100%" max-height="500">
        <el-table-column prop="orderCode" :label="$tt('订单号')" width="180"></el-table-column>
        <el-table-column prop="expressCode" :label="$tt('面单号')" width="180"></el-table-column>
        <el-table-column prop="weight" :label="$tt('重量(kg)')" width="100"></el-table-column>
        <el-table-column prop="shippingName" :label="$tt('收件人')" width="200"></el-table-column>
        <el-table-column prop="shippingAddress" :label="$tt('详细地址')"></el-table-column>
      </el-table>
    </el-card>

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

<script setup lang="ts" name="outbound-scan-order-send">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
import { postData } from '/@/api/common/baseApi';
import to from 'await-to-js';
import scanHook from '/@/components/hooks/scanHook';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

const config = ref({
  // 闪电发货显示打印弹出框
  out_sendNoWeight: true,
});
const base = scanHook({ config });

//#region 定义变量
const state = reactive({
  formData: {
    ...toRefs(base.state.formData),
    scanType: '快递单号',
    orderCode: null,
    noCheckExpressCorp: false,
    expressCorpType: '',
    expressCorpName: '',
    expressCode: '', // 快递单号
    expressCorp: '',
    isReadonly: true,
    weight: 0,
    expressCorpId: '',
  },
  dropDownExpresstype: [] as any[], // 快递单号下拉框
  dropDownExpressName: [] as any[], // 快递单号下拉框
  tableData: [],
  dataInfo: {} as any, // 快递单号返回的数据
  // 系统配置参数
  config: config.value,
});
//#endregion

onMounted(() => {
  changeExpressCorpType();

  // 校验条码
  const noCheckExpressCorp = localStorage['noCheckExpressCorp'];
  if (noCheckExpressCorp) {
    state.formData.noCheckExpressCorp = noCheckExpressCorp === 'true';
  }
});

// 获得快递类别
const getExpressCorpType = async () => {
  state.dropDownExpressName;
  if (state.dropDownExpressName.length > 0) {
    var dataList = state.dropDownExpressName.filter((item: any) => {
      return item.expressCorpId == state.formData.expressCorpId;
    });
    state.formData.expressCorpType = dataList[0].expressCorpType;
  }
};
// 选中快递类别改变快递名称
const changeExpressCorpType = async () => {
  var url = '/basic/base/express-corp/getExpressCorp';
  var params = {};
  const [err, res] = await to(postData(url, params));

  if (err) {
    return;
  }
  proxy.common.showMsg(res);
  if (res.result) {
    res.data.dataList.forEach((item: any) => {
      item.label = item.expressCorpId;
      item.value = item.expressCorpName;
      return item;
    });
    state.dropDownExpressName = res.data.dataList;
  }
};
// 快递单号回车事件
const checkPackingBarcode = async () => {
  var isNoCheckExpressCorp = state.formData.noCheckExpressCorp;
  var scanType = state.formData.scanType;
  var expressCode = state.formData.expressCode.trim();
  state.formData.expressCode = expressCode;
  var expressCorpId = state.formData.expressCorpId;

  if (isNoCheckExpressCorp) {
    // 校验快递公司，只要校验类型
    expressCorpId = '0';
  } else {
    if (!expressCorpId) {
      // 播放声音
      base.playError(); // 播放声音
      proxy.common.showMsg({
        showClose: true,
        message: '请选择快递公司！',
        type: 'error',
      });
      return;
    }
  }

  expressCode = expressCode.trim();

  const url = '/outbound/out/orderScanSendBatch/getCheckExpressCode';
  const params = {
    scanType: scanType,
    expressCode: expressCode,
    expressCorpId: expressCorpId,
    isNoCheckExpressCorp: isNoCheckExpressCorp,
  };
  const [err, res] = await to(postData(url, params));

  if (err) {
    onReset();
    return;
  }
  proxy.common.showMsg(res);
  if (res.result) {
    state.dataInfo = res.data.dataList[0];
    base.state.tableData = res.data.dataList;
    state.formData.isReadonly = false;
    proxy.$nextTick(() => {
      base.focus('weight');
    });
  } else {
    base.focus('expressCode');
  }
};
const onSubmit = async () => {
  var expressCode = state.formData.expressCode;
  var expressCorpId: any = state.formData.expressCorpId;
  var dropDownExpressName: any = state.dropDownExpressName;
  var expressCorpName = '';
  for (var index in dropDownExpressName) {
    if (expressCorpId === dropDownExpressName[index].expressCorpId) {
      expressCorpName = dropDownExpressName[index].expressCorpName;
    }
  }
  var orderId = state.dataInfo.orderId;
  var packageId = state.dataInfo.packageId;
  var orderCode = state.dataInfo.orderCode;
  var isBatchOuter = state.dataInfo.isBatchOuter;
  var scanType = state.formData.scanType;
  var weight = 0;

  // 需要称重
  // if (state.config.out_sendNoWeight) {
  weight = state.formData.weight;
  // }

  var isNoCheckExpressCorp = state.formData.noCheckExpressCorp;
  if (!orderId) {
    proxy.common.showMsg({
      showClose: true,
      message: '出库单不存在',
      type: 'error',
    });
    return;
  }
  if (isNoCheckExpressCorp) {
    // 校验快递公司，只要校验类型
    expressCorpId = 0;
  } else {
    if (!expressCorpId) {
      // 播放声音
      base.playError(); // 播放声音
      proxy.common.showMsg({
        showClose: true,
        message: '请选择快递公司！',
        type: 'error',
      });
      return;
    }
  }
  if (!orderCode) {
    // 播放声音
    base.playError(); // 播放声音
    alert('请先校验快递单号！');
    proxy.$refs.expressCode.focus();
    return;
  }

  const url = '/outbound/out/orderScanSendBatch/orderSave';
  const postParams = {
    scanType: scanType,
    isNoCheckExpressCorp: isNoCheckExpressCorp,
    expressCorpId: expressCorpId,
    expressCode: expressCode,
    expressCorpName: expressCorpName,
    packageId: packageId,
    orderId: orderId,
    orderCode: orderCode,
    isBatchOuter: isBatchOuter,
    weight: weight,
  };
  const [err, res] = await to(postData(url, postParams));

  proxy.common.showMsg(res);
  if (res?.result) {
    base.state.tableData = res.data;
    // 播放声音
    base.play();
  } else {
    // 播放声音
    base.playError();
  }

  onReset();
  base.focus('expressCode');
};
// 重置
const onReset = () => {
  state.formData.orderCode = null;
  state.formData.noCheckExpressCorp = false;
  state.formData.expressCorpType = '';
  state.formData.expressCorpName = '';
  state.formData.expressCode = '';
  state.formData.expressCorpId = '';
  state.formData.isReadonly = true;

  base.state.tableData = [];
};
// 不校验快递公司
const noNoCheckExpressCorpChange = () => {
  localStorage['noCheckExpressCorp'] = state.formData.noCheckExpressCorp;
};
</script>

<style lang="scss" scoped>
@import '/@/theme/scan.scss';
</style>
