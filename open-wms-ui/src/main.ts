import { createApp } from 'vue';
import pinia from '/@/stores/index';
import App from '/@/App.vue';
import router from '/@/router';
import { i18n } from '/@/i18n/index';
import other from '/@/utils/other';

// 图标选择组件
import IconSelector from '/@/components/iconSelector/index.vue';

import ElementPlus from 'element-plus';
import '/@/theme/index.scss';
// import VueGridLayout from 'vue-grid-layout';

// 自定义指令
import { directive } from '/@/directive/index';

// 注册插件
import plugins from './plugins/index'; // plugins
import { download } from '/@/utils/request';

// 预设动画
import animate from './animate';

// svg图标
import 'virtual:svg-icons-register'; // 加上才能显示svg图标
import ElementIcons from '/@/plugins/svgicon';

// 瀑布流
import { VueMasonryPlugin } from 'vue-masonry';

import { useDict } from '/@/utils/dict';
import { getConfigKey, updateConfigByKey } from '/@/api/system/config';
import { parseTime, addDateRange, handleTree, selectDictLabel, selectDictLabels } from '/@/utils/ruoyi';
import mitt from 'mitt';
import axios from 'axios';
import VueAxios from 'vue-axios';
import { installVietnameseDisplayTranslator } from '/@/i18n/business.vi';

// 通用方法加载
import common from '/@/utils/common';
import { ComposerTranslation, DefineLocaleMessage } from 'vue-i18n';
import type { RemoveIndexSignature } from '@intlify/core-base';
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    common: typeof common;
    $tt: (label: string) => string; // i18n.global.t
  }
}

const app = createApp(App);
// 全局方法挂载
app.config.globalProperties.common = common;
app.config.globalProperties.$tt = (p: any) => {
  return p && i18n.global.te(p) ? i18n.global.t(p) : p;
};

app.config.globalProperties.useDict = useDict;
app.config.globalProperties.getConfigKey = getConfigKey;
app.config.globalProperties.updateConfigByKey = updateConfigByKey;
app.config.globalProperties.download = download;
app.config.globalProperties.parseTime = parseTime;
app.config.globalProperties.handleTree = handleTree;
app.config.globalProperties.addDateRange = addDateRange;
app.config.globalProperties.selectDictLabel = selectDictLabel;
app.config.globalProperties.selectDictLabels = selectDictLabels;
app.config.globalProperties.animate = animate;
app.config.globalProperties.mittBus = mitt();

directive(app);
other.elSvg(app);

app.component('IconSelector', IconSelector);
app.use(ElementIcons);
app.use(plugins);
app.use(VueMasonryPlugin);

app
  .use(pinia)
  .use(router)
  .use(ElementPlus)
  .use(i18n)
  .use(VueAxios, axios) // 全局访问axios

  // .use(VueGridLayout)
  .mount('#app');

// Theo dõi toàn bộ tài liệu vì dialog/loading của Element Plus được teleport
// ra ngoài #app và tiêu đề trang nằm trong <head>.
installVietnameseDisplayTranslator(document.documentElement);

// 四舍五入函数
Math.Round = function (num: number, dec?: number) {
  if (dec === undefined) dec = 2;
  return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
};
