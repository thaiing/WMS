import { getCurrentInstance, ref } from 'vue';
import { componentLibs } from '../../../components/componentLibs';

export default function () {
	let libs = ref(componentLibs);
	let basicComponents = ref();
	let comInfo = libs.value.find((item: any) => item.groupName === 'uViewUI组件');
	const { proxy } = getCurrentInstance() as any;

	// uviewui基础组件
	basicComponents = comInfo.libs;
	// 编辑框类型改变
	let dataTypeChange = (val: any) => {
		const item = proxy.basicComponents.find((item: any) => {
			return item.type === val;
		});
		const customJson = {
			label: proxy.config.options?.label,
			prop: proxy.config.options?.prop,
		};
		let options = {};
		if (item && item.options) {
			options = item.options;
		}
		proxy.config.title = item.title;
		proxy.config.options = Object.assign({}, options, customJson);
	};
	return { basicComponents, dataTypeChange };
}
