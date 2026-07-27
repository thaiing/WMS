<template>
	<div class="biz-container">
		<!--数据Table-->
		<yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes" :cell-style="cellStyle"> </yrt-data-list>

		<!--数据编辑器Editor-->
		<yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="base.detailButtonClick" :auth-nodes="state.authNodes" :on-save-before="base.onSaveBefore"> </yrt-editor>

		<!--修改合同状态-->
		<el-dialog v-model="state.statusVisible" draggable width="700px" title="修改合同状态" append-to-body>
			<el-form-item label="合同状态">
				<el-select v-model="state.from.contractSatus" placeholder="合同状态" class="input-300">
					<el-option v-for="(item, index) in state.options" :key="index" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="state.statusVisible = false">取 消</el-button>
					<el-button type="primary" @click="batchModify">确 认</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="basic-consignor-consignorContract">
import moment from 'moment';
import YrtDataList from '/@/components/common/yrtDataList.vue';
import yrtEditor from '/@/components/common/yrtEditor.vue';
import baseHook from '/@/components/hooks/baseHook';
import { BaseProperties } from '/@/types/base-type';
import { ComponentInternalInstance } from 'vue';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
import { ElMessageBox } from 'element-plus';
import { postData } from '/@/api/common/baseApi';
import to from 'await-to-js';

const base = baseHook();

const { baseState, dataListRefName, editorRefName, buttonClick, detailButtonClick, editorInfo, masterData } = base;

//#region 定义变量
const state = reactive({
	...toRefs(baseState),
	statusVisible: false,
	from: {
		contractSatus: '', // 选中的合同状态
	},
	options: [
		{
			value: '正常',
			label: '正常',
		},
		{
			value: '终止',
			label: '终止',
		},
		{
			value: '暂停',
			label: '暂停',
		},
	],
});
//#endregion

onMounted(() => {});

const cellStyle = (params: any) => {
	let { row, column, rowIndex, columnIndex } = params;
	const effetiveDays = row.effetiveDays; // 剩余有效天数
	const contractDays = row.contractDays; // 合同天数

	if (effetiveDays > contractDays / 3 && effetiveDays < (contractDays * 2) / 3) {
		// 当剩余有效天数大于合同天数的1/3，小于合同天数的2/3时，背景颜色将提示为橙黄色
		return { 'background-color': '#ff9900 !important', color: '#eee' };
	} else if (effetiveDays > 0 && effetiveDays < contractDays / 3) {
		//  当剩余有效天数大于0，小于合同天数的1/3时，背景颜色将提示为红色
		return { 'background-color': '#ff0033', color: '#eee' };
	} else if (effetiveDays < 0) {
		// 当剩余有效天数小于0，也就是合同已过期，背景颜色将提示为深红色
		return { 'background-color': '#990000', color: '#eee' };
	} else {
		return {
			'background-color': '',
			color: 'black',
		};
	}
};

// 保存前事件
base.onSaveBefore = (formData: any) => {
	//  var arr = JSON.parse(formData.expandFields);
	// var start = moment(formData.contractStartTime).format("YYYY-MM-DD HH:mm:ss");
	// var end = moment(formData.contractEndTime).format("YYYY-MM-DD HH:mm:ss");
	// formData.contractDays = end.subtract(start, "days");
	let contractDays = 0;
	let effetiveDays = 0;

	var start = moment(formData.contractStartTime);
	var end = moment(formData.contractEndTime);
	var now = moment();
	// 合同天数=合同结束日期-合同开始日期
	contractDays = end.diff(start, 'days');
	// 合同天数=合同结束日期-合同开始日期
	effetiveDays = end.diff(now, 'days');

	masterData.value.contractDays = contractDays;
	masterData.value.effetiveDays = effetiveDays;
	if (start > end) {
		proxy.$message.error('合同开始日期不能大于结束日期！');
		return false;
	}
	return true;
};
// 页面加载后事件
base.onEditLoadAfter = (master: any) => {};
// 列表页面按钮事件
base.buttonClick = (authNode: string) => {
	switch (authNode) {
		case 'contractAlter':
			contractAlter();
			return true;
	}
};
const contractAlter = () => {
	// 获得已选中的ID
	let selectInfos: Array<any> = state.dataListSelections;
	if (selectInfos.length !== 1) {
		proxy.$message.error('请选择一项进行修改状态操作！');
		return;
	}
	state.statusVisible = true;
};
//修改合同状态
const batchModify = () => {
	// 获得已选中的ID
	let selectInfos: Array<any> = state.dataListSelections;
	if (selectInfos.length !== 1) {
		proxy.$message.error('请选择一项进行修改状态操作！');
		return;
	}
	let ids = selectInfos.map((item) => item.contractId);
	const url = '/basic/consignor/consignorContract/contractAlter';

	ElMessageBox.confirm('确定操作当前选中的单据吗', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			const params = {
				ids: ids,
				contractSatus: state.from.contractSatus,
			};
			const [err, res] = await to(postData(url, params));
			if (err) {
				proxy.$message.error(err.message);
				return;
			}

			if (res.result) {
				state.from.contractSatus = '';
				state.statusVisible = false;
				base.dataListRef.value.loadData();
			}
		})
		.catch(() => {});
};
</script>
