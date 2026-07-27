<template>
  <el-container class="designer-container">
    <el-aside width="250px" class="components-list">
      <!-- <sticky class-name="left-sticky">
				<el-collapse accordion>
					<el-collapse-item title="布局容器">
						<draggable :list="layoutComponents" :options="{ group: { name: 'people', pull: 'clone', put: false }, sort: false, ghostClass: 'ghost' }" :move="handleMove" tag="ul" @end="handleMoveEnd" @start="handleMoveStart">
							<template #item="{ element }">
								<li class="form-edit-widget-label">
									<i :class="element.icon"></i>
									<span>{{ element.label }}</span>
								</li>
							</template>
						</draggable>
					</el-collapse-item>
					<el-collapse-item v-for="(m, mIndex) in basicComponents" :key="mIndex" :title="m.title">
						<el-scrollbar :noresize="false" :native="false" wrap-style="max-height:500px;">
							<draggable :list="m.items" :options="{ group: { name: 'people', pull: 'clone', put: false }, sort: false, ghostClass: 'ghost' }" :move="handleMove" tag="ul" @end="handleMoveEnd" @start="handleMoveStart">
								<template #item="{ element }">
									<li class="form-edit-widget-label">
										<i :class="element.icon"></i>
										<span>{{ element.label }}</span>
									</li>
								</template>
							</draggable>
						</el-scrollbar>
					</el-collapse-item>
					<el-collapse-item title="属性设置" class="widget-config-container">
						<component :is="state.configType" v-show="state.configTab == 'widget'" :data="state.widgetFormSelect" :basic-components="basicComponents"></component>
					</el-collapse-item>
				</el-collapse>
			</sticky> -->
    </el-aside>

    <el-container class="center-container" direction="vertical">
      <sticky :z-index="2000" height="40px" class-name="content-tool">
        <div class="right-tools">
          <el-button link size="default" icon="el-icon-yrt-reset" @click="handleReset">重置</el-button>
          <el-button link size="default" icon="el-icon-tickets" @click="handleGenerateJson">查看</el-button>
          <el-button link size="default" icon="el-icon-yrt-baocun" @click="saveVue('save')">保存</el-button>
        </div>
      </sticky>

      <div class="content">
        <!-- <div :class="{ 'widget-empty': state.widgetFormData.fields.length == 0 }" style="min-height: 1200px">
					<widget-form ref="widgetForm" :data="state.widgetFormData" :v-model.sync="state.widgetFormSelect" :config-type.sync="state.configType" :detail-fields.sync="state.detailFields"></widget-form>
				</div> -->
      </div>
    </el-container>

    <cus-dialog ref="jsonPreview" :visible="state.jsonVisible" title="生成JSON并保存Vue文件" width="800px" form @on-close="state.jsonVisible = false">
      <div id="jsoneditor" style="height: 400px; width: 100%">{{ state.jsonData }}</div>
      <template slot="action">
        <el-button data-clipboard-target=".ace_text-input" @dblclick="proxy.$message.success('复制成功')">双击复制</el-button>
        <el-button :loading="state.createLoading" type="primary" data-clipboard-target=".ace_text-input" @click="saveVue('jsoneditor')">保存并生成Vue文件</el-button>
      </template>
    </cus-dialog>

    <cus-dialog ref="codePreview" :visible="state.codeVisible" title="生成页面" form width="800px" @on-close="state.codeVisible = false">
      <div id="codeeditor" style="height: 500px; width: 100%">{{ state.htmlTemplate }}</div>
      <template slot="action">
        <el-button id="closebtn" @click="state.codeVisible = false">关闭</el-button>
      </template>
    </cus-dialog>
  </el-container>
</template>

<script setup lang="ts" name="sys-dev-tools-layout-designer">
import { ComponentInternalInstance, getCurrentInstance, onMounted, reactive } from 'vue';
import { BaseProperties } from '/@/types/base-type';
import draggable from 'vuedraggable';
import widgetConfig from './widgetConfig.vue';
import widgetForm from './widgetForm.vue';
import cusDialog from './cusDialog.vue';
// import JSONEditor from 'jsoneditor'
// import 'jsoneditor/dist/jsoneditor.min.css'
// import Sticky from "@/components/sticky/index.vue";
import Sticky from '/@/components/sticky/index.vue';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
import { postData } from '/@/api/common/baseApi';
import to from 'await-to-js';

import { basicComponents, layoutComponents } from './componentsConfig.js';
import { loadJs } from './util/index.js';
import { generateMixinCode, generateMainCode } from './generateMixinCode.js';

