<template>
  <div :class="[isViewer ? (appConfig.global.isPC ? 'is-viewer-pc' : 'is-viewer-app') : 'center-container']" :style="{ '--page-width': appConfig.global.isPC ? (isViewer ? 'auto' : '1100px') : '379px' }">
    <div class="content">
      <!--头部-->
      <top v-if="!isViewer" v-model:selectModule="currentSelectModule" :app-config="appConfig"></top>
      <div :class="['scrollCon', isViewer ? (appConfig.global.isPC ? 'is-viewer-pc' : 'is-viewer-app') : '']">
        <div :class="['scroll-box', isViewer ? (appConfig.global.isPC ? 'is-viewer-pc' : 'is-viewer-app') : '']">
          <div class="scroll-box2" :style="{ 'background-color': appConfig.global.isBackgroundColor ? appConfig.global.backgroundColor : '' }">
            <draggable v-model="appConfig.modules" item-key="key" :class="['draggable-main', isViewer ? (appConfig.global.isPC ? 'is-viewer-pc' : 'is-viewer-app') : '']" :animation="300" tag="div" :component-data="{ name: 'fade' }" :disabled="isViewer" group="app" ghost-class="ghost-item" chosen-class="chosen-item" drag-class="drag-item" @add="handleWidgetAdd">
              <template #item="{ element, index }">
                <div :class="['drag-row', currentSelectModule === element ? 'select-item' : '']" @click="onClickDragItem(element)">
                  <component v-model:selectModule="currentSelectModule" :is="element.type" :config="element" :appConfig="appConfig" :is-viewer="isViewer" :viewCode="viewCode"></component>
                  <div v-if="currentSelectModule === element" class="tool">
                    <svg-icon class="yrt-shanchu1" title="删除模块" @click="deleteModule(element, index)"></svg-icon>
                    <svg-icon class="yrt-fuzhi3" title="复制模块" @click="copyModule(element, index)"></svg-icon>
                    <svg-icon class="yrt-xiangshang3" title="上移模块" @click="upModule(element, index)"></svg-icon>
                    <svg-icon class="yrt--daxiajiantou" title="下移模块" @click="downModule(element, index)"></svg-icon>
                    <svg-icon class="yrt-pandianliebiao" title="查看代码" @click="viewCode(element, index)"></svg-icon>
                  </div>
                </div>
              </template>
            </draggable>
            <draggable v-if="appConfig.global.showbuttonGroup" v-model="appConfig.global.buttons" item-key="key" group="app" ghost-class="ghost-item" chosen-class="chosen-item" drag-class="drag-item" class="button-box" @add="handleButtonAdd($event, appConfig.global, 0)">
              <template #item="{ element, index }">
                <div :class="['button-item', currentSelectModule === element ? 'active' : '']" @click.stop="onClickDragItem(element)">
                  <component v-if="element.type === 'u-button'" v-model:selectModule="currentSelectModule" :is="element.type" :config="element" :appConfig="appConfig" :is-viewer="isViewer"></component>
                  <div v-else class="invalid">无效组件，请删除</div>
                  <el-button v-if="currentSelectModule && currentSelectModule.key === element.key" title="删除" style="bottom: -20px" circle plain type="danger" class="widget-action-delete" @click.stop="handleWidgetDelete(appConfig.global.buttons, index)">
                    <svg-icon class="yrt-shanchu2"></svg-icon>
                  </el-button>
                </div>
              </template>
            </draggable>
          </div>
        </div>
      </div>
      <bottom v-if="appConfig.global.isAPP" v-model:selectModule="currentSelectModule" :config="appConfig.bottom"></bottom>
    </div>

    <!--查看代码对话框-->
    <el-dialog ref="uploadRef" v-model="viewCodeVisible" overflow title="查看代码" class="import-dialog-container" width="980px" append-to-body draggable>
      <v-ace-editor v-model:value="moduleCode" lang="json" theme="xcode" style="height: 500px" />
      <template #footer>
        <div class="dialog-footer">
          <div class="left-box">
            <el-button type="success" icon="yrt-saomiaoguanli" @click="viewCodeAll">查看全部代码</el-button>
          </div>
          <div>
            <el-button @click="viewCodeVisible = false">关闭</el-button>
            <el-button type="primary" @click="copyCode">复制代码</el-button>
            <el-button type="primary" @click="updateCode">修改代码</el-button>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, getCurrentInstance, computed, nextTick, onMounted } from 'vue';
import commonFunction from '/@/utils/commonFunction';
import { VAceEditor } from 'vue3-ace-editor';
import '/@/utils/ace.config';
import draggable from 'vuedraggable';

