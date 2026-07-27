<template>
  <div class="biz-container">
    <!--数据Table-->
    <yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes" :on-delete-before="onDeleteBefore"></yrt-data-list>

    <!--数据编辑器Editor-->
    <yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="base.detailButtonClick" :auth-nodes="state.authNodes" :on-save-before="base.onSaveBefore" @on-save-after="base.onSaveAfter" @on-change="base.onChange" :btn-read-only="state.btnReadOnly" :use-detail-slot="['images', 'singleSignCode']" @on-detail-change="base.onDetailChange" @on-edit-load-before="base.onEditLoadBefore" @on-edit-load-after="base.onEditLoadAfter">
      <template #footer-button-region>
        <el-button type="primary" icon="CircleCheckFilled" :disabled="state.btnReadOnly.subimtCheckBill" @click="subimtCheckBill">提交</el-button>
        <el-button type="primary" icon="CircleCheckFilled" :disabled="state.btnReadOnly.createProfitLoss" @click="createProfitLoss">生成盈亏单</el-button>
      </template>
      <!--自定义字段插槽-->
      <template #detail-column-slot="{ row, col, detail }">
        <template v-if="col.prop === 'images'">
          <el-image v-for="(pic, index) in base.getPicList(row[col.prop])" :src="base.showSmallPic(pic)" class="pic-small" fit="contain" preview-teleported :preview-src-list="base.getPicList(row[col.prop])" />
        </template>
        <template v-else-if="col.prop === 'singleSignCode'">
          <a href="#" @click="showSnEditor(row, detail)" class="flex flex-col">
            <span class="sn-text">{{ row.singleSignCode }}</span>
            <span class="sn-count">[SN数：{{ row.singleSignCode ? row.singleSignCode.split(',').length : 0 }}]</span>
          </a>
        </template>
      </template>
    </yrt-editor>

    <!--商品库存选择器-->
    <yrt-selector ref="selector-position-dialog" :config="state.selectorPositionConfig" v-model:visible="state.selectorPositionConfig.visible" @on-selected="onPositionSelected"></yrt-selector>

    <!-- SN编辑器 -->
    <sn-editor-dialog v-model:visible="state.snEditorVisible" :row="state.detailRow" @on-sn-change="onSnChange"> </sn-editor-dialog>
  </div>
</template>

<script setup lang="ts" name="inventory-operation-check">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';
import YrtDataList from '/@/components/common/yrtDataList.vue';
const yrtEditor = defineAsyncComponent(() => import('/@/components/common/yrtEditor.vue'));
const SnEditorDialog = defineAsyncComponent(() => import('/@/components/common/sn-editor-dialog.vue'));

import baseHook from '/@/components/hooks/baseHook';
import to from 'await-to-js';
import { postData } from '/@/api/common/baseApi';
import { QueryType } from '/@/types/common';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

const base = baseHook();
const { baseState, dataListRefName, editorRefName, editorInfo, masterData } = base;

//#region 定义变量
const state = reactive({
  ...toRefs(baseState),
  // 库存选择器
  selectorPositionConfig: {
    title: '商品库存选择器',
    width: '1000px',
    visible: false,
    // 配置路由
    router: '/selector/product-inventory',
    url: '/api/common/groupDataList',
    fixedWhere: {
      productStorage: {
        operator: QueryType.GT,
        value: 0,
      },
      validStorage: {
        operator: QueryType.GT,
        value: 0,
      },
      positionType: {
        operator: QueryType.NOTIN,
        value: '4,5',
      },
    },
  },

  // 显示SN编辑器
  snEditorVisible: false,
  // 当前明细行
  detailRow: {},
  // 明细表信息
  currentDetail: {
    subTableView: '',
  },
});
//#endregion

onMounted(() => {});
// 编辑页面按钮事件
base.detailButtonClick = (authNode: string, detail: any, btnOpts: any) => {
  switch (authNode) {
    case 'detailAddPosition':
      // 打开库存选择器
      detailAddPosition();
      return true;
  }
};

