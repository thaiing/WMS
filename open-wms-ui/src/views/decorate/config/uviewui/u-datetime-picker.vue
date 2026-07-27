<!--轮播图 - 参数设置-->
<template>
  <div class="config-container">
    <h4>
      {{ config.title }}
    </h4>
    <el-tabs v-model="tabActive" class="tabs-container">
      <el-tab-pane label="参数设置" name="t1" class="tab-pane">
        <el-form ref="formRef" :model="config" label-width="100px">
          <el-form-item label="标题">
            <el-input v-model="config.label"></el-input>
          </el-form-item>
          <el-form-item label="绑定字段">
            <el-input v-model="config.prop"></el-input>
          </el-form-item>
          <el-form-item label="输入框类型">
            <el-select v-model="config.type" placeholder="请选择" style="width: 100%" @change="(val) => dataTypeChange(val)">
              <el-option v-for="(item, index) in basicComponents" :key="index" :label="item.title" :value="item.type"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标题宽度">
            <el-input v-model="config.labelWidth"></el-input>
          </el-form-item>
          <el-form-item label="输入框宽度">
            <el-input v-model="config.width"></el-input>
          </el-form-item>
          <el-form-item label="输入提示">
            <el-input v-model="config.placeholder"></el-input>
          </el-form-item>
          <el-form-item label="默认值">
            <el-input v-model="config.defaultValue"></el-input>
          </el-form-item>
          <el-form-item label="tab分组名">
            <el-input v-model="config.tabGroupName"></el-input>
          </el-form-item>
          <el-form-item label="数据类型">
            <el-select v-model="config.dataType" placeholder="请选择" style="width: 100%">
              <el-option v-for="(item, index) in dataTypeList" :key="index" :label="item" :value="item"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="格式化">
            <el-select v-model="config.formatter" style="width: 100%">
              <el-option label="YYYY-MM" value="YYYY-MM"></el-option>
              <el-option label="YYYY-MM-DD" value="YYYY-MM-DD"></el-option>
              <el-option label="YYYY-MM-DD HH:mm:ss" value="YYYY-MM-DD HH:mm:ss"></el-option>
              <el-option label="HH:mm:ss" value="HH:mm:ss"></el-option>
              <el-option label="￥#.00" value="￥#.00"></el-option>
              <el-option label="￥#,###.00" value="￥#,###.00"></el-option>
              <el-option label="￥#,###.0000" value="￥#,###.0000"></el-option>
              <el-option label="#" value="#"></el-option>
              <el-option label="#.#" value="#.#"></el-option>
              <el-option label="#.##" value="#.##"></el-option>
              <el-option label="#,###.##" value="#,###.##"></el-option>
              <el-option label="#.###" value="#.###"></el-option>
              <el-option label="#.####" value="#.####"></el-option>
              <el-option label="#.#####" value="#.#####"></el-option>
              <el-option label="#.######" value="#.######"></el-option>
              <el-option label="#.0" value="#.0"></el-option>
              <el-option label="#.00" value="#.00"></el-option>
              <el-option label="#,###.00" value="#,###.00"></el-option>
              <el-option label="#.000" value="#.000"></el-option>
              <el-option label="#.0000" value="#.0000"></el-option>
              <el-option label="#.000000" value="#.000000"></el-option>
              <el-option label="#,###.0000" value="#,###.0000"></el-option>
              <el-option label="%" value="%"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否只读">
            <el-switch v-model="config.readonly" :active-value="true" :inactive-value="false"></el-switch>
          </el-form-item>

          <el-form-item label="是否必填">
            <el-switch v-model="config.required" :active-value="true" :inactive-value="false"></el-switch>
          </el-form-item>
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
          <el-form-item label="背景颜色">
            <el-color-picker v-model="config.style.bgColor" :predefine="predefineColors" show-alpha />
          </el-form-item>
          <el-form-item label="内背景颜色">
            <el-color-picker v-model="config.style.innerBgColor" :predefine="predefineColors" show-alpha />
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
          <el-form-item label="背景圆角半径">
            <el-row :gutter="5">
              <el-col :span="16" class="padding-left-5">
                <el-slider v-model.number="config.style.borderRadius"></el-slider>
              </el-col>
              <el-col :span="8">
                <el-input-number controls-position="right" v-model.number="config.style.borderRadius" :min="0" class="w-100pc" />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="背景外边距">
            <el-row :gutter="5">
              <el-col :span="16" class="padding-left-5">
                <el-slider v-model.number="config.style.bgMargin"></el-slider>
              </el-col>
              <el-col :span="8">
                <el-input-number controls-position="right" v-model.number="config.style.bgMargin" :min="0" class="w-100pc" />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="背景内边距">
            <el-row :gutter="5">
              <el-col :span="16" class="padding-left-5">
                <el-slider v-model.number="config.style.bgPadding"></el-slider>
              </el-col>
              <el-col :span="8">
                <el-input-number controls-position="right" v-model.number="config.style.bgPadding" :min="0" class="w-100pc" />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="页面间距">
            <el-row :gutter="5">
              <el-col :span="16" class="padding-left-5">
                <el-slider v-model.number="config.style.maginTop"></el-slider>
              </el-col>
              <el-col :span="8">
                <el-input-number controls-position="right" v-model.number="config.style.maginTop" :min="0" class="w-100pc" />
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
import { reactive, toRefs, onMounted, onUnmounted, nextTick, getCurrentInstance, computed } from 'vue';
import draggable from '/@/utils/vuedraggable/index.js';
('vuedraggable');
import filerDialog from '/@/components/base/filer-dialog.vue';
import linkerDialog from '/@/components/linker/linker-dialog.vue';
import { ArrowRight } from '@element-plus/icons-vue';
import { predefineColors, dataTypeList } from '/@/utils/commonFunction';
import getCommon from './hooks/common';

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
    // hook公共参数
    const { basicComponents, dataTypeChange } = getCommon();

    const state = reactive({
      tabActive: 't1', // 左侧tab导航
      formData: {}, // 参数设置
      configComponent: null, // 参数配置
      filerVisible: false, // 显示文件选择器
      linkerVisible: false, // 链接选择器
      predefineColors,
      dataTypeList,
      basicComponents,
    });

    //#region 方法
    let method = {
      // 编辑框类型改变
      dataTypeChange,
    };
    //#endregion

    // 页面加载事件
    onMounted(async () => {});

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
