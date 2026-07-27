<template>
  <div ref="container">
    <el-container class="designer-container">
      <el-aside width="300px" style="padding-left: 6px">
        <left-aside ref="leftAsideRef" :basic-components="basicComponents" v-model:module-node="state.moduleNode" v-model:detail-fields="state.detailFields" v-model:widget-form-data="state.widgetFormData" :reset-do-list="resetDoList"></left-aside>
      </el-aside>
      <el-container class="designer-center-container" direction="vertical">
        <div class="content">
          <div class="right-tools" @mousedown.stop>
            <el-button type="primary" link size="small" @click="handleGenerateJson"><i class="icon-baocun"></i>保存</el-button>
            <el-button type="primary" link size="small" @click="handleReset"><i class="icon-chongzhi"></i>重置</el-button>
            <i class="icon-vertical_line"></i>
            <el-button type="primary" link size="small" @click="toolActionUndo()"><i class="icon-undo"></i>撤销</el-button>
            <el-button type="primary" link size="small" @click="toolActionRedo()"><i class="icon-redo"></i>恢复</el-button>
            <i class="icon-vertical_line"></i>
            <el-button type="primary" link size="small" @click="toolAction('left')"><i class="icon-zuoduiqi"></i>左对齐</el-button>
            <el-button type="primary" link size="small" @click="toolAction('right')"><i class="icon-youduiqi"></i>右对齐</el-button>
            <el-button type="primary" link size="small" @click="toolAction('top')"><i class="icon-shangduiqi"></i>上对齐</el-button>
            <el-button type="primary" link size="small" @click="toolAction('bottom')"><i class="icon-xiaduiqi"></i>下对齐</el-button>
            <i class="icon-vertical_line"></i>
            <el-button type="primary" link size="small" @click="toolActionSetting"><i class="icon-settings2"></i>设置</el-button>
          </div>
          <widget-form ref="widgetForm" v-model:data="state.widgetFormData" v-model:select="state.widgetFormSelect" v-model:config-type="state.configType" v-model:detail-fields="state.detailFields" :add-do-list="addDoList"></widget-form>
        </div>
      </el-container>

      <!--属性窗口-->
      <teleport to="body">
        <div v-show="state.settingVisible" v-dragmove="{ dragButton: '.window-header', dragVindow: '.window', custom: true, top: 50, right: 100 }">
          <div class="window">
            <div class="window-header">
              <div>属性设置</div>
              <div><i class="icon-shanchu4"></i></div>
            </div>
            <div class="window-body">
              <el-tabs v-model="state.attributeTab" @tab-click="handleConfigSelect">
                <el-tab-pane label="字段属性" name="widget">
                  <el-scrollbar v-show="state.configTab == 'widget'" :noresize="false" :native="false" wrap-class="config scrollbar-wrap">
                    <WidgetConfig v-model:data="state.widgetFormSelect" :basic-components="basicComponents"></WidgetConfig>
                  </el-scrollbar>
                </el-tab-pane>
                <el-tab-pane label="表单属性" name="form">
                  <el-scrollbar v-show="state.configTab == 'form'" :noresize="false" :native="false" wrap-class="config scrollbar-wrap">
                    <form-config :data-options="state.widgetFormData.dataOptions"></form-config>
                  </el-scrollbar>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>
      </teleport>

      <el-dialog draggable ref="jsonPreview" :modal="false" v-model="state.jsonVisible" append-to-body width="800px" top="5vh" title="保存打印模板" class="attribute-config-container">
        <v-ace-editor v-model:value="state.vueData" lang="json" theme="xcode" style="height: 300px" />
        <template #footer>
          <el-button data-clipboard-target=".ace_text-input" @dblclick="proxy.$message.success('复制成功')">双击复制</el-button>
          <el-button :loading="state.createLoading" type="primary" data-clipboard-target=".ace_text-input" @click="createBaseVue">保存</el-button>
        </template>
      </el-dialog>
    </el-container>
  </div>
</template>