// 删除前事件
const onDeleteBefore = (dataOptions: any, rows: any[]) => {
  if (rows.find((item) => item.checkStatus != '新建')) {
    proxy.$message.error('只有新建的单据才允许删除');
    return false;
  }

  return true;
};
base.onEditLoadAfter = (master: any) => {
  var checkStatus = master.checkStatus;
  state.editorOptions.config.disabled = false;
  state.btnReadOnly.subimtCheckBill = true;
  state.btnReadOnly.createProfitLoss = true;

  if ('已提交'.indexOf(checkStatus) >= 0) {
    state.btnReadOnly.createProfitLoss = false;
  }
  if ('新建,复盘中'.indexOf(checkStatus) >= 0) {
    state.btnReadOnly.subimtCheckBill = false;
  }
};

// 保存前事件
base.onSaveBefore = (formData: any) => {
  setTotal({}, base.detailRows.value);
  return true;
};

//提交
const subimtCheckBill = () => {
  let isok = true;
  base.detailRows.value?.forEach((item: any) => {
    if (item.checkQuantity == null) {
      isok = false;
    }
  });
  if (!isok) {
    proxy.$message.error('盘点数量不能为空');
    return false;
  }

  proxy
    .$confirm('提示：确实要提交当前盘点吗', '确认提交', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
    })
    .then(async () => {
      if ('新建,复盘中'.indexOf(masterData.value.checkStatus) < 0) {
        proxy.$message.error('只有新建状态的单子才能提交！');
        return;
      }
      const url = '/inventory/operation/check/subimtCheckBill';
      const params = {
        checkId: masterData.value.checkId,
      };
      const [err, res] = await to(postData(url, params));
      if (err) {
        proxy.$message.error(err.message);
        return;
      }
      if (res.result) {
        proxy.common.showMsg(res);
        base.dataListRef.value.loadData();
        base.editorRef.value.cancel();
      }
    })
    .catch(() => {
      proxy.$message.success(`取消操作`);
    });
};
//生成盈亏单
const createProfitLoss = () => {
  proxy
    .$confirm('提示：确定要生成盈亏单吗！', '确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
    })
    .then(async ({ value }: { value: any }) => {
      if (masterData.value.checkStatus !== '已提交') {
        proxy.$message.error('只有已提交状态的单子才能提交！');
        return;
      }
      const url = '/inventory/operation/check/createCheck';
      const params = {
        checkId: masterData.value.checkId,
      };
      const [err, res] = await to(postData(url, params));
      if (err) return;

      if (res.result) {
        proxy.common.showMsg(res);
        base.dataListRef.value.loadData();
      }
    })
    .catch(() => {
      proxy.$message.success(`取消操作`);
    });
};
// 打开库存选择器
const detailAddPosition = () => {
  let formData = masterData.value; // 主表
  if (!formData.consignorName) {
    proxy.$message.error('请选择货主！');
    return;
  } else if (!formData.storageName) {
    proxy.$message.error('请选择仓库！');
    return;
  }
  const selector = proxy.$refs['selector-position-dialog'];
  selector.setSearchValue('storageId', formData.storageId);
  selector.setSearchValue('storageName', formData.storageName);
  selector.setSearchValue('consignorId', formData.consignorId);
  selector.setSearchValue('consignorName', formData.consignorName);

  state.selectorPositionConfig.visible = true;
};
// 将选择器选择中的数据填充到明细表中
const onPositionSelected = (rows: Array<any>) => {
  base.editorRef.value.addDetailDataRow(rows);
  state.selectorPositionConfig.visible = false;
};

// 明细字段触发改变
base.onDetailChange = (ref: any, val: any, row: any, field: any, detailRows: Array<any>) => {
  setTotal(field, detailRows);
};

