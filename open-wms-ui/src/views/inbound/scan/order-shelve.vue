<template>
  <div class="scan-container">
    <el-card class="scan-card">
      <template #header>
        <div class="clearfix">
          <span>{{ $tt('待上架扫描上架') }}</span>
        </div>
      </template>
      <el-row>
        <el-col :xl="11" :md="14" :xs="24">
          <el-form ref="form" :model="state.formData" label-width="120px" class="scan-form" @submit.prevent>
            <el-form-item :label="$tt('待上架单号')">
              <el-input ref="shelveCode" v-model="state.formData.shelveCode" class="input-300" autofocus @keyup.enter="getShelveData()"></el-input>
              <span class="sub-item">
                <span class="sub-label">{{ $tt('商品校验') }}：</span>
                <el-switch v-model="state.formData.isCheckProductModel" @change="changeIsCheckProductModel"></el-switch>
              </span>
              <span class="sub-item">
                <span class="sub-label">{{ $tt('开启SN') }}：</span>
                <el-switch v-model="state.formData.isScanSn" @change="onIsScanSnChange"></el-switch>
              </span>
            </el-form-item>
            <el-form-item v-if="state.formData.isCheckProductModel" :label="$tt('商品条码')">
              <el-input ref="productModel" v-model="state.formData.productModel" class="input-300" @keyup.enter.stop="checkPackingBarcode"></el-input>
              <span v-if="!state.formData.isScanSn" class="sub-item">
                <span class="sub-label">{{ $tt('扫描数量') }}：</span>
                <el-input-number ref="scanQty" v-model="state.formData.scanQty" class="input-120" controls-position="right" @change="base.setScanQty"></el-input-number>
              </span>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="shelveSave">{{ $tt('确认上架') }}</el-button>
              <el-button @click="onReset">{{ $tt('重置') }}</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col v-if="state.formData.isScanSn" :xl="12" :md="10" :xs="24">
          <el-form ref="formSn" :model="state.formData" label-position="top" label-width="120px" class="scan-sn-form">
            <el-form-item :label="$tt('扫描SN')">
              <el-input ref="snList" v-model="state.formData.snList" type="textarea" :rows="6" class="input-500" @blur="base.scanSn()" @keyup.stop="base.scanSn()"></el-input>
              <div class="color-666">
                {{ $tt('SN条数') }}：
                <span>{{ state.formData.scanQty }}</span>
              </div>
            </el-form-item>
            <el-form-item :label="$tt('供参考SN列表')">
              <el-input ref="checkSnList" v-model="state.formData.checkSnList" type="textarea" :disabled="true" :rows="6" class="input-500" @keyup.stop="base.scanSn"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="scan-card body-no-padding mt-10">
      <div class="clearfix">
        <span class="padding-top-10">{{ $tt('扫描结果') }}</span>
        <el-button text class="floatRight" @click="state.setting.visible = true">{{ $tt('字段设置') }}</el-button>
      </div>
      <el-table ref="scan-table" :data="base.state.tableData" :row-class-name="base.rowClass" stripe style="width: 100%" class="scan-table" size="small" @row-dblclick="base.setCurrent">
        <template v-for="(item, index) in state.setting.fields">
          <template v-if="'unFinishedQuantity,finishedQuantity'.indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width" align="center">
              <template #default="{ row }">
                <template v-if="!state.formData.isCheckProductModel">
                  <el-input-number v-model="row[item.prop]" size="small" class="w-100pc" controls-position="right" @change="finishedChange(row)"></el-input-number>
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
                <input-select ref="shelvePositionName" v-model="row.shelvePositionName" :options="row.waitPositionNames" :label="$tt('货位')" input-width="110px" trigger="click" size="small" @on-item-click="(ref:any, data:any)=>elDropdownSelect(row, data)" @on-row-change="(ref:any, data:any)=>elDropdownChange(row, data)" @on-key-up="(ref:any, data:any)=>elDropdownKeyup(row, data)"></input-select>
              </template>
            </el-table-column>
          </template>
          <!--SN序列号-->
          <template v-else-if="'singleSignCode'.indexOf(item.prop) >= 0 && state.formData.isScanSn">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width" align="center">
              <template #default="{ row }">
                <span class="sn-text">{{ row.singleSignCode }}</span>
                <span class="sn-count">[{{ $tt('SN数') }}：{{ row.singleSignCode ? row.singleSignCode.split(',').length : 0 }}]</span>
              </template>
            </el-table-column>
          </template>
          <template v-else-if="['scanWeight', 'batchNumber'].indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width" align="center">
              <template #default="{ row }">
                <el-input v-model="row[item.prop]" size="small" class="w-100pc"></el-input>
              </template>
            </el-table-column>
          </template>
          <template v-else-if="'produceDate,limitDate'.indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width" align="center">
              <template #default="{ row }">
                <el-date-picker v-model="row[item.prop]" size="small" type="date" :placeholder="$tt('选择日期')" class="w-110" value-format="YYYY-MM-DD"></el-date-picker>
              </template>
            </el-table-column>
          </template>
          <!--大单位数量-->
          <template v-else-if="'bigQty'.indexOf(item.prop) >= 0">
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
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width" align="center"></el-table-column>
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

