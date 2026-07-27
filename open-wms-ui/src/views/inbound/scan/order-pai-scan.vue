<template>
  <div class="scan-container">
    <el-card class="scan-card">
      <template #header>
        <div class="clearfix">
          <span>{{ $tt('按单码盘扫描') }}</span>
        </div>
      </template>
      <el-row>
        <el-col :xl="11" :md="14" :xs="24">
          <el-form ref="form" :model="state.formData" label-width="120px" class="scan-form">
            <el-form-item :label="$tt('预到货单号')">
              <el-input ref="orderCode" v-model="state.formData.orderCode" class="input-300" autofocus @keyup.enter.stop="getData"></el-input>
              <span class="sub-item">
                <span class="sub-label">{{ $tt('商品校验') }}：</span>
                <el-switch v-model="state.formData.isValidateProductCode" @change="onIsValidateProductCodeChange"></el-switch>
              </span>
              <span class="sub-item">
                <span class="sub-label">{{ $tt('开启SN') }}：</span>
                <el-switch v-model="state.formData.isScanSn" @change="onIsScanSnChange"></el-switch>
              </span>
            </el-form-item>
            <el-form-item :label="state.formData.isOnShelve ? $tt('上架货位') : $tt('收货位')">
              <el-input v-if="state.formData.isOnShelve" ref="positionName" v-model="state.formData.positionName" :placeholder="$tt('请输入上架货位')" class="input-300" @keyup.enter="positionNameKeyup">
                <template #suffix>
                  <SvgIcon name="icon-iconfontcolor32" size="15" class="cursor-pointer mr-10" @click="base.showPositionSelector" />
                </template>
              </el-input>
              <el-select v-else ref="positionName" v-model="state.formData.positionName" :placeholder="$tt('请选择收货位')" class="input-300">
                <el-option v-for="(item, index) in state.positionList" :key="index" :label="item.positionName" :value="item.positionName" @click="positionNameClick(item)"></el-option>
              </el-select>
              <span class="sub-item">
                <span class="sub-label">{{ $tt('直接上架') }}：</span>
                <el-switch v-model="state.formData.isOnShelve" @change="onIsOnShelveChange"></el-switch>
              </span>
            </el-form-item>
            <el-form-item :label="$tt('扫描托盘号')">
              <el-input ref="plateCode" v-model="state.formData.plateCode" :placeholder="$tt('请输入托盘号')" class="input-300" @keyup.enter="positionNameKeyup"></el-input>
            </el-form-item>
            <el-form-item :label="$tt('商品条码')">
              <el-input ref="productModel" v-model="state.formData.productModel" :disabled="!state.formData.isValidateProductCode" class="input-300" @keyup.enter.stop="checkPackingBarcode"></el-input>
              <span v-if="!state.formData.isScanSn" class="sub-item">
                <span class="sub-label">{{ $tt('扫描数量') }}：</span>
                <!-- :min="1" -->
                <el-input-number ref="scanQty" v-model.number="state.formData.scanQty" :min="0" :disabled="!state.formData.isValidateProductCode" class="input-100" controls-position="right" @change="changeScanQty"></el-input-number>
              </span>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveData">{{ $tt('确认入库') }}</el-button>
              <el-button @click="onReset">{{ $tt('重置') }}</el-button>
              <el-button type="success" @click="printPlateCode">{{ $tt('打印箱码') }}</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col v-if="state.formData.isScanSn" :xl="12" :md="10" :xs="24">
          <el-form ref="formSn" :model="state.formData" label-position="top" label-width="120px" class="scan-sn-form">
            <el-form-item :label="$tt('扫描SN')">
              <el-input ref="snList" v-model="state.formData.snList" type="textarea" :rows="6" class="input-500" @blur="base.scanSn()" @keyup.stop="base.scanSn"></el-input>
              <div class="color-666">
                {{ $tt('N条数') }}：
                <span>{{ state.formData.scanQty }}</span>
              </div>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="scan-card body-no-padding mt-10">
      <template #header>
        <div class="clearfix">
          <span class="padding-top-10">{{ $tt('扫描结果') }}</span>
          <el-button type="primary" class="floatRight" link @click="state.setting.visible = true">{{ $tt('字段设置') }}</el-button>
        </div>
      </template>

      <el-table ref="scan-table" :data="base.state.tableData" :row-class-name="base.rowClass" stripe style="width: 100%" class="scan-table" size="small" @row-dblclick="base.setCurrent">
        <template v-for="(item, index) in state.setting.fields">
          <template v-if="['unFinishedQuantity', 'finishedQuantity'].indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width">
              <template #default="scope">
                <template v-if="!state.formData.isValidateProductCode">
                  <el-input-number v-model="scope.row[item.prop]" :min="0" :max="scope.row['quantity']" size="small" class="w-100pc" controls-position="right" @change="base.rowChangeQty(item.prop, scope.row, 'quantity')"></el-input-number>
                </template>
                <template v-else>
                  {{ scope.row[item.prop] }}
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
          <template v-else-if="'plateCode,scanWeight,batchNumber,parcelQuantity'.indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width">
              <template #default="{ row }">
                <el-input v-model="row[item.prop]" size="small" class="w-100pc" @change="base.calculateAverageWeight(item.prop, row)"></el-input>
              </template>
            </el-table-column>
          </template>
          <template v-else-if="'produceDate,limitDate'.indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width">
              <template #default="{ row }">
                <el-date-picker v-model="row[item.prop]" size="small" type="date" placeholder="选择日期" class="w-110" value-format="YYYY-MM-DD"></el-date-picker>
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
          <template v-else>
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width"></el-table-column>
          </template>
        </template>
        <el-table-column fixed="right" :label="$tt('操作')" width="70">
          <template #default="scope">
            <el-button v-if="!scope.row.isMain" link size="small" @click="deleteRow(scope.row, scope.$index)">{{ $tt('删除') }}</el-button>
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

    <!-- 货位选择器 -->
    <yrt-selector ref="selector-dialog" :config="base.state.positionSelector" v-model:visible="base.state.positionSelector.visible" @on-selected="(rows:any[])=>base.onPositionSelected(rows, 'productModel')"></yrt-selector>
  </div>
