<!--轮播图 - 参数设置-->
<template>
  <div class="config-container">
    <h4>
      {{ config.title }}
    </h4>
    <el-tabs v-model="state.tabActive" class="tabs-container">
      <el-tab-pane label="内容设置" name="t1" class="tab-pane">
        <el-form ref="formRef" :model="config" label-width="100px">
          <pc-header :config="config" :is-viewer="isViewer"></pc-header>

          <div class="block-group">
            <el-divider content-position="left">列参数</el-divider>
            <el-radio-group v-model="state.currentColumnIndex" class="mb-10" @change="radioChange">
              <template v-for="(item, index) in config.columns">
                <el-radio-button :label="index" />
              </template>
            </el-radio-group>

            <el-form ref="formRef" :model="state.currentItem" label-width="90px" class="item-column">
              <el-form-item label="主标题1">
                <el-input v-model="state.currentItem.name" style="width: 40%; margin-right: 5px"></el-input>
                <el-input v-model="state.currentItem.nameFontSize" style="width: 25%; margin-right: 10px" placeholder="字体大小"></el-input>
                <el-color-picker v-model="state.currentItem.nameColor" :predefine="predefineColors" show-alpha />
              </el-form-item>
              <el-form-item label="主标题2">
                <el-input v-model="state.currentItem.name2" style="width: 40%; margin-right: 5px"></el-input>
                <el-input v-model="state.currentItem.name2FontSize" style="width: 25%; margin-right: 10px" placeholder="字体大小"></el-input>
                <el-color-picker v-model="state.currentItem.name2BgColor" :predefine="predefineColors" show-alpha />
                <el-color-picker v-model="state.currentItem.name2Color" :predefine="predefineColors" show-alpha />
              </el-form-item>
              <el-form-item label="副标题1">
                <el-input v-model="state.currentItem.subName1" style="width: 40%; margin-right: 5px"></el-input>
                <el-input v-model="state.currentItem.subName1FontSize" style="width: 25%; margin-right: 10px" placeholder="字体大小"></el-input>
                <el-color-picker v-model="state.currentItem.subName1Color" :predefine="predefineColors" show-alpha />
              </el-form-item>
              <el-form-item label="副标题2">
                <el-input v-model="state.currentItem.subName2" style="width: 40%; margin-right: 5px"></el-input>
                <el-input v-model="state.currentItem.subName2FontSize" style="width: 25%; margin-right: 10px" placeholder="字体大小"></el-input>
                <el-color-picker v-model="state.currentItem.subName2Color" :predefine="predefineColors" show-alpha />
              </el-form-item>
              <el-row :gutter="5">
                <el-col :span="12" class="padding-left-5">
                  <el-form-item label="内边距">
                    <el-input v-model="state.currentItem.padding" style="width: 100%"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="外边距">
                    <el-input v-model="state.currentItem.margin" style="width: 100%"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="12" class="padding-left-5">
                  <el-form-item label="主标题高度">
                    <el-input v-model="state.currentItem.nameLineHeight" style="width: 100%"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="副标题高度">
                    <el-input v-model="state.currentItem.subNameLineHeight" style="width: 100%"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="12" class="padding-left-5">
                  <el-form-item label="内容高度">
                    <el-input v-model="state.currentItem.contentLineHeight" style="width: 100%"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12"> </el-col>
              </el-row>
              <div class="column-row-group">
                <div class="column-row-header">内容行设置</div>
                <draggable :list="state.currentItem.rows" item-key="title" class="column-rows-box" :animation="300" tag="div" :component-data="{ name: 'fade' }" handle=".cursor-move" group="config" ghost-class="ghost-item" chosen-class="chosen-item" drag-class="drag-item">
                  <template #item="row">
                    <el-form ref="formRef" :model="row.element" label-width="100px" class="column-row">
                      <el-form-item label="标题">
                        <el-input v-model="row.element.title" style="width: 40%; margin-right: 5px"></el-input>
                        <el-input v-model="row.element.titleFontSize" style="width: 30%; margin-right: 10px" placeholder="字体大小"></el-input>
                        <el-color-picker v-model="row.element.titleColor" :predefine="predefineColors" show-alpha />
                      </el-form-item>
                      <el-form-item label="值">
                        <el-input v-model="row.element.value" style="width: 40%; margin-right: 5px"></el-input>
                        <el-input v-model="row.element.valueFontSize" style="width: 30%; margin-right: 10px" placeholder="字体大小"></el-input>
                        <el-color-picker v-model="row.element.valueColor" :predefine="predefineColors" show-alpha />
                      </el-form-item>
                      <el-form-item :label-width="12">
                        <el-button @click="delColumnRow(state.currentItem.rows, state.currentColumnIndex)">删除行</el-button>
                      </el-form-item>
                    </el-form>
                  </template>
                </draggable>
                <div class="column-row-footer">
                  <el-button type="primary" plain class="w-100pc margin-top-10" @click="addColumnRow(state.currentItem)">添加内容行</el-button>
                </div>
              </div>
              <el-form-item :label-width="12">
                <el-button @click="delItem(state.currentItem, state.currentColumnIndex)">删除列</el-button>
              </el-form-item>
            </el-form>

            <el-button type="primary" plain class="w-100pc margin-top-10" @click="addItem">添加列</el-button>
          </div>

          <div class="block-group">
            <el-divider content-position="left">接口地址</el-divider>
            <el-form-item label="开启接口">
              <el-checkbox v-model="config.api.openApi"></el-checkbox>
            </el-form-item>
            <el-form-item label="接口地址">
              <el-input v-model="config.api.apiUrl" />
            </el-form-item>
          </div>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="样式设置" name="t2" class="tab-pane">
        <el-form ref="formRef" :model="config.style" label-width="100px" @submit.prevent>
          <pc-style :config="config" :is-viewer="isViewer"></pc-style>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts" name="pc-stat-config">
