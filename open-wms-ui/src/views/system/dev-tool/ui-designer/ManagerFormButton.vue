<template>
  <div :class="{ active: selectWidget && selectWidget.key == element.key }" class="button-item" @click.stop="handleSelectWidget(index)">
    <div v-if="element.type == 'button'" class="btn">
      <el-button :key="index" :type="element.options.type">
        <template #icon>
          <svg-icon :name="element.options.icon" class="text-size-n" :size="14" />
        </template>
        {{ element.label }}
      </el-button>
    </div>
    <div v-else-if="element.type == 'button-dropdown'" class="btn">
      <el-dropdown :key="index" v-bind="element.options">
        <el-button :type="element.options.type">
          <i :class="element.options.icon"></i>
          {{ element.label }}
          <i class="el-icon-arrow-down el-icon-right"></i>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="(item, itemIndex) in element.options.options" :key="itemIndex">{{ item.label }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div class="tool">
      <el-button circle plain type="danger" title="删除" size="small" @click.stop="handleWidgetDelete(index)">
        <i class="yrt-shanchu2"></i>
      </el-button>
      <el-button circle plain type="primary" title="复制" size="small" @click.stop="handleWidgetClone(index)">
        <i class="yrt-fuzhi4"></i>
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    element: {
      type: Object,
      default: () => {
        return {};
      },
    },
    select: {
      type: Object,
      default: () => {
        return {};
      },
    },
    index: {
      type: Number,
      default: null,
    },
    buttons: {
      type: Array,
      default: () => {
        return [];
      },
    },
    configType: {
      type: String,
      default: null,
    },
  },
  data() {
    return {};
  },
  computed: {
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
    handleSelectWidget(index) {
      this.selectWidget = this.buttons[index];
      this.$emit('update:configType', 'WidgetConfig');
    },
    handleWidgetDelete(index) {
      if (this.buttons.length - 1 === index) {
        if (index === 0) {
          this.selectWidget = {};
        } else {
          this.selectWidget = this.buttons[index - 1];
        }
      } else {
        this.selectWidget = this.buttons[index + 1];
      }

      this.$nextTick(() => {
        this.buttons.splice(index, 1);
      });
    },
    handleWidgetClone(index) {
      const cloneData = {
        ...this.buttons[index],
        key: Date.parse(new Date()) + '_' + Math.ceil(Math.random() * 99999),
      };

      this.buttons.splice(index, 0, cloneData);

      this.$nextTick(() => {
        this.selectWidget = this.buttons[index + 1];
      });
    },
  },
};
</script>
