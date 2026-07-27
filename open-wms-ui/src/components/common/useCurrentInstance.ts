import { ComponentInternalInstance, getCurrentInstance } from "vue";
// 通用方法加载
import common from "/@/utils/common";
import { Emitter } from "mitt";
import { Message } from "element-plus";

export default function useCurrentInstance() {
	const { appContext } = getCurrentInstance() as ComponentInternalInstance;
	const globalProperties = appContext.config.globalProperties;
	return {
		mittBus: globalProperties.mittBus as Emitter<any>,
		common: globalProperties.common as typeof common,
		$message: globalProperties.$message as Message,
	};
}
