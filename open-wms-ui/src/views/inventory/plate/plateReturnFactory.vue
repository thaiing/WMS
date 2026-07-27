<template>
  <div class="biz-container">
    <!--数据Table-->
    <yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes"></yrt-data-list>

    <!--数据编辑器Editor-->
    <yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="base.detailButtonClick" :auth-nodes="state.authNodes" :on-save-before="base.onSaveBefore" @on-save-after="base.onSaveAfter" @on-change="base.onChange" @on-detail-change="base.onDetailChange" @on-edit-load-before="base.onEditLoadBefore" @on-edit-load-after="base.onEditLoadAfter" @on-detail-delete-after="base.onDetailDeleteAfter"></yrt-editor>
  </div>
</template>

<script setup lang="ts" name="inventory-plate-plateReturnFactory">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';
import YrtDataList from '/@/components/common/yrtDataList.vue';
const yrtEditor = defineAsyncComponent(() => import('/@/components/common/yrtEditor.vue'));
import baseHook from '/@/components/hooks/baseHook';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
import { postData } from '/@/api/common/baseApi';
import useDropdownStore from '/@/stores/modules/dropdown';
const dropdownStore = useDropdownStore();
const base = baseHook();
const { baseState, dataListRefName, editorRefName, editorInfo, masterData } = base;
import { ElMessageBox } from 'element-plus';
import to from 'await-to-js';

//#region 定义变量
const state = reactive({
  ...toRefs(baseState),
});
//#endregion

onMounted(() => {});

// 列表页面按钮事件
base.buttonClick = (authNode: string) => {
  switch (authNode) {
    case 'multiAuditing':
      multiAuditing();
      return true;
  }
};

// 保存后事件
base.onSaveAfter = (formData: any) => {
  total(); // 明细计算
};
//明细改变事件
base.onDetailChange = (ref: any, val: any, row: any, field: any, detailRows: Array<any>) => {
  total(); // 明细计算
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
//明细合计到主表
const total = () => {
  let totalReturnFactoryQty = 0; // 返厂数量
  let totalWeight = 0; // 合计重量
  let totalCube = 0; // 合计体积
  base.detailRows.value?.forEach((item: any) => {
    item.returnFactoryQty = Number(item.returnFactoryQty);
    item.rowWeight = Math.Round(Number(item.weight * item.returnFactoryQty), 4);
    item.rowCube = Math.Round(Number(item.unitCube * item.returnFactoryQty), 4);
    totalReturnFactoryQty += item.returnFactoryQty;
    totalWeight += item.rowWeight;
    totalCube += item.rowCube;
  });
  masterData.value.totalReturnFactoryQty = Math.Round(totalReturnFactoryQty, 5);
  masterData.value.totalWeight = Math.Round(totalWeight, 4);
  masterData.value.totalCube = Math.Round(totalCube, 4);
};
// 明细删除后事件
base.onDetailDeleteAfter = (deletedRows: Array<any>, detailInfo: any) => {
  total();
};
// 审核
const multiAuditing = async () => {
  const url = '/inventory/plate/plateReturnFactory/multiAuditing';
  let selectInfos: Array<any> = state.dataListSelections;
  if (!selectInfos.length) {
    proxy.$message.error('至少选择一项进行审核');
    return;
  }
  for (const item of selectInfos) {
    if (['新建', '待审核'].indexOf(item.statusText) == -1) {
      proxy.$message.error('只有新建或者待审核的单据才可以进行审核');
      return;
    }
  }
  let ids = selectInfos.map((item) => item.returnFactoryId);

  ElMessageBox.confirm('确定要审核单据吗', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const params = ids;

      const [err, res] = await to(postData(url, params));
      if (err) {
        proxy.$message.error(err.message);
        return;
      }

      if (res.result) {
        proxy.common.showMsg(res);
        base.dataListRef.value.loadData();
      }
    })
    .catch(() => {});
};
</script>
