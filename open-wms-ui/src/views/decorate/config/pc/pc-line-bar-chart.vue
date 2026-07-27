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
            <el-divider content-position="left">左侧数据</el-divider>
            <el-form-item label="数字">
              <el-input v-model.number="config.content.num1"></el-input>
            </el-form-item>
            <el-form-item label="百分比">
              <el-input v-model.number="config.content.num2"></el-input>
            </el-form-item>
            <el-form-item label="百分比颜色">
              <el-color-picker v-model="config.content.num2Color" :predefine="predefineColors" show-alpha />
            </el-form-item>
            <el-form-item label="标题">
              <el-input v-model="config.content.title"></el-input>
            </el-form-item>
          </div>

          <div class="block-group">
            <el-divider content-position="left">右侧图标</el-divider>
            <el-form-item label="图标">
              <icon-selector v-model="config.content.icon" />
            </el-form-item>
            <el-form-item label="图标颜色">
              <el-color-picker v-model="config.content.iconColor" :predefine="predefineColors" show-alpha />
            </el-form-item>
            <el-form-item label="图标背景">
              <el-color-picker v-model="config.content.iconBackgroundColor" :predefine="predefineColors" show-alpha />
            </el-form-item>
            <el-form-item label="图标大小">
              <el-row :gutter="5">
                <el-col :span="16" class="padding-left-5">
                  <el-slider v-model.number="config.content.iconFontSize"></el-slider>
                </el-col>
                <el-col :span="8">
                  <el-input-number controls-position="right" v-model.number="config.content.iconFontSize" :min="0" class="w-100pc" />
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="图标外框宽度">
              <el-row :gutter="5">
                <el-col :span="16" class="padding-left-5">
                  <el-slider v-model.number="config.content.iconWidth"></el-slider>
                </el-col>
                <el-col :span="8">
                  <el-input-number controls-position="right" v-model.number="config.content.iconWidth" :min="0" class="w-100pc" />
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="图标外框高度">
              <el-row :gutter="5">
                <el-col :span="16" class="padding-left-5">
                  <el-slider v-model.number="config.content.iconHeight"></el-slider>
                </el-col>
                <el-col :span="8">
                  <el-input-number controls-position="right" v-model.number="config.content.iconHeight" :min="0" class="w-100pc" />
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="图标内边距">
              <el-row :gutter="5">
                <el-col :span="16" class="padding-left-5">
                  <el-slider v-model.number="config.content.iconPadding"></el-slider>
                </el-col>
                <el-col :span="8">
                  <el-input-number controls-position="right" v-model.number="config.content.iconPadding" :min="0" class="w-100pc" />
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="背景圆角半径">
              <el-row :gutter="5">
                <el-col :span="16" class="padding-left-5">
                  <el-slider v-model.number="config.content.iconBorderRadius"></el-slider>
                </el-col>
                <el-col :span="8">
                  <el-input-number controls-position="right" v-model.number="config.content.iconBorderRadius" :min="0" class="w-100pc" />
                </el-col>
              </el-row>
            </el-form-item>
          </div>

          <div class="block-group">
            <el-divider content-position="left">接口地址</el-divider>
            <el-form-item label="开启接口">
              <el-checkbox v-model="config.content.openApi"></el-checkbox>
            </el-form-item>
            <el-form-item label="接口地址">
              <el-input v-model="config.content.apiUrl" />
            </el-form-item>
          </div>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="样式设置" name="t2" class="tab-pane">
        <el-form ref="formRef" :model="config.style" label-width="100px" @submit.prevent>
          <el-form-item label="文本位置">
            <el-radio-group v-model="config.style.align">
              <el-radio-button label="left">靠左</el-radio-button>
              <el-radio-button label="center">居中</el-radio-button>
              <el-radio-button label="right">靠右</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="外背景颜色">
            <el-color-picker v-model="config.style.bgColor" :predefine="predefineColors" show-alpha />
          </el-form-item>
          <el-form-item label="内背景颜色">
            <el-color-picker v-model="config.style.innerBgColor" :predefine="predefineColors" show-alpha />
          </el-form-item>
          <el-form-item label="内边框粗细">
            <el-row :gutter="5">
              <el-col :span="16" class="padding-left-5">
                <el-slider v-model.number="config.style.innerBorderWidth"></el-slider>
              </el-col>
              <el-col :span="8">
                <el-input-number controls-position="right" v-model.number="config.style.innerBorderWidth" :min="0" class="w-100pc" />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="内边框颜色">
            <el-color-picker v-model="config.style.innerBorderColor" :predefine="predefineColors" show-alpha />
          </el-form-item>
          <el-form-item label="内边框样式">
            <el-select v-model="config.style.innerBorderStyle" placeholder="选择边框样式" style="width: 100%">
              <el-option label="无边框" value="none" />
              <el-option label="实线边框" value="solid" />
              <el-option label="点状边框" value="dotted" />
              <el-option label="虚线边框" value="dashed" />
              <el-option label="双实线边框" value="double" />
              <el-option label="隐藏边框" value="hidden" />
            </el-select>
          </el-form-item>
          <el-form-item label="内边圆角半径">
            <el-row :gutter="5">
              <el-col :span="16" class="padding-left-5">
                <el-slider v-model.number="config.style.borderRadius"></el-slider>
              </el-col>
              <el-col :span="8">
                <el-input-number controls-position="right" v-model.number="config.style.borderRadius" :min="0" class="w-100pc" />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="显示悬停阴影">
            <el-checkbox v-model="config.style.boxShadow" />
          </el-form-item>

          <el-form-item label="文字颜色">
            <el-color-picker v-model="config.style.color" :predefine="predefineColors" show-alpha />
          </el-form-item>
          <el-form-item label="字体大小">
            <el-row :gutter="5">
              <el-col :span="16" class="padding-left-5">
                <el-slider v-model.number="config.style.fontSize"></el-slider>
              </el-col>
              <el-col :span="8">
                <el-input-number controls-position="right" v-model.number="config.style.fontSize" :min="0" class="w-100pc" />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="背景外边距">
            <el-input v-model="config.style.bgMargin" />
          </el-form-item>
          <el-form-item label="背景内边距">
            <el-input v-model="config.style.bgPadding" />
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts" name="pc-stat-config">
import { reactive, toRefs, onMounted, onUnmounted, nextTick, getCurrentInstance } from 'vue';
import { predefineColors } from '/@/utils/commonFunction';
import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
import pcHeader from '../components/pc-header.vue';
// 引入图标组件
const IconSelector = defineAsyncComponent(() => import('/@/components/iconSelector/index.vue'));

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
  currentItem: null as any,
});