</template>

<script setup lang="ts" name="inbound/order-pai-scan">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
import { postData } from '/@/api/common/baseApi';
import to from 'await-to-js';
import scanHook from '/@/components/hooks/scanHook';
import moment from 'moment';
const ScanSettingDialog = defineAsyncComponent(() => import('/@/components/common/components/scanSettingDialog.vue'));
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

const config = ref({
  // 自动生成上架单
  in_generateShelve: true,
  // 是否启用装箱操作
  in_caseNumber: false,
  // 支持一品多码
  sku_productToMultiBarcode: true,
});

const base = scanHook({ config });

//#region 定义变量
const state = reactive({
  // 收货位候选项
  positionList: [] as any[],
  // 配置参数
  config: config.value,
  // 扫描列设置对话框参数
  setting: {
    visible: false,
    name: 'order-pai-scan',
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
        prop: 'plateCode',
        label: '托盘号',
        visible: true,
        width: 160,
        order: 8,
      },
      {
        prop: 'singleSignCode',
        label: '序列号(SN)',
        visible: true,
        width: 180,
        order: 8,
      },
      {
        prop: 'positionName',
        label: '货位',
        visible: true,
        width: 160,
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
        prop: 'batchNumber',
        label: '批次号',
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
        prop: 'parcelQuantity',
        label: '包数',
        visible: true,
        width: 80,
        order: 16,
      },
      {
        prop: 'parcelAverageWeight',
        label: '均重',
        visible: true,
        width: 80,
        order: 17,
      },
      {
        prop: 'productName',
        label: '商品名称',
        visible: true,
        order: 18,
      },
    ],
  },
  formData: {
    ...toRefs(base.state.formData),
    orderCode: '',
    orderId: '',
  },
});
//#endregion

