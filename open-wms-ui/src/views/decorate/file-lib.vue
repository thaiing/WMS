
<template>
  <div ref="container" class="page-list-container">
    <div class="box-card">
      <div class="title">素材中心</div>
    </div>
    <filer></filer>
  </div>
</template>

<script lang="ts">
import { toRefs, reactive, getCurrentInstance, onMounted } from "vue";
import filer from "/@/components/base/filer.vue";

export default {
	name: "decorate-file-lib",
	components: { filer },
	setup() {
		const { proxy } = getCurrentInstance() as any;
		proxy;
		//#region 变量
		const state: any = reactive({});
		//#endregion

		let method = {};

		onMounted(async () => {});

		return {
			...toRefs(state),
			...method,
		};
	},
};
</script>

<style lang="scss" scoped>
@import "/@/theme/page.scss";
.box-card {
	border-radius: var(--border-radius);
	border: 1px solid var(--el-border-color-light);
	background-color: var(--el-color-white);
	padding: 20px;
	margin-bottom: 10px;
}
</style>

    