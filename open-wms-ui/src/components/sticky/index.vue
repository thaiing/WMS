<template>
  <div :style="{ height: height, zIndex: zIndex }">
    <div :class="className" :style="{ top: top + 'px', zIndex: zIndex, position: position, width: width, height: height }">
      <slot>
        <div>sticky</div>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Sticky',
  props: {
    stickyTop: {
      type: Number,
      default: 0,
    },
    zIndex: {
      type: Number,
      default: 1,
    },
    className: {
      type: String,
      default: '',
    },
    height: {
      type: String,
      default: '100%',
    },
  },
  data() {
    return {
      active: false,
      position: '',
      width: undefined,
      isSticky: false,
      top: 0,
    };
  },
  mounted() {
    // let d = document.getElementById("designer-container").parentNode.parentNode.parentNode;
    // d.addEventListener("scroll", this.handleScroll);
    // d.addEventListener("resize", this.handleReize);
    this.mittBus.on('onMainScroll', (params) => {
      let { scrollLeft, scrollTop } = params;
      let { editorRefName, index } = params;
      this.handleScroll();
    });
    nextTick(() => {
      setTimeout(() => {
        this.handleScroll();
      }, 100);
    });
  },
  activated() {
    this.handleScroll();
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleReize);
  },
  methods: {
    sticky() {
      if (this.active) {
        return;
      }
      this.position = 'fixed';
      this.active = true;
      this.width = this.width + 'px';
      this.isSticky = true;
      this.top = this.stickyTop;
    },
    reset() {
      if (!this.active) {
        return;
      }
      this.position = '';
      this.width = 'auto';
      this.active = false;
      this.isSticky = false;
      this.top = 0;
    },
    handleScroll() {
      const width = this.$el.getBoundingClientRect().width;
      if (width && width > 20) {
        this.width = width + 'px';
      } else {
        this.width = 'auto';
      }
      const offsetTop = this.$el.getBoundingClientRect().top;
      if (offsetTop < this.stickyTop) {
        this.sticky();
        return;
      }
      this.reset();
    },
    handleReize() {
      if (this.isSticky) {
        const width = this.$el.getBoundingClientRect().width;
        if (width && width > 20) {
          this.width = width + 'px';
        } else {
          this.width = 'auto';
        }
      }
    },
  },
};
</script>
