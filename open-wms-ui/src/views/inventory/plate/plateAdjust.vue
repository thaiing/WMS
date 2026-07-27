<template>
  <div class="biz-container">
    <!--数据Table-->
    <yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes"></yrt-data-list>

    <!--数据编辑器Editor-->
    <yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="base.detailButtonClick" :auth-nodes="state.authNodes" :on-save-before="base.onSaveBefore" @on-save-after="base.onSaveAfter" @on-change="base.onChange" @on-detail-change="base.onDetailChange" @on-edit-load-before="base.onEditLoadBefore" @on-edit-load-after="base.onEditLoadAfter"></yrt-editor>
  </div>
</template>

<script setup lang="ts" name="inventory-plate-plateAdjust">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';
import YrtDataList from '/@/components/common/yrtDataList.vue';

import { postData } from '/@/api/common/baseApi';
import to from 'await-to-js';
import baseHook from '/@/components/hooks/baseHook';
const yrtEditor = defineAsyncComponent(() => import('/@/components/common/yrtEditor.vue'));

let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

const base = baseHook();
const { baseState, dataListRefName, editorRefName, editorInfo, masterData } = base;
import useDropdownStore from '/@/stores/modules/dropdown';
const dropdownStore = useDropdownStore();

//#region 定义变量
const state = reactive({
  ...toRefs(baseState),
});
//#endregion

onMounted(() => {});

base.onDetailChange = async (ref: any, val: any, row: any, field: any, detailRows: Array<any>) => {
  if (field.prop === 'plateType' || field.prop === 'plateSpec') {
    if (row.plateType && row.plateSpec && masterData.value.storageName && masterData.value.clientShortName) {
      // 获取现借出数量
      const url = '/inventory/plate/plateAdjust/getNowOutQty';
      const params = {
        plateType: row.plateType,
        plateSpec: row.plateSpec,
        storageName: masterData.value.storageName,
        clientShortName: masterData.value.clientShortName,
      };
      const [err, res] = await to(postData(url, params));

      if (err) {
        return;
      }
      proxy.common.showMsg(res);
      row.nowOutQty = res;

      let totalNowOutQty = 0.0; // 合计借出数量
      let totalReturnQty = 0.0; // 合计归还数量
      detailRows &&
        detailRows.forEach((item: any) => {
          totalNowOutQty += Number(item.nowOutQty) || 0;
          totalReturnQty += Number(item.adjustReturnQty) || 0;
        });
      masterData.value.totalNowOutQty = Math.Round(totalNowOutQty, 5);
      masterData.value.totalReturnQty = Math.Round(totalReturnQty, 5);
    }
  }

  if (field.prop === 'adjustOutQty') {
    row.surplusOutQty = Number(row.nowOutQty || 0) + Number(val || 0);
  }
  if (field.prop === 'adjustReturnQty') {
    row.surplusOutQty = Number(row.nowOutQty || 0) - Number(val || 0);

    let totalReturnQty = 0.0; // 合计归还数量
    let totalNowOutQty = 0.0; // 调整前数量
    let totalOutQty = 0.0; // 调整借出数量
    let totalAfterQty = 0.0; // 调整后数量
    detailRows &&
      detailRows.forEach((item: any) => {
        totalReturnQty += Number(item.adjustReturnQty) || 0;
        totalNowOutQty += Number(item.nowOutQty) || 0;
        totalOutQty += Number(item.adjustOutQty) || 0;
        totalAfterQty += Number(item.surplusOutQty) || 0;
      });
    masterData.value.totalReturnQty = Math.Round(totalReturnQty, 5);
    masterData.value.totalNowOutQty = Math.Round(totalNowOutQty, 5);
    masterData.value.totalOutQty = Math.Round(totalOutQty, 5);
    masterData.value.totalAfterQty = Math.Round(totalAfterQty, 5);
  }
};
//明细改变事件
base.onDetailChange = (ref: any, val: any, row: any, field: any, detailRows: Array<any>) => {
  if (field.prop === 'plateType') {
    // 改变容器名称下拉框
    getPlateSpecInfo(val, 1136);
  }
  if (field.prop === 'plateSpec') {
    // 改变单位重量,单位体积
    getWeightCube(val, row);
  }
};

// 根据容器类型获得容器名称下拉值内容
const getPlateSpecInfo = async (val: any, dropdownId: any) => {
  if (!val) {
    return;
  }
  let url = '/basic/storage/plate/getPlateSpec';
  let params = {
    plateType: val,
  };
  let res = await postData(url, params);
  if (res.result) {
    res.data = res.data.map((m: any) => {
      return {
        value: m.plateId,
        label: m.plateSpec,
        plateId: m.plateId,
        plateSpec: m.plateSpec,
      };
    });
    var data = res.data;
    dropdownStore.setDropDown(dropdownId, data);
  } else {
    proxy.$message.error(res.msg);
  }
};
// 根据容器规格默认重量，体积
const getWeightCube = async (val: any, row: any) => {
  if (!val) {
    return;
  }
  let url = '/basic/storage/plate/getWeightCube';
  let params = {
    plateSpec: val,
  };
  let res = await postData(url, params);
  if (res.result) {
    row.weight = res.data.weight;
    row.unitCube = res.data.unitCube;
    row.plateName = res.data.plateName;
  } else {
    proxy.$message.error(res.msg);
  }
};
</script>