const setTotal = (field: any, detailRows: Array<any>) => {
  let totalProductStorage = 0; // 合计账面库存量
  let totalPurchaseAmount = 0.0; // 合计账面成本额
  let totalCheckQuantity = 0; // 合计盘点数量

  let totalProfitQuantity = 0; // 合计盘盈数量
  let totalProfitAmount = 0.0; // 合计盘盈金额

  let totalLossQuantity = 0; // 合计盘亏数量
  let totalLossAmount = 0.0; // 合计盘亏金额
  let totalWeight = 0.0; // 合计重量
  detailRows &&
    detailRows.forEach((item) => {
      if (!item.productStorage) {
        item.productStorage = 0;
      }
      if (!Number.isFinite(Number(item.checkQuantity))) {
        item.checkQuantity = null;
        proxy.$message.error('盘点数量必须是数字');
        return;
      }

      totalProductStorage += Number(item.productStorage) || 0;
      totalPurchaseAmount += Number(item.purchaseAmount) || 0;
      totalCheckQuantity += Number(item.checkQuantity) || 0;
      item.rowWeight = (item.weight || 0) * item.productStorage;
      totalWeight += Number(item.rowWeight) || 0;

      if (!item.checkQuantity) {
        item.profitQuantity = 0;
        item.profitAmount = 0;
        item.lossQuantity = 0;
        item.lossAmount = 0;
      } else if (item.checkQuantity > item.productStorage) {
        var profitQuantity = (item.checkQuantity || 0) - item.productStorage;
        item.profitQuantity = profitQuantity;
        item.profitAmount = profitQuantity * item.purchasePrice;

        item.lossQuantity = 0;
        item.lossAmount = 0;
        totalProfitQuantity += profitQuantity;
        totalProfitAmount += item.profitAmount;
      } else if (item.checkQuantity < item.productStorage) {
        var lossQuantity = item.productStorage - item.checkQuantity;
        var lossAmount = lossQuantity * item.purchasePrice;
        item.profitQuantity = 0;
        item.profitAmount = 0;

        item.lossQuantity = lossQuantity;
        item.lossAmount = lossAmount;
        totalLossQuantity += lossQuantity;
        totalLossAmount += lossAmount;
      } else {
        item.profitQuantity = 0;
        item.profitAmount = 0;
        item.lossQuantity = 0;
        item.lossAmount = 0;
      }
      item.rowWeight = (item.weight || 0) * item.productStorage;
      if (field.prop === 'checkQuantity' || field.prop === 'weight') {
        // 盘盈重量  =  盘盈数量 * 单位重量
        item.profitWeight = (item.profitQuantity || 0) * (item.weight || 0);
      } else if (field && field.prop === 'rowWeight') {
        // 单位重量：weight=  库存重量:totalWeight/ 盘点数量:checkQuantity
        if (item.checkQuantity) {
          item.weight = (item.totalWeight || 0) / (item.checkQuantity || 0);
        } else {
          item.weight = 0;
        }
      }
    });
  masterData.value.totalProductStorage = Math.Round(totalProductStorage, 2);
  masterData.value.totalPurchaseAmount = Math.Round(totalPurchaseAmount, 2);
  masterData.value.totalCheckQuantity = Math.Round(totalCheckQuantity, 2);
  masterData.value.totalProfitQuantity = Math.Round(totalProfitQuantity, 2);
  masterData.value.totalProfitAmount = Math.Round(totalProfitAmount, 2);
  masterData.value.totalLossQuantity = Math.Round(totalLossQuantity, 2);
  masterData.value.totalLossAmount = Math.Round(totalLossAmount, 2);
};

// 显示SN编辑器
const showSnEditor = (row: any, detail: any) => {
  state.currentDetail = detail; // 记录当前明细表信息
  state.detailRow = row;
  state.snEditorVisible = true;
};

// SN改变事件，改变数量
const onSnChange = (currentRow: any, snList: any, snCount: number) => {
  currentRow.checkQuantity = snCount;
};
</script>
