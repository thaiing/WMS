<template>
  <div class="biz-container">
    <!--数据Table-->
    <yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes"></yrt-data-list>

    <!--数据编辑器Editor-->
    <yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="base.detailButtonClick" :auth-nodes="state.authNodes" :on-save-before="base.onSaveBefore" @on-save-after="base.onSaveAfter" @on-change="base.onChange" @on-detail-change="base.onDetailChange" @on-edit-load-before="base.onEditLoadBefore" @on-edit-load-after="base.onEditLoadAfter"></yrt-editor>
  </div>
</template>

<script setup lang="ts" name="inbound-in-orderPlan">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';
import YrtDataList from '/@/components/common/yrtDataList.vue';
import yrtEditor from '/@/components/common/yrtEditor.vue';
import baseHook from '/@/components/hooks/baseHook';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
import moment from 'moment';
import to from 'await-to-js';
import { postData } from '/@/api/common/baseApi';

const base = baseHook();
const { baseState, dataListRefName, editorRefName, editorInfo, masterData } = base;

//#region 定义变量
const state = reactive({
  ...toRefs(baseState),
});
//#endregion

// 保存前事件
base.onSaveBefore = (formData: any) => {
  var takeGoodsDate = moment(formData.takeGoodsDate);
  var outGoodsDate = moment(formData.outGoodsDate);
  if (takeGoodsDate && outGoodsDate && takeGoodsDate > outGoodsDate) {
    proxy.$message.error('到场日期不能大于离场日期！');
    return false;
  }
  return true;
};
// 字段值改变事件
base.onChange = (ref: any, val: any, field: any, formData: any) => {
  if (['carProvince', 'carCity', 'carNum'].find((item) => field.options.prop === item)) {
    if (formData.carProvince || formData.carCity || formData.carNum) {
      masterData.value.truckNumber = (formData.carProvince || '') + (formData.carCity || '') + (formData.carNum || '');
    }
  }
};

onMounted(() => {});

base.buttonClick = (authNode: string) => {
  switch (authNode) {
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

//审核
const multiAuditing = async () => {
  const url = '/basic/tms/vehicleAccess/multiAuditing';
  let selectInfos: Array<any> = state.dataListSelections;
  if (!selectInfos.length) {
    proxy.$message.error('至少选择一项进行审核');
    return;
  }
  for (const item of selectInfos) {
    if ([0, null].indexOf(item.auditing) == -1) {
      proxy.$message.error('只有待审核的单据才可以进行反审');
      return;
    }
  }
  let ids = selectInfos.map((item) => item.vehicleAccessId);

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
