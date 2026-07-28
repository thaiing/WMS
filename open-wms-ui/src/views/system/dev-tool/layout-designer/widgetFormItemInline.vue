<template>
	<div v-if="element && element.key" :class="{ active: state.selectWidget && state.selectWidget.key == element.key }" class="inline-view" @click.stop="handleSelectWidget(index)">
		<template v-if="element.type == 'input'">
			<el-input v-model="element.options.defaultValue" :style="{ width: element.options.width }" :placeholder="element.options.placeholder"></el-input>
		</template>

		<template v-if="element.type == 'textarea'">
			<el-input v-model="element.options.defaultValue" :style="{ width: element.options.width }" :placeholder="element.options.placeholder" :rows="5" type="textarea"></el-input>
		</template>

		<template v-if="element.type == 'number'">
			<el-input-number v-model="element.options.defaultValue" :disabled="element.options.disabled" :controls-position="element.options.controlsPosition" :style="{ width: element.options.width }"></el-input-number>
		</template>

		<template v-if="element.type == 'radio'">
			<el-radio-group v-model="element.options.defaultValue" :style="{ width: element.options.width }">
				<el-radio v-for="(item, index2) in element.options.options" :key="item.value + index2" :style="{ display: element.options.inline ? 'inline-block' : 'block' }" :label="item.value">
					{{ element.options.showLabel ? item.label : item.value }}
				</el-radio>
			</el-radio-group>
		</template>

		<template v-if="element.type == 'checkbox'">
			<el-checkbox-group v-model="element.options.defaultValue" :style="{ width: element.options.width }">
				<el-checkbox v-for="(item, index2) in element.options.options" :key="item.value + index2" :style="{ display: element.options.inline ? 'inline-block' : 'block' }" :label="item.value">
					{{ element.options.showLabel ? item.label : item.value }}
				</el-checkbox>
			</el-checkbox-group>
		</template>

		<template v-if="element.type == 'time'">
			<el-time-picker v-model="element.options.defaultValue" :is-range="element.options.isRange" :placeholder="element.options.placeholder" :start-placeholder="element.options.startPlaceholder" :end-placeholder="element.options.endPlaceholder" :readonly="element.options.readonly" :disabled="element.options.disabled" :editable="element.options.editable" :clearable="element.options.clearable" :arrow-control="element.options.arrowControl" :style="{ width: element.options.width }"> </el-time-picker>
		</template>

		<template v-if="element.type == 'date'">
			<el-date-picker v-model="element.options.defaultValue" :type="element.options.type" :is-range="element.options.isRange" :placeholder="element.options.placeholder" :start-placeholder="element.options.startPlaceholder" :end-placeholder="element.options.endPlaceholder" :readonly="element.options.readonly" :disabled="element.options.disabled" :editable="element.options.editable" :clearable="element.options.clearable" :style="{ width: element.options.width }"> </el-date-picker>
		</template>

		<template v-if="element.type == 'rate'">
			<el-rate v-model="element.options.defaultValue" :max="element.options.max" :disabled="element.options.disabled" :allow-half="element.options.allowHalf"></el-rate>
		</template>

		<template v-if="element.type == 'color'">
			<el-color-picker v-model="element.options.defaultValue" :disabled="element.options.disabled" :show-alpha="element.options.showAlpha"></el-color-picker>
		</template>

		<template v-if="element.type == 'select'">
			<el-select v-model="element.options.defaultValue" :disabled="element.options.disabled" :multiple="element.options.multiple" :clearable="element.options.clearable" :placeholder="element.options.placeholder" :style="{ width: element.options.width }">
				<el-option v-for="item in element.options.options" :key="item.value" :value="item.value" :label="element.options.showLabel ? item.label : item.value"></el-option>
			</el-select>
		</template>

		<template v-if="element.type == 'switch'">
			<el-switch v-model="element.options.defaultValue" :disabled="element.options.disabled"> </el-switch>
		</template>

		<template v-if="element.type == 'slider'">
			<el-slider v-model="element.options.defaultValue" :min="element.options.min" :max="element.options.max" :disabled="element.options.disabled" :step="element.options.step" :show-input="element.options.showInput" :range="element.options.range" :style="{ width: element.options.width }"></el-slider>
		</template>

		<template v-if="element.type == 'imgupload'">
			<fm-upload v-model="element.options.defaultValue" :disabled="element.options.disabled" :style="{ width: element.options.width }" :width="element.options.size.width" :height="element.options.size.height" token="xxx" domain="xxx"> </fm-upload>
		</template>

		<template v-if="element.type == 'blank'">
			<div style="height: 50px; color: #999; background: #eee; line-height: 50px; text-align: center">自定义区域</div>
		</template>

		<el-button v-if="state.selectWidget && state.selectWidget.key == element.key" title="删除" class="widget-action-delete" circle plain type="danger" @click.stop="handleWidgetDelete(index)">
			<i class="el-icon-yrt-shanchu2"></i>
		</el-button>
		<el-button v-if="state.selectWidget && state.selectWidget.key == element.key" title="复制" class="widget-action-clone" circle plain type="primary" @click.stop="handleWidgetClone(index)">
			<i class="el-icon-yrt-fuzhi4"></i>
		</el-button>
	</div>
</template>

<script setup lang="ts" name="manager-form-item-in=line">
import FmUpload from './Upload/index.vue';
import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
// 双向更新事件定义
const emit = defineEmits(['update:select', 'update:configType']);
//#region 定义父组件传过来的值
const props = defineProps({
	element: {
		type: Object,
		default: () => {
			return {};
		},
	},
	select: {
		type: Object,
		default: () => {
			return {};
		},
	},
	index: {
		type: Number,
		default: null,
	},
	fields: {
		type: Object,
		default: () => {
			return {};
		},
	},
});
//#region 定义变量
const state = reactive({
	selectWidget: props.select as any,
});
const _fields: any = computed(() => {
	return props.fields;
});
//#endregion

//#region wacth
watch(
	() => props.select,
	(val) => {
		state.selectWidget = val;
	},
	{ deep: true, immediate: true }
);

watch(
	() => state.selectWidget,
	(val) => {
		emit('update:select', val);
	},
	{ deep: true, immediate: true }
);
//#endregion

const handleSelectWidget = (index: number) => {
	state.selectWidget = props.fields[index];
};
const handleWidgetDelete = (index: any) => {
	if (props.fields.length - 1 === index) {
		if (index === 0) {
			state.selectWidget.value = {};
		} else {
			state.selectWidget.value = props.fields[index - 1];
		}
	} else {
		state.selectWidget.value = props.fields[index + 1];
	}

	proxy.$nextTick(() => {
		props.fields.splice(index, 1);
	});
};
const handleWidgetClone = (index: number) => {
	let cloneData = {
		..._fields.value[index],
		options: { ..._fields.value[index].options },
		key: new Date().valueOf() + '_' + Math.ceil(Math.random() * 99999),
	};

	if (_fields.value[index].type === 'radio' || _fields.value[index].type === 'checkbox') {
		cloneData = {
			...cloneData,
			options: {
				...cloneData.options,
				options: cloneData.options.options.map((item: any) => ({ ...item })),
			},
		};
	}

	props.fields.splice(index, 0, cloneData);

	proxy.$nextTick(() => {
		state.selectWidget.value = props.fields[index + 1];
	});
};
</script>
