<template>
	<div class="biz-container">
		<!--数据Table-->
		<yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes">
			<!--自定义字段插槽-->
			<template #common-column-slot="{ row, col }">
				<template v-if="col.prop == 'operParam'">
					<el-popover placement="bottom" title="请求参数" width="500" trigger="hover" :content="row.operParam">
						<template #reference>
							<el-button class="m-2">{{ displaySummary(row.operParam) }}</el-button>
						</template>
					</el-popover>
				</template>
				<template v-else-if="col.prop == 'jsonResult'">
					<el-popover placement="top-start" title="返回参数" width="500" trigger="hover" :content="row.jsonResult">
						<template #reference>
							<el-button class="m-2">{{ displaySummary(row.jsonResult) }}</el-button>
						</template>
					</el-popover>
				</template>
			</template>
		</yrt-data-list>

		<!--数据编辑器Editor-->
		<yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="detailButtonClick" :auth-nodes="state.authNodes"> </yrt-editor>

		<!--参数弹出窗-->
		<el-dialog draggable ref="jsonPreview" :modal="false" v-model="state.jsonVisible" append-to-body width="800px" top="5vh" title="参数列表" class="attribute-config-container">
			<v-ace-editor v-model:value="state.vueData" lang="json" theme="xcode" style="height: 300px" />
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="system-monitor-operLog">
import YrtDataList from '/@/components/common/yrtDataList.vue';
import yrtEditor from '/@/components/common/yrtEditor.vue';
import baseHook from '/@/components/hooks/baseHook';
import { generateMixinCode } from './generateMixinCode.js';

const base = baseHook();
const { baseState, dataListRefName, editorRefName, buttonClick, detailButtonClick, editorInfo } = base;

//#region 定义变量
const state = reactive({
	...toRefs(baseState),
	jsonVisible: false,
	// 模块字段信息
	moduleNode: {
		tableTenantName: '【请选择模块】',
		tableId: 0,
		tableName: null,
		parentId: null,
		detailName: null,
		idField: null,
		codeRegular: null,
		linkColumn: null,
		orderBy: {},
		vueData: '',
		prefixRouter: null,
		webRouter: null,
		editorType: 'dialog', // 对话框模式
	},
	vueData: '', // 创建混入文件内容
});
//#endregion

onMounted(() => {});

// 显示内容折叠
const displaySummary = (saleWhere: any) => {
	if (!saleWhere) {
		return '';
	}
	let w = saleWhere.substr(0, 50);
	if (saleWhere.length > 50) {
		w += '...';
	}
	return w;
};
// 显示内容
const displayText = (saleWhere: any) => {
	if (!saleWhere) {
		return '';
	}
	// state.jsonVisible = true;
	// state.vueData = generateMixinCode(saleWhere);
	return saleWhere;
};
</script>
