<template>
  <div class="biz-container">
    <!--数据Table-->
    <yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes"></yrt-data-list>

    <!--数据编辑器Editor-->
    <yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="base.detailButtonClick" :auth-nodes="state.authNodes" :on-save-before="base.onSaveBefore" @on-save-after="base.onSaveAfter" @on-change="base.onChange" @on-detail-change="base.onDetailChange" @on-edit-load-before="base.onEditLoadBefore" @on-edit-load-after="base.onEditLoadAfter" @on-detail-delete-after="base.onDetailDeleteAfter" :use-detail-slot="['images']" :detailRemoteMethod="base.detailRemoteMethod">
      <!--自定义字段插槽-->
      <template #detail-column-slot="{ row, col }">
        <template v-if="col.prop === 'images'">
          <el-image v-for="(pic, index) in base.getPicList(row[col.prop])" :src="base.showSmallPic(pic)" class="pic-small" fit="contain" preview-teleported :preview-src-list="base.getPicList(row[col.prop])" />
        </template>
      </template>
    </yrt-editor>

    <!-- 商品选择器 -->
    <yrt-selector ref="selector-dialog" :config="state.selectorConfig" v-model:visible="state.selectorConfig.visible" @on-selected="onSelected"></yrt-selector>

    <!--商品库存选择器-->
    <yrt-selector ref="selector-position-dialog" :config="state.selectorPositionConfig" v-model:visible="state.selectorPositionConfig.visible" @on-selected="onPositionSelected"></yrt-selector>
  </div>
</template>

<script setup lang="ts" name="inbound-in-orderPlan">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';
import YrtDataList from '/@/components/common/yrtDataList.vue';
import yrtEditor from '/@/components/common/yrtEditor.vue';
import baseHook from '/@/components/hooks/baseHook';
import to from 'await-to-js';
import { postData } from '/@/api/common/baseApi';
import { QueryType } from '/@/types/common';
import { DetailInfo } from '/@/api/types';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
import useDropdownStore from '/@/stores/modules/dropdown';
import { PositionTypeEnum } from '/@/enums/PositionTypeEnum';
const dropdownStore = useDropdownStore();

const base = baseHook();
const { baseState, dataListRefName, editorRefName, editorInfo, masterData } = base;

//#region 定义变量
const state = reactive({
  ...toRefs(baseState),
  selectorConfig: {
    title: '商品选择器',
    width: '1000px',
    visible: false,
    // 配置路由
    router: '/selector/product',
  },
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
});
//#endregion

onMounted(() => {});

// 列表页面按钮事件
base.buttonClick = (authNode: string) => {
  switch (authNode) {
    case 'multiAuditing':
      multiAuditing(state.dataListSelections);
      return true;
  }
};

// 明细按钮事件
base.detailButtonClick = (authNode: string, detail: any, btnOpts: any) => {
  switch (authNode) {
    case 'detailAdd':
      detailAdd(); // 打开商品选择器
      return true;
    case 'detailAddPosition':
      detailAddPosition(); // 打开库存选择器
      return true;
  }
};

// 明细添加
const detailAdd = () => {
  state.selectorConfig.visible = true;
};

// 打开库存选择器
const detailAddPosition = () => {
  let formData = masterData.value; // 主表
  if (!formData.storageName) {
    proxy.$message.error('请选择仓库！');
    return;
  }
  const selector = proxy.$refs['selector-position-dialog'];
  selector.setSearchValue('storageId', formData.storageId);
  selector.setSearchValue('storageName', formData.storageName);

  state.selectorPositionConfig.visible = true;
};

// 将选择器选择中的数据填充到明细表中
const onSelected = (rows: Array<any>) => {
  rows.forEach((item) => {
    item.subCube = item.rowCube;
  });
  base.editorRef.value.addDetailDataRow(rows);
  state.selectorConfig.visible = false;
  let formData = masterData.value; // 主表
  base.detailRows.value?.forEach((item) => {
    item.providerShortName = formData.providerShortName;
    item.providerCode = formData.providerCode;
    item.providerId = formData.providerId;
  });
};

// 将选择器选择中的数据填充到明细表中
const onPositionSelected = (rows: Array<any>) => {
  rows.forEach((element) => {
    element.consignorIdTarget = null;
    element.consignorCodeTarget = null;
    element.consignorNameTarget = null;
    element.sortingStatus = 1;
    element.transferQuantity = element.productStorage;
    element.positionNameIn = element.positionName;
    element.purchaseAmount = Math.Round((element.purchasePrice || 0) * element.transferQuantity, 2);
    element.rowWeight = Math.Round((element.weight || 0) * element.transferQuantity, 2);
    element.rowWeightTon = (element.rowWeight || 0) / 1000; // 吨的计算
    element.ratePrice = Math.Round((element.purchasePrice || 0) * (1 + (element.rate || 0)), 2);
    element.rateAmount = Math.Round(element.ratePrice * element.transferQuantity, 2);
    element.rowCube = Math.Round(element.unitCube * element.transferQuantity, 2);
    if (element.unitConvert > 0) {
      element.bigQty = Math.Round(element.transferQuantity / element.unitConvert, 4);
      element.differenceQuantity = element.transferQuantity;
    }
  });
  base.editorRef.value.addDetailDataRow(rows);
  setTotal(base.detailRows.value);

  state.selectorPositionConfig.visible = false;
};