//#region 定义变量
const state = reactive({
  basicComponents,
  layoutComponents,
  // 明细字段
  detailFields: [] as any[],

  // 当前配置参数设置组件
  configType: 'widgetConfig',

  // 模块tree prop参数配置
  moduleProps: {
    label: 'CnName',
    // children: "zones",
    isLeaf: function (data: any, node: any) {
      return data.hasChild !== 1;
    },
  },
  // 设计器数据结构
  widgetFormData: {
    fields: [],
    config: {
      labelWidth: '100px', // 标签文字宽度
      labelPosition: 'right', // 标签位置
      top: '3vh', // 对话框底部距离
      width: '1200px', // 对话框宽度
      visible: false, // 是否显示添加实验室对话框
      disabled: false, // 是否禁用
      title: null, // 对话框标题
      action: 'add', // 接收值为：add、edit
      formInline: false, // 行内表单
      saveButtonText: '保存',
    },
  },

  // 设计器类型：管理页面、编辑页面
  editRegionTab: 'widgetConfig',
  configTab: 'widget',
  widgetFormSelect: null, // 选中项
  previewVisible: false,
  jsonVisible: false,
  codeVisible: false,
  widgetModels: {},
  blank: '',
  htmlTemplate: '',
  jsonData: '', // 创建混入文件内容
  createLoading: false, // 创建页面loading
});
//#endregion
onMounted(() => {
  loadJs('https://auod-beijing.oss-cn-beijing.aliyuncs.com/ace/src-min-noconflict/ace.js');
  init();
});
const handleMoveEnd = (evt: any) => {};
const handleMoveStart = (evt: any) => {};
const handleMove = () => {
  return true;
};
// 预览设计
const handlePreview = () => {
  state.previewVisible = true;
};
// 重置，重新开始设计
const handleReset = () => {
  proxy
    .$confirm('确定要重置设计，将重新开始设计, 是否继续?', '重置提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(() => {
      reset();
      proxy.$message.error('重置成功');
    })
    .catch(() => {
      proxy.$message.error('已取消重置');
    });
};
const reset = () => {
  state.widgetFormData = Object.assign(
    {},
    {
      fields: [],
      config: {
        labelWidth: '100px', // 标签文字宽度
        labelPosition: 'right', // 标签位置
        top: '3vh', // 对话框底部距离
        width: '1200px', // 对话框宽度
        visible: false, // 是否显示添加实验室对话框
        disabled: false, // 是否禁用
        title: null, // 对话框标题
        action: 'add', // 接收值为：add、edit
        formInline: false, // 行内表单
        saveButtonText: '保存',
      },
    }
  );
  // 对话框标题名称
  state.configType = 'widgetConfig'; // 参数设置组件类型
  state.widgetFormSelect = null; // 编辑页面选中项
};
// 生成JSON
const handleGenerateJson = () => {
  state.jsonVisible = true;
  state.jsonData = generateMixinCode(state.widgetFormData);

  proxy.$nextTick(() => {
    // eslint-disable-next-line
    const editor = window.ace.edit('jsoneditor');
    editor.session.setMode('ace/mode/jsx');
  });
};
// 加载数据
const init = async () => {
  const url = '/system/dataHandler/layout/initLayout';
  const params = {};
  const [err, res] = await to(postData(url, params));
  if (err) {
    proxy.$message.error(err.message);
    return;
  }
  if (res.result) {
    state.widgetFormData = res.data;
  }
};
// 保存
const saveVue = async (type: any) => {
  var jsonData: string = '';
  if (type === 'jsoneditor') {
    // eslint-disable-next-line
    const editor = window.ace.edit('jsoneditor');
    jsonData = editor.getSelectedText();
    type = 'json';
  }

  // UI布局参数
  if (!jsonData) {
    jsonData = JSON.stringify(state.widgetFormData, null, 2);
  } else {
    state.widgetFormData = JSON.parse(jsonData);
  }
  if (!jsonData) {
    proxy.$message.error('没有可保存的数据！');
    return;
  }
  const mainCode = generateMainCode();

  state.createLoading = true;
  var url = '/system/dataHandler/layout/saveLayout';
  var params = {
    mainCode: mainCode,
    jsonData: jsonData,
    type: type,
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }
  if (res.result) {
    state.jsonVisible = false;
  }
  state.createLoading = false;
};
</script>

<style lang="scss">
@import './styles/cover.scss';
@import './styles/index.scss';
.content {
  ::v-deep .el-tabs__header {
    margin: 0 0 2px;
  }
}
</style>
