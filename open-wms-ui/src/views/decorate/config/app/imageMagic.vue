<!--轮播图 - 参数设置-->
<template>
  <div class="config-container">
    <h4>
      {{ config.title }}
    </h4>
    <el-tabs v-model="tabActive" class="tabs-container">
      <el-tab-pane label="内容设置" name="t1" class="tab-pane">
        <el-form ref="formRef" :model="config.style" label-width="100px" @submit.prevent>
          <el-form-item label-width="0px">
            <div class="title">展示样式</div>
            <el-radio-group v-model.number="config.style.type" @change="typeChange">
              <el-radio-button label="1">样式1</el-radio-button>
              <el-radio-button label="2">样式2</el-radio-button>
              <el-radio-button label="3">样式3</el-radio-button>
              <el-radio-button label="4">样式4</el-radio-button>
              <el-radio-button label="5">样式5</el-radio-button>
              <el-radio-button label="6">样式6</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label-width="0px">
            <div class="title">布局</div>
            <el-alert title="选定布局区域，在下方添加图片，建议添加比例一致的图片" type="info" :closable="false" class="margin-bottom-5" />
            <div v-if="config.style.type == 1" class="style-1">
              <el-image :src="config.items.item1.image + '?x-oss-process=style/300'" class="img" :class="[config.items.item1 === currentItem ? 'active' : '']" @click="selectItem(config.items.item1)">
                <template #error>
                  <div class="image-slot" @click="selectFile()">
                    <el-icon>
                      <icon-picture />
                    </el-icon>
                  </div>
                </template>
              </el-image>
            </div>
            <div v-else-if="config.style.type == 2" class="style-2">
              <el-image :src="config.items.item1.image + '?x-oss-process=style/200'" fit="fill" class="img" :class="[config.items.item1 === currentItem ? 'active' : '']" @click="selectItem(config.items.item1)">
                <template #error>
                  <div class="image-slot" @click="selectItem(config.items.item1)">
                    <el-icon>
                      <icon-picture />
                    </el-icon>
                  </div>
                </template>
              </el-image>
              <el-image :src="config.items.item2.image + '?x-oss-process=style/200'" fit="fill" class="img" :class="[config.items.item2 === currentItem ? 'active' : '']" @click="selectItem(config.items.item2)">
                <template #error>
                  <div class="image-slot" @click="selectItem(config.items.item2)">
                    <el-icon>
                      <icon-picture />
                    </el-icon>
                  </div>
                </template>
              </el-image>
            </div>
            <div v-else-if="config.style.type == 3" class="style-3">
              <el-image :src="config.items.item1.image + '?x-oss-process=style/200'" fit="fill" class="img" :class="[config.items.item1 === currentItem ? 'active' : '']" @click="selectItem(config.items.item1)">
                <template #error>
                  <div class="image-slot" @click="selectItem(config.items.item1)">
                    <el-icon>
                      <icon-picture />
                    </el-icon>
                  </div>
                </template>
              </el-image>
              <el-image :src="config.items.item2.image + '?x-oss-process=style/200'" fit="fill" class="img" :class="[config.items.item2 === currentItem ? 'active' : '']" @click="selectItem(config.items.item2)">
                <template #error>
                  <div class="image-slot" @click="selectItem(config.items.item2)">
                    <el-icon>
                      <icon-picture />
                    </el-icon>
                  </div>
                </template>
              </el-image>
              <el-image :src="config.items.item3.image + '?x-oss-process=style/200'" fit="fill" class="img" :class="[config.items.item3 === currentItem ? 'active' : '']" @click="selectItem(config.items.item3)">
                <template #error>
                  <div class="image-slot" @click="selectItem(config.items.item3)">
                    <el-icon>
                      <icon-picture />
                    </el-icon>
                  </div>
                </template>
              </el-image>
            </div>
            <div v-else-if="config.style.type == 4" class="style-4">
              <el-image :src="config.items.item1.image + '?x-oss-process=style/200'" fit="fill" class="img" :class="[config.items.item1 === currentItem ? 'active' : '']" @click="selectItem(config.items.item1)">
                <template #error>
                  <div class="image-slot" @click="selectItem(config.items.item1)">
                    <el-icon>
                      <icon-picture />
                    </el-icon>
                  </div>
                </template>
              </el-image>
              <div class="item">
                <el-image :src="config.items.item2.image + '?x-oss-process=style/200'" fit="fill" class="img-right" :class="[config.items.item2 === currentItem ? 'active' : '']" @click="selectItem(config.items.item2)">
                  <template #error>
                    <div class="image-slot" @click="selectItem(config.items.item2)">
                      <el-icon>
                        <icon-picture />
                      </el-icon>
                    </div>
                  </template>
                </el-image>
                <el-image :src="config.items.item3.image + '?x-oss-process=style/200'" fit="fill" class="img-right" :class="[config.items.item3 === currentItem ? 'active' : '']" @click="selectItem(config.items.item3)">
                  <template #error>
                    <div class="image-slot" @click="selectItem(config.items.item3)">
                      <el-icon>
                        <icon-picture />
                      </el-icon>
                    </div>
                  </template>
                </el-image>
              </div>
            </div>
            <div v-else-if="config.style.type == 5" class="style-5">
              <el-image :src="config.items.item1.image + '?x-oss-process=style/200'" fit="fill" class="img" :class="[config.items.item1 === currentItem ? 'active' : '']" @click="selectItem(config.items.item1)">
                <template #error>
                  <div class="image-slot" @click="selectItem(config.items.item1)">
                    <el-icon>
                      <icon-picture />
                    </el-icon>
                  </div>
                </template>
              </el-image>
              <el-image :src="config.items.item2.image + '?x-oss-process=style/200'" fit="fill" class="img" :class="[config.items.item2 === currentItem ? 'active' : '']" @click="selectItem(config.items.item2)">
                <template #error>
                  <div class="image-slot" @click="selectItem(config.items.item2)">
                    <el-icon>
                      <icon-picture />
                    </el-icon>
                  </div>
                </template>
              </el-image>
              <el-image :src="config.items.item3.image + '?x-oss-process=style/200'" fit="fill" class="img" :class="[config.items.item3 === currentItem ? 'active' : '']" @click="selectItem(config.items.item3)">
                <template #error>
                  <div class="image-slot" @click="selectItem(config.items.item3)">
                    <el-icon>
                      <icon-picture />
                    </el-icon>
                  </div>
                </template>
              </el-image>
              <el-image :src="config.items.item4.image + '?x-oss-process=style/200'" fit="fill" class="img" :class="[config.items.item4 === currentItem ? 'active' : '']" @click="selectItem(config.items.item4)">
                <template #error>
                  <div class="image-slot" @click="selectItem(config.items.item4)">
                    <el-icon>
                      <icon-picture />
                    </el-icon>
                  </div>
                </template>
              </el-image>
            </div>
            <div v-else-if="config.style.type == 6" class="style-6">
              <div class="item">
                <el-image :src="config.items.item1.image + '?x-oss-process=style/200'" fit="fill" class="img-right" :class="[config.items.item1 === currentItem ? 'active' : '']" @click="selectItem(config.items.item1)">
                  <template #error>
                    <div class="image-slot" @click="selectItem(config.items.item1)">
                      <el-icon>
                        <icon-picture />
                      </el-icon>
                    </div>
                  </template>
                </el-image>
                <el-image :src="config.items.item2.image + '?x-oss-process=style/200'" fit="fill" class="img-right" :class="[config.items.item2 === currentItem ? 'active' : '']" @click="selectItem(config.items.item2)">
                  <template #error>
                    <div class="image-slot" @click="selectItem(config.items.item2)">
                      <el-icon>
                        <icon-picture />
                      </el-icon>
                    </div>
                  </template>
                </el-image>
              </div>
              <div class="item">
                <el-image :src="config.items.item3.image + '?x-oss-process=style/200'" fit="fill" class="img-right" :class="[config.items.item3 === currentItem ? 'active' : '']" @click="selectItem(config.items.item3)">
                  <template #error>
                    <div class="image-slot" @click="selectItem(config.items.item3)">
                      <el-icon>
                        <icon-picture />
                      </el-icon>
                    </div>
                  </template>
                </el-image>
                <el-image :src="config.items.item4.image + '?x-oss-process=style/200'" fit="fill" class="img-right" :class="[config.items.item4 === currentItem ? 'active' : '']" @click="selectItem(config.items.item4)">
                  <template #error>
                    <div class="image-slot" @click="selectItem(config.items.item4)">
                      <el-icon>
                        <icon-picture />
                      </el-icon>
                    </div>
                  </template>
                </el-image>
              </div>
            </div>
            <div class="current-item">
              <el-image v-if="config.style.type >= 1" :src="currentItem.image + '?x-oss-process=style/100'" fit="fill" class="current-img" @click="selectFile()">
                <template #error>
                  <div class="image-slot" @click="selectFile()">
                    <el-icon>
                      <icon-picture />
                    </el-icon>
                  </div>
                </template>
              </el-image>
              <el-form ref="formRef" :model="currentItem" label-width="80px" class="form">
                <el-form-item label="连接">
                  <el-input v-model="currentItem.url">
                    <template #suffix>
                      <el-icon class="el-input__icon" @click="selectLink(currentItem)">
                        <arrow-right />
                      </el-icon>
                    </template>
                  </el-input>
                </el-form-item>
              </el-form>
            </div>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="样式设置" name="t2" class="tab-pane">
        <el-form ref="formRef" :model="config.style" label-width="100px" @submit.prevent>
          <el-form-item label="图标间距">
            <el-input-number v-model="config.style.imageMargin" :min="1" :max="200" controls-position="right" />
          </el-form-item>
          <el-form-item label="图片圆角半径">
            <el-row :gutter="5">
              <el-col :span="16" class="padding-left-5">
                <el-slider v-model.number="config.style.imageBorderRadius"></el-slider>
              </el-col>
              <el-col :span="8">
                <el-input-number controls-position="right" v-model.number="config.style.imageBorderRadius" class="w-100pc" />
              </el-col>
            </el-row>
          </el-form-item>
          <el-divider border-style="dotted">背景设置</el-divider>
          <el-form-item label="模块背景颜色">
            <el-color-picker v-model="config.style.bgColor" :predefine="predefineColors" show-alpha />
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
import draggable from '/@/utils/vuedraggable/index.js';
('vuedraggable');
import filerDialog from '/@/components/base/filer-dialog.vue';
import linkerDialog from '/@/components/linker/linker-dialog.vue';
import { ArrowRight } from '@element-plus/icons-vue';
import { Picture as IconPicture } from '@element-plus/icons-vue';
import { predefineColors } from '/@/utils/commonFunction';

