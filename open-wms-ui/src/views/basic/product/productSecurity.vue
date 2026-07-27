<template>
	<div class="biz-container">
		<!--数据Table-->
		<yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes"></yrt-data-list>

		<!--数据编辑器Editor-->
		<yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="base.detailButtonClick" :auth-nodes="state.authNodes" :on-save-before="base.onSaveBefore" @on-save-after="base.onSaveAfter" @on-change="base.onChange" @on-detail-change="base.onDetailChange" @on-edit-load-before="base.onEditLoadBefore" @on-edit-load-after="base.onEditLoadAfter" :use-detail-slot="['history']">
			<!--自定义字段插槽-->
			<template #detail-column-slot="{ row, col }">
				<template v-if="col.prop == 'history'">
					<product-security-history :load-options="state.productSecurityHistoryLoadOptionsDetail" :where="{ securityDetailId: row.securityDetailId }">
						<template #content>
							<el-tag color="#00ff99" style="color: black; border: 0; cursor: pointer"> 查看轨迹 </el-tag>
						</template>
					</product-security-history>
				</template>
			</template>
		</yrt-editor>

		<!--生成防伪码对话框-->
		<el-dialog draggable v-model="state.createSecurityVisible" title="生成防伪码" width="30%" append-to-body>
			<el-form label-width="120px">
				<el-form-item label="产品名称">
					<table-select
						:ref="state.productTableSelect"
						v-model="state.subForm.productName"
						:table-data="state.productDataList"
						:field="state.field"
						class="w-250"
						:popover-width="420"
						:table-max-height="500"
						label-field="productName"
						label="商品名称"
						trigger="focus"
						tabindex="1"
						@on-key-up="
							(ref, val, event, productDataList) => {
								onProductKeyup(ref, val, event, productDataList);
							}
						"
						@on-key-down="
							(ref, val, event, productDataList) => {
								onProductKeydown(ref, val, event, productDataList);
							}
						"
						@on-row-change="
							(ref, rowData) => {
								onProductRowChange(ref, rowData, state.subForm);
							}
						"
					>
						<template #column>
							<el-table-column property="productName" :label="$tt('商品名称')" width="200"></el-table-column>
							<el-table-column property="productModel" :label="$tt('条码')" width="120"></el-table-column>
						</template>
					</table-select>
				</el-form-item>
				<el-form-item label="批次名称">
					<el-input v-model="state.subForm.batchNumber" class="w-250" placeholder="请输入批次名称"></el-input>
				</el-form-item>
				<el-form-item label="批次编号">
					<el-input v-model="state.subForm.batchCode" class="w-250" placeholder="请输入批次编号"></el-input>
				</el-form-item>
				<el-form-item label="生产企业">
					<el-input v-model="state.subForm.produceEnterprise" class="w-250" placeholder="请输入生产企业" disabled></el-input>
				</el-form-item>
				<el-form-item label="原产地">
					<el-input v-model="state.subForm.originPlace" class="w-250" placeholder="请输入原产地" disabled></el-input>
				</el-form-item>
				<el-form-item label="生成标签数量">
					<el-input v-model="state.subForm.quantity" type="number" class="w-250" placeholder="请输入生成标签数量"></el-input>
				</el-form-item>
				<el-form-item label="备注">
					<el-input v-model="state.subForm.remark" class="w-250" placeholder="请输入备注"></el-input>
				</el-form-item>
				<el-form-item label="上传图片" class="margin-bottom-10">
					<upload-file :value.sync="state.subForm.productImageUrl"></upload-file>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="state.createSecurityVisible = false">取 消</el-button>
				<el-button :loading="state.loading" type="primary" @click="createSecurity">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="basic-product-productSecurity">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';
import YrtDataList from '/@/components/common/yrtDataList.vue';
import baseHook from '/@/components/hooks/baseHook';
import to from 'await-to-js';
import { postData } from '/@/api/common/baseApi';
const yrtEditor = defineAsyncComponent(() => import('/@/components/common/yrtEditor.vue'));

const ProductSecurityHistory = defineAsyncComponent(() => import('./components/product-security-history.vue'));

let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

const base = baseHook();
const { baseState, dataListRefName, editorRefName, editorInfo, masterData } = base;

