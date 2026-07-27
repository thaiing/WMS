<template>
	<el-dialog v-model="currentVisible" title="批量导出操作" class="dialog-container" draggable>
		<el-alert title="提示：请筛选好需要生产上架单的入库明细数据。" type="warning" />
		<el-form :inline="true" class="demo-form-inline">
			<el-form-item label-width="120px" label="每个入库单按">
				<el-col :span="4">
					<el-input v-model="state.number" placeholder="请输入内容"></el-input>
				</el-col>
				<el-col :span="20"> 个商品分组。 </el-col>
			</el-form-item>
		</el-form>
		<div>注意：默认填0或者空着将按照每个入库单生成一个上架单。</div>
		<div slot="footer" class="dialog-footer">
			<el-button @click="currentVisible = false">取 消</el-button>
			<el-button type="primary" @click="shelvecreate">确 定</el-button>
		</div>
	</el-dialog>
</template>

<script setup lang="ts" name="shelve-create">
import { ComponentInternalInstance } from 'vue';

import { BaseProperties } from '/@/types/base-type';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
import { postData } from '/@/api/common/baseApi';
import to from 'await-to-js';

const emit = defineEmits(['update:visible', 'closed']);
//#region 定义属性
const props = defineProps({
	visible: Boolean,
});
//#endregion

//#region 定义变量
const state = reactive({
	number: 0,
	ids: [],
});

//#endregion

// 是否显示dialog
const currentVisible = computed({
	get() {
		return props.visible;
	},
	set(newValue) {
		emit('update:visible', newValue); // 双向绑定prop.action，通知父级组件变量值同步更新
	},
});

const addwhere = async (ids: any) => {
	state.ids = ids;
};

const shelvecreate = async () => {
	const url = '/inbound/in/shelve/createShelve';
	const params = {
		num: state.number,
		shelveIds: state.ids,
	};
	const [err, res] = await to(postData(url, params));
	if (err) {
		proxy.$message.error(err.message);
		return;
	}

	if (res.result) {
		proxy.common.showMsg(res);
		currentVisible.value = false;
		emit('closed');
	}
};

// 对外暴露属性和方法
defineExpose({
	addwhere,
});
</script>