// 明细字段触发改变
base.onDetailChange = (ref: any, val: any, row: any, field: any, detailRows: Array<any>) => {
  setTotal(detailRows);
};

const setTotal = (detailRows: Array<any>) => {
  // 合计数量求和
  let totalTransferQuantity = 0; // 合计数量
  let totalPurchaseAmount = 0.0; // 合计金额
  let totalRateAmount = 0.0; // 合计价税
  let totalWeight = 0.0; // 合计重量
  let totalCube = 0.0; // 合计体积
  let bigQtyTotal = 0.0; // 合计大件数
  detailRows &&
    detailRows.forEach((item: any) => {
      item.purchaseAmount = Math.Round((item.purchasePrice || 0) * item.transferQuantity, 2);
      item.ratePrice = Math.Round((item.purchasePrice || 0) * (1 + (item.rate / 100 || 0)), 2);
      // 明细不含税金额 = 数量 * 不含税单价；
      item.saleAmount = Math.Round((item.transferQuantity || 0) * (item.salePrice || 0), 2);
      // 含税金额 = 数量 * 含税单价；
      item.rateAmount = Math.Round((item.transferQuantity || 0) * (item.ratePrice || 0), 2);

      item.rowWeight = Math.Round(item.weight * item.transferQuantity, 4); //小计毛重
      item.rowCube = Math.Round((item.transferQuantity || 0) * (item.unitCube || 0)); // 小计体积
      item.rowWeightTon = Math.Round((item.transferQuantity || 0) * (item.weight || 0), 4) / 1000;
      item.bigQty = Math.Round((item.transferQuantity || 0) / (item.unitConvert || 0), 2);

      totalTransferQuantity += Number(item.transferQuantity || 0);
      totalPurchaseAmount += Number(item.purchaseAmount || 0);
      totalRateAmount += Number(item.rateAmount || 0);
      totalWeight += Number(item.rowWeight || 0);
      totalCube += Number(item.rowCube || 0);
      bigQtyTotal += Number(item.bigQty || 0);
    });
  masterData.value.totalTransferQuantity = Math.Round(totalTransferQuantity, 2);
  masterData.value.totalPurchaseAmount = Math.Round(totalPurchaseAmount, 2);
  masterData.value.totalRateAmount = Math.Round(totalRateAmount, 2);
  masterData.value.totalWeight = Math.Round(totalWeight, 2);
  masterData.value.totalCube = Math.Round(totalCube, 2);
  masterData.value.bigQtyTotal = Math.Round(bigQtyTotal, 4);
};

//审核
const multiAuditing = async (selections: Array<any>) => {
  const url = '/inventory/operation/consignorTransfer/multiAuditing';
  if (!selections.length) {
    proxy.$message.error('至少选择一项进行审核');
    return;
  }
  for (const item of selections) {
    if (['新建', '待审核'].indexOf(item.transferStatus) == -1) {
      proxy.$message.error('只有新建或者待审核的单据才可以进行审核');
      return;
    }
  }
  let ids = selections.map((item) => item.consignorTransferId);

  proxy
    .$confirm('确定要审核单据吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(async () => {
      const params = ids;
      const [err, res] = await to(postData(url, params));
      if (err) return;

      if (res.result) {
        proxy.common.showMsg(res);
        base.dataListRef.value.loadData();
      }
    })
    .catch((error: any) => {
      proxy.$message.error(error.message);
    });
};

// 保存前
base.onSaveBefore = (master: any) => {
  let isQty = true;
  base.detailRows.value?.forEach((item) => {
    if (item.transferQuantity <= 0 || !item.transferQuantity) {
      isQty = false;
    }
  });
  if (!isQty) {
    proxy.$message.error('转移数量必须大于0！');
    return false;
  }
  return true;
};
// 明细删除后事件
base.onDetailDeleteAfter = (deletedRows: Array<any>, detailInfo: DetailInfo) => {
  setTotal(base.detailRows.value);
};

// 加载完毕后事件
base.onEditLoadAfter = async (masterData: any) => {
  positionNameQuery();
};
// 明细下拉框搜索
base.detailRemoteMethod = async (query: string, row: any, col: any) => {
  if (col.prop === 'positionNameIn') {
    await positionNameQuery(query);
  }
};
const positionNameQuery = async (query?: string) => {
  const url = '/basic/storage/position/getPositionList';
  const params = {
    storageId: masterData.value.storageId,
    name: query,
    positionType: PositionTypeEnum.NORMAL, // 上架货位
  };
  const [err, res] = await to(postData(url, params, false));
  if (res?.result) {
    debugger;
    let dataList = res.data.map((m: any) => {
      let item = {
        positionIdIn: m.positionId,
        positionNameIn: m.positionName,
        value: m.positionId,
        label: m.positionName,
      };
      return item;
    });
    dropdownStore.setDropDown(754, dataList); // 更新货位下拉框值
  }
};
// 加载完毕后事件
base.onChange = async (masterData: any) => {
  positionNameQuery();
};
</script>