//#region 定义变量
const state = reactive({
	...toRefs(baseState),
	loading: false,
	subForm: {
		productId: null,
		productCode: null,
		productName: null,
		productModel: null,
		unit: null,
		batchNumber: null,
		batchCode: null,
		produceEnterprise: null,
		originPlace: null,
		quantity: null,
		remark: null,
		productImageUrl: [],
	} as any,
	// 商品明细选择下拉框ref名称
	productTableSelect: 'tableSelect',
	createSecurityVisible: false, // 生成防伪码窗口
	dropDownList_unit: [],
	productDataList: [],
	productSecurityHistoryLoadOptionsDetail: {
		prefixRouter: 'basic/product/productSecurityHistory',
		folder: 'basic/product',
		// projectName: 'ERP.Storage',
		tableName: 'base_product_security_history',
		idField: 'security_history_id',
		orderBy: 'security_history_id DESC, security_history_id',
		pageIndex: 1,
		pageSize: 100,
		menuId: -1,
	},
	tableData: [] as any[],
	field: {
		options: {
			prop: 'productName',
			searchFields: 'productName',
		},
	},
	searchHandle: 0 as unknown as NodeJS.Timeout,
});
//#endregion

onMounted(() => {
	getUnit();
	getProductList();
});
// 主表按钮事件
base.buttonClick = (authNode: string) => {
	switch (authNode) {
		case 'createSecurity':
			createSecurityDialog();
			return false;
		case 'cancel':
			cancel();
			return false;
	}
};

// 编辑页面按钮事件
base.detailButtonClick = (authNode: string, detail: any, btnOpts: any) => {
	switch (authNode) {
		case 'detailCancel':
			// 商品明细添加
			detailCancel(detail.options.detailSelections);
			return true;
		case 'detailPrint':
			// 商品明细添加
			detailPrint();
			return true;
	}
};
// 作废
const cancel = async () => {
	const securityIds = state.dataListSelections.map((m: any) => {
		return m.securityId;
	});
	if (securityIds.length <= 0) {
		proxy.$message.error('请至少选择一行数据！');
		return false;
	}
	var url = '/basic/product/productSecurity/cancel';
	var params = {
		securityIds: securityIds,
	};
	const [err, res] = await to(postData(url, params));
	if (err) {
		return;
	}
	proxy.common.showMsg(res);

	if (res.result) {
		base.dataListRef.value.reload(); // 刷新列表数据
	}
};

// 明细作废
const detailCancel = async (detailSelections: any) => {
	const securityDetailIds = [] as any[];
	if (detailSelections.length < 1) {
		proxy.$message.error('至少选中一行明细数据!');
		return false;
	}
	// this.batchimportVisible = true;
	detailSelections.forEach((rowData: any) => {
		securityDetailIds.push(rowData.securityDetailId);
	});
	var url = '/basic/product/productSecurity/detailCancel';
	var params = {
		securityDetailIds: securityDetailIds,
	};
	const [err, res] = await to(postData(url, params));
	if (err) {
		return;
	}
	proxy.common.showMsg(res);

	if (res.result) {
		base.dataListRef.value.loadData(); // 刷新页面
	}
};
// 明细打印
const detailPrint = () => {
	state.tableData = [] as any[];
	if (base.editorRef.value.detailFields[0].options.detailSelections.length < 1) {
		proxy.$message.error('至少选中一行明细数据!');
		return false;
	}
	// state.batchimportVisible = true;
	base.editorRef.value.detailFields[0].options.detailSelections.forEach((rowData: any) => {
		state.tableData.push({
			securityCode: rowData.securityCode,
			productName: base.masterData.value.productName,
			productCode: base.masterData.value.productCode,
			productSpec: base.masterData.value.productSpec,
			originPlace: base.masterData.value.originPlace,
			produceEnterprise: base.masterData.value.produceEnterprise,
			batchNumber: base.masterData.value.batchNumber,
			batchCode: base.masterData.value.batchCode,
		});
	});
	localStorage.setItem('printType', '商品防伪码打印');
	localStorage.setItem('tableData', JSON.stringify(state.tableData));
	var url = '/inbound/purchase/print-barcode';
	window.open(url);
};

