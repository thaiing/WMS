// 通用函数
import useClipboard from 'vue-clipboard3';
import { ElMessage } from 'element-plus';
import { formatDate } from '/@/utils/formatTime';
import { useI18n } from 'vue-i18n';

export default function () {
	const { t } = useI18n();
	const { toClipboard } = useClipboard();

	// 百分比格式化
	const percentFormat = (row: EmptyArrayType, column: number, cellValue: string) => {
		return cellValue ? `${cellValue}%` : '-';
	};
	// 列表日期时间格式化
	const dateFormatYMD = (row: EmptyArrayType, column: number, cellValue: string) => {
		if (!cellValue) return '-';
		return formatDate(new Date(cellValue), 'YYYY-mm-dd');
	};
	// 列表日期时间格式化
	const dateFormatYMDHMS = (row: EmptyArrayType, column: number, cellValue: string) => {
		if (!cellValue) return '-';
		return formatDate(new Date(cellValue), 'YYYY-mm-dd HH:MM:SS');
	};
	// 列表日期时间格式化
	const dateFormatHMS = (row: EmptyArrayType, column: number, cellValue: string) => {
		if (!cellValue) return '-';
		let time = 0;
		if (typeof row === 'number') time = row;
		if (typeof cellValue === 'number') time = cellValue;
		return formatDate(new Date(time * 1000), 'HH:MM:SS');
	};
	// 小数格式化
	const scaleFormat = (value: string = '0', scale: number = 4) => {
		return Number.parseFloat(value).toFixed(scale);
	};
	// 小数格式化
	const scale2Format = (value: string = '0') => {
		return Number.parseFloat(value).toFixed(2);
	};
	// 点击复制文本
	const copyText = (text: string) => {
		return new Promise((resolve, reject) => {
			try {
				//复制
				toClipboard(text);
				//下面可以设置复制成功的提示框等操作
				ElMessage.success(t('message.layout.copyTextSuccess'));
				resolve(text);
			} catch (e) {
				//复制失败
				ElMessage.error(t('message.layout.copyTextError'));
				reject(e);
			}
		});
	};
	return {
		percentFormat,
		dateFormatYMD,
		dateFormatYMDHMS,
		dateFormatHMS,
		scaleFormat,
		scale2Format,
		copyText,
	};
}

// 动态加载BetterScroll插件 - 内容滚动工具
let loadBetterScroll = (onload: Function): any => {
	let betterScript = document.getElementById('betterScript');
	if (betterScript) {
		window.setTimeout(() => {
			onload();
		}, 2000);
	} else {
		let script = document.createElement('script');
		script.id = 'betterScript';
		script.type = 'text/javascript';
		script.src = `https://unpkg.com/better-scroll@latest/dist/better-scroll.min.js`;
		script.onload = () => {
			window.setTimeout(() => {
				onload();
			}, 2000);
		};
		script.onerror = () => {
			alert('加载better-scroll失败');
		};
		document.head.appendChild(script);
	}
};

export { loadBetterScroll };

export const loadJs = (url: string) => {
	return new Promise((resolve, reject) => {
		const script = document.createElement('script');
		script.src = url;
		script.type = 'text/javascript';
		document.body.appendChild(script);
		script.onload = () => {
			resolve({});
		};
	});
};

export const loadCss = (url: string) => {
	return new Promise((resolve, reject) => {
		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = url;
		document.head.appendChild(link);
		link.onload = () => {
			resolve({});
		};
	});
};

export const predefineColors = ['rgba(5, 200, 5, 1)', 'rgba(0, 255, 0, 1)', '#90ee90', '#409EFF', 'rgb(102, 177, 255)', 'rgb(140, 197, 255);', 'rgb(217, 236, 255)', '#00ced1', '#c71585', 'rgb(255, 120, 0)', '#ff0000', '#ff4500', '#ff8c00', '#ffd700', 'rgba(255, 255, 0, 1)', 'rgba(201, 241, 3, 1)', 'hsva(120, 40, 94, 0.5)', 'hsl(181, 100%, 37%)', 'hsla(209, 100%, 56%, 0.73)', '#c7158577', '#303133', '#606266', '#909399', '#DCDFE6', '#E4E7ED', '#F2F6FC', '#ffffff', 'rgba(208, 3, 208, 1)', 'rgba(252, 68, 252, 1)', 'rgba(255, 0, 255, 1)'];

// 数据类型
export const dataTypeList = ['string', 'byte', 'long', 'boolean', 'double', 'bigDecimal', 'date', 'datetime', 'time'];