import top from '../modules/app/top.vue';
import bottom from '../modules/app/bottom.vue';
import rotationChart from '../modules/app/rotationChart.vue';
import productList from '../modules/app/productList.vue';
import navGroup from '../modules/app/navGroup.vue';
import newsBroadcast from '../modules/app/newsBroadcast.vue';
import productType from '../modules/app/productType.vue';
import newsList from '../modules/app/newsList.vue';
import imageMagic from '../modules/app/imageMagic.vue';
import searchBox from '../modules/app/searchBox.vue';
import promotionList from '../modules/app/promotionList.vue';
import titleHeader from '../modules/app/titleHeader.vue';
import guideBlank from '../modules/app/guideBlank.vue';
import guideLine from '../modules/app/guideLine.vue';
import bargaining from '../modules/app/bargaining.vue';
import combination from '../modules/app/combination.vue';
import seckill from '../modules/app/seckill.vue';
import coupon from '../modules/app/coupon.vue';
import marketingMagic from '../modules/app/marketingMagic.vue';
import userCenter from '../modules/app/userCenter.vue';

// uviewui基础组件
import uInput from '../modules/uviewui/u-input.vue';
import uText from '../modules/uviewui/u-text.vue';
import uDatetimePicker from '../modules/uviewui/u-datetime-picker.vue';
import uGrid from '../modules/uviewui/u-grid.vue';
import uDetail from '../modules/uviewui/u-detail.vue';
import uPicker from '../modules/uviewui/u-picker.vue';
import uButton from '../modules/uviewui/u-button.vue';
import uUpload from '../modules/uviewui/u-upload.vue';
import uSplitter from '../modules/uviewui/u-splitter.vue';
import uRadio from '../modules/uviewui/u-radio.vue';
import uContent from '../modules/uviewui/u-content.vue';

// PC组件
import pcStat from '../modules/pc/pc-stat.vue';
import pcStatAll from '../modules/pc/pc-stat-all.vue';
import pcNav from '../modules/pc/pc-nav.vue';
import pcLineChart from '../modules/pc/pc-line-chart.vue';
import pcBarChart from '../modules/pc/pc-bar-chart.vue';
import pcLineBarChart from '../modules/pc/pc-line-bar-chart.vue';
import pcPieChart from '../modules/pc/pc-pie-chart.vue';
import pcRingChart from '../modules/pc/pc-ring-chart.vue';
import pcTable from '../modules/pc/pc-table.vue';