// 生成防伪码弹窗
const createSecurityDialog = () => {
	state.subForm = {
		productId: null,
		productCode: null,
		productName: null,
		productModel: null,
		unit: null,
		batchNumber: null,
		batchCode: null,
		produceEnterprise: null,
		originPlace: null,
		quantity: null,
		remark: null,
		productImageUrl: [],
	};
	// 生成防伪码
	state.createSecurityVisible = true;
};
// 生成防伪码
const createSecurity = () => {
	if (!state.subForm.batchNumber) {
		proxy.$message.error('批次名称不能为空');
		return;
	}
	if (!state.subForm.batchCode) {
		proxy.$message.error('批次编号不能为空');
		return;
	}
	if (!state.subForm.quantity) {
		proxy.$message.error('生成标签数量不能为空');
		return;
	}

	if (state.subForm.productImageUrl.length > 0) {
		state.subForm.productImageUrl = state.subForm.productImageUrl ? state.subForm.productImageUrl[0].url : null;
	}
	state.subForm.expandFields = null;

	proxy
		.$confirm('提示：确认生成防伪码', '生成防伪码', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning',
		})
		.then(async () => {
			state.loading = true;

			// const formData = state.dataListSelections[0];
			const ids = state.dataListSelections.map((item: any) => item.planId);
			const url = '/basic/product/productSecurity/createSecurity'; //
			const params = {
				productId: state.subForm.productId,
				productCode: state.subForm.productCode,
				productName: state.subForm.productName,
				productModel: state.subForm.productModel,
				unit: state.subForm.unit,
				batchNumber: state.subForm.batchNumber,
				batchCode: state.subForm.batchCode,
				produceEnterprise: state.subForm.produceEnterprise,
				originPlace: state.subForm.originPlace,
				quantity: state.subForm.quantity,
				remark: state.subForm.remark,
				productImageUrl: state.subForm.productImageUrl,
			};
			const [err, res] = await to(postData(url, params));
			if (err) {
				return;
			}
			proxy.common.showMsg(res);

			state.loading = false;
			if (res.result) {
				state.createSecurityVisible = false;
				base.dataListRef.value.reload(); // 刷新列表数据
			}
		})
		.catch(() => {
			proxy.$message.info('已取消');
		});
};

// 获取下拉框值(按实际来)
const getUnit = async () => {
	var url = '/system/dataHandler/dropdown/loadDropDown';
	var params = Object.assign({}, state.dataOptions, {
		typeId: '535', //
	});
	let [err, res] = await to(postData(url, params));
	if (err) {
		return;
	}

	if (res?.result) {
		state.dropDownList_unit = res.dataList;
	}
};
const remoteMethod = async (query: any) => {
	const url = '/basic/product/product/getList';
	const params = { name: query, appendField: '*' };

	const [err, res] = await to(postData(url, params));
	if (err) {
		return;
	}
	proxy.common.showMsg(res);

	if (res.result) {
		state.productDataList = res.data;
	}
};

const getProductList = async () => {
	const url = `/basic/product/product/getList`;
	var params = { appendField: '*' };

	const [err, res] = await to(postData(url, params));
	if (err) {
		return;
	}
	proxy.common.showMsg(res);

	if (res.result) {
		state.productDataList = res.data;
	}
};

// 商品名称下拉框输入改变后
const onProductKeyup = (ref: any, val: any, event: any, productDataList: any) => {
	if (!val) {
		productDataList = [];
		return;
	}

	clearTimeout(state.searchHandle);
	state.searchHandle = setTimeout(async () => {
		const url = '/basic/product/product/getList';
		const params = {
			name: val,
		};

		const [err, res] = await to(postData(url, params));
		if (err) {
			return;
		}
		proxy.common.showMsg(res);

		if (res.result) {
			productDataList.length = 0;
			for (const item of res.data) {
				productDataList.push(item);
			}
		}
	}, 800);
};
// 商品名称keydown事件
const onProductKeydown = (ref: any, val: any, event: any, productDataList: any) => {
	// tab keycode
	// if (event.keyCode === 9 && this.$refs[this.productTableSelect].getCurrrentIndex() < 0) {
	//   this.$refs[this.productTableSelect].setCurrentIndex(0);
	// } else {
	//   const index = this.$refs[this.productTableSelect].getCurrrentIndex();
	//   this.$refs[this.productTableSelect].setCurrentIndex(index);
	// }
};
// 商品名称下拉框行数据单击事件
const onProductRowChange = (ref: any, rowData: any, scopeRow: any) => {
	state.subForm.productId = rowData.productId;
	state.subForm.productCode = rowData.productCode;
	state.subForm.productName = rowData.productName;
	state.subForm.productModel = rowData.productModel;
};
</script>
