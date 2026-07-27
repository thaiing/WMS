<template>
  <div class="biz-container">
    <!--数据Table-->
    <yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes"> </yrt-data-list>

    <!--数据编辑器Editor-->
    <yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="base.detailButtonClick" :auth-nodes="state.authNodes" :on-save-before="base.onSaveBefore" @on-save-after="base.onSaveAfter" @on-change="base.onChange" @on-detail-change="base.onDetailChange" @on-edit-load-before="base.onEditLoadBefore" @on-edit-load-after="base.onEditLoadAfter">
      <template #blank-passing>
        <draggable v-model="state.passing" itemKey="id">
          <template #item="{ element, index }">
            <el-tag :key="index" :disable-transitions="false" closable @close="handleClose(index)">
              {{ element }}
            </el-tag>
          </template>
        </draggable>
        <el-input v-if="state.inputVisible" ref="saveTagInput" class="w-150" v-model="state.inputValue" @keyup.enter="handleInputConfirm" @blur="handleInputConfirm"></el-input>
        <el-button v-else class="button-new-tag" @click="showInput">+ 添加途经点</el-button>
      </template>
    </yrt-editor>
  </div>
</template>

<script setup lang="ts" name="basic-tms-line">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';
import YrtDataList from '/@/components/common/yrtDataList.vue';
const yrtEditor = defineAsyncComponent(() => import('/@/components/common/yrtEditor.vue'));
import baseHook from '/@/components/hooks/baseHook';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
import to from 'await-to-js';
import { postData } from '/@/api/common/baseApi';
const base = baseHook();
const { baseState, dataListRefName, editorRefName, editorInfo, masterData } = base;

//#region 定义变量
const state = reactive({
  ...toRefs(baseState),
  passing: [] as any[],
  inputVisible: false,
  inputValue: '',
});
//#endregion

onMounted(() => {});

// 数据加载后
base.onEditLoadAfter = (master: any) => {
  // 给数据的字符串转成数组格式，显示出来
  state.passing = JSON.parse(master.passing);
};

// 保存前事件
base.onSaveBefore = (formData: any) => {
  masterData.value.passing = state.passing.join(',');

  const distributionSite = formData.distributionSite;
  const passing = formData.passing;
  const unloadSite = formData.unloadSite;
  // lineRoute "线路路由" =   distributionSite  "出发网点" > passing "途径点" > unloadSite "目的地网点"
  masterData.value.lineRoute = `${distributionSite || ''}>${passing || ''}>${unloadSite || ''}`;

  masterData.value.passing = JSON.stringify(state.passing);
  return true;
};
// 删除
const handleClose = (index: any) => {
  state.passing.splice(state.passing.indexOf(index), 1);
};
// 鼠标点击事件
const handleInputConfirm = async () => {
  state.passing.push(state.inputValue);
  masterData.value.passing = state.passing.join(',');
  // 重置输入框状态
  state.inputVisible = false;
  state.inputValue = '';
};
const showInput = () => {
  state.inputVisible = true;
  proxy.$nextTick(() => {
    proxy.$refs.saveTagInput.$refs.input.focus();
  });
};

// 列表页面按钮事件
base.buttonClick = (authNode: string) => {
  switch (authNode) {
    case 'multiAuditing':
      multiAuditing();
      return true;
  }
};
//审核
const multiAuditing = async () => {
  const url = '/basic/tms/line/multiAuditing';
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
  let ids = selectInfos.map((item) => item.lineId);

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
