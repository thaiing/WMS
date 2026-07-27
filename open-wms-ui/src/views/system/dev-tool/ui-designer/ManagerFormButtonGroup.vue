<template>
  <draggable v-model="currentButtons" item-key="key" group="button-group" ghost-class="ghost" :animation="300" chosen-class="chosen-item" :sort="true" tag="div" class="draggable-main button-container" @add="handleButtonAdd">
    <template #item="{ element, index }">
      <template v-if="element.type == 'button-group'">
        <div :key="element.key" :class="{ active: selectWidget && selectWidget.key === element.key }" class="button-group" style="position: relative" @click.stop="handleSelectButton(index)">
          <draggable v-model="element.buttons" item-key="key" group="button-group" ghost-class="ghost" :animation="300" tag="div" class="draggable-main button-box" @add="($evt) => handleButtonGroupAdd($evt, element)">
            <template #item="scoped">
              <manager-form-button :key="scoped.element.key" :element="scoped.element" v-model:select="selectWidget" :index="scoped.index" :buttons="element.buttons" v-model:config-type="currentConfigType"></manager-form-button>
            </template>
          </draggable>
          <div class="tool">
            <el-button v-if="selectWidget && selectWidget.key == element.key" title="删除" style="bottom: -20px" class="widget-action-delete" circle plain type="danger" @click.stop="handleButtonDelete(index)">
              <i class="yrt-shanchu2"></i>
            </el-button>
          </div>
        </div>
      </template>
      <template v-else>
        <manager-form-button :key="element.key" :element="element" v-model:select="selectWidget" :index="index" :buttons="currentButtons" v-model:config-type="currentConfigType"></manager-form-button>
      </template>
    </template>
  </draggable>
</template>

<script>
import Draggable from 'vuedraggable';
import ManagerFormButton from './ManagerFormButton.vue';

export default {
  components: {
    Draggable,
    ManagerFormButton,
  },
  props: {
    select: {
      type: Object,
      default: () => {},
    },
    buttons: {
      type: Array,
      default: () => [],
    },
    configType: {
      type: String,
      default: 'WidgetConfig',
    },
  },
  data() {
    return {
      // selectWidget: this.select
    };
  },
  computed: {
    currentButtons: {
      get: function () {
        return this.buttons;
      },
      set: function (val) {
        this.$emit('update:buttons', val);
      },
    },
    currentConfigType: {
      get: function () {
        return this.configType;
      },
      set: function (val) {
        this.$emit('update:configType', val);
      },
    },
    selectWidget: {
      get: function () {
        return this.select;
      },
      set: function (val) {
        this.$emit('update:select', val);
      },
    },
  },
  watch: {
    select(val) {
      this.selectWidget = val;
    },
  },
  methods: {
    // 按钮添加
    handleButtonAdd(evt) {
      const newIndex = evt.newIndex;
      // 为拖拽到容器的元素添加唯一 key
      const key = Date.parse(new Date()) + '_' + Math.ceil(Math.random() * 99999);
      var button = this.currentButtons[newIndex];
      this.currentButtons[newIndex] = Object.assign({}, JSON.parse(JSON.stringify(button)), {
        key,
      });

      this.currentConfigType = 'WidgetConfig';
      this.selectWidget = this.currentButtons[newIndex];
    },
    // 按钮组添加
    handleButtonGroupAdd($event, row) {
      const newIndex = $event.newIndex;
      const oldIndex = $event.oldIndex;
      const item = $event.item;

      // 防止布局元素的嵌套拖拽
      if (item.className.indexOf('button-group') >= 0) {
        // 如果是列表中拖拽的元素需要还原到原来位置
        item.tagName === 'DIV' && this.currentButtons.splice(oldIndex, 0, row.buttons[newIndex]);

        row.buttons.splice(newIndex, 1);

        return false;
      }
      const key = Date.parse(new Date()) + '_' + Math.ceil(Math.random() * 99999);

      var button = row.buttons[newIndex];
      row.buttons[newIndex] = Object.assign({}, JSON.parse(JSON.stringify(button)), {
        key,
      });

      this.currentConfigType = 'WidgetConfig';
      this.selectWidget = row.buttons[newIndex];
    },
    // 按钮选择
    handleSelectButton(index) {
      this.selectWidget = this.currentButtons[index];
    },
    // 按钮删除
    handleButtonDelete(index) {
      var buttons = this.currentButtons;
      if (buttons.length - 1 === index) {
        if (index === 0) {
          this.selectWidget = {};
        } else {
          this.selectWidget = buttons[index - 1];
        }
      } else {
        this.selectWidget = buttons[index + 1];
      }

      this.$nextTick(() => {
        buttons.splice(index, 1);
      });
    },
  },
};
</script>
