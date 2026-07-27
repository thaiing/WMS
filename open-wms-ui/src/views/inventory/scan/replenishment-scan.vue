<template>
  <div class="scan-container">
    <el-card class="scan-card no-print">
      <template #header>
        <div class="flex flex-between">
          <div class="clearfix justify-start">
            <span class="title">{{ $tt('补货扫描') }}</span>
          </div>
          <el-button link @click="state.replenishmentSetting.visible = true">{{ $tt('场景设置') }}</el-button>
        </div>
      </template>
      <el-form ref="form" :model="state.formData" label-width="120px" class="scan-form">
        <el-form-item label="补货单号">
          <el-input ref="replenishmentCode" v-model="state.formData.replenishmentCode" class="input-300" autofocus @keyup.enter.stop="getData"></el-input>
        </el-form-item>
        <el-form-item v-if="state.config.isPositionName" label="存储货位">
          <el-input ref="positionName" v-model="state.formData.positionName" :disabled="!state.config.isPositionName" class="input-300" @keyup.enter.stop="positionNameClick"></el-input>
        </el-form-item>
        <el-form-item label="目标货位">
          <el-input ref="targetPositionName" v-model="state.formData.targetPositionName" :disabled="!state.config.isValidateProductCode" class="input-300" @keyup.enter.stop="positionNameClick"></el-input>
        </el-form-item>
        <el-form-item label="商品条码">
          <el-input ref="productModel" v-model="state.formData.productModel" :disabled="!state.config.isValidateProductCode" class="input-300" @keyup.enter.stop="checkPackingBarcode"></el-input>
          <span class="sub-item">
            <span class="sub-label">扫描数量：</span>
            <!-- :min="1" -->
            <el-input-number ref="scanQty" v-model="state.formData.scanQty" :disabled="!state.config.isValidateProductCode" class="input-100" controls-position="right" @change="changeScanQty"></el-input-number>
          </span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveCheck">确认补货</el-button>
          <el-button @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="scan-card body-no-padding mt-10">
      <template #header>
        <span class="padding-top-10">扫描结果</span>
        <el-button link class="floatRight" @click="state.setting.visible = true">字段设置</el-button>
      </template>
      <el-table ref="scan-table" :row-class-name="base.rowClass" :data="base.state.tableData" stripe style="width: 100%" class="scan-table" size="small" @row-dblclick="base.setCurrent">
        <template v-for="(item, index) in state.setting.fields">
          <template v-if="'targetPositionName,scanWeight'.indexOf(item.prop) >= 0">
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
    <!-- 扫描明细字段设置 -->
    <scan-setting-dialog ref="setting-dialog" v-model:visible="state.setting.visible" :fields="state.setting.fields" :name="state.setting.name"></scan-setting-dialog>

    <!-- 应用场景设置 -->
    <replenishment-setting-dialog ref="replenishmentSettingDialog" v-model:visible="state.replenishmentSetting.visible" :scanSetting="state.config" @scan-setting-change="scanSettingChange"></replenishment-setting-dialog>

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

<script setup lang="ts" name="inventory-scan-replenishment-scan">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
import { postData } from '/@/api/common/baseApi';
import to from 'await-to-js';
import scanHook from '/@/components/hooks/scanHook';
const ScanSettingDialog = defineAsyncComponent(() => import('/@/components/common/components/scanSettingDialog.vue'));
const ReplenishmentSettingDialog = defineAsyncComponent(() => import('./components/replenishment-setting-dialog.vue'));

let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

const hookOptions = {
  // 判断所有条码是否存在
  checkProductModelExist: (productModel: string, rowData: any) => {
    let isExists = false;
    if (!productModel || !rowData) {
      return false;
    }

    isExists = productModel === rowData.productModel || productModel === rowData.relationCode || productModel === rowData.relationCode2 || productModel === rowData.relationCode3 || productModel === rowData.relationCode4 || productModel === rowData.relationCode5 || productModel === rowData.middleBarcode || productModel === rowData.singleSignCode || productModel === rowData.bigBarcode || productModel === rowData.caseNumber;
    if (state.config.isPositionName) {
      return isExists && state.formData.positionName === rowData.positionName;
    } else {
      return isExists;
    }
  },
};

