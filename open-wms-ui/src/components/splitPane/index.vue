<template>
  <div :style="{ cursor, userSelect }" class="vue-splitter-container clearfix" @mouseup="onMouseUp" @mousemove="onMouseMove">
    <pane :split="split" :style="{ [type]: leftWidth }" class="splitter-pane splitter-paneL">
      <slot name="paneL"></slot>
    </pane>

    <resizer :class-name="className" :split="split" @mousedown="onMouseDown" @click="onClick"></resizer>

    <pane :split="split" :style="{ [type]: rightWidth }" class="splitter-pane splitter-paneR">
      <slot name="paneR"></slot>
    </pane>
  </div>
</template>

<script>
import Resizer from './resizer.vue';
import Pane from './pane.vue';

export default {
  name: 'splitPane',
  components: { Resizer, Pane },
  props: {
    minWidth: {
      type: Number,
      default: 0,
    },
    maxWidth: {
      type: Number,
      default: 500,
    },
    defaultWidth: {
      type: Number,
      default: 150,
    },
    split: {
      validator(value) {
        return ['vertical', 'horizontal'].indexOf(value) >= 0;
      },
      required: true,
    },
    className: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      active: false,
      hasMoved: false,
      height: null,
      width: this.defaultWidth,
      type: this.split === 'vertical' ? 'width' : 'height',
    };
  },
  computed: {
    userSelect() {
      return this.active ? 'none' : '';
    },
    cursor() {
      return this.active ? 'col-resize' : '';
    },
    rightWidth() {
      var width = 'calc(100% - ' + this.width + 'px)';
      return width;
    },
    leftWidth() {
      return this.width + 'px';
    },
  },
  methods: {
    onClick() {
      if (!this.hasMoved) {
        // this.width = 50
        this.$emit('resize');
      }
    },
    onMouseDown() {
      this.active = true;
      this.hasMoved = false;
    },
    onMouseUp() {
      this.active = false;
    },
    onMouseMove(e) {
      if (e.buttons === 0 || e.which === 0) {
        this.active = false;
      }

      if (this.active) {
        let offset = 0;
        let target = e.currentTarget;
        if (this.split === 'vertical') {
          while (target) {
            offset += target.offsetLeft;
            target = target.offsetParent;
          }
        } else {
          while (target) {
            offset += target.offsetTop;
            target = target.offsetParent;
          }
        }

        const currentPage = this.split === 'vertical' ? e.pageX : e.pageY;
        /* const targetOffset =
          this.split === "vertical"
            ? e.currentTarget.offsetWidth
            : e.currentTarget.offsetHeight; */
        const width = currentPage - offset;
        // console.log('currentPage=' + currentPage + ", offset=" + offset + ", targetOffset=" + targetOffset);

        if (width > this.minWidth && width < this.maxWidth) {
          this.width = width;
        }

        this.$emit('resize');
        this.hasMoved = true;
      }
    },
  },
};
</script>

<style scoped>
.clearfix:after {
  visibility: hidden;
  display: block;
  font-size: 0;
  content: ' ';
  clear: both;
  height: 0;
}

.vue-splitter-container {
  display: flex;
  justify-content: flex-start;
}
</style>
