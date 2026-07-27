<template>
	<div class="dialog-container">
		<el-dialog v-model="currentDialogVisible" title="字段属性信息" draggable overflow top="10vh" class="table-info-dialog" width="1000px">
			<!-- <el-scrollbar :noresize="false" :native="false" wrap-class="scrollbar-wrap"> -->
			<el-row class="padding-bottom-10">
				<el-col :span="6"> <span class="w-80 inline-block align-right">表名：</span>{{ dataOptions.tableName }} </el-col>
				<el-col :span="6"> <span class="w-80 inline-block align-right">主键：</span>{{ dataOptions.idField }} </el-col>
				<el-col :span="12"> <span class="w-80 inline-block align-right">排序方式：</span>{{ dataOptions.orderBy }} </el-col>
			</el-row>
			<el-row class="padding-bottom-10">
				<el-col :span="6"> <span class="w-80 inline-block align-right">模块ID：</span>{{ dataOptions.menuId }} </el-col>
				<el-col :span="6"> <span class="w-80 inline-block align-right">连接字段：</span>{{ dataOptions.linkColumn }} </el-col>
				<el-col :span="12"> <span class="w-100 inline-block align-right">自定义方法：</span>{{ dataOptions.listMethod }} </el-col>
			</el-row>
			<el-row class="padding-bottom-10">
				<el-col :span="12"> <span class="w-80 inline-block align-right">前端路由：</span>{{ dataOptions.webRouter }} </el-col>
				<el-col :span="12"> <span class="w-80 inline-block align-right">后端路由：</span>{{ dataOptions.prefixRouter }} </el-col>
			</el-row>
			<el-table :data="fields" style="width: 100%" max-height="500">
				<el-table-column prop="prop" label="英文名"></el-table-column>
				<el-table-column prop="label" label="中文名"></el-table-column>
				<el-table-column prop="dataType" label="数据类型" width="100"></el-table-column>
				<el-table-column prop="width" label="宽度" width="80"></el-table-column>
				<el-table-column prop="type" label="输入框类型" width="110"></el-table-column>
				<el-table-column prop="isExpandField" label="扩展字段" width="80">
					<template #default="{ row }">
						<el-tag v-if="row.isExpandField" type="warning">是</el-tag>
						<span v-else>否</span>
					</template>
				</el-table-column>
			</el-table>
			<!-- </el-scrollbar> -->
			<template #footer>
				<span class="dialog-footer">
					<div></div>
					<el-button @click="currentDialogVisible = false">关闭</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script>
export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		dataOptions: {
			type: Object,
			default: () => {
				return {};
			},
		},
		fields: {
			type: Array,
			default: () => {
				return [];
			},
		},
	},
	data() {
		return {
			isLoading: false,
		};
	},
	computed: {
		// 显示窗口
		currentDialogVisible: {
			get: function () {
				return this.visible;
			},
			set: function (val) {
				this.$emit('update:visible', val);
			},
		},
	},
	watch: {},
	methods: {},
};
</script>

<style lang="scss" scoped>
.table-info-dialog {
	:deep(.el-dialog__body) {
		padding: 10px 5px;
	}

	:deep(.scrollbar-wrap) {
		max-height: 400px;
	}

	.alert-msg {
		margin-bottom: 10px;
	}
}
</style>
