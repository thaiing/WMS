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
            <el-divider content-position="left">栅格参数</el-divider>
            <el-form-item label="栅格间距">
              <el-input v-model.number="config.options.gutter"></el-input>
            </el-form-item>
            <el-form-item label="列配置项">
              <draggable :list="config.columns" item-key="key" tag="ul" group="options" ghost-class="ghost-item" chosen-class="chosen-item" drag-class="drag-item" class="grid-list">
                <template #item="{ element, index }">
                  <li>
                    <i class="drag-item el-icon-yrt-yidong1" style="font-size: 16px; margin: 0 5px; cursor: move"></i>
                    <el-input v-model.number="element.span" placeholder="栅格值" size="small" style="width: 100px" type="number"></el-input>
                    <el-button circle plain type="danger" size="small" style="padding: 4px; margin-left: 5px; height: 24px" @click="handleOptionsRemove(index)">
                      <svg-icon name="icon-icon_cut" :size="10"></svg-icon>
                    </el-button>
                  </li>
                </template>
              </draggable>
              <div style="margin-left: 22px">
                <el-button link @click="handleAddColumn">添加列</el-button>
              </div>
            </el-form-item>
            <el-form-item label="水平排列方式">
              <el-select v-model="config.options.justify" class="w-100pc">
                <el-option value="start" label="左对齐"></el-option>
                <el-option value="end" label="右对齐"></el-option>
                <el-option value="center" label="居中"></el-option>
                <el-option value="space-around" label="两侧间隔相等"></el-option>
                <el-option value="space-between" label="两端对齐"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="垂直排列方式">
              <el-select v-model="config.options.align" class="w-100pc">
                <el-option value="top" label="顶部对齐"></el-option>
                <el-option value="middle" label="居中"></el-option>
                <el-option value="bottom" label="底部对齐"></el-option>
              </el-select>
            </el-form-item>
          </div>

          <div class="block-group">
            <el-divider content-position="left">列参数</el-divider>
            <el-radio-group v-model="state.currentColumnIndex" class="mb-10" @change="radioChange">
              <template v-for="(item, index) in config.columns">
                <el-radio-button :label="index" />
              </template>
            </el-radio-group>

            <el-form ref="formRef" :model="state.currentItem.field" label-width="100px" class="item-column">
              <el-divider content-position="left">第 {{ state.currentColumnIndex + 1 }} 数据</el-divider>
              <el-form-item label="标题">
                <el-input v-model="state.currentItem.field.num1"></el-input>
              </el-form-item>
              <el-form-item label="副标题">
                <el-input v-model="state.currentItem.field.num2"></el-input>
              </el-form-item>
              <el-form-item label="百分比颜色">
                <el-color-picker v-model="state.currentItem.field.num2Color" :predefine="predefineColors" show-alpha />
              </el-form-item>
              <el-form-item label="内容">
                <el-input v-model="state.currentItem.field.title"></el-input>
              </el-form-item>

              <el-divider content-position="left">右侧图标</el-divider>
              <el-form-item label="图标">
                <icon-selector v-model="state.currentItem.field.icon" />
              </el-form-item>
              <el-form-item label="图标颜色">
                <el-color-picker v-model="state.currentItem.field.iconColor" :predefine="predefineColors" show-alpha />
              </el-form-item>
              <el-form-item label="图标背景">
                <el-color-picker v-model="state.currentItem.field.iconBackgroundColor" :predefine="predefineColors" show-alpha />
              </el-form-item>
              <el-form-item label="图标大小">
                <el-row :gutter="5">
                  <el-col :span="16" class="padding-left-5">
                    <el-slider v-model.number="state.currentItem.field.iconFontSize"></el-slider>
                  </el-col>
                  <el-col :span="8">
                    <el-input-number controls-position="right" v-model.number="state.currentItem.field.iconFontSize" :min="0" class="w-100pc" />
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="图标外框宽度">
                <el-row :gutter="5">
                  <el-col :span="16" class="padding-left-5">
                    <el-slider v-model.number="state.currentItem.field.iconWidth"></el-slider>
                  </el-col>
                  <el-col :span="8">
                    <el-input-number controls-position="right" v-model.number="state.currentItem.field.iconWidth" :min="0" class="w-100pc" />
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="图标外框高度">
                <el-row :gutter="5">
                  <el-col :span="16" class="padding-left-5">
                    <el-slider v-model.number="state.currentItem.field.iconHeight"></el-slider>
                  </el-col>
                  <el-col :span="8">
                    <el-input-number controls-position="right" v-model.number="state.currentItem.field.iconHeight" :min="0" class="w-100pc" />
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="图标内边距">
                <el-row :gutter="5">
                  <el-col :span="16" class="padding-left-5">
                    <el-slider v-model.number="state.currentItem.field.iconPadding"></el-slider>
                  </el-col>
                  <el-col :span="8">
                    <el-input-number controls-position="right" v-model.number="state.currentItem.field.iconPadding" :min="0" class="w-100pc" />
                  </el-col>
                </el-row>
              </el-form-item>

              <el-divider content-position="left">列样式</el-divider>
              <el-form-item label="背景圆角半径">
                <el-row :gutter="5">
                  <el-col :span="16" class="padding-left-5">
                    <el-slider v-model.number="state.currentItem.field.iconBorderRadius"></el-slider>
                  </el-col>
                  <el-col :span="8">
                    <el-input-number controls-position="right" v-model.number="state.currentItem.field.iconBorderRadius" :min="0" class="w-100pc" />
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="内边距">
                <el-input v-model="state.currentItem.field.padding" />
              </el-form-item>
              <el-form-item label="列背景色">
                <el-color-picker v-model="state.currentItem.field.backgroundColor" :predefine="predefineColors" show-alpha />
              </el-form-item>
              <el-form-item label="边框粗细">
                <el-row :gutter="5">
                  <el-col :span="16" class="padding-left-5">
                    <el-slider v-model.number="state.currentItem.field.borderWidth"></el-slider>
                  </el-col>
                  <el-col :span="8">
                    <el-input-number controls-position="right" v-model.number="state.currentItem.field.borderWidth" :min="0" class="w-100pc" />
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="边框颜色">
                <el-color-picker v-model="state.currentItem.field.borderColor" :predefine="predefineColors" show-alpha />
              </el-form-item>
              <el-form-item label="边框样式">
                <el-select v-model="state.currentItem.field.borderStyle" placeholder="选择边框样式" style="width: 100%">
                  <el-option label="无边框" value="none" />
                  <el-option label="实线边框" value="solid" />
                  <el-option label="点状边框" value="dotted" />
                  <el-option label="虚线边框" value="dashed" />
                  <el-option label="双实线边框" value="double" />
                  <el-option label="隐藏边框" value="hidden" />
                </el-select>
              </el-form-item>
              <el-form-item label="圆角半径">
                <el-row :gutter="5">
                  <el-col :span="16" class="padding-left-5">
                    <el-slider v-model.number="state.currentItem.field.borderRadius"></el-slider>
                  </el-col>
                  <el-col :span="8">
                    <el-input-number controls-position="right" v-model.number="state.currentItem.field.borderRadius" :min="0" class="w-100pc" />
                  </el-col>
                </el-row>
              </el-form-item>
            </el-form>
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
  currentItem: {
    field: {},
  } as any,
  currentColumnIndex: 0,
});

//#region 方法
const handleAddColumn = () => {
  props.config.columns.push({
    span: '',
    fields: [],
  });
};

const handleOptionsRemove = (index: any) => {
  if (props.config.type === 'u-grid') {
    props.config.columns.splice(index, 1);
  }
};

const init = () => {
  state.currentItem = {
    field: {},
  };
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
  background-color: #fff;
  padding: 5px 5px;
  margin-bottom: 10px;
  border: 1px solid #d1d1d1;
}
</style>
