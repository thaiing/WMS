<!--商品列表 - 参数设置-->
<template>
  <div class="config-container">
    <h4>
      {{ config.title }}
    </h4>
    <el-tabs v-model="tabActive" class="tabs-container">
      <el-tab-pane label="内容设置" name="t1" class="tab-pane">
        <el-alert title="最多可添加4个版块；鼠标拖拽左侧圆点可调整版块顺序" type="info" show-icon class="margin-bottom-10" :closable="false"></el-alert>

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
                  <el-form-item label="简介">
                    <el-input v-model="element.desc"></el-input>
                  </el-form-item>
                  <el-form-item label="连接">
                    <el-select v-model="element.url" placeholder="选择连接" class="w-100pc">
                      <el-option label="首发新品" :value="1" />
                      <el-option label="精品推荐" :value="2" />
                      <el-option label="热门榜单" :value="3" />
                      <el-option label="促销单品" :value="4" />
                    </el-select>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
          </template>
        </draggable>
        <el-button v-if="config.items.length < 4" type="primary" plain class="w-100pc margin-bottom-10" @click="addItem">添加项</el-button>

        <el-form ref="contentRef1" label-width="100px">
          <el-form-item label="商品排序字段">
            <el-radio-group v-model="config.auto.orderByField" @change="reloadChange">
              <el-radio-button label="综合"></el-radio-button>
              <el-radio-button label="销量"></el-radio-button>
              <el-radio-button label="价格"></el-radio-button>
            </el-radio-group>
            <el-radio-group v-model="config.auto.orderByType" @change="reloadChange">
              <el-radio-button label="DESC">降序</el-radio-button>
              <el-radio-button label="ASC">升序</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="显示商品个数">
            <el-input-number v-model="config.auto.productCount" class="mx-4" :min="1" :max="30" controls-position="right" @change="reloadChange" />
          </el-form-item>
        </el-form>

        <el-form ref="contentRef2" label-width="120px">
          <el-form-item label="是否显示名称">
            <el-switch v-model="config.common.showTitle" />
          </el-form-item>
          <el-form-item label="是否显示原价">
            <el-switch v-model="config.common.showOriginPrice" />
          </el-form-item>
          <el-form-item label="是否显示价格">
            <el-switch v-model="config.common.showPrice" />
          </el-form-item>
          <el-form-item label="是否显示优惠券">
            <el-switch v-model="config.common.showCoupon" />
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="样式设置" name="t2" class="tab-pane">
        <el-divider border-style="dashed">头部设置</el-divider>
        <el-form ref="formRef" :model="config.style" inline label-width="100px">
          <el-form-item label="标题颜色">
            <el-color-picker v-model="config.style.headerTitleColor" :predefine="predefineColors" show-alpha />
          </el-form-item>
          <el-form-item label="简介颜色">
            <el-color-picker v-model="config.style.headerDescColor" :predefine="predefineColors" show-alpha />
          </el-form-item>
          <el-form-item label="标题选中颜色">
            <el-color-picker v-model="config.style.headerTitleColorActive" :predefine="predefineColors" show-alpha />
          </el-form-item>
          <el-form-item label="简介选中颜色">
            <el-color-picker v-model="config.style.headerDescColorActive" :predefine="predefineColors" show-alpha />
          </el-form-item>
          <el-form-item label="头部背景颜色">
            <el-color-picker v-model="config.style.headerBgColor" :predefine="predefineColors" show-alpha />
          </el-form-item>
          <el-form-item label="简介背景颜色">
            <el-color-picker v-model="config.style.headerBgColorActive" :predefine="predefineColors" show-alpha />
          </el-form-item>
        </el-form>
        <el-form ref="formRef" :model="config.style" label-width="100px" @submit.prevent>
          <el-form-item label="头部圆角半径">
            <el-row :gutter="5">
              <el-col :span="16" class="padding-left-5">
                <el-slider v-model.number="config.style.headerBorderRadius"></el-slider>
              </el-col>
              <el-col :span="8">
                <el-input-number controls-position="right" v-model.number="config.style.headerBorderRadius" class="w-100pc" />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="背景外边距">
            <el-row :gutter="5">
              <el-col :span="16" class="padding-left-5">
                <el-slider v-model.number="config.style.headerBgMargin"></el-slider>
              </el-col>
              <el-col :span="8">
                <el-input-number controls-position="right" v-model.number="config.style.headerBgMargin" class="w-100pc" />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="背景内边距">
            <el-row :gutter="5">
              <el-col :span="16" class="padding-left-5">
                <el-slider v-model.number="config.style.headerBgPadding"></el-slider>
              </el-col>
              <el-col :span="8">
                <el-input-number controls-position="right" v-model.number="config.style.headerBgPadding" class="w-100pc" />
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
        <el-divider border-style="dashed">内容设置</el-divider>
        <el-form ref="formRef" :model="config.style" inline label-width="100px">
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
              <el-radio-button label="两列"></el-radio-button>
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
      typeOptions: [],
      typeProps: {
        checkStrictly: true,
      },
      // 预选颜色
      predefineColors: predefineColors,
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
      selectFile() {
        proxy.filerVisible = true;
      },
      // 选择连接
      selectLink(item: any) {
        proxy.currentItem = item;
        proxy.linkerVisible = true;
      },
      // 改变参数重新加载数据
      reloadChange() {
        proxy.mittBus.emit('onAppProductReload');
      },
    };
    //#endregion

    // 页面加载事件
    onMounted(async () => {
      // 响应选中文件事件
      proxy.mittBus.on('onSelectFile', (item: any) => {
        if (item) {
          proxy.config.image = item.url;
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
  :deep(.el-form-item--small) {
    margin-bottom: 10px;
  }
}
</style>
