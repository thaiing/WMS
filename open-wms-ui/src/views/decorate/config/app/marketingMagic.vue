<!--活动魔方 - 参数设置-->
<template>
  <div class="config-container">
    <h4>
      {{ config.title }}
    </h4>
    <el-tabs v-model="tabActive" class="tabs-container">
      <el-tab-pane label="内容设置" name="t1" class="tab-pane">
        <el-alert title="最多可添加20张图片，建议宽度90 * 90px" type="info" show-icon class="margin-bottom-10" :closable="false"></el-alert>
        <draggable :list="config.items" item-key="title" class="item-row" :animation="300" tag="el-row" :component-data="{ name: 'fade' }" handle=".col-icon" group="config" animation="600" ghost-class="ghost-item" chosen-class="chosen-item" drag-class="drag-item">
          <template #item="{ element, index }">
            <el-row class="item-row">
              <el-col :span="2" class="col-icon">
                <i class="iconfont el-icon-yrt-juzhong"></i>
              </el-col>
              <el-col :span="5">
                <el-badge value="x" class="item" type="primary" @click="delItem(element, index)">
                  <el-image class="img" :src="element.image" :initial-index="1" @click.stop.prevent="selectFile(element)">
                    <template #error>
                      <div class="image-slot" @click.stop.prevent="selectFile(element)">加载失败</div>
                    </template>
                  </el-image>
                </el-badge>
              </el-col>
              <el-col :span="17">
                <el-form ref="formRef" :model="element" label-width="80px" @submit.prevent>
                  <el-form-item label="标题">
                    <el-input v-model="element.title"></el-input>
                  </el-form-item>
                  <el-form-item label="简介">
                    <el-input v-model="element.desc"></el-input>
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
        <el-button type="primary" plain class="w-100pc margin-top-10" @click="addItem">添加模块</el-button>
      </el-tab-pane>
      <el-tab-pane label="样式设置" name="t2" class="tab-pane">
        <el-divider border-style="dashed">内容设置</el-divider>
        <el-form ref="formRef" :model="config.style" inline label-width="100px" @submit.prevent>
          <el-form-item label="标题颜色">
            <el-color-picker v-model="config.style.titleColor" :predefine="predefineColors" show-alpha />
          </el-form-item>
          <el-form-item label="原价颜色">
            <el-color-picker v-model="config.style.originPriceColor" :predefine="predefineColors" show-alpha />
          </el-form-item>
          <el-form-item label="价格颜色">
            <el-color-picker v-model="config.style.salePriceColor" :predefine="predefineColors" show-alpha />
          </el-form-item>
          <el-form-item label="标签颜色">
            <el-color-picker v-model="config.style.labelColor" :predefine="predefineColors" show-alpha />
          </el-form-item>
        </el-form>
        <el-form ref="formRef" :model="config.style" label-width="100px" @submit.prevent>
          <el-form-item label="显示类型">
            <el-radio-group v-model="config.style.displayMode">
              <el-radio-button label="单列"></el-radio-button>
              <el-radio-button label="两列1"></el-radio-button>
              <el-radio-button label="两列2"></el-radio-button>
              <el-radio-button label="三列"></el-radio-button>
              <el-radio-button label="大图"></el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="商品背景颜色">
            <el-color-picker v-model="config.style.productBgColor" :predefine="predefineColors" show-alpha />
          </el-form-item>
          <el-form-item label="商品圆角半径">
            <el-row :gutter="5">
              <el-col :span="16" class="padding-left-5">
                <el-slider v-model.number="config.style.productBorderRadius"></el-slider>
              </el-col>
              <el-col :span="8">
                <el-input-number controls-position="right" v-model.number="config.style.productBorderRadius" class="w-100pc" />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="商品间距">
            <el-row :gutter="5">
              <el-col :span="16" class="padding-left-5">
                <el-slider v-model.number="config.style.productMaginTop"></el-slider>
              </el-col>
              <el-col :span="8">
                <el-input-number controls-position="right" v-model.number="config.style.productMaginTop" class="w-100pc" />
              </el-col>
            </el-row>
          </el-form-item>
          <el-divider border-style="dashed">模块设置</el-divider>
          <el-form-item label="模块背景颜色">
            <el-color-picker v-model.number="config.style.bgColor" :predefine="predefineColors" show-alpha />
          </el-form-item>
          <el-form-item label="背景圆角半径">
            <el-row :gutter="5">
              <el-col :span="16" class="padding-left-5">
                <el-slider v-model.number="config.style.bgBorderRadius"></el-slider>
              </el-col>
              <el-col :span="8">
                <el-input-number controls-position="right" v-model.number="config.style.bgBorderRadius" class="w-100pc" />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="背景外边距">
            <el-row :gutter="5">
              <el-col :span="16" class="padding-left-5">
                <el-slider v-model.number="config.style.bgMargin"></el-slider>
              </el-col>
              <el-col :span="8">
                <el-input-number controls-position="right" v-model.number="config.style.bgMargin" class="w-100pc" />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="背景内边距">
            <el-row :gutter="5">
              <el-col :span="16" class="padding-left-5">
                <el-slider v-model.number="config.style.bgPadding"></el-slider>
              </el-col>
              <el-col :span="8">
                <el-input-number controls-position="right" v-model.number="config.style.bgPadding" class="w-100pc" />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="页面间距">
            <el-row :gutter="5">
              <el-col :span="16" class="padding-left-5">
                <el-slider v-model.number="config.style.maginTop"></el-slider>
              </el-col>
              <el-col :span="8">
                <el-input-number controls-position="right" v-model.number="config.style.maginTop" class="w-100pc" />
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="头部设置" name="t3" class="tab-pane tab3">
        <el-divider border-style="dashed">数据设置</el-divider>
        <el-alert title="最多可添加1张图片，建议宽度130 * 36px" type="info" show-icon class="margin-bottom-10" :closable="false"></el-alert>

        <el-form ref="formRef" :model="config.header" label-width="100px">
          <el-form-item label="图片">
            <el-badge value="x" type="primary" class="badge" @click.stop.prevent="clearImage()">
              <el-image class="img" :src="config.header.image" :initial-index="1" fit="contain" @click.stop.prevent="selectFile(config.header)">
                <template #error>
                  <div class="image-slot" @click.stop.prevent="selectFile(config.header)">加载失败</div>
                </template>
              </el-image>
            </el-badge>
          </el-form-item>
          <el-form-item label="图片大小"> <el-input-number controls-position="right" v-model.number="config.header.width" :min="0" class="w-100" /> X <el-input-number controls-position="right" v-model.number="config.header.height" :min="0" class="w-100" /> px </el-form-item>
          <el-form-item label="图片填充方式">
            <el-radio-group v-model="config.header.fit">
              <el-radio-button label="fill" title="默认值。内容拉伸填满整个content box, 不保证保持原有的比例。">fill</el-radio-button>
              <el-radio-button label="contain" title="保持原有尺寸比例。长度和高度中短的那条边跟容器大小一致，长的那条等比缩放，可能会有留白。">contain</el-radio-button>
              <el-radio-button label="cover" title="保持原有尺寸比例。宽度和高度中长的那条边跟容器大小一致，短的那条等比缩放。可能会有部分区域不可见。">cover</el-radio-button>
              <el-radio-button label="none" title="保持原有尺寸比例。同时保持替换内容原始尺寸大小。">none</el-radio-button>
              <el-radio-button label="scale-down" title="保持原有尺寸比例,如果容器尺寸大于图片内容尺寸，保持图片的原有尺寸，不会放大失真；容器尺寸小于图片内容尺寸，用法跟contain一样。">scale-down</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="标题">
            <el-input v-model="config.header.title"></el-input>
          </el-form-item>
          <el-form-item label="副标题">
            <el-input v-model="config.header.subTitle"></el-input>
          </el-form-item>
          <el-form-item label="连接">
            <el-input v-model="config.header.url">
              <template #suffix>
                <el-icon class="el-input__icon" @click="selectLink(element)">
                  <arrow-right />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
        </el-form>

        <el-divider border-style="dashed">样式设置</el-divider>
        <el-form ref="formRef" :model="config.header" label-width="100px" @submit.prevent>
          <el-form-item label="文本位置">
            <el-radio-group v-model="config.header.align">
              <el-radio-button label="left">靠左</el-radio-button>
              <el-radio-button label="center">居中</el-radio-button>
              <el-radio-button label="right">靠右</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="背景颜色">
            <el-color-picker v-model="config.header.bgColor" :predefine="predefineColors" show-alpha />
          </el-form-item>
          <el-form-item label="内背景颜色">
            <el-color-picker v-model="config.header.innerBgColor" :predefine="predefineColors" show-alpha />
          </el-form-item>
          <el-form-item label="文字颜色">
            <el-color-picker v-model="config.header.color" :predefine="predefineColors" show-alpha />
          </el-form-item>
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
          <el-form-item label="背景圆角半径">
            <el-row :gutter="5">
              <el-col :span="16" class="padding-left-5">
                <el-slider v-model.number="config.header.borderRadius"></el-slider>
              </el-col>
              <el-col :span="8">
                <el-input-number controls-position="right" v-model.number="config.header.borderRadius" :min="0" class="w-100pc" />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="背景外边距">
            <el-row :gutter="5">
              <el-col :span="16" class="padding-left-5">
                <el-slider v-model.number="config.header.bgMargin"></el-slider>
              </el-col>
              <el-col :span="8">
                <el-input-number controls-position="right" v-model.number="config.header.bgMargin" :min="0" class="w-100pc" />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="背景内边距">
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
  name: 'marketing-magic',
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
      typeOptions: [],
      typeProps: {
        checkStrictly: true,
      },
      // 预选颜色
      predefineColors: predefineColors,
      selectedElement: {}, // 选中元素
    });

    //#region 方法
    let method = {
      addItem() {
        if (!Array.isArray(proxy.config.items)) {
          proxy.config.items = [];
        }
        proxy.config.items.push({
          title: '',
          desc: '',
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
      selectFile(element: any) {
        proxy.selectedElement = element;
        proxy.filerVisible = true;
      },
      // 选择连接
      selectLink(item: any) {
        proxy.currentItem = item;
        proxy.linkerVisible = true;
      },
      // 改变参数重新加载数据
      reloadChange() {
        proxy.mittBus.emit('onReload:bargaining');
      },
      // 清除图片
      clearImage() {
        proxy.config.header.image = null;
      },
    };
    //#endregion

    // 页面加载事件
    onMounted(async () => {
      // 响应选中文件事件
      proxy.mittBus.on('onSelectFile', (item: any) => {
        if (item) {
          proxy.selectedElement.image = item.url;
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
    .btn-add {
      position: relative;
      top: 5px;
      margin-left: 5px;
    }
    :deep(.el-cascader) {
      width: 100%;
    }

    .item-row {
      + .item-row {
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px solid var(--el-border-color-light);
      }
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
        width: 100px;
        height: 100px;
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
  :deep(.el-radio-button__inner) {
    padding: 8px 12px;
  }
  .badge {
    cursor: pointer;
  }
}
</style>