<script setup lang="ts" name="system-dev-tool-print-designer-index">
import WidgetConfig from './widgetConfig.vue';
import FormConfig from './formConfig.vue';
import WidgetForm from './widgetForm.vue';
import { basicComponents } from './componentsConfig.js';
import { generateMixinCode } from './generateMixinCode.js';
import LeftAside from './components/leftAside.vue';
import { dragmove as vDragmove } from './directive/dragmove';
import { ref } from 'vue';
import { VAceEditor } from 'vue3-ace-editor';
import '/@/utils/ace.config';

import { postData } from '/@/api/common/baseApi';
import to from 'await-to-js';
import { BaseProperties, DataOptions } from '/@/types/base-type';
import { ComponentInternalInstance } from 'vue';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
const emit = defineEmits([]);
declare type LeftAsideInstance = InstanceType<typeof LeftAside>;
let leftAsideRef = ref<LeftAsideInstance>();

//#region 定义变量
const state = reactive({
  basicComponents,
  // 明细字段
  detailFields: [],
  // 当前配置参数设置组件
  configType: 'WidgetConfig',

  // 模块字段信息
  moduleNode: {
    projectName: null,
    cnName: '【请选择模块】',
    table_Id: 0,
    tableName: null,
    dBServer: null,
    dBServerReadOnly: null,
    parentId: null,
    detailName: null,
    idField: null,
    codeRegular: null,
    linkColumn: null,
    sortName: null,
    vueData: {},
  },

  // 设计器数据结构
  widgetFormData: {
    // 数据加载及保存参数
    dataOptions: {
      menuId: null,
      projectName: 'BasicInfo',
      tableName: '',
      idField: '',
      router: '/sys/table',
      title: '',
      paddingTop: 5,
      paddingBottom: 5,
      paddingLeft: 5,
      paddingRight: 5,
      width: 210,
      height: 148,
      templateType: '常规模板',
    },
    // 字段集合
    fields: [] as any[],
  },
  // 撤销、恢复
  undoList: [] as any[],
  redoList: [] as any[],
  // undo、redo操作，不在记录历史
  isDoAction: false,
  // 时间戳
  currentTimeStamp: 0,

  // 设计器默认数据结构
  widgetFormDataDefault: {
    // 数据加载及保存参数
    dataOptions: {
      projectName: 'BasicInfo',
      tableName: '',
      idField: '',
      router: '',
      title: '',
      paddingTop: 30,
      paddingRight: 30,
      paddingBottom: 30,
      paddingLeft: 30,
      templateType: '常规模板',
    },
    // 字段集合
    fields: [],
  },
  // 设计器类型：管理页面、编辑页面
  editRegionTab: 'WidgetConfig',
  configTab: 'widget',
  widgetFormSelect: {}, // 选中项
  jsonVisible: false,
  vueData: '', // 创建混入文件内容
  createLoading: false, // 创建页面loading
  // 参数设置窗口显示
  settingVisible: true,
  attributeTab: 'widget',
});
//#endregion

onMounted(() => {
  // loadJs('https://auod-beijing.oss-cn-beijing.aliyuncs.com/ace/src-min-noconflict/ace.js');
});

onDeactivated(() => {
  document.onselectstart = null;
  document.oncontextmenu = null;
  state.settingVisible = false;
});

onActivated(() => {
  state.settingVisible = true;
  // document.onselectstart = function () {
  //   return false;
  // };
});

const handleConfigSelect = (tab: any, event: any) => {
  state.configTab = tab.paneName;
};

// 重置，重新开始设计
const handleReset = () => {
  if (!state.moduleNode.tableName) {
    proxy.$message.error('请选择需要设计的模块！');
    return;
  }
  proxy
    .$confirm('确定要重置设计，将重新开始设计, 是否继续?', '重置提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(() => {
      reset();
      proxy.$message.success('重置成功!');
    })
    .catch(() => {
      proxy.$message.error('已取消重置');
    });
};