<script setup lang="ts" name="inbound-scan-order-shelve">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
import { postData } from '/@/api/common/baseApi';
import to from 'await-to-js';
import moment from 'moment';
import _ from 'lodash';
import scanHook from '/@/components/hooks/scanHook';
const ScanSettingDialog = defineAsyncComponent(() => import('/@/components/common/components/scanSettingDialog.vue'));
const InputSelect = defineAsyncComponent(() => import('/@/components/base/InputSelect.vue'));
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

const config = ref({
  // 支持一品多码
  sku_productToMultiBarcode: true,
  caseMode: 0,
  // 同商品同条码存在多条时默认选中第一条
  global_scanSameProductCodeAndModel: false,
});

const base = scanHook({ config });
//#region 定义变量
const state = reactive({
  formData: {
    ...toRefs(base.state.formData),
    isCheckProductModel: true,
    shelveCode: '',
  },
  // 配置参数
  config: config.value,
  // 扫描列设置对话框参数
  setting: {
    visible: false,
    name: 'inbound-scan-shelve-order',
    fields: [
      {
        prop: 'productModel',
        label: '条形码',
        visible: true,
        width: 130,
        order: 1,
      },
      {
        prop: 'plateCode',
        label: '箱号',
        visible: false,
        width: 130,
        order: 1,
      },
      {
        prop: 'positionName',
        label: '推荐货位',
        visible: true,
        width: 100,
        order: 1,
      },
      {
        prop: 'shelvePositionName',
        label: '上架货位',
        visible: true,
        width: 120,
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
        prop: 'singleSignCode',
        label: '序列号',
        visible: true,
        width: 150,
        order: 7,
      },
      {
        prop: 'smallUnit',
        label: '单位',
        visible: true,
        width: 50,
        order: 8,
      },
      {
        prop: 'bigUnit',
        label: '大单位',
        visible: true,
        width: 60,
        order: 8,
      },
      {
        prop: 'bigQty',
        label: '大单位数量',
        visible: true,
        width: 80,
        order: 8,
      },
      {
        prop: 'batchNumber',
        label: '批次号',
        visible: true,
        width: 100,
        order: 8,
      },
      {
        prop: 'produceDate',
        label: '生产日期',
        visible: true,
        width: 120,
        order: 9,
      },
      {
        prop: 'limitDate',
        label: '到期日期',
        visible: false,
        width: 80,
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
        width: undefined,
        order: 16,
      },
      {
        prop: 'brandName',
        label: '品牌',
        visible: false,
        width: 100,
        order: 8,
      },
    ],
  },
});
//#endregion

onMounted(() => {
  // 扫描明细数据集合
  base.state.tableData = [];
  // 当前正在扫描的数据
  base.state.currentRow = null;
  // 已经找到的数据
  base.state.existRows = [];
  // 字段设置
  const setting = localStorage[state.setting.name + '-setting'];
  if (setting) {
    state.setting.fields = JSON.parse(setting);
  }

  // 开启扫描商品校验
  const isCheckProductModel = localStorage['isCheckProductModel'];
  if (isCheckProductModel) {
    state.formData.isCheckProductModel = isCheckProductModel === 'true';
  }

  // 开启SN扫描
  const isScanSn = localStorage['isScanSn'];
  if (isScanSn) {
    state.formData.isScanSn = isScanSn === 'true';
  }
});

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

