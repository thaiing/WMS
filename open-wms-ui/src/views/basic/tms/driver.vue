<template>
  <div class="biz-container">
    <!--数据Table-->
    <yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes" :action-field="state.actionField">
      <template #common-column-slot="{ row, col }">
        <!--自定义显示图片-->
        <template v-if="col.prop === 'driverImage'">
          <el-image v-for="(pic, index) in base.getPicList(row[col.prop])" :src="base.showSmallPic(pic)" class="pic-small" fit="contain" preview-teleported :preview-src-list="base.getPicList(row[col.prop])" />
        </template>
      </template>
    </yrt-data-list>

    <!--数据编辑器Editor-->
    <yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="base.detailButtonClick" :auth-nodes="state.authNodes" :on-save-before="base.onSaveBefore" @on-save-after="base.onSaveAfter" @on-change="base.onChange" @on-detail-change="base.onDetailChange" @on-edit-load-before="base.onEditLoadBefore" @on-edit-load-after="base.onEditLoadAfter">
      <!--自定义按钮插槽-->
      <template #footer-button-region="{ formData, details }">
        <!--修改密码按钮-->
        <el-button type="success" @click="modifypwd(formData, details)">
          <template #icon>
            <svg-icon name="ele-Lock" class="text-size-n" :size="14" />
          </template>
          修改密码
        </el-button>
      </template>
    </yrt-editor>

    <!--数据权限设置-->
    <data-auth-dialog ref="data-auth-dialog" v-model:visible="state.dataAuthVisible" :user-id="state.currentUserId" module-type="司机模块"></data-auth-dialog>

    <!--修改密码弹出页面-->
    <modify-pwd ref="modifypwdDialogRef" v-model:visible="state.modifyPwdVisible" :is-orgin-pwd="false"></modify-pwd>
  </div>
</template>

<script setup lang="ts" name="inbound-in-orderPlan">
import YrtDataList from '/@/components/common/yrtDataList.vue';
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';
import yrtEditor from '/@/components/common/yrtEditor.vue';
import baseHook from '/@/components/hooks/baseHook';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
import modifyPwd from './components/modify-pwd.vue';
const DataAuthDialog = defineAsyncComponent(() => import('/@/views/system/permission/components/data-auth-dialog.vue'));

const base = baseHook();
const { baseState, dataListRefName, editorRefName, editorInfo, masterData } = base;
const modifypwdDialogRef = ref();

//#region 定义变量
const state = reactive({
  ...toRefs(baseState),
  // 修改密码页面默认不显示
  modifyPwdVisible: false,

  // 显示数据权限对话框
  dataAuthVisible: false,
  // 当前选中用户ID
  currentUserId: 0,
  // 自定义操作列
  actionField: {
    prop: '_action',
    label: '操作',
    width: '150',
    headerAlign: 'center',
    align: 'center',
    action: [
      {
        type: 'button',
        action: 'dataAuth',
        label: '数据权限',
        onClick(btnInfo: any, rowData: any, colInfo: any) {
          state.dataAuthVisible = true;
          state.currentUserId = rowData.driverId;
          return true;
        },
      },
      {
        type: 'button',
        action: 'modify',
        label: '编辑',
        onClick(btnInfo: any, rowData: any, colInfo: any) {
          base.editorRef.value.loadEditData(rowData.driverId, rowData);
          return true;
        },
      },
      {
        type: 'button',
        action: 'delete',
        label: '删除',
      },
    ],
    hidden: false,
  },
});
//#endregion

onMounted(() => {});

// 修改密码
const modifypwd = (formData: any, details: any) => {
  state.modifyPwdVisible = true;
  modifypwdDialogRef.value.setDriverId(formData.driverId);
};
</script>
