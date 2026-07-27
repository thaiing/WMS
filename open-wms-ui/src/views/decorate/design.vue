<template>
  <div class="home-container">
    <el-config-provider :locale="state.locale">
      <div class="header">
        <div class="title">页面装修</div>
        <div class="button">
          <el-button type="primary" @click="decorateSave">保存</el-button>
          <el-button>重置</el-button>
        </div>
      </div>
      <div class="body">
        <left-panel></left-panel>
        <center-panel v-model:selectModule="state.selectModule" :app-config="state.appConfig"></center-panel>
        <right-panel :config="state.selectModule"></right-panel>
      </div>
    </el-config-provider>
  </div>
</template>

<script setup lang="ts" name="app-design">
import { reactive, toRefs, onMounted, getCurrentInstance, ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
import leftPanel from './components/leftPanel.vue';
import centerPanel from './components/centerPanel.vue';
import rightPanel from './components/rightPanel.vue';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import to from 'await-to-js';
import { postData } from '/@/api/common/baseApi';
import { BaseObject, DataType, QueryType, QueryBo, PageListBo } from '/@/types/common';

let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

const state = reactive({
  locale: zhCn,
  leftTabActive: 't1', // 左侧tab导航
  collapseActives: ['1', '2', '3'],
  // app参数
  appConfig: {
    global: {
      pageId: 0,
      type: 'global',
      title: '页面设置',
      header: '易软通仓配一体化',
      decorateName: '默认模板',
      enable: 1,
      orderNo: 0,
      buttons: [] as any[],
      pageType: 'PC',
      isPC: true,
      isAPP: false,
    },
    modules: [],
  },
  // 选中项
  selectModule: {
    type: 'global',
  },
});

// 加载数据
const decorateLoad = async () => {
  let pageId = proxy.$route.query.id;
  if (!pageId) {
    proxy.$message.error('模块ID不能为空');
    return;
  }

  let queryBoList: Array<QueryBo> = [];
  let url = '/system/decorate/page/selectById/' + pageId;
  const [err, res] = await to(postData(url, queryBoList));
  if (err) {
    return;
  }

  proxy.common.showMsg(res);
  let pageType = res.data.pageType;
  if (res.data.jsonData) {
    state.appConfig = JSON.parse(res.data.jsonData);
    if (!state.appConfig.global.buttons) {
      state.appConfig.global.buttons = [];
    }
    state.selectModule = state.appConfig.global;
    state.appConfig.global.pageId = res.data.pageId;
    state.appConfig.global.pageType = pageType;
    state.appConfig.global.isPC = pageType === 'PC';
    state.appConfig.global.isAPP = pageType === 'APP';
  } else {
    state.appConfig.global.pageType = pageType;
    state.appConfig.global.decorateName = res.data.pageName;
    state.appConfig.global.isPC = pageType === 'PC';
    state.appConfig.global.isAPP = pageType === 'APP';
  }
};

// 保存设置
const decorateSave = async () => {
  let pageId = Number(proxy.$route.query.id);
  if (!pageId) {
    proxy.$message.error('模块ID不能为空');
    return;
  }
  state.appConfig.global.pageId = pageId;
  state.appConfig.global.orderNo = state.appConfig.global.orderNo || 0;
  state.appConfig.modules.forEach((element: any, index: number) => {
    element.index = index;
  });
  let url = '/system/decorate/page/update';
  let params = {
    pageId: pageId,
    decorateName: state.appConfig.global.decorateName,
    enable: state.appConfig.global.enable ? 1 : 0,
    jsonData: JSON.stringify(state.appConfig),
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }

  proxy.common.showMsg(res);
};

onMounted(() => {
  decorateLoad();
});
</script>

<style scoped lang="scss">
.home-container {
  .header {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    background-color: var(--color-whites);
    border-bottom: 1px solid var(--color-info-light-8);
    .title {
      font-size: var(--font-size-title);
      line-height: 32px;
    }
  }
  .body {
    .right {
      position: fixed;
      right: 0;
      top: 53px;
      bottom: 0;
      width: 400px;
      background-color: var(--color-whites);
    }
  }
}
</style>
