<template>
	<div>
		<el-dialog draggable v-model="currentVisible" :title="$tt('拆分单据')" width="800px" append-to-body>
			<el-form :label-width="state.formLabelWidth">
				<el-form-item style="width: 90%">
					<el-alert width="90%" :title="$tt('提示：下面可改变需要拆分到新订单的实际数量。注意：拆单成功后，请及时审核，否则再次同步该订单，会覆盖该订单明细，导致明细重复。')" type="info"> </el-alert>
					<el-table :data="state.splitDetails" style="width: 100%">
						<el-table-column prop="orderDetailId" :label="$tt('明细id')" width="180"> </el-table-column>
						<el-table-column prop="productModel" :label="$tt('条形码')" width="180"> </el-table-column>
						<el-table-column prop="quantity" :label="$tt('拆分数量')">
							<template #default="{ row }">
								<el-form :model="row">
									<el-form-item prop="login">
										<el-input v-show="true" v-model="row.quantity" :placeholder="$tt('请输入拆分数量')" />
									</el-form-item>
								</el-form>
							</template>
						</el-table-column>
					</el-table>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="currentVisible = false">{{ $tt('取 消') }}</el-button>
				<el-button type="primary" @click="addSplitOrder()">{{ $tt('确 定') }}</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="order-detail-split">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
import { postData } from '/@/api/common/baseApi';
import to from 'await-to-js';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
const emit = defineEmits(['update:visible', 'on-closed']);

//#region 定义属性
const props = defineProps({
	visible: Boolean,
});
//#endregion

//#region 定义变量
const state = reactive({
	formLabelWidth: '120px', // 弹出框显示的宽度
	// 明细拆分列表
	splitDetails: [],
	// 订单ID
	order_Id: 0,
});
//#endregion

//#region 是否显示dialog
const currentVisible = computed({
	get() {
		return props.visible;
	},
	set(newValue) {
		emit('update:visible', newValue); // 双向绑定prop.action，通知父级组件变量值同步更新
	},
});
//#endregion

// 接受预到货单主表信息
const initData = (rows: any, order_Id: any) => {
	state.splitDetails = rows;
	state.order_Id = order_Id;
};
// 确认拆分订单
const addSplitOrder = () => {
	const the = this;
	const productModelList = [] as any[];
	let modelInfo = {};
	state.splitDetails.forEach((a: any) => {
		modelInfo = {
			orderDetailId: a.orderDetailId,
			productModel: a.productModel,
			quantity: a.quantity,
		};
		productModelList.push(modelInfo);
	});

	proxy
		.$confirm('确定要进行拆分操作吗?', '拆分单据', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning',
		})
		.then(async () => {
			const url = '/inbound/in/order/splitOrder';
			const params = {
				order_Id: state.order_Id,
				productModelList: productModelList,
			};
			const [err, res] = await to(postData(url, params));
			if (err) {
				proxy.$message.error(err.message);
				return;
			}
			proxy.common.showMsg(res);
			currentVisible.value = false;

			emit('on-closed'); // 关闭窗口事件
		})
		.catch(() => {
			proxy.$message.info('已取消');
		});
};

defineExpose({
	initData,
});
</script>

<style lang="scss" scoped>
.upload-demo {
	text-align: center;
	margin-top: 100px;
}
.download {
	margin: 50px 0px 0px 80px;
	text-decoration: underline;
}
</style>
