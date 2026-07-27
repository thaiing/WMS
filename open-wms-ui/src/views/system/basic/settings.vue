<template>
  <el-container style="border: 1px solid #eee">
    <el-aside ref="left-aside" class="left-aside" width="220px" style="background-color: rgb(238, 241, 246)">
      <el-menu :default-openeds="state.defaultOpeneds" :default-active="state.defaultActive" unique-opened>
        <el-sub-menu v-for="(item, index) in state.menuList" :index="item.id">
          <template #title> <i class="el-icon-menu"></i>{{ $tt(item.name) }} </template>
          <el-menu-item v-for="(subItem, index) in item.subMenu" :index="subItem.id" @click="menuSelect(item, subItem)">
            <i class="icon-wenjian"></i>
            <template #title>
              <span>{{ $tt(subItem.name) }}</span>
            </template>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>

    <el-main ref="el-main" style="padding: 10px">
      <el-card class="box-card">
        <template #header>
          <div class="clearfix">
            <span>{{ $tt(state.title) }}</span>
          </div>
        </template>
        <!--动态组件-->
        <component :is="layouts[state.currentComponent]"></component>
        <div v-if="state.currentComponent == null" class="color-666">
          {{ $tt('请选择左侧导航栏设置参数') }}
        </div>
      </el-card>
    </el-main>
  </el-container>
</template>

<script setup lang="ts" name="system-basic-settings">
const layouts: any = {
  SettingsBase: defineAsyncComponent(() => import('./components/settings-base.vue')),
  SettingsConsignor: defineAsyncComponent(() => import('./components/settings-consignor.vue')),
  SettingsOutInBasic: defineAsyncComponent(() => import('./components/settings-outin-basic.vue')),
  SettingsPDA: defineAsyncComponent(() => import('./components/settings-pda.vue')),
  SettingsBarcode: defineAsyncComponent(() => import('./components/settings-barcode.vue')),
  SettingsStorageArea: defineAsyncComponent(() => import('./components/settings-storagearea.vue')),
  SettingsERP: defineAsyncComponent(() => import('./components/settings-erp.vue')),
  SettingsApi: defineAsyncComponent(() => import('./components/settings-api.vue')),
  SettingsSMS: defineAsyncComponent(() => import('./components/settings-sms.vue')),
  SettingMQ: defineAsyncComponent(() => import('./components/settings-mq.vue')),
  SettingGPS: defineAsyncComponent(() => import('./components/settings-gps.vue')),
  settingsIn: defineAsyncComponent(() => import('./components/settings-in.vue')),
  settingsRetail: defineAsyncComponent(() => import('./components/settings-retail.vue')),
  settingsOut: defineAsyncComponent(() => import('./components/settings-out.vue')),
  settingsOutBiz: defineAsyncComponent(() => import('./components/settings-out-biz.vue')),
  settingsPickBill: defineAsyncComponent(() => import('./components/settings-pick-bill.vue')),
  settingsStorage: defineAsyncComponent(() => import('./components/settings-storage.vue')),
  settingsWechat: defineAsyncComponent(() => import('./components/settings-wechat.vue')),
  settingsStorageAdjust: defineAsyncComponent(() => import('./components/settings-storage-adjust.vue')),
  settingsDefaultWx: defineAsyncComponent(() => import('./components/settings-default-wx.vue')),
  settingsBatchOrder: defineAsyncComponent(() => import('./components/settings-batch-order.vue')),
  storageFeeSetting: defineAsyncComponent(() => import('./components/storage-fee-setting.vue')),
  settingsSorter: defineAsyncComponent(() => import('./components/settings-sorter.vue')),
  settingsErpTob: defineAsyncComponent(() => import('./components/settings-erp-tob.vue')),
  settingsErpPurchaseorder: defineAsyncComponent(() => import('./components/settings-erp-purchaseorder.vue')),
  settingsTmsTransport: defineAsyncComponent(() => import('./components/settings-tms-transport.vue')),
  settingsAppGlobal: defineAsyncComponent(() => import('./components/settings-app-global.vue')),
  settingsKingdee: defineAsyncComponent(() => import('./components/settings-kingdee.vue')),
  settingsWcs: defineAsyncComponent(() => import('./components/settings-wcs.vue')),
  settingsFlowableUi: defineAsyncComponent(() => import('./components/settings-flowable-ui.vue')),
};
// import SettingsExpress from './components/settings-express.vue';

import { reactive, ComponentInternalInstance, defineAsyncComponent, getCurrentInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

//#region 定义变量
const state = reactive({
  title: '系统参数设置 - 货主类型',
  // 加载状态
  loading: false,
  // 当前组件
  currentComponent: 'SettingsBase',
  defaultActive: '0-0',
  defaultOpeneds: ['0'],
  // 菜单结构
  menuList: [
    {
      id: '0',
      name: '基础参数设置',
      subMenu: [
        {
          id: '0-0',
          component: 'SettingsBase',
          name: '全局设置',
        },
        {
          id: '0-1',
          component: 'SettingsConsignor',
          name: '货主参数设置',
        },
        {
          id: '0-3',
          component: 'SettingsOutInBasic',
          name: '商品参数设置',
        },
        {
          id: '0-4',
          component: 'SettingsPDA',
          name: 'PDA参数设置',
        },
        {
          id: '0-6',
          component: 'SettingsBarcode',
          name: '条码打印设置',
        },
        // {
        // 	id: '0-7',
        // 	component: 'SettingsStorageArea',
        // 	name: '库区名称',
        // },
      ],
    },
    {
      id: '1',
      name: '出入库参数设置',
      subMenu: [
        {
          id: '1-2',
          component: 'settingsIn',
          name: '入库作业设置',
        },
        {
          id: '1-3',
          component: 'settingsOutBiz',
          name: '出库基础设置',
        },
        {
          id: '1-3-1',
          component: 'settingsOut',
          name: '出库作业设置',
        },
        {
          id: '1-5',
          component: 'settingsStorage',
          name: '库存作业设置',
        },
      ],
    },
    {
      id: '2',
      name: '波次参数设置',
      subMenu: [
        {
          id: '2-1',
          component: 'settingsBatchOrder',
          name: '波次设置',
        },
      ],
    },
    {
      id: '3',
      name: '库存参数设置',
      subMenu: [
        {
          id: '3-1',
          component: 'settingsStorageAdjust',
          name: '库存调整设置',
        },
      ],
    },
  ],
});
//#endregion

// 左侧菜单点击事件
const menuSelect = (item: any, subItem: any) => {
  state.title = item.name + '-' + subItem.name;
  state.currentComponent = subItem.component;
  state.defaultActive = subItem.id;
  state.defaultOpeneds = [item.id];
};
</script>

<style lang="scss" scoped>
.left-aside {
  --el-menu-bg-color: rgb(238, 241, 246);
  --text-color: rgb(15, 15, 15);
  --next-bg-menuBarColor: #606266;
  ::v-deep .el-menu {
    .el-sub-menu {
      .el-menu-item,
      .el-submenu__title {
        height: 35px;
        line-height: 35px;
      }

      .el-menu-item.is-active {
        background-color: #ecf5ff;
      }

      &.is-active,
      &.is-opened {
        // background-color: #66b1ff;
        .el-submenu__title {
          color: white;

          .el-icon-menu,
          .el-submenu__icon-arrow {
            color: white;
          }

          &:hover {
            background-color: #66b1ff;
          }
        }
      }
    }
  }
}

.box-card {
  ::v-deep .el-card__body {
    padding: 0 20px 20px;
  }
}
</style>
