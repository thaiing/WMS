<template>
  <div>
    <div class="dialog-container" @click="handlePathClick">
      <div v-html="state.svgContent"></div>
    </div>
    <!-- 货位库存明细对话框 -->
    <position-storage-dialog :detail-title="state.positionOptions.detailTitle" v-model:visible="state.positionOptions.detailVisible" :data-config="state.positionOptions.dataConfig"></position-storage-dialog>
  </div>
</template>

<script setup lang="ts" name="order-split-dialog">
import { ComponentInternalInstance, nextTick } from 'vue';
import { BaseProperties } from '/@/types/base-type';
import PositionStorageDialog from './position-storage-dialog.vue';
import { postData } from '/@/api/common/baseApi';
import to from 'await-to-js';

let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
const emit = defineEmits(['update:visible', 'on-closed']);

//#region 定义属性
const props = defineProps({
  svgUrl: String,
  fromData: Object,
  positionList: Array,
});
//#endregion

//#region 定义变量
const state = reactive({
  svgContent: '',
  positionOptions: {
    detailTitle: '',
    detailVisible: false,
    dataConfig: {
      productPositionList: [],
    },
  },
});

//监听 positionList
watch(
  () => props.positionList,
  (newValue, oldValue) => {
    // 更新加载状态
    initSvg();
  },
  {
    deep: true,
  }
);
//#region onMounted
onMounted(async () => {
  initSvg();
});
const initSvg = () => {
  let url: any = props.svgUrl;
  if (!url) {
    return;
  }
  // url = url.replace('http://', 'https://');

  fetch(url)
    .then((response) => response.text())
    .then((svg) => {
      state.svgContent = svg;

      // 使用 nextTick 确保 SVG 完全渲染后再进行 DOM 操作
      nextTick(() => {
        setDomColor();
      });
    })
    .catch((error) => {
      url = url.replace('http://', 'https://');
      fetch(url)
        .then((response) => response.text())
        .then((svg) => {
          state.svgContent = svg;

          // 使用 nextTick 确保 SVG 完全渲染后再进行 DOM 操作
          nextTick(() => {
            setDomColor();
          });
        })
        .catch((error) => {
          console.error('Error loading SVG:', error);
        });
    });
};
// 给svg 标记颜色
const setDomColor = async () => {
  props.positionList?.forEach((item: any) => {
    if (item.validStorage) {
      // 获取到所有的 text 标签
      let elements: any = document.querySelectorAll('text');
      elements.forEach((element: any) => {
        // 获取到 text 标签的上一个兄弟元素 (path)
        const previousElement = element.previousElementSibling;

        // 获取当前 text 标签下的 子标签 tspan
        let span: any = element.querySelector('tspan');
        let positionName = item.positionName.toLowerCase();

        let count = null;
        let color = '';
        let content = '';
        switch (element.textContent.toLowerCase()) {
          case positionName:
            // 如果是已经有库存则需要给 path 更改颜色
            previousElement.setAttribute('fill', '#00FF00');
            //用于点击的时候获取货位名称
            span.setAttribute('positionName', item.positionName);
            break;
          case 'a' + positionName:
            count = Number(item.productStorage);
            color = '#f60';
            content = '总库存量为';
            break;
          case 'b' + positionName:
            count = Number(item.validStorage);
            color = '#2eade8';
            content = '有效库存量为';

            break;
          case 'c' + positionName:
            count = Number(item.holderStorage);
            color = '#080706';
            content = '占位库存量为';
            break;
        }
        if (color) {
          span.textContent = Number(count);
          previousElement.setAttribute('fill', color);
          element.setAttribute('title', content + count);
          span.style.fill = 'white'; //给文字颜色设置为白色
          span.removeAttribute('textLength'); //删除 标签

          //给 tspan 添加属性，用于点击的时候查询库存，因为 上面 已经把货位替换成对应的数值了
          span.setAttribute('positionName', item.positionName);
        }
      });
    }
  });
};

// 事件委托：处理点击事件
const handlePathClick = async (event: MouseEvent) => {
  if (!props.fromData || !props.fromData.storageId || !props.fromData.areaCode) {
    return;
  }
  let htmlElement: any = event.target;
  let textElement = null;
  let tspanElement = null;
  // 判断点击的是否是 path 元素
  if (htmlElement) {
    switch (htmlElement.nodeName) {
      case 'path':
        // 如果是path 标签  需要找到 他的弟标签 （text）
        textElement = htmlElement.nextElementSibling;
      case 'text':
        // 如果 选中的标签是 path 则 上面case已经赋值了 不需要在赋值给text
        if (!textElement) {
          textElement = htmlElement;
        }
        // 获取到 text 标签的子标签 tspan
        tspanElement = textElement?.querySelector('tspan');
        break;
      case 'tspan':
        //如果选中的表情是 tspan 则直接赋值给 tspan
        tspanElement = htmlElement;

        break;
    }
  }
  let positionName = tspanElement?.getAttribute('positionName');
  //有可能点击的是空白的地方则不需要 弹框
  if (!positionName) {
    return;
  }
  state.positionOptions.detailVisible = true;

  state.positionOptions.detailTitle = '货位库存详情-' + positionName;
  // 获得库存数据
  const url = '/inventory/core/inventory/selectValidInventoryList';
  const params = {
    storageId: props.fromData.storageId,
    areaCode: props.fromData.areaCode,
    positionName: positionName,
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    proxy.$message.error(err.message);
    return;
  }
  if (res.result) {
    state.positionOptions.dataConfig.productPositionList = res.data;
    state.positionOptions.dataConfig.productPositionList.forEach((item: any) => {
      item.productStorage = Number(item.productStorage);
      item.rowWeight = Number(item.rowWeight);
      item.purchasePrice = Number(item.purchasePrice);
      item.purchaseAmount = Number(item.purchaseAmount);
    });
  }
};
</script>

<style lang="scss" scoped>
.dialog-footer {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
</style>