// 获取订单数据
const getShelveData = async () => {
  base.state.currentRow = null;
  if (!state.formData.shelveCode) {
    proxy.$message.error('待上架单号不能为空！');
    return;
  }
  state.formData.shelveCode = state.formData.shelveCode.trim();
  let url = '/inbound/in/inScanShelve/getShelveData';
  let params = {
    shelveCode: state.formData.shelveCode,
  };
  let [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }
  proxy.common.showMsg(res);
  if (res?.result) {
    res.data.forEach((element: any) => {
      element.quantity = Math.Round(element.quantity, 4);
      element.shelvedQuantity = Math.Round(element.shelvedQuantity, 4);

      element.sortIndex = 0;
      element.shelvePositionName = '';
      element.scanWeight = element.totalWeight;
      element.finishedQuantity = Math.Round(state.formData.isCheckProductModel ? 0 : element.onShelveQuantity, 4);
      element.unFinishedQuantity = Math.Round(state.formData.isCheckProductModel ? element.onShelveQuantity : 0, 4);
      element.produceDate = element.produceDate ? moment(element.produceDate).format('YYYY-MM-DD') : null;
      if (Array.isArray(element.shelvePositionNameList)) {
        element.waitPositionNames = element.shelvePositionNameList;
        element.shelvePositionName = element.shelvePositionNameList[0] ? element.shelvePositionNameList[0].label : '';
      } else {
        element.waitPositionNames = [];
      }
      if (!element.waitPositionNames.length) {
        element.waitPositionNames.push({ label: element.positionName, id: -1 });
      }
      element.shelvePositionName = element.waitPositionNames[0] ? element.waitPositionNames[0].label : '';

      element.singleSignCodeOrigin = element.singleSignCode; // 备份源SN
      element.validQuantity = element.unFinishedQuantity; // 原始可扫描数量
      // state.formData.checkSnList = element.singleSignCodeOrigin; // 待核验的SN列表
      // 清空条码信息
      element.singleSignCode = '';
      if (element.bigQty) {
        element.bigQty = Math.Round(element.bigQty);
      }
      if (typeof element.expandFields === 'string') {
        element.expandFields = JSON.parse(element.expandFields);
        element = Object.assign(element, element.expandFields);
      }
    });
    base.state.tableData = res.data;
    if (proxy.$refs.productModel) {
      base.focus('productModel');
    }
  } else {
    base.state.tableData = [];
  }
};

// 改变是否扫描商品校验
const changeIsCheckProductModel = () => {
  localStorage['isCheckProductModel'] = state.formData.isCheckProductModel;
  base.state.tableData.forEach((element: any) => {
    element.sortIndex = 0;
    element.shelvePositionName = '';
    element.scanWeight = element.totalWeight;
    element.finishedQuantity = Math.Round(state.formData.isCheckProductModel ? 0 : element.onShelveQuantity, 4);
    element.unFinishedQuantity = Math.Round(state.formData.isCheckProductModel ? element.onShelveQuantity : 0, 4);
    if (Array.isArray(element.shelvePositionNameList)) {
      element.waitPositionNames = element.shelvePositionNameList;
      element.shelvePositionName = element.shelvePositionNameList[0] ? element.shelvePositionNameList[0].label : '';
    }
  });
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

const checkPackingBarcode = (evt: any) => {
  base.checkPackingProductModel();
  if (base.state.currentRow) {
    state.formData.scanQty = base.state.currentRow.finishedQuantity;

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
};

// 提交数据
const shelveSave = () => {
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

  proxy
    .$confirm('您确定要[上架]扫描的数据吗？', '待上架扫描', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(async () => {
      let url = '/inbound/in/inScanShelve/shelveSave';
      let params = {
        scanInType: 'PC_SCAN_SHELVE_IN', // PC扫描上架
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
      }
    })
    .catch(() => {
      proxy.$message.info('已取消');
    });
};

// 重置onReset
const onReset = () => {
  state.formData.scanQty = 0;
  state.formData.productModel = '';
  state.formData.snList = '';
  state.formData.checkSnList = '';
  state.formData.productModel = '';

  base.state.tableData = [];
  base.focus('shelveCode');
};

const finishedChange = (value: any) => {
  value.onShelveQuantity === 0 ? alert('没有入库数量') : value.onShelveQuantity;
  value.finishedQuantity = value.finishedQuantity >= value.onShelveQuantity ? value.onShelveQuantity : value.finishedQuantity;
  value.unFinishedQuantity = value.onShelveQuantity - value.finishedQuantity;
};
</script>

<style lang="scss" scoped>
@import '/@/theme/scan.scss';
</style>