//#region wacth
watch(
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

// 开启SN
const onIsScanSnChange = () => {
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
  const detailField = state.setting.fields.find((item) => item.prop === 'positionName');
  detailField!.label = state.formData.isOnShelve ? '上架货位' : '收货位';
};
// 获得明细数据
const getData = async () => {
  var orderCode = state.formData.orderCode;
  if (!orderCode) {
    proxy.$message.error('预到货单号不能为空');
  }
  orderCode = orderCode.trim();
  state.formData.orderCode = orderCode;
  const url = '/inbound/in/inScanOrder/getInOrderData';
  const params = {
    orderCode: state.formData.orderCode,
    isOnShelve: state.formData.isOnShelve,
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
    state.formData.plateCode = '';
    state.formData.productModel = '';
    state.formData.scanQty = 0;
    // 获取最大编码
    state.formData.plateCode = res.data.newCaseNumber;
    state.formData.orderId = res.data.orderId;
    state.formData.storageId = res.data.storageId;
    state.formData.storageName = res.data.storageName;

    if (!state.formData.isValidateProductCode) {
      base.state.tableData.forEach((row) => {
        row.finishedQuantity = row.unFinishedQuantity;
        row.unFinishedQuantity = 0;
        row.enterQuantity = Number(row.enterQuantity);
      });
    }
    base.state.tableData = res.data.orderList.map((row: any) => {
      row.unFinishedQuantity = Math.Round(row.quantity - (row.enterQuantity || 0), 4);
      row.finishedQuantity = 0;
      row.sortIndex = 0;
      row.scanWeight = 0;
      row.isMain = 1; // 用于拆分，是否为源数据
      row.plateCode = null; // 将托盘号 留空，扫描条码时才会赋值扫描结果到托盘号列
      row.validQuantity = row.unFinishedQuantity;
      row.quantity = Number(row.quantity);
      row.waitPositionNames = [];
      row.enterQuantity = Number(row.enterQuantity);

      return row;
    });
    // 直接上架选中时手工输入，未选中获取收货位
    if (!state.formData.isOnShelve) {
      await getPositionList();
    }
    base.focus('positionName');
  } else {
    base.focus('orderCode');
  }
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
      base.state.tableData.forEach((row) => {
        row.positionName = state.formData.positionName;
      });
    }
  } else {
    state.positionList = [];
  }
  // 条码框获得焦点
  base.focus('plateCode');
};
// 判断扫描包装条码
const checkPackingBarcode = (evt: any) => {
  // if (!state.formData.positionName) {
  // 	proxy.$message.error('上架货位不能为空');
  // 	return;
  // }
  if (!state.formData.plateCode) {
    proxy.$message.error('托盘号不能为空');
    return;
  }
  // // 托盘号已使用
  // if (base.state.tableData.some(item => item.plateCode === state.formData.plateCode && item.unFinishedQuantity === 0)) {
  //   proxy.$message.error("托盘号已使用过了");
  //   return;
  // }
  // for (const item of base.state.tableData) {
  // 	if (item.plateCode === state.formData.plateCode && item.productModel !== state.formData.productModel) {
  // 		proxy.$message.error('收货拍号重复' + item.plateCode);
  // 		return;
  // 	}
  // }

  splitRow(); // 拆分行
  if (state.formData.positionName) {
    base.checkPackingProductModel(() => {
      base.state.currentRow!.plateCode = state.formData.plateCode;
      base.state.currentRow!.positionName = state.formData.positionName;
    });
  } else {
    base.checkPackingProductModel(() => {
      base.state.currentRow!.plateCode = state.formData.plateCode;
    });
  }
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
  state.formData.snList = '';
  state.formData.plateCode = '';
  state.formData.orderCode = '';
  state.formData.orderCode = '';
  base.state.tableData = [];
  proxy.$refs.orderCode.focus();
};

// 入库时保质期如果超过一定时长（可设定）需要预警提示是否入库
const saveData = async () => {
  if (!state.formData.orderCode) {
    proxy.$message.error('请扫描预到货单号！');
    proxy.$refs.orderCode.focus();
    base.playError(); // 播放声音
    return;
  }

  var dataList = base.state.tableData.filter((item) => {
    return item.finishedQuantity > 0;
  });

  if (!dataList.length) {
    proxy.$message.error('没有扫描可用的数据！');
    return;
  }
  if (!window.confirm('当前扫描要确认入库吗？')) return;
  var url = '/composite/in/inPaiScan/saveCheckPlateCode';
  var params = {
    plateCodes: dataList.map((item) => item.plateCode).join(','),
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }
  if (res.result) {
    await save();
  }
};

