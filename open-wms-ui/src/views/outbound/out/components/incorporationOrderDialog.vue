<template>
	<div>
		<el-dialog draggable v-model="currentVisible" title="合并单据" width="30%" class="dialog-container">
			<el-form label-width="120px">
				<el-form-item :label="$tt('请选择主订单')" style="width: 320px">
					<el-radio-group v-model="state.selectOrderCode">
						<el-radio v-for="(item, index) in orderCodes" :key="index" :label="item"></el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<template class="right" #footer>
				<span>
					<el-button @click="currentVisible = false">取 消</el-button>
					<el-button type="primary" @click="save">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="create-order-dialog">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
import to from 'await-to-js';
import { postData } from '/@/api/common/baseApi';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

const emit = defineEmits(['update:visible', 'on-closed']);
//#region 定义属性
const props = defineProps({
	visible: Boolean,
	// 选中的订单ID
	orderCodes: {
		type: Array as PropType<any[]>,
		default: () => {
			return [];
		},
		required: false,
	},
	// 选中的订单ID
	ids: {
		type: Array,
		default: () => {
			return [];
		},
		required: false,
	},
});
//#endregion

//#region 定义变量
const state = reactive({
	selectOrderCode: '',
});

//#endregion

// 是否显示dialog
const currentVisible = computed({
	get() {
		return props.visible;
	},
	set(newValue) {
		emit('update:visible', newValue); // 双向绑定prop.action，通知父级组件变量值同步更新
		state.selectOrderCode = '';
	},
});

// 确认
const save = async () => {
	if (!state.selectOrderCode) {
		proxy.$message.error('请选择主订单！');
		return;
	}
	proxy
		.$confirm('确定要进行合并操作吗?', '合并单据', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning',
		})
		.then(async () => {
			const url = '/outbound/out/order/incorprationOrder';
			const params = {
				selectOrderCode: state.selectOrderCode,
				ids: props.ids,
			};
			const [err, res] = await to(postData(url, params));
			if (err) {
				return;
			}
			proxy.common.showMsg(res);
			if (res.result) {
				emit('on-closed');
			}
		})
		.catch(() => {
			proxy.$message.error('已取消');
		});
};

// 对外暴露属性和方法
defineExpose({});
</script>
