<template>
	<div :class="['popup-right-container']" :style="style" @click.stop>
		<header>
			<slot name="header"></slot>
		</header>
		<main>
			<slot></slot>
		</main>
		<footer>
			<slot name="footer"></slot>
		</footer>
	</div>
</template>

<script>
export default {
	name: 'popupRight',
	props: {
		top: {
			type: String,
			required: true,
			default: '200px',
		},
		width: {
			type: String,
			required: true,
			default: '200px',
		},
		spanWidth: {
			// 右侧间隙补差
			type: Number,
			default: 0,
		},
		height: {
			type: String,
			required: true,
			default: '400px',
		},
		isActive: {
			type: Boolean,
			required: true,
			default: false,
		},
	},
	data() {
		return {};
	},
	computed: {
		style: function () {
			var s = {
				top: this.top,
				height: this.height,
				width: this.width,
				right: '-' + (parseInt(this.width) + this.spanWidth) + 'px',
				transform: 'translateX(-' + (this.isActive ? parseInt(this.width) : 0) + 'px)',
				'-webkit-transform': 'translateX(-' + (this.isActive ? parseInt(this.width) : 0) + 'px)',
			};
			return s;
		},
	},
	methods: {},
};
</script>

<style lang="scss" scoped>
.popup-right-container {
	background-color: white;
	border-top: 1px solid #e4e7ed;
	border-left: 1px solid #e4e7ed;
	border-bottom: 1px solid #e4e7ed;
	border-top-left-radius: 4px;
	border-bottom-left-radius: 4px;
	position: absolute;
	background: #fff;
	transition: all 1s;
	-moz-transition: all 1s; /* Firefox 4 */
	-webkit-transition: all 1s; /* Safari and Chrome */
	-o-transition: all 1s; /* Opera */
	z-index: 3;
}
</style>
