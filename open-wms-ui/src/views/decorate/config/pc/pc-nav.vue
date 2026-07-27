<!--轮播图 - 参数设置-->
<template>
  <div class="config-container">
    <h4>
      {{ config.title }}
    </h4>
    <el-tabs v-model="state.tabActive" class="tabs-container">
      <el-tab-pane label="内容设置" name="t1" class="tab-pane">
        <el-alert title="最多可添加20张图片，建议宽度90 * 90px" type="info" show-icon class="margin-bottom-10" :closable="false"></el-alert>
        <draggable :list="config.items" item-key="title" class="item-row" :animation="300" tag="el-row" :component-data="{ name: 'fade' }" handle=".col-icon" group="config" ghost-class="ghost-item" chosen-class="chosen-item" drag-class="drag-item">
          <template #item="{ element, index }">
            <el-row class="item-row">
              <el-col :span="22">
                <el-form ref="formRef" :model="element" label-width="80px">
                  <el-form-item label="图标">
                    <icon-selector v-model="element.icon" />
                  </el-form-item>
                  <el-form-item label="图标颜色">
                    <el-color-picker v-model="element.iconColor" :predefine="predefineColors" show-alpha />
                  </el-form-item>
                  <el-form-item label="标题">
                    <el-input v-model="element.name"></el-input>
                  </el-form-item>
                  <el-form-item label="连接">
                    <el-input v-model="element.url" class="w-100pc"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button @click="delItem(element, index)">删除</el-button>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="2" class="col-icon">
                <i class="iconfont icon-juzhong"></i>
              </el-col>
            </el-row>
          </template>
        </draggable>
        <el-button type="primary" plain class="w-100pc margin-top-10" @click="addItem">添加模块</el-button>
      </el-tab-pane>
      <el-tab-pane label="样式设置" name="t2" class="tab-pane">
        <el-form ref="formRef" :model="config.style" label-width="100px" @submit.prevent>
          <el-divider border-style="dashed">图标区域</el-divider>
          <el-form-item label="展示样式">
            <el-radio-group v-model="config.style.type" @change="typeChange">
              <el-radio-button label="单行展示"></el-radio-button>
              <el-radio-button label="多行展示"></el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="图标样式">
            <el-radio-group v-model="config.style.iconStyle">
              <el-radio-button label="方形"></el-radio-button>
              <el-radio-button label="圆形"></el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="图标大小">
                <el-input-number v-model="config.style.iconSize" :min="1" :max="200" controls-position="right" class="w-100pc" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="图标间距">
                <el-input-number v-model="config.style.iconMargin" :min="1" :max="200" controls-position="right" class="w-100pc" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="字体大小">
                <el-input-number v-model="config.style.fontSize" :min="1" :max="50" controls-position="right" class="w-100pc" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="字体颜色">
                <el-color-picker v-model="config.style.fontColor" :predefine="predefineColors" show-alpha />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="文字行高">
                <el-input-number v-model="config.style.lineHeight" :min="0" controls-position="right" class="w-100pc" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="内容区高度">
                <el-input-number v-model="config.style.contentHeight" :min="1" controls-position="right" class="w-100pc" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item v-if="config.style.type === '多行展示'" label="显示行数">
            <el-radio-group v-model.number="config.style.lineCount">
              <el-radio-button label="1">1行</el-radio-button>
              <el-radio-button label="2">2行</el-radio-button>
              <el-radio-button label="3">3行</el-radio-button>
              <el-radio-button label="4">4行</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="config.style.type === '多行展示'" label="每行个数">
            <el-radio-group v-model.number="config.style.showCount">
              <el-radio-button label="3">3个</el-radio-button>
              <el-radio-button label="4">4个</el-radio-button>
              <el-radio-button label="5">5个</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="config.style.type === '多行展示'" label="指示器样式">
            <el-radio-group v-model="config.style.indicatorStyle" @change="indicatorChange">
              <el-radio-button label="outside">长条</el-radio-button>
              <el-radio-button label="circle">圆形</el-radio-button>
              <el-radio-button label="none">无指示器</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="config.style.indicatorStyle !== 'none'" label="指示器颜色">
            <el-color-picker v-model="config.style.indicatorColor" show-alpha @change="indicatorChange" />
          </el-form-item>
          <el-form-item label="背景颜色">
            <el-color-picker v-model="config.style.bgColor" :predefine="predefineColors" show-alpha />
          </el-form-item>
          <el-form-item label="背景圆角半径">
            <el-row :gutter="5">
              <el-col :span="16" class="padding-left-5">
                <el-slider v-model.number="config.style.bgBorderRadius"></el-slider>
              </el-col>
              <el-col :span="8">
                <el-input-number controls-position="right" v-model.number="config.style.bgBorderRadius" class="w-100pc" :min="0" />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="背景外边距">
            <el-row :gutter="5">
              <el-col :span="16" class="padding-left-5">
                <el-slider v-model.number="config.style.bgMargin"></el-slider>
              </el-col>
              <el-col :span="8">
                <el-input-number controls-position="right" v-model.number="config.style.bgMargin" class="w-100pc" :min="0" />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="背景内边距">
            <el-row :gutter="5">
              <el-col :span="16" class="padding-left-5">
                <el-slider v-model.number="config.style.bgPadding"></el-slider>
              </el-col>
              <el-col :span="8">
                <el-input-number controls-position="right" v-model.number="config.style.bgPadding" class="w-100pc" :min="0" />
              </el-col>
            </el-row>
          </el-form-item>
          <el-divider border-style="dashed">模块样式</el-divider>
          <el-form-item label="显示悬停阴影">
            <el-checkbox v-model="config.style.boxShadow" />
          </el-form-item>
          <el-form-item label="边框颜色">
            <el-color-picker v-model="config.style.moduleBorderColor" :predefine="predefineColors" show-alpha />
          </el-form-item>
          <el-form-item label="边框粗细">
            <el-row :gutter="5">
              <el-col :span="16" class="padding-left-5">
                <el-slider v-model.number="config.style.moduleBorderWidth"></el-slider>
              </el-col>
              <el-col :span="8">
                <el-input-number controls-position="right" v-model.number="config.style.moduleBorderWidth" class="w-100pc" :min="0" />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="边框样式">
            <el-radio-group v-model.number="config.style.moduleBorderStyle">
              <el-radio-button label="dashed">虚线</el-radio-button>
              <el-radio-button label="solid">实线</el-radio-button>
              <el-radio-button label="dotted">点线</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="模块背景颜色">
            <el-color-picker v-model="config.style.moduleBgColor" :predefine="predefineColors" show-alpha />
          </el-form-item>
          <el-form-item label="背景圆角半径">
            <el-row :gutter="5">
              <el-col :span="16" class="padding-left-5">
                <el-slider v-model.number="config.style.moduleBorderRadius"></el-slider>
              </el-col>
              <el-col :span="8">
                <el-input-number controls-position="right" v-model.number="config.style.moduleBorderRadius" class="w-100pc" />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="外边距">
            <el-input-number controls-position="right" v-model.number="config.style.moduleMarginTop" :min="0" class="w-70" title="上边距" />
            <el-input-number controls-position="right" v-model.number="config.style.moduleMarginRight" :min="0" class="w-70" title="右边距" />
            <el-input-number controls-position="right" v-model.number="config.style.moduleMarginBottom" :min="0" class="w-70" title="下边距" />
            <el-input-number controls-position="right" v-model.number="config.style.moduleMarginLeft" :min="0" class="w-70" title="左边距" />
          </el-form-item>
          <el-form-item label="内边距">
            <el-input-number controls-position="right" v-model.number="config.style.modulePaddingTop" :min="0" class="w-70" title="上边距" />
            <el-input-number controls-position="right" v-model.number="config.style.modulePaddingRight" :min="0" class="w-70" title="右边距" />
            <el-input-number controls-position="right" v-model.number="config.style.modulePaddingBottom" :min="0" class="w-70" title="下边距" />
            <el-input-number controls-position="right" v-model.number="config.style.modulePaddingLeft" :min="0" class="w-70" title="左边距" />
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="头部设置" name="t3" class="tab-pane tab3">
        <el-divider border-style="dashed">数据设置</el-divider>
        <el-form ref="formRef" :model="config.header" label-width="100px">
          <el-form-item label="标题">
            <el-input v-model="config.header.title"></el-input>
          </el-form-item>
          <el-form-item label="副标题">
            <el-input v-model="config.header.subTitle"></el-input>
          </el-form-item>
          <el-form-item label="显示更多">
            <el-switch v-model="config.header.showMore" />
          </el-form-item>
          <el-form-item v-if="config.header.showMore" label="更多文字">
            <el-input v-model="config.header.moreText"></el-input>
          </el-form-item>
          <el-form-item v-if="config.header.showMore" label="更多连接">
            <el-input v-model="config.header.url">
              <template #suffix>
                <el-icon class="el-input__icon" @click="selectLink(config.header)">
                  <arrow-right />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
        </el-form>

        <el-divider border-style="dashed">样式设置</el-divider>
        <el-form ref="formRef" :model="config.header" label-width="100px" @submit.prevent>
          <el-form-item label="显示标题">
            <el-switch v-model="config.header.showHeader" />
          </el-form-item>
          <el-form-item label="文本位置">
            <el-radio-group v-model="config.header.align">
              <el-radio-button label="left">靠左</el-radio-button>
              <el-radio-button label="center">居中</el-radio-button>
              <el-radio-button label="right">靠右</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="背景颜色">
                <el-color-picker v-model="config.header.bgColor" :predefine="predefineColors" show-alpha />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="内背景颜色">
                <el-color-picker v-model="config.header.innerBgColor" :predefine="predefineColors" show-alpha />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="标题颜色">
                <el-color-picker v-model="config.header.titleColor" :predefine="predefineColors" show-alpha />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="副标题颜色">
                <el-color-picker v-model="config.header.subColor" :predefine="predefineColors" show-alpha />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="更多颜色">
                <el-color-picker v-model="config.header.moreColor" :predefine="predefineColors" show-alpha />
              </el-form-item>
            </el-col>
            <el-col :span="12"> </el-col>
          </el-row>
          <el-form-item label="字体大小">
            <el-row :gutter="5">
              <el-col :span="16" class="padding-left-5">
                <el-slider v-model.number="config.header.fontSize"></el-slider>
              </el-col>
              <el-col :span="8">
                <el-input-number controls-position="right" v-model.number="config.header.fontSize" :min="0" class="w-100pc" />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="行高">
            <el-row :gutter="5">
              <el-col :span="16" class="padding-left-5">
                <el-slider v-model.number="config.header.lineHeight"></el-slider>
              </el-col>
              <el-col :span="8">
                <el-input-number controls-position="right" v-model.number="config.header.lineHeight" :min="0" class="w-100pc" />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="圆角半径">
            <el-row :gutter="5">
              <el-col :span="16" class="padding-left-5">
                <el-slider v-model.number="config.header.borderRadius"></el-slider>
              </el-col>
              <el-col :span="8">
                <el-input-number controls-position="right" v-model.number="config.header.borderRadius" :min="0" class="w-100pc" />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="外边距">
            <el-row :gutter="5">
              <el-col :span="16" class="padding-left-5">
                <el-slider v-model.number="config.header.bgMargin"></el-slider>
              </el-col>
              <el-col :span="8">
                <el-input-number controls-position="right" v-model.number="config.header.bgMargin" :min="0" class="w-100pc" />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="内边距">
            <el-row :gutter="5">
              <el-col :span="16" class="padding-left-5">
                <el-slider v-model.number="config.header.bgPadding"></el-slider>
              </el-col>
              <el-col :span="8">
                <el-input-number controls-position="right" v-model.number="config.header.bgPadding" :min="0" class="w-100pc" />
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <!--文件选择器-->
    <filer-dialog v-model="state.filerVisible" single-select is-viewer></filer-dialog>
    <!--链接选择器-->
    <linker-dialog v-model="state.linkerVisible" single-select is-viewer></linker-dialog>
  </div>
