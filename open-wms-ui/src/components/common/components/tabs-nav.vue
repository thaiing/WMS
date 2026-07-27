<template>
  <div class="tabs-nav-container">
    <template v-for="(tab, index) in tabNavList">
      <template v-if="tab.type === 'checkbox'">
        <el-checkbox-group :key="'rg_' + index" v-model="tab.value" size="small" class="tabs-nav" @change="checkBoxGroupChange(null, null)">
          <el-checkbox-button
            v-for="(item, itemIndex) in tab.items.filter((li:any, _index:any) => {
							return _index < tab.showCount;
						})"
            :key="itemIndex"
            :label="item.label"
            >{{ item.label }}</el-checkbox-button
          >
        </el-checkbox-group>
        <el-dropdown v-if="tab.items.length > tab.showCount" :key="'dd_' + index" size="small">
          <el-button type="primary" link size="small">
            更多
            <i class="el-icon-arrow-down el-icon-right"></i>
          </el-button>
          <el-dropdown-menu #dropdown>
            <el-dropdown-item
              v-for="(item, itemIndex) in tab.items.filter((li:any, _index:any) => {
								return _index >= tab.showCount;
							})"
              :key="itemIndex"
              :class="{ active: activeMenuItem(tab, item) }"
              @click="menuItemClick(tab, item)"
              >{{ item.label }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </template>
      <template v-else-if="tab.type === 'radio'">
        <el-radio-group :key="'rg_' + index" v-model="tab.value" size="small" class="tabs-nav">
          <el-radio-button
            v-for="(item, itemIndex) in tab.items.filter((li:any, _index:any) => {
							return _index < tab.showCount;
						})"
            :key="itemIndex"
            :label="item.label"
            :value="item.value"
            @click.stop="radioGroupChange(tab, item)"
          ></el-radio-button>
        </el-radio-group>
        <el-dropdown v-if="tab.items.length > tab.showCount" :key="'dd_' + index" size="small">
          <el-button type="primary" link size="small">
            更多
            <i class="el-icon-arrow-down el-icon-right"></i>
          </el-button>
          <el-dropdown-menu #dropdown>
            <el-dropdown-item
              v-for="(item, itemIndex) in tab.items.filter((li:any, _index:any) => {
								return _index >= tab.showCount;
							})"
              :key="itemIndex"
              :class="{ active: activeMenuItem(tab, item) }"
              @click="menuItemClick(tab, item)"
              >{{ item.label }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts" name="inbound-scan-order">
// 事件定义
const emit = defineEmits(['on-tabs-nav-change']);

//#region 定义属性
const props = defineProps({
  // tab导航数据结构
  tabNavList: {
    type: Array<any>,
    default: () => {
      return [];
    },
  },
});
//#endregion

// 复选组改变
const checkBoxGroupChange = (tab: any, item: any) => {
  getWhere();
};
// 单选组改变
const radioGroupChange = (tab: any, item: any) => {
  tab.value = item.value;
  getWhere();
};
// 菜单项选择
const menuItemClick = (tab: any, item: any) => {
  if (tab.type === 'checkbox') {
    var index = tab.value.findIndex((s: any) => {
      return s === item.value;
    });
    if (index >= 0) {
      tab.value.splice(index, 1);
    } else {
      tab.value.push(item.value);
    }
  } else {
    tab.value = item.value;
  }
  getWhere();
};
// 是否选中
const activeMenuItem = (tab: any, item: any) => {
  if (tab.type === 'checkbox') {
    var index = tab.value.findIndex((s: any) => {
      return s === item.value;
    });
    return index >= 0;
  } else {
    return tab.value === item.value;
  }
};
// 获得条件
const getWhere = () => {
  var where: any = [];
  props.tabNavList.forEach((tab: any) => {
    if (typeof tab.getWhere === 'function') {
      const _where = tab.getWhere(tab, props.tabNavList);
      if (Array.isArray(_where)) {
        where = where.concat(_where);
      } else {
        where.push(_where);
      }
    } else {
      if (tab.type === 'checkbox') {
        if (tab.value.length) {
          where.push({
            prop: tab.field,
            value: tab.value,
          });
        }
      } else {
        if (tab.value) {
          where.push({
            prop: tab.field,
            value: tab.value,
          });
        }
      }
    }
  });
  emit('on-tabs-nav-change', where);
};
</script>

<style lang="scss" scoped>
.tabs-nav-container {
  .tabs-nav {
    display: inline-block;
  }
  .el-dropdown {
    top: 3px;
    margin-right: 20px;
  }
}
.el-dropdown-menu {
  .active {
    background-color: #409eff;
    color: white;
  }
}
</style>
