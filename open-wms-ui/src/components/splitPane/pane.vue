<template>
  <div :class="classes">
    <slot></slot>
  </div>
</template>

<script>
export default {
	name: "Pane",
	props: {
		className: {
			type: String,
			default: null,
		},
	},
	data() {
		const classes = [this.$parent.split, this.className];
		return {
			classes: classes.join(" "),
			percent: 50,
		};
	},
};
</script>

<style scoped>
.splitter-pane.vertical.splitter-paneL {
	margin-bottom: 0px;
	padding-bottom: 0px;
}

.splitter-pane.vertical.splitter-paneR {
	margin-bottom: 0px;
	padding-bottom: 0px;
}

.splitter-pane.horizontal.splitter-paneL {
	position: absolute;
	top: 0px;
	width: 100%;
}

.splitter-pane.horizontal.splitter-paneR {
	position: absolute;
	bottom: 0px;
	width: 100%;
	padding-top: 3px;
}
</style>
