<template>
  <div class="detail-container" :class="[currentSelectModule === config ? 'active' : '']">
    <div class="detail-title">
      <div class="title">{{ config.options.title }}</div>
      <!-- <div class="sub-title">按钮区域</div> -->
    </div>
    <draggable v-model="config.buttons" item-key="key" group="app" ghost-class="ghost-item" chosen-class="chosen-item" drag-class="drag-item" class="button-box" @add="handleButtonAdd($event, config, colIndex)">
      <template #item="{ element, index }">
        <div :class="['button-item', currentSelectModule === element ? 'active' : '']" @click.stop="onClickDragItem(element)">
          <component v-if="element.type === 'u-button'" v-model:selectModule="currentSelectModule" :is="element.type" :config="element" :appConfig="appConfig"></component>
          <div v-else class="invalid">无效组件，请删除</div>
          <el-button v-if="currentSelectModule && currentSelectModule.key === element.key" title="删除" style="bottom: -20px" circle plain type="danger" class="widget-action-delete" @click.stop="handleWidgetDelete(config.buttons, index)">
            <svg-icon name="yrt-shanchu2"></svg-icon>
          </el-button>
        </div>
      </template>
    </draggable>

    <draggable v-model="config.fields" item-key="key" group="app" ghost-class="ghost-item" chosen-class="chosen-item" drag-class="drag-item" class="detail-list" @add="handleWidgetSubAdd($event, config, colIndex)">
      <template #item="{ element, index }">
        <div :class="['detail-row', currentSelectModule === element ? 'active' : '']" @click.stop="onClickDragItem(element)">
          <component v-model:selectModule="currentSelectModule" :is="element.type" :config="element" :appConfig="appConfig"></component>
          <el-button v-if="currentSelectModule && currentSelectModule.key === element.key" title="删除" style="bottom: -20px" circle plain type="danger" class="widget-action-delete" @click.stop="handleWidgetDelete(config.fields, index)">
            <svg-icon name="yrt-shanchu2"></svg-icon>
          </el-button>
        </div>
      </template>
    </draggable>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, getCurrentInstance, computed } from 'vue';
import draggable from 'vuedraggable';

// uviewui基础组件
import uInput from './u-input.vue';
import uText from './u-text.vue';
import uDatetimePicker from './u-datetime-picker.vue';
import uGrid from './u-grid.vue';
import uButton from './u-button.vue';
import uUpload from './u-upload.vue';

export default {
  name: 'app-design-left-panel',
  components: {
    draggable,

    uInput,
    uText,
    uDatetimePicker,
    uGrid,
    uButton,
    uUpload,
  },
  props: {
    // 整个配置
    appConfig: {
      type: Object,
      default: () => {
        return {};
      },
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
      // 明细添加
      handleWidgetSubAdd($event: any, row: any, colIndex: any) {
        // console.log('coladd', $event, row, colIndex)
        const newIndex = $event.newIndex;
        const oldIndex = $event.oldIndex;
        const item = $event.item;

        // 防止布局元素的嵌套拖拽
        if (item.className.indexOf('data-grid') >= 0) {
          // 如果是列表中拖拽的元素需要还原到原来位置
          item.tagName === 'DIV' && proxy.appConfig.modules.splice(oldIndex, 0, row.fields[newIndex]);

          row.fields.splice(newIndex, 1);

          return false;
        }

        // console.log('from', item)

        const key = Date.parse('' + new Date()) + '_' + Math.ceil(Math.random() * 99999);

        row.fields[newIndex] = {
          ...proxy.common.deepCopy(row.fields[newIndex]),
          key,
        };

        if (row.fields[newIndex].type === 'radio' || row.fields[newIndex].type === 'checkbox') {
          row.fields[newIndex] = {
            ...row.fields[newIndex],
            options: {
              ...row.fields[newIndex].options,
              options: row.fields[newIndex].options.options.map((item: any) => ({
                ...item,
              })),
            },
          };
        }
        delete row.fields[newIndex].icon;
        proxy.currentSelectModule = row.fields[newIndex];
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

    return {
      ...toRefs(state),
      currentSelectModule,
      ...method,
    };
  },
};
</script>

<style lang="scss" scoped>
.detail-container {
  min-height: 80px;
  background-color: rgb(255, 255, 255);
  border: 1px solid #ccc;
  cursor: pointer;
  position: relative;
  margin-bottom: 10px;
  padding: 0px 5px;
  &.active {
    background-color: rgb(255, 255, 255);
  }

  .detail-title {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid rgb(228, 228, 228);
    margin-bottom: 10px;

    flex-wrap: wrap;
    .title {
      padding: 10px;
    }
    .sub-title {
      padding: 10px;
    }
  }

  .widget-action-delete {
    position: absolute;
    right: 20px;
    bottom: -35px;
    z-index: 1009;
  }
  .button-box {
    padding: 2px;
    min-height: 50px;
    border: 1px solid rgb(228, 228, 228);
    position: relative;
    z-index: 2;
    display: flex;
    &::before {
      content: '明细按钮区域';
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
    }
  }
  .detail-list {
    height: 300px;
    .detail-row {
      background-color: rgb(255, 255, 255);
      position: relative;
      &.active {
        background-color: rgb(148, 240, 247);
        border: 1px solid rgb(74, 175, 243);
      }
    }
  }
}
</style>