const base = scanHook(hookOptions);
//#region 定义变量
const state = reactive({
  formData: {
    ...toRefs(base.state.formData),
    replenishmentCode: '',
    targetPositionName: '',
  },
  // 配置参数
  config: {
    // 是否校验存储货位
    isPositionName: false,
    // 是否扫描商品
    isValidateProductCode: true,
  },
  // 扫描列设置对话框参数
  setting: {
    visible: false,
    name: 'inventory-scan-replenishment-scan',
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
        label: '托盘号',
        visible: true,
        width: 100,
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
        prop: 'storageName',
        label: '仓库',
        visible: true,
        width: 130,
        order: 1,
      },
      {
        prop: 'positionName',
        label: '存储货位',
        visible: true,
        width: 120,
        order: 4,
      },
      {
        prop: 'targetPositionName',
        label: '目标货位',
        visible: true,
        width: 120,
        order: 5,
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
        visible: true,
        width: 130,
        order: 3,
      },
      {
        prop: 'productSpec',
        label: '商品规格',
        visible: true,
        width: 130,
        order: 3,
      },
      {
        prop: 'manufacturer',
        label: '生产厂家',
        visible: true,
        width: 100,
        order: 6,
      },

      {
        prop: 'productName',
        label: '商品名称',
        visible: true,
        width: 140,
        order: 2,
      },
      {
        prop: 'enterQuantity',
        label: '已入库数量',
        visible: false,
        width: 90,
        order: 3,
      },
      {
        prop: 'batchNumber',
        label: '批次号',
        visible: true,
        width: 100,
        order: 6,
      },
    ],
  },
  // 应用设置
  replenishmentSetting: {
    visible: false,
  },
});

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
  const isOnShelve = localStorage['isOnShelve'];
  if (isOnShelve) {
    state.formData.isOnShelve = isOnShelve === 'true';
  }
  const isValidateProductCode = localStorage['isValidateProductCode'];
  if (isOnShelve) {
    state.config.isValidateProductCode = isValidateProductCode === 'true';
  }
});
//#endregion
// 直接上架设置
const onIsValidateProductCodeChange = () => {
  localStorage['isValidateProductCode'] = state.config.isValidateProductCode;
  base.state.tableData.forEach((row) => {
    if (state.config.isValidateProductCode) {
      // 开启扫描校验
      row.unFinishedQuantity = Math.Round(row.holderStorage - 0, 4);
      row.finishedQuantity = 0;
    } else {
      row.unFinishedQuantity = 0;
      row.finishedQuantity = Math.Round(row.holderStorage - 0, 4);
    }
  });
};
const positionNameClick = () => {
  proxy.$refs.productModel.focus();
  proxy.$refs.productModel.select();
};
// 获得明细数据
const getData = async () => {
  var replenishmentCode = state.formData.replenishmentCode;
  if (!replenishmentCode) {
    proxy.$message.error('补货单号不能为空');
    return;
  }
  const url = '/inventory/replenishment/replenishmentDetail/getReplenishmentGroupData';
  const params = {
    replenishmentCode: replenishmentCode,
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }
  if (res.result) {
    // 构建数据
    base.state.tableData = res.data.detailList.map((row: any) => {
      if (state.config.isValidateProductCode) {
        // 开启扫描校验
        row.unFinishedQuantity = Math.Round(row.holderStorage - 0, 4);
        row.finishedQuantity = 0;
      } else {
        row.unFinishedQuantity = 0;
        row.finishedQuantity = Math.Round(row.holderStorage - 0, 4);
      }
      row.sortIndex = 0;
      row.originalPositionName = row.positionName;
      return row;
    });
  }
};
// 判断扫描包装条码
const checkPackingBarcode = (evt: any) => {
  evt.target.select();
  var code: string | null = state.formData.productModel;
  if (!code) return;
  code = code.trim();
  base.state.existRows = [];
  var targetPositionName = '';
  if (state.formData.targetPositionName) {
    targetPositionName = state.formData.targetPositionName.trim();
  }

  var isItemFinished = false;
  var isExistsProduct = false; // 商品是否在明细存在
  for (var index in base.state.tableData) {
    var rowData = base.state.tableData[index];
    if (rowData.productModel === code) {
      isExistsProduct = true;
      var finishedQuantity = parseFloat(rowData.finishedQuantity); // 已扫描数量
      var unFinishedQuantity = parseFloat(rowData.unFinishedQuantity); // 未扫描数量
      if (unFinishedQuantity > 0) {
        base.state.currentRow = rowData;
        base.state.existRows.push(rowData);
        rowData.finishedQuantity = finishedQuantity + 1;
        rowData.unFinishedQuantity = unFinishedQuantity - 1;
        base.playError(); // 播放声音
        if (targetPositionName) {
          rowData.targetPositionName = targetPositionName;
        }
      } else {
        // 查找明细中是否还有该 条码 的商品
        var isHaveAnother = false;
        for (var index2 in base.state.tableData) {
          var rowData2 = base.state.tableData[index2];
          if (rowData2.productModel === code && parseFloat(rowData2.unFinishedQuantity) > 0) {
            isHaveAnother = true;
            var _finishedQuantity = parseFloat(rowData2.finishedQuantity);
            var _unFinishedQuantity = parseFloat(rowData2.unFinishedQuantity);
            base.state.currentRow = rowData2;
            base.state.existRows.push(rowData2);
            rowData2.finishedQuantity = _finishedQuantity + 1;
            rowData2.unFinishedQuantity = _unFinishedQuantity - 1;
            base.playError(); // 播放声音
            if (targetPositionName) {
              rowData2.targetPositionName = targetPositionName;
            }
            break;
          }
        }
        if (!isHaveAnother) {
          isItemFinished = true;
        }
      }
      // 不管这个商品编号有几个item，满足第一个商品编号后就跳出，不能扫描一个条码，对每一个明细扫描数量都加1
      break;
    }
  }
  if (!isExistsProduct) {
    proxy.$message.error('商品条码【' + code + '】在该订单不存在！');
    base.playError(); // 播放声音
    return;
  }
  if (isItemFinished) {
    proxy.$message.error('商品【' + code + '】已经扫描完成，不需要再扫描！');
    base.playError(); // 播放声音
    return;
  }
};
// 扫描数量手工改变
const changeScanQty = () => {
  var code = state.formData.productModel;
  if (base.state.currentRow) {
    if (state.formData.scanQty <= 0) {
      proxy.$message.error('数量不正确');
      base.playError(); // 播放声音
      return false;
    }
    if (state.formData.scanQty > base.state.currentRow.holderStorage) {
      proxy.$message.error('商品 【' + code + '】的未扫描数量小于您的输入的数量。');
      base.playError(); // 播放声音
      return false;
    }
    base.state.currentRow.finishedQuantity = state.formData.scanQty;
    base.state.currentRow.unFinishedQuantity = base.state.currentRow.holderStorage - state.formData.scanQty;
  }
};

