<template>
  <div class="biz-container">
    <!--数据Table-->
    <yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes"></yrt-data-list>

    <!--数据编辑器Editor-->
    <yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="base.detailButtonClick" :auth-nodes="state.authNodes" :on-save-before="base.onSaveBefore" @on-save-after="base.onSaveAfter" @on-change="base.onChange" @on-detail-change="base.onDetailChange" @on-edit-load-before="base.onEditLoadBefore" @on-edit-load-after="base.onEditLoadAfter" :use-detail-slot="['images']">
      <!--自定义字段插槽-->
      <template #detail-column-slot="{ row, col }">
        <template v-if="col.prop === 'images'">
          <el-image v-for="(pic, index) in base.getPicList(row[col.prop])" :src="base.showSmallPic(pic)" class="pic-small" fit="contain" preview-teleported :preview-src-list="base.getPicList(row[col.prop])" />
        </template>
      </template>
    </yrt-editor>

    <!-- 商品选择器 -->
    <yrt-selector ref="selector-dialog" :config="state.selectorConfig" v-model:visible="state.selectorConfig.visible" @on-selected="onSelected"> </yrt-selector>
  </div>
</template>

<script setup lang="ts" name="inbound-in">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';
import YrtDataList from '/@/components/common/yrtDataList.vue';
const yrtEditor = defineAsyncComponent(() => import('/@/components/common/yrtEditor.vue'));
import baseHook from '/@/components/hooks/baseHook';
import { postData } from '/@/api/common/baseApi';
import to from 'await-to-js';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

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
});
//#endregion

onMounted(() => {});
// 主表按钮事情
base.buttonClick = (authNode: string) => {
  switch (authNode) {
    // case "multiAuditing":
    //   multiAuditing();
    //   return true;
    case 'toInOrder':
      // 转预到货单
      if (state.dataListSelections.length !== 1) {
        proxy.$message.error('请选择一条数据！');
        return;
      }
      if (state.dataListSelections.filter((item) => item.auditing != 2).length > 0) {
        proxy.$message.error('单据未审核不允许转出库单！');
        return;
      }
      toInOrder();
      return true;
    case 'multiAuditing':
      // 批量审核
      if (state.dataListSelections.length !== 1) {
        proxy.$message.error('请选择一条数据！');
        return;
      }
      multiAuditing();
      return true;
  }
};
// 明细按钮事件
base.detailButtonClick = (authNode: string) => {
  switch (authNode) {
    case 'detailAdd':
      detailAdd();
      return true;
  }
};
// 打开明细选择器
const detailAdd = () => {
  state.selectorConfig.visible = true;
};
// 选择器选择商品后 给明细赋值
const onSelected = (rows: Array<any>) => {
  base.editorRef.value.addDetailDataRow(rows);
  state.selectorConfig.visible = false;
};
// 审核
// const multiAuditing =async()=>{
//
//   // 选中行的id
//   var openIds: Array<any> = state.dataListSelections;
//   if (Array.isArray(state.dataListSelections)) {
//     openIds = state.dataListSelections.map((item: any) => {
//       return item[state.dataOptions.idField];
//     });
//   }
//   const url = "/inbound/in/damagedOrder/multiAuditing";
//   const params = {
//     ids: openIds
//   };
//   const [err,res] = await to(postData(url,params));
//   if(err){
//     proxy.$message.error(err.message);
//     return
//   }
//   if(res.result){
//     proxy.common.showMsg(res);
//   }
// }
// 转到预到货单
const toInOrder = async () => {
  // 选中行的id
  // let ss = base.masterData;
  const ids = state.dataListSelections.map((item: any) => item.damagedOrderId);
  const url = '/inbound/in/damagedOrder/toInOrder';
  const params = {
    ids: ids.join(','),
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }
  proxy.common.showMsg(res);

  if (res.result) {
    base.dataListRef.value.reload(); // 刷新列表数据
  }
};

base.onSaveBefore = (master: any) => {
  let isQty = true;
  base.detailRows.value?.forEach((item) => {
    if (item.quantity <= 0 || !item.quantity) {
      isQty = false;
    }
  });
  if (!isQty) {
    proxy.$message.error('明细数量必须大于0！');
    return false;
  }
  return true;
};
// 明细字段触发改变
base.onDetailChange = (ref: any, val: any, row: any, field: any, detailRows: Array<any>) => {
  setTotal(ref, val, row, field, detailRows);
};

// 求和
const setTotal = (ref: any, val: any, row: any, field: any, detailRows: Array<any>) => {
  // 合计数量求和
  let totalQuantity = 0; // 合计数量
  let totalAmount = 0.0; // 合计金额
  let totalWeight = 0.0; // 合计重量
  detailRows &&
    detailRows.forEach((item: any) => {
      item.rowAmount = Math.Round((item.quantity || 0) * (item.purchasePrice || 0), 2); // 成本金额 = 数量 * 成本单价

      item.rowWeight = Math.Round((item.weight || 0) * (item.quantity || 0)); // 小计毛重
      item.rowCube = Math.Round((item.quantity || 0) * (item.unitCube || 0)); // 小计体积
      item.rowWeightTon = Math.Round((item.quantity || 0) * (item.weight || 0), 4) / 1000; // 合计重量(吨)
      item.bigQty = Math.Round(item.quantity / item.unitConvert, 4);
      totalQuantity += Number(item.quantity) || 0;
      totalAmount += Number(item.rowAmount) || 0;
      totalWeight += Number(item.rowWeight) || 0;
      item.ratePrice = Number(item.rate) * Number(item.purchasePrice) + Number(item.purchasePrice);
      item.rateAmount = item.quantity * item.ratePrice;
    });
  masterData.value.totalQuantity = Math.Round(totalQuantity, 2); // 合计数量

  masterData.value.totalAmount = Math.Round(totalAmount, 2); // 合计金额
  masterData.value.totalWeight = Math.Round(totalWeight, 2); // 合计重量
};

// 批量审核
const multiAuditing = async () => {
  // 选中行id
  var openIds: Array<any> = state.dataListSelections;
  let flag = false;
  for (const item of openIds) {
    if (['新建', '待审核'].indexOf(item.damagedStatus) == -1) {
      flag = true;
    }
  }
  if (flag) {
    proxy.$message.error('只有新建或者待审核的单据才可以进行审核');
    return;
  }
  if (Array.isArray(state.dataListSelections)) {
    openIds = state.dataListSelections.map((item: any) => {
      return item[state.dataOptions.idField];
    });
  }

  const url = '/inbound/in/damagedOrder/multiAuditing';
  const params = openIds;
  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }
  if (res.result) {
    proxy.common.showMsg(res);
    base.dataListRef.value.reload(); // 刷新列表数据
  }
};
</script>
