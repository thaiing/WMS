<template>
  <div class="grid-container">
    <div class="data-grid" style="position: relative">
      <el-row :justify="config.options.justify" :align="config.options.align" :gutter="config.options.gutter ? config.options.gutter : 0" :style="{ 'background-color': config.style.bgColor || 'transport' }" class="widget-grid" type="flex">
        <el-col v-for="(col, colIndex) in config.columns" :key="colIndex" :span="col.span ? col.span : 0">
          <div :style="{ border: isViewer ? '' : '1px dashed #999' }">
            <draggable v-model="col.fields" item-key="key" :disabled="isViewer" group="app" ghost-class="ghost-item" chosen-class="chosen-item" drag-class="drag-item" class="grid-column" @add="handleWidgetColAdd($event, config, colIndex)">
              <template #item="{ element, index }">
                <div v-if="element.type === 'u-grid'" class="grid-nest">栅格布局不允许嵌套，点击拖拽出去</div>
                <div v-else :class="['drag-row', currentSelectModule === element ? 'select-item' : '']" @click.stop="onClickDragItem(element)">
                  <component v-if="appConfig.global.isPC" v-model:selectModule="currentSelectModule" :is="element.type" :config="element" :appConfig="appConfig" :is-viewer="isViewer"></component>
                  <u-text v-else v-model:selectModule="currentSelectModule" :is="element.type" :config="element" :appConfig="appConfig" :is-viewer="isViewer"></u-text>
                  <el-button v-if="currentSelectModule && currentSelectModule.key === element.key" title="查看代码" style="bottom: -20px" circle plain type="primary" class="widget-action-code" @click.stop="viewCode(element, index, config.columns, colIndex)">
                    <svg-icon name="yrt-pandianliebiao"></svg-icon>
                  </el-button>
                  <el-button v-if="currentSelectModule && currentSelectModule.key === element.key" title="删除" style="bottom: -20px" circle plain type="danger" class="widget-action-delete" @click.stop="handleWidgetDelete(col.fields, index)">
                    <svg-icon name="yrt-shanchu2"></svg-icon>
                  </el-button>
                </div>
              </template>
            </draggable>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, getCurrentInstance, computed } from 'vue';
import draggable from 'vuedraggable';

// uviewui基础组件
import uInput from './u-input.vue';
import uText from './u-text.vue';
import uDatetimePicker from './u-datetime-picker.vue';
import uPicker from './u-picker.vue';
import uUpload from './u-upload.vue';
import uRadio from './u-radio.vue';
import uContent from './u-content.vue';

// PC组件
import pcStat from '../pc/pc-stat.vue';
import pcNav from '../pc/pc-nav.vue';
import pcStatAll from '../pc/pc-stat-all.vue';
import pcLineChart from '../pc/pc-line-chart.vue';
import pcBarChart from '../pc/pc-bar-chart.vue';
import pcLineBarChart from '../pc/pc-line-bar-chart.vue';
import pcPieChart from '../pc/pc-pie-chart.vue';
import pcRingChart from '../pc/pc-ring-chart.vue';
import pcTable from '../pc/pc-table.vue';

export default {
  name: 'app-design-left-panel',
  components: {
    draggable,

    uInput,
    uText,
    uDatetimePicker,
    uPicker,
    uUpload,
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
    // 整个配置
    appConfig: {
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
    // 配置参数
    config: {
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
    // 查看代码
    viewCode: {
      type: Function,
      default: () => {
        return () => {};
      },
    },
  },
  setup() {
    const { proxy } = getCurrentInstance() as any;
    const state = reactive({
      form: {
        value: null,
      },
    });

    // 当前选中模块双向绑定
    const currentSelectModule = computed({
      get() {
        return proxy.selectModule;
      },
      set(value) {
        proxy.$emit('update:selectModule', value);
      },
    });

    //#region
    let method = {
      // 选中模块
      onClickDragItem(element: any) {
        proxy.currentSelectModule = element;
      },
      handleWidgetColAdd($event: any, row: any, colIndex: any) {
        const newIndex = $event.newIndex;
        const oldIndex = $event.oldIndex;
        const item = $event.item;
        const clone = $event.clone;

        // 拖拽新组件时，防止布局元素的嵌套拖拽
        if (item.innerText === '栅格布局' && $event.to.className === 'grid-column') {
          // 如果是列表中拖拽的元素需要还原到原来位置
          // item.tagName === "DIV" && proxy.appConfig.modules.splice(oldIndex, 0, row.columns[colIndex].fields[newIndex]);
          row.columns[colIndex].fields.splice(newIndex, 1);
          return false;
        }

        const key = Date.parse('' + new Date()) + '_' + Math.ceil(Math.random() * 99999);

        row.columns[colIndex].fields[newIndex] = {
          ...proxy.common.deepCopy(row.columns[colIndex].fields[newIndex]),
          key,
        };

        if (row.columns[colIndex].fields[newIndex].type === 'radio' || row.columns[colIndex].fields[newIndex].type === 'checkbox') {
          row.columns[colIndex].fields[newIndex] = {
            ...row.columns[colIndex].fields[newIndex],
            options: {
              ...row.columns[colIndex].fields[newIndex].options,
              options: row.columns[colIndex].fields[newIndex].options.options.map((item: any) => ({
                ...item,
              })),
            },
          };
        }
        delete row.columns[colIndex].fields[newIndex].icon;
        proxy.currentSelectModule = row.columns[colIndex].fields[newIndex];
      },
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

    return {
      ...toRefs(state),
      currentSelectModule,
      ...method,
    };
  },
};
</script>

<style lang="scss" scoped>
.grid-container {
  min-width: 0;
  max-width: 100%;

  .widget-view {
    position: relative;
  }
  .widget-view::after {
    position: absolute;
    content: ' ';
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    display: block;
    z-index: 1001;
  }
  .data-grid {
    min-width: 0;
    max-width: 100%;

    ::v-deep(.el-form .el-form-item:last-of-type) {
      margin-bottom: 5px !important;
    }
    .grid-column {
      min-width: 0;
      min-height: 40px;
    }
    .drag-row {
      border: 0px dashed var(--color-whites);
      cursor: pointer;
      position: relative;
      &.select-item {
        border: 1px solid var(--color-primary);
      }
    }
    .grid-nest {
      background-color: rgb(245, 90, 90);
      color: white;
      border: 1px dashed var(--color-primary);
      padding: 10px;
    }
    .widget-action-code {
      position: absolute;
      right: 60px;
      bottom: -35px;
      z-index: 1009;
    }
    .widget-action-delete {
      position: absolute;
      right: 20px;
      bottom: -35px;
      z-index: 1009;
    }
  }
}

@media screen and (max-width: 900px) {
  .grid-container .data-grid {
    :deep(.widget-grid) {
      row-gap: 12px;
    }

    :deep(.widget-grid > .el-col) {
      flex: 0 0 100%;
      max-width: 100%;
    }
  }
}
</style>
