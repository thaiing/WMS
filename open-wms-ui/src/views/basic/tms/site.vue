<template>
  <div class="biz-container">
    <!--数据Table-->
    <yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes"></yrt-data-list>

    <!--数据编辑器Editor-->
    <yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="base.detailButtonClick" :auth-nodes="state.authNodes" :on-save-before="base.onSaveBefore" @on-save-after="base.onSaveAfter" @on-change="base.onChange" @on-detail-change="base.onDetailChange" @on-edit-load-before="base.onEditLoadBefore" @on-edit-load-after="base.onEditLoadAfter"></yrt-editor>
  </div>
</template>

<script setup lang="ts" name="basic-tms-site">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';
import YrtDataList from '/@/components/common/yrtDataList.vue';
const yrtEditor = defineAsyncComponent(() => import('/@/components/common/yrtEditor.vue'));
import { DataType, OrderByType, OrderItem, QueryBo, QueryType } from '/@/types/common';
import { postData } from '/@/api/common/baseApi';
import baseHook from '/@/components/hooks/baseHook';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

import useDropdownStore from '/@/stores/modules/dropdown';
const dropdownStore = useDropdownStore();

const base = baseHook();
const { baseState, dataListRefName, editorRefName, editorInfo, masterData } = base;

//#region 定义变量
const state = reactive({
  ...toRefs(baseState),
});
//#endregion

onMounted(() => {});

// 字段值改变事件
base.onChange = (ref: any, val: any, field: any, formData: any) => {
  // 记录ID和Name
  if (field.options.prop === 'provinceName') {
    formData.cityName = '';
    formData.cityId = '';

    formData.regionName = '';
    formData.regionId = '';
    // 改变市级下拉框
    loadChildrenNode(val, 614, field.options.prop);
  } else if (field.options.prop === 'cityName') {
    formData.regionName = '';
    formData.regionId = '';
    // 改变区级下拉框
    loadChildrenNode(val, 615, field.options.prop);
  }
};

// 根据省ID获得市
const loadChildrenNode = async (id: any, dropdownId: any, prop: any) => {
  if (!id) {
    return;
  }
  let whereList: Array<QueryBo> = []; // 查询条件
  whereList.push({
    column: 'parentId',
    values: id,
    queryType: QueryType.EQ,
    dataType: DataType.INT,
  });
  let orderByList: Array<OrderItem> = []; // 排序提交
  orderByList.push({
    column: 'parentId',
    orderByType: OrderByType.DESC,
  });
  let url = '/system/core/common/loadTreeNode';
  let params = {
    tableName: 'baseCity',
    keyName: 'cityId',
    nodeName: 'cityName',
    fixHasChild: false,
    showOutsideNode: false,
    parentName: 'parentId',
    whereList: whereList, // 查询条件
    orderByList: orderByList, // 排序字段
    extendColumns: '',
  };
  let res = await postData(url, params);
  if (res.result) {
    var data = res.data.map((item: { value: any; label: any }) => {
      if (prop === 'provinceName') {
        const newItem = {
          cityId: item.value,
          cityName: item.label,
          value: item.value,
          label: item.label,
        };
        return newItem;
      } else if (prop === 'cityName') {
        const newItem = {
          regionId: item.value,
          regionName: item.label,
          value: item.value,
          label: item.label,
        };
        return newItem;
      }
    });
    dropdownStore.setDropDown(dropdownId, data);
  } else {
    proxy.$message.error(res.msg);
  }
};

base.onEditLoadAfter = (master: any) => {
  // 加载省
  if (master.provinceId) {
    loadChildrenNode(master.provinceId, 614, 'provinceName');
  }
  // 加载市
  if (master.cityId) {
    loadChildrenNode(master.cityId, 615, 'cityName');
  }
};
</script>
