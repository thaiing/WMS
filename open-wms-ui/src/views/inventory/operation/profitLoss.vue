<template>
  <div class="biz-container">
    <!--数据Table-->
    <yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes" :on-batch-auditing-before="onBatchAuditingBefore"></yrt-data-list>

    <!--数据编辑器Editor-->
    <yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="base.detailButtonClick" :auth-nodes="state.authNodes" :on-save-before="base.onSaveBefore" @on-save-after="base.onSaveAfter" @on-change="base.onChange" @on-detail-change="base.onDetailChange" @on-edit-load-before="base.onEditLoadBefore" @on-edit-load-after="base.onEditLoadAfter" :btn-read-only="state.btnReadOnly">
      <template #footer-button-region>
        <el-button type="primary" icon="CircleCheckFilled" :disabled="state.createProfitLossDisabled" @click="createCheck">生成盘点单</el-button>
        <el-button type="primary" icon="CircleCheckFilled" @click="adjustInventory">调整库存</el-button>
      </template>
    </yrt-editor>
  </div>
</template>

<script setup lang="ts" name="inventory-operation-profitLoss">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';
import YrtDataList from '/@/components/common/yrtDataList.vue';
import yrtEditor from '/@/components/common/yrtEditor.vue';
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

  createProfitLossDisabled: false,
});
//#endregion

onMounted(() => {});

base.onEditLoadAfter = (master: any) => {
  var lossStatus = master.lossStatus;
  state.editorOptions.config.disabled = true;
  state.createProfitLossDisabled = false;

  if (lossStatus == '新建' || lossStatus == '复盘中' || lossStatus == '已复盘') {
    state.editorOptions.config.disabled = false;
  }
  if (lossStatus == '复盘中' || lossStatus == '已复盘') {
    state.createProfitLossDisabled = true;
  }
  if (master.auditing == 2) {
    state.editorOptions.config.disabled = true;
  }

  state.btnReadOnly.detailExport = false;
};

//生成盈亏单
const createCheck = () => {
  proxy
    .$confirm('提示：确定要生成复盘单吗！', '确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
    })
    .then(async ({ value }: { value: any }) => {
      const url = '/inventory/operation/profitLoss/createCheck';
      const params = {
        profitLossId: masterData.value.profitLossId,
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

//调整库存
const adjustInventory = () => {
  proxy
    .$confirm('提示：确定要调整库存吗！', '确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
    })
    .then(async ({ value }: { value: any }) => {
      if (masterData.value.auditing !== 2) {
        proxy.$message.error('只有审核成功状态的单子才能调整库存！');
        return;
      }
      const url = '/inventory/operation/profitLoss/adjustInventory';
      const params = {
        profitLossId: masterData.value.profitLossId,
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
const onBatchAuditingBefore = (rows: any) => {
  let flag = false;
  rows.map((item: any) => {
    if ('复盘中'.indexOf(item.lossStatus) >= 0) {
      flag = true;
    }
  });
  if (flag) {
    proxy.$message.error('状态为【复盘中不允许操作】！');
  }
  return !flag;
};
</script>