</template>

<script setup lang="ts" name="pc-nav-config">
import { reactive, toRefs, onMounted, onUnmounted, nextTick, getCurrentInstance } from 'vue';
import draggable from 'vuedraggable';
('vuedraggable');
import filerDialog from '/@/components/base/filer-dialog.vue';
import linkerDialog from '/@/components/linker/linker-dialog.vue';
import { ArrowRight } from '@element-plus/icons-vue';
import { predefineColors } from '/@/utils/commonFunction';
import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
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
      return {
        items: [],
      };
    },
  },
});
//#endregion

//#region 属性
const state = reactive({
  tabActive: 't1', // 左侧tab导航
  formData: {}, // 参数设置
  configComponent: null, // 参数配置
  filerVisible: false, // 显示文件选择器
  linkerVisible: false, // 链接选择器
  // 预选颜色
  predefineColors: predefineColors,
  currentItem: null as any,
});
//#endregion

//#region 方法
const addItem = () => {
  if (!Array.isArray(props.config.items)) {
    props.config.items = [];
  }
  props.config.items.push({
    image: '',
    title: '',
    url: '',
  });
};

// 删除项
const delItem = (element: any, index: number) => {
  if (props.config.items.length === 1) {
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
      props.config.items.splice(index, 1);
    })
    .catch(() => {
      proxy.$message.info('已取消');
    });
};