// 重置
const reset = () => {
  let data = state.moduleNode;
  state.widgetFormData = Object.assign({}, state.widgetFormDataDefault, {
    dataOptions: {
      projectName: data.projectName,
      tableName: data.tableName,
      idField: data.idField,
      router: '/api/common/loadEditData',
      idValue: 0,
      codeRegular: data.codeRegular, // 自动编码字段
      linkColumn: data.linkColumn, // 链接到弹出编辑窗口的字段
      menuId: null,
      pageIndex: 1,
      pageSize: 15,
      total: 0,
      sortName: data.sortName,
    },
  });
  state.widgetFormSelect = {}; // 编辑页面选中项
};

// 预览页面
const handlePagePreview = () => {};

// 生成JSON
const handleGenerateJson = () => {
  let title = state.widgetFormData.dataOptions.title;
  let router = state.widgetFormData.dataOptions.router;
  if (!title) {
    proxy.$message.error('请在表单属性里面填写必填属性');
    return;
  }

  state.jsonVisible = true;
  let last = router.lastIndexOf('/');
  if (last === router.length - 1) {
    router = router.substring(0, router.length - 1);
    state.widgetFormData.dataOptions.router = router;
  }

  state.vueData = generateMixinCode(state.widgetFormData);

  proxy.$nextTick(() => {
    // eslint-disable-next-line
    // const editor = window.ace.edit('jsoneditor');
    // eslint-disable-next-line
    // editor.session.setMode('ace/mode/jsx');
  });
};

// 生成文件
const createBaseVue = async () => {
  let the = state;
  if (state.widgetFormData.dataOptions.menuId === '') {
    proxy.$message.error('关联模块ID不能为空！');
    return;
  }
  if (!state.widgetFormData.dataOptions.title) {
    proxy.$message.error('模板名称不能为空！');
    return;
  }
  // if (!state.widgetFormData.dataOptions.router) {
  // 	proxy.$message.error('API地址不能为空！');
  // 	return;
  // }
  // if (!state.widgetFormData.dataOptions.tableName) {
  //   proxy.$message.error('关联表名不能为空！');
  //   return;
  // }
  // UI布局参数
  let vueData = state.vueData;
  if (!vueData) {
    vueData = JSON.stringify(state.widgetFormData, null, 2);
  } else {
    state.widgetFormData = JSON.parse(vueData);
  }
  if (!state.vueData) {
    proxy.$message.error('没有可保存的数据！');
    return;
  }
  let node = leftAsideRef.value!.getCurrentNode();
  let printTemplateId = node.printTemplateId;
  // 更新节点数据
  node.vueData = vueData;

  the.createLoading = true;
  let url = '/system/core/printTemplate/savePrintTemplate';
  let params = {
    menuId: state.widgetFormData.dataOptions.menuId,
    printTemplateId: printTemplateId,
    templateName: state.widgetFormData.dataOptions.title,
    templateType: state.widgetFormData.dataOptions.templateType,
    vueData: vueData,
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }

  proxy.common.showMsg(res);
  if (res.result) {
    state.moduleNode.vueData = vueData; // 保存数下拉框中的VueData
    state.jsonVisible = false;
    resetDoList();
  }
  the.createLoading = false;
};

// 工具栏事件操作
const toolAction = (action: any) => {
  let topItem: any = null;
  let fields = state.widgetFormData.fields;
  document.querySelectorAll('.resable-item.selected').forEach((item: any) => {
    if (!topItem || topItem.offsetY > item.offsetY) {
      topItem = item;
    }
  });
  if (!topItem) return;

  document.querySelectorAll('.resable-item.selected').forEach((item: any) => {
    const key = item.attributes['data-key'].value;
    const field = fields.find((item) => {
      return item.key === key;
    });

    let bottom, y, right, x;
    switch (action) {
      case 'top':
        field.options.y = topItem.offsetTop;
        break;
      case 'bottom':
        bottom = topItem.offsetTop + topItem.offsetHeight;
        y = bottom - item.offsetHeight;
        field.options.y = y;
        break;
      case 'left':
        field.options.x = topItem.offsetLeft;
        break;
      case 'right': {
        right = topItem.offsetLeft + topItem.offsetWidth;
        x = right - item.offsetWidth;
        field.options.x = x;
        break;
      }
    }
  });
};