export default {
  name: 'app-design-left-panel',
  components: {
    VAceEditor,
    draggable,
    top,
    bottom,
    rotationChart,
    productList,
    navGroup,
    newsBroadcast,
    productType,
    newsList,
    imageMagic,
    searchBox,
    promotionList,
    titleHeader,
    guideBlank,
    guideLine,
    bargaining,
    combination,
    seckill,
    coupon,
    marketingMagic,
    userCenter,

    uInput,
    uText,
    uDatetimePicker,
    uGrid,
    uDetail,
    uPicker,
    uButton,
    uUpload,
    uSplitter,
    uRadio,
    uContent,

    // PC组件
    pcStat,
    pcStatAll,
    pcNav,
    pcLineChart,
    pcBarChart,
    pcLineBarChart,
    pcPieChart,
    pcRingChart,
    pcTable,
  },
  props: {
    // app配置参数
    appConfig: {
      type: Object,
      default: () => {
        return {};
      },
    },
    // 选中项
    selectModule: {
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
  },
  setup() {
    const { copyText } = commonFunction();
    const { proxy } = getCurrentInstance() as any;
    const state = reactive({
      leftTabActive: 't1', // 左侧tab导航
      collapseActives: ['1', '2', '3'],
      configComponent: null, // 参数配置
      viewCodeVisible: false, // 显示代码对话框
      moduleCode: '', // 代码
      currentIndex: 0, // 当前模块位置
      currentCodeType: 'module', // 当前查看代码类型：module/all
      currentColumns: [], // 当前选中的u-grid单元列
      currentColIndex: 0, // 当前选中栅格列索引
    });

    // 当前选中模块双向绑定
    const currentSelectModule = computed({
      get() {
        if (proxy.isViewer) {
          return {};
        }
        return proxy.selectModule;
      },
      set(value) {
        proxy.$emit('update:selectModule', value);
      },
    });

    //#region 方法
    let methods = {
      // 选中模块
      onClickDragItem(element: any) {
        proxy.currentSelectModule = element;
      },
      // 删除模块
      deleteModule(element: any, index: number) {
        proxy.appConfig.modules.splice(index, 1);
        window.setTimeout(() => {
          if (index >= proxy.appConfig.modules.length) index -= 1;
          if (index < 0) {
            proxy.currentSelectModule = proxy.appConfig.global;
            return;
          }

          proxy.currentSelectModule = proxy.appConfig.modules[index];
        }, 10);
      },
      // 复制模块
      copyModule(element: any, index: number) {
        let cloneEl = proxy.common.deepCopy(element);
        proxy.appConfig.modules.splice(index, 0, cloneEl);
      },
      // 上移模块
      upModule(element: any, index: number) {
        proxy.common.swapArray(proxy.appConfig.modules, index - 1, index);
      },
      // 下移模块
      downModule(element: any, index: number) {
        proxy.common.swapArray(proxy.appConfig.modules, index, index + 1);
      },
      // 查看代码
      viewCode(element: any, index: number, columns?: Array<any>, colIndex?: number) {
        proxy.currentIndex = index; // 记录当前行
        proxy.currentCodeType = 'module'; // 记录代码查看类型
        proxy.currentColumns = columns;
        proxy.currentColIndex = colIndex; // 当前栅格列索引
        proxy.moduleCode = JSON.stringify(element, null, 2);
        proxy.viewCodeVisible = true;
      },
      // 复制代码
      copyCode() {
        copyText(proxy.moduleCode);
      },
      // 查看全部代码
      async viewCodeAll() {
        proxy.currentCodeType = 'all';
        proxy.moduleCode = JSON.stringify(proxy.appConfig, null, 2);
      },
      // 更新代码
      updateCode() {
        if (proxy.currentCodeType === 'all') {
          let appConfig = JSON.parse(proxy.moduleCode);
          Object.keys(appConfig).forEach((key) => {
            proxy.appConfig[key] = appConfig[key];
          });
          proxy.currentSelectModule = proxy.appConfig.modules[proxy.currentIndex];
          proxy.$message.success('代码更新成功');
          proxy.viewCodeVisible = false;
        } else if (proxy.currentCodeType === 'module') {
          if (proxy.currentColumns && proxy.currentColumns.length) {
            // 更新栅格中的模块
            proxy.currentColumns[proxy.currentColIndex].fields[proxy.currentIndex] = JSON.parse(proxy.moduleCode);
            proxy.currentSelectModule = proxy.currentColumns[proxy.currentColIndex].fields[proxy.currentIndex];
          } else {
            // 更新普通模块
            proxy.appConfig.modules[proxy.currentIndex] = JSON.parse(proxy.moduleCode);
            proxy.currentSelectModule = proxy.appConfig.modules[proxy.currentIndex];
          }
          proxy.$message.success('代码更新成功');
          proxy.viewCodeVisible = false;
        } else {
          proxy.$message.error('没有可更新模块');
        }
      },
      // 模块添加
      handleWidgetAdd(evt: any) {
        const newIndex = evt.newIndex;

        // 为拖拽到容器的元素添加唯一 key
        const key = Date.parse('' + new Date()) + '_' + Math.ceil(Math.random() * 99999);
        proxy.appConfig.modules[newIndex] = {
          ...proxy.common.deepCopy(proxy.appConfig.modules[newIndex]),
          key,
          rules: [],
        };
        delete proxy.appConfig.modules[newIndex].icon;

        if (proxy.appConfig.modules[newIndex].type === 'radio' || proxy.appConfig.modules[newIndex].type === 'checkbox') {
          proxy.appConfig.modules[newIndex] = {
            ...proxy.appConfig.modules[newIndex],
            options: {
              ...proxy.appConfig.modules[newIndex].options,
              options: proxy.appConfig.modules[newIndex].options.options.map((item: any) => ({
                ...item,
              })),
            },
          };
        } else if (proxy.appConfig.modules[newIndex].type === 'detail-grid') {
          proxy.appConfig.modules[newIndex].subTableView = null; // 关联子表
          proxy.appConfig.modules[newIndex]['buttons'] = [
            {
              type: 'button-group',
              label: '按钮组',
              buttons: [
                {
                  type: 'button',
                  label: '新建',
                  options: {
                    icon: 'el-icon-plus',
                    type: 'primary',
                    authNode: 'detailAdd',
                  },
                  key: 'detail_add',
                },
                {
                  type: 'button',
                  label: '删除',
                  options: {
                    icon: 'yrt-shanchu2',
                    type: 'primary',
                    authNode: 'detailDelete',
                  },
                  key: 'detail_delete',
                },
              ],
              options: {
                icon: 'yrt-anniuzu',
              },
            },
          ];

          // delete proxy.appConfig.modules[newIndex].options;
          delete proxy.appConfig.modules[newIndex].rules;
        } else if (proxy.appConfig.modules[newIndex].type === 'grid') {
          proxy.appConfig.modules[newIndex] = {
            ...proxy.appConfig.modules[newIndex],
            columns: proxy.appConfig.modules[newIndex].columns.map((item: any) => ({ ...item })),
          };
          delete proxy.appConfig.modules[newIndex].rules;
        }

        proxy.currentSelectModule = proxy.appConfig.modules[newIndex];
      },
      // 按钮添加
      handleButtonAdd($event: any, row: any, colIndex: any) {
        const newIndex = $event.newIndex;
        const key = Date.parse('' + new Date()) + '_' + Math.ceil(Math.random() * 99999);
        row.buttons[newIndex] = {
          ...proxy.common.deepCopy(row.buttons[newIndex]),
          key,
        };

        delete row.buttons[newIndex].icon;
        proxy.currentSelectModule = row.buttons[newIndex];
      },
      // 删除项
      handleWidgetDelete(fields: Array<any>, index: number) {
        if (fields.length - 1 === index) {
          if (index === 0) {
            proxy.currentSelectModule = {
              type: 'global',
            };
          } else {
            proxy.currentSelectModule = fields[index - 1];
          }
        } else {
          proxy.currentSelectModule = fields[index + 1];
        }

        fields.splice(index, 1);
      },
    };
    //#endregion

    //#region
    onMounted(() => {});
    //#endregion

    return {
      ...toRefs(state),
      currentSelectModule,
      ...methods,
    };
  },
};
</script>

<style lang="scss" scoped>
.center-container {
  left: 300px;
  right: 395px;
  top: 53px;
  bottom: 0;
  position: fixed;
  padding-top: 20px;
  overflow-x: hidden;
  overflow-y: scroll;
  // background-color: var(--color-info-light-8);
  &.is-viewer-pc {
    position: static;
    padding-top: 1px;
  }
  &.is-viewer-app {
    position: static;
    padding-top: 1px;
  }
  .content {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .scrollCon {
      overflow: auto scroll;
      -webkit-font-smoothing: antialiased;
      height: calc(100vh - 115px);
      min-height: 500px;
      &.is-viewer-pc {
        height: auto;
        max-height: auto;
        min-height: auto;
      }
      &.is-viewer-app {
        height: calc(100vh - 320px);
        max-height: 700px;
        min-height: 300px;
      }

      // 滚动条整体宽度
      &::-webkit-scrollbar {
        width: 4px;
        background: transparent;
      }
      // 滚动条滑槽样式
      &::-webkit-scrollbar-track-piece {
        background-color: #eee;
        border-radius: 4px;
      }
      // 滚动条样式
      &::-webkit-scrollbar-thumb {
        border-radius: 4px;
        background: #ddd;
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

      .drag-row {
        border: 0px dashed var(--color-whites);
        cursor: pointer;
        position: relative;
        .tool {
          position: absolute;
          display: none;
          right: -45px;
          top: 0px;
          background-color: dodgerblue;
          padding: 5px 5px;
          border-radius: 5px;
          width: 40px;
          text-align: center;
          i {
            color: white;
            display: block;
            width: 30px;
            height: 30px;
            padding: 9px 0 8px;
            &:hover {
              background-color: rgb(88, 171, 255);
            }
          }
        }
        &.select-item {
          border: 1px solid var(--color-primary);
          .tool {
            display: block;
          }
        }
      }
    }
    .scroll-box {
      width: calc(var(--page-width) + 114px);
      margin: 0px auto;
      &.is-viewer-app {
        width: 380px;
      }
    }
    .scroll-box2 {
      flex: 1 1 0%;
      width: var(--page-width);
      margin: 0px auto;
      padding-top: 1px;
      .draggable-main {
        min-height: 100px;
        padding-bottom: 50px;
        &.is-viewer-pc {
          min-height: auto;
          padding-bottom: inherit;
        }
        &.is-viewer-app {
          min-height: auto;
          padding-bottom: inherit;
        }
      }
    }
  }

  .button-box {
    padding: 2px;
    min-height: 50px;
    border: 1px solid rgb(228, 228, 228);
    position: relative;
    z-index: 0;
    display: flex;
    &::before {
      content: '按钮设计区域';
      position: absolute;
      top: 5px;
      left: 0;
      right: 0;
      bottom: 0;
      color: rgb(228, 228, 228);
      font-size: 30px;
      text-align: right;
      z-index: -1;
    }
    .button-item {
      position: relative;
      padding: 3px;
      &.active {
        background-color: rgb(148, 240, 247);
        border: 1px solid rgb(74, 175, 243);
      }
      &.button-item {
        margin-right: 5px;
      }
      .invalid {
        color: red;
      }
      .widget-action-delete {
        position: absolute;
        right: 20px;
        bottom: -35px;
        z-index: 1009;
      }
    }
  }
}
</style>