// 重置onReset
const onReset = () => {
  state.formData = {
    replenishmentCode: '',
    targetPositionName: '',
  };
  base.state.tableData = [];
  proxy.$refs.replenishmentCode.focus();
};
// 确认补货
const saveCheck = async () => {
  var productModelList = base.state.tableData.filter((item: any) => item.finishedQuantity > 0);

  if (!productModelList.length) {
    proxy.$message.error('至少扫描一条记录');
    return;
  }
  proxy
    .$confirm('您确定要执行扫描的数据吗？', '补货扫描', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(async () => {
      var url = '/inventory/replenishment/replenishment/saveReplenishment';
      var params = {
        transferType: 'PC_REPLENISHMENT_SCAN', // PC补货扫描
        storageId: state.formData.storageId,
        storageName: state.formData.storageName,
        dataList: base.state.tableData,
        replenishmentCode: state.formData.replenishmentCode,
      };
      const [err, res] = await to(postData(url, params));
      if (err) return;
      proxy.common.showMsg(res);

      if (res?.result) {
        onReset();
        base.play(); // 播放声音
      } else {
        base.playError(); // 播放声音
      }
    })
    .catch(() => {
      proxy.$message.info('已取消删除');
    });
};

// 应用场景设置改变
const scanSettingChange = ({ config }: { config: any }) => {
  state.config = config;
};
</script>

<style lang="scss" scoped>
@import '/@/theme/scan.scss';
</style>
