<!--轮播图 - 参数设置-->
<template>
  <div class="config-container">
    <h4>
      {{ config.title }}
    </h4>
    <el-tabs v-model="tabActive" class="tabs-container">
      <el-tab-pane label="内容设置" name="t1" class="tab-pane">
        <el-alert title="最多可添加10条；鼠标拖拽左侧圆点可调整版块顺序" type="info" show-icon class="margin-bottom-10" :closable="false"></el-alert>

        <draggable :list="config.items" item-key="title" class="item-row" :animation="300" tag="div" :component-data="{ name: 'fade' }" handle=".col-icon" group="config" ghost-class="ghost-item" chosen-class="chosen-item" drag-class="drag-item">
          <template #item="{ element, index }">
            <el-row class="item-row">
              <el-col :span="2" class="col-icon">
                <i class="iconfont el-icon-yrt-juzhong"></i>
              </el-col>
              <el-col :span="22">
                <el-form ref="formRef" :model="element" label-width="60px">
                  <el-form-item label="标题">
                    <el-badge value="x" type="primary" class="w-100pc" @click.stop.prevent="delItem(element, index)">
                      <el-input v-model="element.title" @click.stop.prevent></el-input>
                    </el-badge>
                  </el-form-item>
                  <el-form-item label="数字">
                    <el-input v-model="element.number" @click.stop.prevent></el-input>
                  </el-form-item>
                  <el-form-item label="连接">
                    <el-input v-model="element.url">
                      <template #suffix>
                        <el-icon class="el-input__icon" @click="selectLink(element)">
                          <arrow-right />
                        </el-icon>
                      </template>
                    </el-input>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
          </template>
        </draggable>
        <el-button type="primary" plain class="w-100pc margin-top-10" @click="addItem">添加项</el-button>
      </el-tab-pane>
      <el-tab-pane label="样式设置" name="t2" class="tab-pane">
        <el-form ref="formRef" :model="config.style" label-width="100px" @submit.prevent>
          <el-divider border-style="dashed">内容样式</el-divider>
          <el-row>
            <el-col :span="12">
              <el-form-item label="数字大小">
                <el-input-number v-model="config.style.numFontSize" :min="1" :max="50" controls-position="right" class="w-100pc" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="数字颜色">
                <el-color-picker v-model="config.style.numFontColor" :predefine="predefineColors" show-alpha />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="文字大小">
                <el-input-number v-model="config.style.fontSize" :min="1" :max="50" controls-position="right" class="w-100pc" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="文字颜色">
                <el-color-picker v-model="config.style.fontColor" :predefine="predefineColors" show-alpha />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="背景颜色">
            <el-color-picker v-model="config.style.headerBgColor" show-alpha />
          </el-form-item>
          <el-form-item label="背景图片">
            <el-badge value="x" type="primary" class="badge" @click.stop.prevent="clearImage('headerBgImage')">
              <el-image class="img" :src="config.style.headerBgImage" :initial-index="1" fit="contain" @click.stop.prevent="selectFile('headerBgImage')">
                <template #error>
                  <div class="image-slot" @click.stop.prevent="selectFile('headerBgImage')">无图</div>
                </template>
              </el-image>
            </el-badge>
          </el-form-item>
          <el-divider border-style="dashed">模块样式</el-divider>
          <el-form-item label="背景颜色">
            <el-color-picker v-model="config.style.moduleBgColor" show-alpha />
          </el-form-item>
          <el-form-item label="背景图片">
            <el-badge value="x" type="primary" class="badge" @click.stop.prevent="clearImage('moduleBgImage')">
              <el-image class="img" :src="config.style.moduleBgImage" :initial-index="1" fit="contain" @click.stop.prevent="selectFile('moduleBgImage')">
                <template #error>
                  <div class="image-slot" @click.stop.prevent="selectFile('moduleBgImage')">无图</div>
                </template>
              </el-image>
            </el-badge>
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
          <el-form-item label="圆角半径">
            <el-row :gutter="5">
              <el-col :span="16" class="padding-left-5">
                <el-slider v-model.number="config.style.moduleborderRadius"></el-slider>
              </el-col>
              <el-col :span="8">
                <el-input-number controls-position="right" v-model.number="config.style.moduleborderRadius" :min="0" class="w-100pc" />
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
    </el-tabs>

    <!--文件选择器-->
    <filer-dialog v-model="filerVisible" single-select is-viewer></filer-dialog>
    <!--链接选择器-->
    <linker-dialog v-model="linkerVisible" single-select is-viewer></linker-dialog>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, onMounted, onUnmounted, nextTick, getCurrentInstance } from 'vue';
import draggable from 'vuedraggable';
('vuedraggable');
import filerDialog from '/@/components/base/filer-dialog.vue';
import linkerDialog from '/@/components/linker/linker-dialog.vue';
import { ArrowRight } from '@element-plus/icons-vue';
import { predefineColors } from '/@/utils/commonFunction';

export default {
  name: 'app-design-left-panel',
  components: {
    draggable,
    filerDialog,
    linkerDialog,
    ArrowRight,
  },
  props: {
    config: {
      type: Object, // 选中项
      default: () => {
        return {
          items: [],
        };
      },
    },
  },
  setup() {
    const { proxy } = getCurrentInstance() as any;
    const state = reactive({
      tabActive: 't1', // 左侧tab导航
      formData: {}, // 参数设置
      configComponent: null, // 参数配置
      filerVisible: false, // 显示文件选择器
      linkerVisible: false, // 链接选择器
      currentImageField: null, // 当前选中图片字段
      predefineColors: predefineColors, // 预选颜色
    });

    //#region 方法
    let method = {
      addItem() {
        if (!Array.isArray(proxy.config.items)) {
          proxy.config.items = [];
        }
        proxy.config.items.push({
          image: '',
          title: '',
          url: '',
        });
      },
      // 删除项
      delItem(element: any, index: number) {
        if (proxy.config.items.length === 1) {
          proxy.$message.error('至少保留一项！');
          return;
        }
        proxy.config.items.splice(index, 1);
      },
      // 选择文件
      selectFile(field: any) {
        proxy.currentImageField = field;
        proxy.filerVisible = true;
      },
      // 选择连接
      selectLink(item: any) {
        proxy.currentItem = item;
        proxy.linkerVisible = true;
      },
      // 清除图片
      clearImage(field: any) {
        proxy.config.style[field] = null;
      },
    };
    //#endregion

    // 页面加载事件
    onMounted(async () => {
      // 响应选中文件事件
      proxy.mittBus.on('onSelectFile', (item: any) => {
        if (item) {
          proxy.config.style[proxy.currentImageField] = item.url;
          proxy.filerVisible = false;
        }
      });
      // 响应选择链接事件
      proxy.mittBus.on('onSelectLink', (item: any) => {
        if (item) {
          proxy.currentItem.url = item.url;
          proxy.linkerVisible = false;
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

    return {
      ...toRefs(state),
      ...method,
    };
  },
};
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
  .img {
    width: 200px;
    height: 60px;
    cursor: pointer;
    margin-bottom: 10px;
    .image-slot {
      background-color: var(--el-bg-color);
      height: 100%;
      text-align: center;
      color: var(--color-info-light-1);
      line-height: 60px;
      cursor: pointer;
    }
  }
  .badge {
    cursor: pointer;
  }
  :deep(.el-input-number.is-controls-right .el-input__inner) {
    padding-left: 3px;
    padding-right: 5px;
  }
}
</style>
