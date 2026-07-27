<template>
	<div class="right-container">
		<component :is="config.type" :config="config"></component>
	</div>
</template>

<script lang="ts">
import { reactive, toRefs } from 'vue';

import global from '../config/app/global.vue';
import bottom from '../config/app/bottom.vue';
import rotationChart from '../config/app/rotationChart.vue';
import productList from '../config/app/productList.vue';
import navGroup from '../config/app/navGroup.vue';
import newsBroadcast from '../config/app/newsBroadcast.vue';
import productType from '../config/app/productType.vue';
import newsList from '../config/app/newsList.vue';
import imageMagic from '../config/app/imageMagic.vue';
import searchBox from '../config/app/searchBox.vue';
import promotionList from '../config/app/promotionList.vue';
import titleHeader from '../config/app/titleHeader.vue';
import guideBlank from '../config/app/guideBlank.vue';
import guideLine from '../config/app/guideLine.vue';
import bargaining from '../config/app/bargaining.vue';
import combination from '../config/app/combination.vue';
import seckill from '../config/app/seckill.vue';
import coupon from '../config/app/coupon.vue';
import marketingMagic from '../config/app/marketingMagic.vue';
import userCenter from '../config/app/userCenter.vue';

// uviewui基础组件
import uInput from '../config/uviewui/u-input.vue';
import uText from '../config/uviewui/u-text.vue';
import uDatetimePicker from '../config/uviewui/u-datetime-picker.vue';
import uGrid from '../config/uviewui/u-grid.vue';
import uDetail from '../config/uviewui/u-detail.vue';
import uPicker from '../config/uviewui/u-picker.vue';
import uButton from '../config/uviewui/u-button.vue';
import uUpload from '../config/uviewui/u-upload.vue';
import uSplitter from '../config/uviewui/u-splitter.vue';
import uRadio from '../config/uviewui/u-radio.vue';
import uContent from '../config/uviewui/u-content.vue';

// PC组件
import pcStat from '../config/pc/pc-stat.vue';
import pcStatAll from '../config/pc/pc-stat-all.vue';
import pcNav from '../config/pc/pc-nav.vue';
import pcLineChart from '../config/pc/pc-line-chart.vue';
import pcBarChart from '../config/pc/pc-bar-chart.vue';
import pcLineBarChart from '../config/pc/pc-line-bar-chart.vue';
import pcPieChart from '../config/pc/pc-pie-chart.vue';
import pcRingChart from '../config/pc/pc-ring-chart.vue';
import pcTable from '../config/pc/pc-table.vue';

export default {
	name: 'app-design-right-panel',
	components: {
		global,
		bottom,
		rotationChart,
		productList,
		navGroup,
		newsBroadcast,
		productType,
		newsList,
		imageMagic,
		searchBox,
		promotionList,
		titleHeader,
		guideBlank,
		guideLine,
		bargaining,
		combination,
		seckill,
		coupon,
		marketingMagic,
		userCenter,

		uInput,
		uText,
		uDatetimePicker,
		uGrid,
		uDetail,
		uPicker,
		uButton,
		uUpload,
		uSplitter,
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
		// 选中项
		config: {
			type: Object,
			default: () => {
				return {};
			},
		},
	},
	setup() {
		// const { proxy } = getCurrentInstance() as any;
		const state = reactive({});

		return {
			...toRefs(state),
		};
	},
};
</script>

<style lang="scss" scoped>
.right-container {
	position: fixed;
	right: 0;
	top: 53px;
	bottom: 0;
	width: 400px;
	background-color: var(--color-whites);
}
</style>