// 确认入库
const save = async () => {
  if (!state.formData.orderCode) {
    proxy.$message.error('请扫描预到货单号！');
    proxy.$refs.orderCode.focus();
    base.playError(); // 播放声音
    return;
  }

  var emptypositionName = base.state.tableData
    .filter((item) => {
      return !item.plateCode && item.finishedQuantity > 0;
    })
    .map((item) => {
      return item.productModel;
    });
  if (emptypositionName.length) {
    proxy.$message.error('条形码[' + emptypositionName.join(',') + ']货位不能为空！');
    base.playError(); // 播放声音
    return;
  }

  var dataList = proxy.common.deepCopy(base.state.tableData.filter((rowData) => rowData.finishedQuantity));

  dataList = dataList.map((item: any) => {
    delete item.waitPositionNames;
    return item;
  });
  if (!dataList.length) {
    proxy.$message.error('至少扫描一条！');
    base.playError(); // 播放声音
    return;
  }
  var url = '/composite/in/inPaiScan/scanPlateInSave';
  var params = {
    scanInType: 'PC_ORDER_STACKING_IN', // PC按单码盘入库
    orderId: state.formData.orderId,
    orderCode: state.formData.orderCode,
    positionName: state.formData.positionName,
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
};

// 收货位
const positionNameClick = (item: any) => {
  const plateCode = item.name;
  base.state.tableData.forEach((rowData) => {
    rowData.plateCode = plateCode;
  });
};

// 输入上架货位
const positionNameKeyup = (val: any) => {
  state.formData.snList = '';
  base.focus('productModel');
};

// 打印托盘条码
const printPlateCode = () => {
  if (!state.formData.plateCode) {
    proxy.$message.error('箱码不能为空');
    return;
  }
  let productIds = base.state.tableData.map((m) => m.productId).join(',');
  let data = base.state.tableData.map((m) => {
    m.quantity = m.finishedQuantity;
    m.produceDate = m.produceDate ? moment(m.produceDate).format('YYYY-MM-DD') : '';
    return m;
  });

  let key = proxy.common.getGUID();
  sessionStorage.setItem('static_' + key, JSON.stringify(data));
  var url = `/system/print/base-template-id/12001/0/${productIds}?key=${key}&autoPrint=false`;
  window.open(url);
};

// 拆分明细
const splitRow = () => {
  const row = base.state.currentRow;
  if (!row || !row.plateCode) {
    return;
  }
  if (row.plateCode === state.formData.plateCode) {
    return;
  }
  // 未完成数量必须大于0
  if (row.unFinishedQuantity <= 0) {
    return;
  }
  base.state.tableData.forEach((element) => {
    element.sortIndex = 0;
  });

  const index = base.state.tableData.indexOf(base.state.currentRow);
  const newRow = proxy.common.deepCopy(row);
  newRow.finishedQuantity = 0;
  newRow.quantity = newRow.unFinishedQuantity;
  newRow.validQuantity = newRow.unFinishedQuantity;

  newRow.isMain = 0;
  newRow.sortIndex = 1; // 置顶
  newRow.singleSignCode = null;
  base.state.tableData.splice(index + 1, 0, newRow);

  // 置顶排序
  base.state.tableData.sort(function (a, b) {
    return b.sortIndex - a.sortIndex;
  });

  // 原始行数据修改，总数量减少
  row.quantity = row.quantity - newRow.unFinishedQuantity;
  // 未完成数量改成0
  row.unFinishedQuantity = 0;
  base.state.currentRow = newRow;
  base.state.existRows = [newRow];
};

// 删除明细
const deleteRow = (row: any, index: any) => {
  if (row.isMain) {
    proxy.$message.error('主商品不允许删除！');
    return;
  }
  const quantity = row.quantity;
  const mainRow = base.state.tableData.find((item) => item.isMain && item.orderList_Id === row.orderList_Id);
  mainRow.quantity += quantity;
  mainRow.unFinishedQuantity += quantity;
  if (base.state.currentRow === row) {
    base.state.currentRow = mainRow;
  }
  base.state.tableData.splice(index, 1);
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
