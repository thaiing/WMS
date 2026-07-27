<template>
  <div :class="classes"></div>
</template>

<script>
export default {
  props: {
    split: {
      validator(value) {
        return ["vertical", "horizontal"].indexOf(value) >= 0;
      },
      required: true
    },
    className: {
      type: String,
      default: null,
      required: false
    }
  },
  computed: {
    classes() {
      const classes = ["splitter-pane-resizer", this.split, this.className];
      return classes.join(" ");
    }
  }
};
</script>

<style scoped>
.splitter-pane-resizer {
	-moz-box-sizing: border-box;
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
	background-color: #f0f0f0;
	opacity: 0.2;
	z-index: 1;
	-moz-background-clip: padding;
	-webkit-background-clip: padding;
	background-clip: padding-box;
	float: left;
}

.splitter-pane-resizer.horizontal {
	height: 11px;
	margin: -5px 0;
	border-top: 5px solid rgba(255, 255, 255, 0);
	border-bottom: 5px solid rgba(255, 255, 255, 0);
	cursor: row-resize;
	width: 100%;
}

.splitter-pane-resizer.vertical {
	width: 11px;
	margin-bottom: 0px;
	padding-bottom: 0px;
	margin-left: -5px;
	border-left: 5px solid rgba(255, 255, 255, 0);
	border-right: 5px solid rgba(255, 255, 255, 0);
	cursor: col-resize;
}
</style>
