<template>
  <div id="mapDiv" :style="'width: 100%; height:' + props.height"></div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue';

const emit = defineEmits(['tianditu-click']);

//#region 定义属性
const props = defineProps({
  height: {
    type: String,
    default: '500px',
  },
});
//#endregion
//#region 定义变量
const state = reactive({
  // 百度地图map
  mapInfo: {
    map: null as any,
    lng: 113.305711,
    lat: 23.434963,
    content: '',
    zoom: 15,
  },
});
//#endregion

/**
 * 加载后事件 把地图的初始化地图
 */
onMounted(() => {
  state.mapInfo.map = new T.Map('mapDiv', { projection: 'EPSG:4326' }); // 定义地图事件
  positionAdd(state.mapInfo);
  state.mapInfo.map.addEventListener('moveend', mapMoveend); //添加：鼠标、滚轮事件
  state.mapInfo.map.addEventListener('click', mapClick); //添加：点击事件

  // 地图容器大小发生变化时调整地图的大小以适应新的容器大小  得地图加载完才生效
  setTimeout(function () {
    state.mapInfo.map.checkResize();
  }, 2000);
});

/**
 * 设置当前地址信息
 * @param data 定位信息
 */
const positionAdd = (data: any) => {
  state.mapInfo.map.clearOverLays(); //删除之前的所有标记
  state.mapInfo.lng = data.lng;
  state.mapInfo.lat = data.lat;

  let lngLat = new T.LngLat(data.lng, data.lat);

  state.mapInfo.map.centerAndZoom(lngLat, state.mapInfo.zoom);
  //创建标注对象
  var marker = new T.Marker(lngLat);
  //向地图上添加标注
  state.mapInfo.map.addOverLay(marker);
};
/**
 * 显示轨迹线路
 * @param list 轨迹列表对象 需要有 lan、lat
 */
const handlePath = (list: any) => {
  var points: any = [];
  list.map((item: any) => {
    points.push(new T.LngLat(item.lng, item.lat));
  });
  let line = new T.Polyline(points, {
    strokeColor: 'green',
    strokeWeight: 1,
    strokeOpacity: 1,
  });
  state.mapInfo.map.addOverLay(line);
};

//鼠标、滚轮后事件
const mapMoveend = () => {
  state.mapInfo.zoom = state.mapInfo.map.getZoom();
};

const mapClick = (e: any) => {
  let lng = e.lnglat.getLng();
  let lat = e.lnglat.getLat();
  let address = '';
  //根据坐标获取详细地址
  let geocoder = new T.Geocoder();
  geocoder.getLocation(e.lnglat, (result: any) => {
    address = result.getAddress();
  });

  emit('tianditu-click', lng, lng, address); // 关闭窗口事件

  //保存定位信息，并且地图上标注
  state.mapInfo.lng = lng;
  state.mapInfo.lat = lat;
  positionAdd(state.mapInfo);
};
defineExpose({
  positionAdd,
  handlePath,
});
</script>