export default {
  name: 'app-design-left-panel',
  components: {
    draggable,
    filerDialog,
    linkerDialog,
    ArrowRight,
    IconPicture,
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
    //#region 属性
    const state = reactive({
      tabActive: 't1', // 左侧tab导航
      currentItem: {}, // 参数设置
      filerVisible: false, // 显示文件选择器
      linkerVisible: false, // 链接选择器
      // 预选颜色
      predefineColors: predefineColors,
    });
    //#endregion

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
      selectFile() {
        proxy.filerVisible = true;
      },
      // 选择连接
      selectLink(item: any) {
        proxy.currentItem = item;
        proxy.linkerVisible = true;
      },
      // 选中模块
      selectItem(item: any) {
        proxy.currentItem = item;
      },
      // 类型改变
      typeChange() {
        // 触发样式事件
        proxy.mittBus.emit('onNavGroup:typeChange', {});
      },
      // 指示器改变
      indicatorChange() {
        // 触发指示器事件
        proxy.mittBus.emit('onNavGroup:indicatorChange', {});
      },
    };
    //#endregion

    // 页面加载事件
    onMounted(async () => {
      // 响应选中文件事件
      proxy.mittBus.on('onSelectFile', (item: any) => {
        if (item) {
          proxy.currentItem.image = item.url;
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
.el-alert {
  --el-alert-padding: 0px 0px;
}
:deep(.el-radio-button__inner) {
  padding: 8px 13px;
}
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
    .active {
      border: solid 1px var(--el-color-primary);
    }
  }
  :deep(.el-tabs__header) {
    margin-bottom: 10px;
  }
  :deep(.el-tabs__item) {
    width: 200px;
    text-align: center;
  }
}

.current-item {
  display: flex;
  justify-content: flex-start;
  margin-top: 10px;
  .current-img {
    width: 80px;
    height: 80px;
  }
  .image-slot {
    background-color: var(--el-bg-color);
    height: 100%;
    text-align: center;
    color: var(--color-info-light-1);
    line-height: 90px;
    cursor: pointer;
    font-size: 40px;
  }
  .form {
    width: calc(100% - 60px);
  }
}

.style-1 {
  .img {
    width: 100%;
    height: 385px;
    cursor: pointer;
    border: solid 1px var(--color-whites);
  }
  .image-slot {
    background-color: var(--el-bg-color);
    height: 100%;
    text-align: center;
    color: var(--color-info-light-1);
    line-height: 90px;
    cursor: pointer;
    font-size: 40px;
  }
}

.style-2 {
  display: flex;
  justify-content: flex-start;

  .img {
    width: 100%;
    height: 190px;
    cursor: pointer;
    border: solid 1px var(--color-whites);
  }
  .image-slot {
    background-color: var(--el-bg-color);
    height: 100%;
    text-align: center;
    color: var(--color-info-light-1);
    line-height: 190px;
    cursor: pointer;
    font-size: 40px;
  }
}

.style-3 {
  display: flex;
  justify-content: flex-start;

  .img {
    width: 100%;
    height: 120px;
    cursor: pointer;
    border: solid 1px var(--color-whites);
  }
  .image-slot {
    background-color: var(--el-bg-color);
    height: 100%;
    text-align: center;
    color: var(--color-info-light-1);
    line-height: 120px;
    cursor: pointer;
    font-size: 40px;
  }
}

.style-4 {
  display: flex;
  justify-content: flex-start;

  .img {
    width: 100%;
    height: 190px;
    cursor: pointer;
    border: solid 1px var(--color-whites);
  }
  .img-right {
    width: 100%;
    height: 88px;
    cursor: pointer;
    border: solid 1px var(--color-whites);
  }
  .image-slot {
    background-color: var(--el-bg-color);
    height: 100%;
    text-align: center;
    color: var(--color-info-light-1);
    line-height: 190px;
    cursor: pointer;
    font-size: 40px;
  }
}

.style-5 {
  display: flex;
  justify-content: flex-start;

  .img {
    width: 100%;
    height: 94px;
    cursor: pointer;
    border: solid 1px var(--color-whites);
  }
  .image-slot {
    background-color: var(--el-bg-color);
    height: 100%;
    text-align: center;
    color: var(--color-info-light-1);
    line-height: 94px;
    cursor: pointer;
    font-size: 40px;
  }
}

.style-6 {
  display: flex;
  justify-content: flex-start;

  .img-right {
    width: 100%;
    height: 88px;
    cursor: pointer;
    border: solid 1px var(--color-whites);
  }
  .image-slot {
    background-color: var(--el-bg-color);
    height: 100%;
    text-align: center;
    color: var(--color-info-light-1);
    line-height: 190px;
    cursor: pointer;
    font-size: 40px;
  }
}
</style>