// 设计动作记录add do list
const addDoList = () => {
  if (state.isDoAction) {
    state.isDoAction = false;
    return;
  }
  let currStamp = new Date().valueOf();
  let span = currStamp - state.currentTimeStamp;
  let newItem = JSON.parse(JSON.stringify(state.widgetFormData));
  if (state.undoList.length) {
    let lastItem = state.undoList[state.undoList.length - 1];
    let newItemJson = JSON.stringify(state.widgetFormData);

    if (newItemJson !== lastItem) {
      if (span < 150) {
        state.undoList[state.undoList.length - 1] = newItem;
      } else {
        state.undoList.push(newItem);
      }
    }
  } else {
    state.undoList.push(newItem);
  }
  state.redoList = [];
  state.currentTimeStamp = currStamp;
};

// undo
const toolActionUndo = () => {
  state.isDoAction = true;
  if (state.undoList.length >= 1) {
    let item = state.undoList.pop();
    let newItem = JSON.parse(JSON.stringify(item));
    state.redoList.push(newItem);
    let lastItem = state.undoList[state.undoList.length - 1];
    newItem = JSON.parse(JSON.stringify(lastItem));
    state.widgetFormData = newItem;
  } else {
    proxy.$message.error('没有可撤销的步骤了！');
  }
};

// redo
const toolActionRedo = () => {
  state.isDoAction = true;
  if (state.redoList.length) {
    let item = state.redoList.pop();
    let newItem: any = JSON.parse(JSON.stringify(item));
    state.undoList.push(newItem);
    newItem = JSON.parse(JSON.stringify(item));
    state.widgetFormData = newItem;
  } else {
    proxy.$message.error('没有可恢复的步骤了！');
  }
};

// todo、redo reset
const resetDoList = () => {
  state.redoList = [];
  state.undoList = [];
};

const toolActionSetting = () => {
  state.settingVisible = !state.settingVisible;
};

//#region wacth
watch(
  () => state.widgetFormData,
  (newVal) => {
    addDoList();
  },
  { deep: true, immediate: true }
);
//#endregion
</script>

<style lang="scss" scoped>
@import './styles/index.scss';

.el-container {
  height: 100% !important;
}

.el-radio + .el-radio {
  margin-left: 0 !important;
}
.el-radio {
  margin-right: 30px;
  line-height: 32px;
}
.el-checkbox + .el-checkbox {
  margin-left: 0 !important;
}
.el-checkbox {
  margin-right: 30px;
}
</style>

<style lang="scss" scoped>
.window {
  width: 300px;
  min-height: 300px;
  position: absolute;
  top: 100px;
  right: 100px;
  background: #fff;
  z-index: 1000;

  --el-dialog-bg-color: var(--el-bg-color);
  --el-dialog-box-shadow: var(--el-box-shadow);
  --el-dialog-title-font-size: var(--el-font-size-large);
  --el-dialog-content-font-size: 14px;
  --el-dialog-font-line-height: var(--el-font-line-height-primary);
  --el-dialog-padding-primary: 20px;
  --el-dialog-border-radius: var(--el-border-radius-small);
  margin: var(--el-dialog-margin-top, 15vh) auto 50 px;
  background: var(--el-dialog-bg-color);
  border-radius: var(--el-dialog-border-radius);
  box-shadow: var(--el-dialog-box-shadow);
  box-sizing: border-box;

  .window-header {
    text-align: left;
    user-select: none;
    padding: 20px;
    line-height: var(--el-dialog-font-line-height);
    font-size: var(--el-dialog-title-font-size);
    color: var(--el-text-color-primary);
    display: flex;
    justify-content: space-between;
  }

  :deep(.el-tabs__nav) {
    left: 10px;
  }
}
</style>