// 页面加载事件
onMounted(async () => {});
</script>

<style lang="scss" scoped>
.config-container {
  position: fixed;
  right: 0;
  top: 53px;
  bottom: 0;
  width: 400px;
  background-color: var(--color-whites);
  h4 {
    padding: 10px;
    border-bottom: 1px solid var(--el-border-color-light);
  }
}

.tabs-container {
  .tab-pane {
    overflow-x: hidden;
    overflow-y: auto;
    height: calc(100vh - 144px);
    padding: 0 10px 10px 5px;
    &::-webkit-scrollbar {
      width: 4px;
      background: transparent;
    }
    // 滑槽背景色
    &::-webkit-scrollbar-track-piece {
      width: 4px;
      background-color: var(--el-color-white);
    }
    // 滚动条样式
    &::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background: transparent;
    }
    &:hover {
      &::-webkit-scrollbar-thumb {
        border-radius: 4px;
        background: #ccc;
      }
    }
    &::-webkit-scrollbar-thumb:hover {
      background: #ccc;
    }
    &::-webkit-scrollbar-thumb:active {
      background: rgb(175, 174, 174);
    }
    // 浏览器失焦的样式
    &::-webkit-scrollbar-thumb:window-inactive {
      background: rgba(230, 230, 230, 0.4);
    }

    .item-row {
      padding-bottom: 10px;
      margin-bottom: 10px;
      border-bottom: 1px solid var(--el-border-color-light);
      .col-icon {
        text-align: center;
        padding-top: 10px;
        color: var(--el-text-color-regular);
        cursor: move;
      }
      :deep(.el-badge__content) {
        height: 16px;
        line-height: 13.5px;
        cursor: pointer;
      }
      .el-input__icon {
        margin-top: 2px;
        cursor: pointer;
      }
    }
  }
  :deep(.el-tabs__header) {
    margin-bottom: 10px;
  }
  :deep(.el-tabs__item) {
    width: 200px;
    text-align: center;
  }
  :deep(.el-collapse-item__header) {
    padding-left: 10px;
    font-weight: bolder;
  }
  :deep(.el-collapse-item__content) {
    padding: 10px;
  }
  .badge {
    cursor: pointer;
  }
  .img {
    height: 36px;
    cursor: pointer;
    margin-bottom: 10px;
    .image-slot {
      background-color: var(--el-bg-color);
      height: 100%;
      text-align: center;
      color: var(--color-info-light-1);
      line-height: 100px;
      cursor: pointer;
    }
  }
}
</style>