import { reactive, toRefs, onMounted, onUnmounted, nextTick, getCurrentInstance } from 'vue';
import draggable from 'vuedraggable';
import { predefineColors } from '/@/utils/commonFunction';
import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
import pcHeader from '../components/pc-header.vue';
import pcStyle from '../components/pc-style.vue';

let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

//#region 定义属性
const props = defineProps({
  // 配置参数
  config: {
    type: Object,
    default: () => {
      return {};
    },
  },
  // 预览模式
  isViewer: {
    type: Boolean,
    default: false,
  },
});
//#endregion

const state = reactive({
  tabActive: 't1', // 左侧tab导航
  formData: {}, // 参数设置
  configComponent: null, // 参数配置
  filerVisible: false, // 显示文件选择器
  linkerVisible: false, // 链接选择器
  predefineColors,
  currentItem: {} as any,
  currentColumnIndex: 0,
});

//#region 方法
const addItem = () => {
  if (!Array.isArray(props.config.columns)) {
    props.config.columns = [];
  }
  props.config.columns.push({
    name: '列标题',
    subName1: '子标题1',
    subName2: '子标题2',
    nameFontSize: '22px',
    subName1FontSize: '20px',
    subName2FontSize: '18px',
    rows: [
      {
        title: '标题',
        value: '25.5%',
        titleColor: '#010101',
        titleFontSize: 14,
        valueColor: '#ff0000',
        valueFontSize: 14,
      },
    ],
  });
};

// 删除项
const delItem = (element: any, index: number) => {
  if (props.config.columns.length === 1) {
    proxy.$message.error('至少保留一项！');
    return;
  }

  proxy
    .$confirm('确定要删除选定项吗, 是否继续?', '确定删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(() => {
      props.config.columns.splice(index, 1);
      init();
    })
    .catch(() => {
      proxy.$message.info('已取消');
    });
};

// 添加内容行
const addColumnRow = (column: any) => {
  if (!column.rows) {
    column.rows = [];
  }
  column.rows.push({
    title: '标题',
    value: '25.5%',
    titleColor: '#010101',
    titleFontSize: 14,
    valueColor: '#ff0000',
    valueFontSize: 14,
  });
};

// 删除内容行
const delColumnRow = (rows: any[], index: number) => {
  proxy
    .$confirm('确定要删除选定项吗, 是否继续?', '确定删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(() => {
      rows.splice(index, 1);
    })
    .catch(() => {
      proxy.$message.info('已取消');
    });
};

const init = () => {
  state.currentItem = {};
  if (props.config.columns.length > 0) {
    state.currentItem = props.config.columns[0];
  }
};

// 列改变
const radioChange = () => {
  state.currentItem = props.config.columns[state.currentColumnIndex];
};
//#endregion

// 页面加载事件
onMounted(async () => {
  init();
});
</script>

<style lang="scss" scoped>
@import '../scss/config.scss';
.item-column {
  border: 1px solid #1a83fc;
  padding: 5px;
  margin-bottom: 10px;
  background-color: #1a83fc23;
}
.column-row-group {
  background-color: #fefefe;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #5cbd02;
  background-color: #5cbd0218;
  .column-row-header {
    padding-bottom: 5px;
    margin-bottom: 10px;
    border-bottom: 1px solid #9b9b9b;
  }
  .column-row {
    border-bottom: 1px solid #cecece;
    margin-bottom: 10px;
  }
}
</style>
