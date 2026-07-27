<!--商品类别 - 参数设置-->
<template>
  <div class="config-container">
    <h4>
      {{ config.title }}
    </h4>
    <el-tabs v-model="tabActive" class="tabs-container">
      <el-tab-pane label="内容设置" name="t1" class="tab-pane">
        <el-form ref="formRef" :model="config.content" label-width="100px">
          <el-form-item label="文章分类">
            <el-select v-model="config.content.module_Id" class="w-100pc" placeholder="选择分类">
              <el-option v-for="item in newsOptions" :key="item.module_Id" :label="item.moduleCnName" :value="item.module_Id"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="显示行数">
            <el-input-number v-model="config.content.rowCount" :min="1" :max="20" controls-position="right" class="w-100pc" @change="rowCountChange" />
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="样式设置" name="t2" class="tab-pane">
        <el-form ref="formRef" :model="config.style" label-width="100px" @submit.prevent>
          <el-divider border-style="dashed">标题颜色</el-divider>
          <el-form-item label="字体大小">
            <el-input-number v-model="config.style.fontSize" :min="0" :max="50" controls-position="right" />
          </el-form-item>
          <el-form-item label="字体颜色">
            <el-color-picker v-model="config.style.fontColor" :predefine="predefineColors" show-alpha />
          </el-form-item>
          <el-divider border-style="dashed">时间颜色</el-divider>
          <el-form-item label="字体大小">
            <el-input-number v-model="config.style.activeFontSize" :min="0" :max="50" controls-position="right" />
          </el-form-item>
          <el-form-item label="字体颜色">
            <el-color-picker v-model="config.style.activeFontColor" :predefine="predefineColors" show-alpha />
          </el-form-item>
          <el-divider border-style="dashed">新闻模块</el-divider>
          <el-form-item label="新闻背景颜色">
            <el-color-picker v-model="config.style.itemBgColor" :predefine="predefineColors" show-alpha />
          </el-form-item>
          <el-form-item label="新闻圆角半径">
            <el-row :gutter="5">
              <el-col :span="16" class="padding-left-5">
                <el-slider v-model.number="config.style.itemBorderRadius"></el-slider>
              </el-col>
              <el-col :span="8">
                <el-input-number controls-position="right" v-model.number="config.style.itemBorderRadius" class="w-100pc" />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="新闻项间距">
            <el-row :gutter="5">
              <el-col :span="16" class="padding-left-5">
                <el-slider v-model.number="config.style.itemMargin"></el-slider>
              </el-col>
              <el-col :span="8">
                <el-input-number controls-position="right" v-model.number="config.style.itemMargin" class="w-100pc" />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="新闻项内距">
            <el-row :gutter="5">
              <el-col :span="16" class="padding-left-5">
                <el-slider v-model.number="config.style.itemPadding"></el-slider>
              </el-col>
              <el-col :span="8">
                <el-input-number controls-position="right" v-model.number="config.style.itemPadding" class="w-100pc" />
              </el-col>
            </el-row>
          </el-form-item>
          <el-divider border-style="dashed">模块</el-divider>
          <el-form-item label="最大高度">
            <el-input-number v-model="config.style.maxHeight" :min="0" :max="1200" controls-position="right" />
          </el-form-item>
          <el-form-item label="背景渐变色">
            <el-color-picker v-model="config.style.bgColor1" :predefine="predefineColors" show-alpha />
            <el-color-picker v-model="config.style.bgColor2" :predefine="predefineColors" show-alpha />
          </el-form-item>
          <el-form-item label="背景渐变角度">
            <el-row :gutter="5">
              <el-col :span="16" class="padding-left-5">
                <el-slider v-model.number="config.style.bgColorDeg" :min="0" :max="360"></el-slider>
              </el-col>
              <el-col :span="8">
                <el-input-number v-model.number="config.style.bgColorDeg" controls-position="right" :min="0" :max="360" class="w-100pc" />
              </el-col>
            </el-row>
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
    //#region 属性
    const state = reactive({
      tabActive: 't1', // 左侧tab导航
      filerVisible: false, // 显示文件选择器
      linkerVisible: false, // 链接选择器
      // 预选颜色
      predefineColors: predefineColors,
      newsOptions: [
        {
          module_Id: 1,
          moduleCnName: '公司新闻',
        },
      ], // 新闻类别
    });
    //#endregion

    //#region 方法
    let methods = {
      // 加载类别数据
      getModuleList() {
        let url = '/api/common/loadDataList';
        let where = {};
        let orderBy = { orderNo: 'DESC', module_Id: 'DESC' };
        let params = {
          tableView: 'Cms_Module',
          idField: 'module_Id',
          folder: 'cms/module',
          menu_Id: 2002,
          pageIndex: 1,
          pageSize: 20,
          where: where,
          orderBy: orderBy,
          select: ['module_Id', 'moduleCnName'],
        };
        proxy.common.ajax(
          url,
          params,
          (res: any) => {
            proxy.common.showMsg(res);
            if (res.result) {
              proxy.newsOptions = res.data.rows;
            }
            proxy.initLoading = false;
          },
          false
        );
      },
      // 行数改变
      rowCountChange() {
        // 触发行数改变事件
        proxy.mittBus.emit('onNewList:rowCountChange');
      },
    };
    //#endregion

    // 页面加载事件
    onMounted(async () => {
      proxy.getModuleList();
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
      ...methods,
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
      :deep(.el-input__suffix) {
        margin-right: 0px;
        right: 8px;
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