// 选择文件
const selectFile = (item: any) => {
  state.currentItem = item;
  state.filerVisible = true;
};

// 选择连接
const selectLink = (item?: any) => {
  state.currentItem = item;
  state.linkerVisible = true;
};

// 类型改变
const typeChange = () => {
  // 触发样式事件
  proxy.mittBus.emit('onNavGroup:typeChange', {});
};

// 指示器改变
const indicatorChange = () => {
  // 触发指示器事件
  proxy.mittBus.emit('onNavGroup:indicatorChange', {});
};

// 清除图片
const clearImage = () => {
  props.config.header.image = null;
};
//#endregion

// 页面加载事件
onMounted(async () => {
  // 响应选中文件事件
  proxy.mittBus.on('onSelectFile', (item: any) => {
    if (item) {
      state.currentItem.image = item.url;
      state.filerVisible = false;
    }
  });
  // 响应选择链接事件
  proxy.mittBus.on('onSelectLink', (item: any) => {
    if (item) {
      state.currentItem.url = item.url;
      state.linkerVisible = false;
    }
  });
});

// 页面卸载事件
onUnmounted(() => {
  // 卸载选中文件事件
  proxy.mittBus.off('onSelectFile');
  // 卸载选择链接事件
  proxy.mittBus.off('onSelectLink');
});
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
      width: 100%;
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
      .img {
        width: 80px;
        height: 80px;
        cursor: pointer;
      }
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
  .tab3 {
    :deep(.el-radio-button__inner) {
      padding: 8px 8px;
    }
    .img {
      width: 80px;
      height: 80px;
      cursor: pointer;
    }
    .image-slot {
      background-color: var(--el-bg-color);
      height: 100%;
      text-align: center;
      color: var(--color-info-light-1);
      line-height: 80px;
      cursor: pointer;
    }
  }
  :deep(.el-tabs__header) {
    margin-bottom: 10px;
  }
  :deep(.el-tabs__item) {
    width: 133.3333px;
    text-align: center;
  }
  :deep(.el-collapse-item__header) {
    padding-left: 10px;
    font-weight: bolder;
  }
  :deep(.el-collapse-item__content) {
    padding: 10px;
  }
  :deep(.el-form-item--small) {
    margin-bottom: 10px;
  }
  :deep(.el-input-number.is-controls-right .el-input__inner) {
    padding-left: 3px;
    padding-right: 5px;
  }
  .badge {
    cursor: pointer;
  }
}
</style>
