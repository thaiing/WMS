<template>
  <div class="biz-container">
    <!--数据Table-->
    <yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes"></yrt-data-list>

    <!--数据编辑器Editor-->
    <yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="base.detailButtonClick" :auth-nodes="state.authNodes" :on-save-before="base.onSaveBefore" @on-save-after="base.onSaveAfter" @on-change="base.onChange" @on-detail-change="base.onDetailChange" @on-edit-load-before="base.onEditLoadBefore" @on-edit-load-after="base.onEditLoadAfter" :btn-read-only="state.btnReadOnly">
      <!--自定义按钮-->
      <template #footer-button-region="{ formData }">
        <el-button :disabled="state.btnReadOnly.auditing" type="success" @click="updateAuditing(formData, 2)">
          <template #icon>
            <svg-icon name="icon-shenpi6" class="auditing" :size="14" />
          </template>
          审核</el-button
        >
        <el-button :disabled="!state.btnReadOnly.auditing" type="danger" @click="updateAuditing(formData, 0)">
          <template #icon>
            <svg-icon name="ele-CircleClose" class="auditing" :size="14" />
          </template>
          审核驳回
        </el-button>
        <el-button :disabled="state.btnReadOnly.signingStatus" type="success" @click="updateSign(formData, '已签署')">
          <template #icon>
            <svg-icon name="ele-Checked" class="auditing" :size="14" />
          </template>
          签署
        </el-button>
        <el-button :disabled="!state.btnReadOnly.signingStatus" type="danger" @click="updateSign(formData, '未签署')">
          <template #icon>
            <svg-icon name="ele-CircleClose" class="auditing" :size="14" />
          </template>
          签署驳回
        </el-button>
      </template>
    </yrt-editor>
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
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

const base = baseHook();
const { baseState, dataListRefName, editorRefName, editorInfo, masterData } = base;

//#region 定义变量
const state = reactive({
  ...toRefs(baseState),
});
//#endregion

onMounted(() => {});

// 页面加载后事件
base.onEditLoadAfter = (master: any) => {
  const auditingID = masterData.value.auditing; // 审核
  const signingStatus = masterData.value.signingStatus; // 签署
  if (auditingID === 0) {
    state.btnReadOnly.auditing = false;
    state.editorOptions.config.disabled = false;
  } else if (auditingID === 2) {
    state.btnReadOnly.auditing = true;
    state.editorOptions.config.disabled = true;
  }
  if (signingStatus === '未签署') {
    state.btnReadOnly.signingStatus = false;
    state.editorOptions.config.disabled = false;
  } else if (signingStatus === '已签署') {
    state.btnReadOnly.signingStatus = true;
    state.editorOptions.config.disabled = true;
  }
};

//批量审核
const updateAuditing = async (dataList: any, auditing: any) => {
  proxy
    .$confirm('审核后将无法对页面进行操作, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(async () => {
      const contractId = masterData.value.contractId;
      const url = '/basic/tms/driverContract/multiAuditing';
      const params = {
        contractId: contractId,
        auditing: auditing,
      };

      const [err, res] = await to(postData(url, params));

      if (err) {
        proxy.$message.error(err.message);
        return;
      }
      if (res.result) {
        proxy.common.showMsg(res);
        base.editorRef.value.loadEditData(masterData.value.orderId);
        base.dataListRef.value.loadData();
      }
    })
    .catch(() => {
      proxy.$message.error('已取消审核');
    });
};

//签署
const updateSign = async (dataList: any, status: any) => {
  proxy
    .$confirm('签署后将无法对页面进行操作, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(async () => {
      const contractId = masterData.value.contractId;
      const url = '/basic/tms/driverContract/updateSign';
      const params = {
        contractId: contractId,
        signingStatus: status,
      };

      const [err, res] = await to(postData(url, params));

      if (err) {
        proxy.$message.error(err.message);
        return;
      }
      if (res.result) {
        proxy.common.showMsg(res);
        base.editorRef.value.loadEditData(masterData.value.orderId);
        base.dataListRef.value.loadData();
      }
    })
    .catch(() => {
      proxy.$message.error('已取消审核');
    });
};
</script>
