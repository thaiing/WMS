<template>
  <el-container style="border: 1px solid #eee">
    <el-aside ref="left-aside" class="left-aside" width="200px" style="background-color: rgb(238, 241, 246)">
      <div class="left-role-title flex flex-between">
        <span class="title">
          {{ $tt('请选择角色') }}
        </span>
        <el-link type="default" @click="getMenuData">刷新</el-link>
      </div>
      <el-menu unique-opened @select="menuSelect">
        <template v-for="item in state.roleList">
          <el-sub-menu v-if="item.children && item.children.length" :index="item.roleId">
            <template #title>
              <i class="el-icon-menu"></i>
              {{ $tt(item.roleName) }}
            </template>
            <el-menu-item v-for="subItem in item.children" :key="subItem.roleId" :sub-item="subItem" :index="'' + subItem.roleId">{{ subItem.roleName }}</el-menu-item>
          </el-sub-menu>
          <el-menu-item v-else :item="item" :index="'' + item.roleId">{{ item.roleName }}</el-menu-item>
        </template>
      </el-menu>
    </el-aside>

    <el-tabs v-model="state.currentTab" type="card" style="width: 100%" @tab-click="handleClick">
      <el-tab-pane :label="$tt('角色权限设置')" name="user">
        <el-main ref="el-main" style="padding: 0">
          <el-card class="box-card">
            <template #header>
              <div class="clearfix">
                <span>{{ $tt('角色权限设置') }} - {{ $tt(state.title) }}</span>
              </div>
            </template>
            <el-radio-group v-model="state.rootMenuId" class="mb-2" @change="getRoleAuthMenu()">
              <el-radio-button v-for="(item, index) in state.rootMenuList" :key="index" :label="item.menuId">{{ $tt(item.menuName) }}</el-radio-button>
              <el-radio-button :label="0">{{ $tt('全部') }}</el-radio-button>
            </el-radio-group>
            <el-table ref="roleTreeTableRef" :data="state.menuList" :max-height="600" row-key="menuId" default-expand-all border @select="rowSelected" @select-all="selectAll">
              <el-table-column type="selection" width="45" />
              <el-table-column prop="menuName" label="模块" width="250" />
              <el-table-column :label="$tt('权限点')">
                <template #default="{ row }">
                  <el-checkbox v-for="(item, index) in row.permsList" :key="index" v-model="item.value" :true-label="1" :false-label="0" :checked="!!item.value" @change="checkAuthNode(row)">{{ $tt(item.label) }}</el-checkbox>
                </template>
              </el-table-column>
            </el-table>
            <div class="tool margin-top-20">
              <el-button :loading="state.loading" type="default" @click="getRoleAuthMenu()">
                <template #icon>
                  <svg-icon name="icon-shuaxin" class="text-size-n" :size="14" />
                </template>
                {{ $tt('刷新') }}
              </el-button>
              <el-button :loading="state.loading" type="primary" @click="saveAuth">
                <template #icon>
                  <svg-icon name="s-save" class="text-size-n" :size="14" />
                </template>
                {{ $tt('保存') }}
              </el-button>
            </div>
          </el-card>
        </el-main>
      </el-tab-pane>
      <el-tab-pane :label="$tt('模块权限设置')" name="app">
        <el-main ref="el-main" style="padding: 0">
          <el-card class="box-card">
            <template #header>
              <div class="clearfix">
                <span>{{ $tt('模块权限设置') }} - {{ $tt(state.title) }}</span>
              </div>
            </template>
            <el-table ref="roleTreeTableRef" :data="state.menuAppList" :max-height="600" row-key="menuId" default-expand-all border @select="rowSelected" @select-all="selectAll">
              <el-table-column type="selection" width="45" />
              <el-table-column prop="menuName" label="模块" width="250" />
              <el-table-column :label="$tt('权限点')">
                <template #default="{ row }">
                  <el-checkbox v-for="(item, index) in row.permsList" :key="index" v-model="item.value" :true-label="1" :false-label="0" :checked="!!item.value" @change="checkAuthNode(row)">{{ $tt(item.label) }}</el-checkbox>
                </template>
              </el-table-column>
            </el-table>
            <div class="tool margin-top-20">
              <el-button :loading="state.loading" type="default" @click="getRoleAuthMenuApp()">
                <template #icon>
                  <svg-icon name="icon-shuaxin" class="text-size-n" :size="14" />
                </template>
                {{ $tt('刷新') }}
              </el-button>
              <el-button :loading="state.loading" type="primary" @click="saveAuth">
                <template #icon>
                  <svg-icon name="s-save" class="text-size-n" :size="14" />
                </template>
                {{ $tt('保存') }}
              </el-button>
            </div>
          </el-card>
        </el-main>
      </el-tab-pane>
    </el-tabs>
  </el-container>
</template>

<script setup lang="ts" name="system-permission-role-auth">
import { reactive, ComponentInternalInstance, getCurrentInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
import { postData } from '/@/api/common/baseApi';
import { ElTable } from 'element-plus';
import to from 'await-to-js';
import { QueryBo, QueryType, DataType, OrderItem, OrderByType } from '/@/types/common';
import useUserStore from '/@/stores/modules/user';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

const userStore = useUserStore();

//#region 定义变量
const state = reactive({
  title: '[请选择左侧角色名称]',
  // 加载状态
  loading: false,
  expandAll: true,
  // 选中角色
  currentRoleInfo: {
    roleId: 0,
  } as any,
  // 左侧导航集合
  roleList: [] as any[],
  // 右侧表格树权限列表集合
  menuList: [] as any[], // 角色模块菜单
  menuAppList: [] as any[], // 数据模块菜单
  // 需要保存的角色权限集合
  saveMenuList: [] as any[],
  currentTab: 'user',
  // app选中角色
  currentAppRoleInfo: {},
  roleId: 0,
  // 当前根目录
  rootMenuId: 0, // 0表示全部
  // 根目录集合
  rootMenuList: [] as any[],
  // 角色权限集合
  roleAuthList: [] as any[], // 角色模块已有权限点
  roleAuthAppList: [] as any[], // 数据模块已有权限点
  // 全部菜单
  allMenuList: [] as any[],
});
//#endregion

const roleTreeTableRef = ref<InstanceType<typeof ElTable>>();

onMounted(async () => {
  await getMenuData(); // 左侧菜单
  await getRootMenu(); // 根目录
});

// 左侧加载数据
const getMenuData = async () => {
  let queryBoList: Array<QueryBo> = []; // 查询条件
  queryBoList.push({
    column: 'orderNum',
    values: 'orderNum',
    queryType: QueryType.ORDERBYDESC,
    dataType: DataType.INT,
  });
  queryBoList.push({
    column: 'roleId',
    values: 'roleId',
    queryType: QueryType.ORDERBYASC,
    dataType: DataType.LONG,
  });
  queryBoList.push({
    column: 'enable',
    values: 1,
    queryType: QueryType.EQ,
    dataType: DataType.INT,
  });

  let url = '/system/permission/role/selectList';
  let [err, res] = await to(postData(url, queryBoList));
  if (err) {
    return;
  }
  if (res?.result) {
    state.roleList = res.data;
  }
};

// 左侧菜单点击事件
const menuSelect = async (index: string, indexPath: string[], node: any) => {
  state.saveMenuList = [];
  state.currentRoleInfo = state.roleList.find((r) => r.roleId === Number(index));
  state.title = state.currentRoleInfo.roleName;
  state.currentAppRoleInfo = state.currentRoleInfo;
  state.roleId = state.currentRoleInfo.roleId;

  if (state.currentTab === 'user') {
    await getRoleAuth(); // 获取角色权限集合
    await getRoleAuthMenu();
  } else if (state.currentTab === 'app') {
    await getRoleAuthApp(); // 获取角色权限集合
    await getRoleAuthMenuApp(); // 获取角色APP权限集合
  }
};

// 获得角色权限右侧表格树列表
const getRoleAuthMenu = async () => {
  let whereList: Array<QueryBo> = []; // 查询条件
  let subWhereList: Array<QueryBo> = []; // 子集固定查询条件
  if (state.rootMenuId === 0) {
    // 查询全部
    whereList.push({
      column: 'parentId',
      values: 0,
      queryType: QueryType.EQ,
      dataType: DataType.INT,
    });
  } else {
    whereList.push({
      column: 'menuId',
      values: state.rootMenuId,
      queryType: QueryType.EQ,
      dataType: DataType.INT,
    });
  }
  if (userStore.tenantId !== '000000') {
    whereList.push({
      column: 'packageId',
      values: userStore.packageId,
      queryType: QueryType.EQ,
      dataType: DataType.INT,
    });
  }

  // 隐藏的需要显示出来，设置权限
  // subWhereList.push({
  //   column: 'visible',
  //   values: 1,
  //   queryType: QueryType.EQ,
  //   dataType: DataType.INT,
  // });
  subWhereList.push({
    column: 'enable',
    values: 1,
    queryType: QueryType.EQ,
    dataType: DataType.INT,
  });
  if (userStore.tenantId !== '000000') {
    subWhereList.push({
      column: 'packageId',
      values: userStore.packageId,
      queryType: QueryType.EQ,
      dataType: DataType.INT,
    });
  }

  let orderByList: Array<OrderItem> = []; // 排序提交
  orderByList.push({
    column: 'orderNum',
    orderByType: OrderByType.DESC,
  });
  let url = '/system/core/common/loadTreeNodeAll';
  let params = {
    tableName: userStore.tenantId === '000000' ? 'sys_menu' : 'sys_tenant_menu',
    keyName: 'menuId',
    nodeName: 'menuName',
    fixHasChild: false,
    showOutsideNode: false,
    parentName: 'parentId',
    whereList: whereList, // 查询条件
    subWhereList: subWhereList, // 子集固定查询条件
    orderByList: orderByList, // 排序字段
    extendColumns: 'perms',
  };

  let [err, res] = await to(postData(url, params));
  if (err) return;

  proxy.common.showMsg(res);
  if (res?.result) {
    state.menuList = res.data;
    const eachChildren = (children: any) => {
      children.forEach((item: any) => {
        item.permsList = getPerms(item);
        if (item.children) {
          eachChildren(item.children);
        }
      });
    };
    eachChildren(state.menuList);
    state.loading = false;
  }
};

// 处理权限点
const getPerms = (row: any) => {
  let perms: string = row.perms;
  let roleAuth = state.roleAuthList.find((item) => item.menuId === row.menuId);
  let roleAuths: any[] = [];
  if (roleAuth && roleAuth.authValue) {
    let roleAuthArr = roleAuth.authValue.split(',');
    roleAuths = roleAuthArr.map((item: any) => {
      let items = item.split('=');
      return {
        authName: items[0],
        value: Number(items[1]),
      };
    });
  }
  let permsList: any[] = perms.split(',');
  permsList = permsList.map((item: any) => {
    let items = item.split('=');
    let authName = items[0];
    let label = items[1];
    let existAuth = roleAuths.find((item) => item.authName == authName);
    let value = 0;
    if (existAuth) value = existAuth.value;
    return {
      authName: authName,
      label: label,
      value: value,
    };
  });
  return permsList.filter((item) => item.label); // 权限值
};

const getPermsApp = (row: any) => {
  let vueAuth: string = row.vueAuth;
  let roleAuth = state.roleAuthAppList.find((item) => item.nodeId === row.menuId);
  let roleAuths: any[] = [];
  if (roleAuth && roleAuth.authValue) {
    let roleAuthArr = roleAuth.authValue.split(',');
    roleAuths = roleAuthArr.map((item: any) => {
      let items = item.split('=');
      return {
        authName: items[0],
        value: Number(items[1]),
      };
    });
  }
  let permsList: any[] = vueAuth.split(',');
  permsList = permsList.map((item: any) => {
    let items = item.split('=');
    let authName = items[0];
    let label = items[1];
    let existAuth = roleAuths.find((item) => item.authName == authName);
    let value = 0;
    if (existAuth) value = existAuth.value;
    return {
      authName: authName,
      label: label,
      value: value,
    };
  });
  return permsList.filter((item) => item.label); // 权限值
};

// 获得App权限右侧表格树列表
const getRoleAuthMenuApp = async () => {
  let whereList: Array<QueryBo> = []; // 查询条件
  let subWhereList: Array<QueryBo> = []; // 子集固定查询条件
  whereList.push({
    column: 'parentId',
    values: 0,
    queryType: QueryType.EQ,
    dataType: DataType.INT,
  });
  whereList.push({
    column: 'enable',
    values: 1,
    queryType: QueryType.EQ,
    dataType: DataType.INT,
  });

  let orderByList: Array<OrderItem> = []; // 排序提交
  orderByList.push({
    column: 'orderNum',
    orderByType: OrderByType.DESC,
  });
  let url = '/system/core/common/loadTreeNodeAll';
  let params = {
    tableName: 'sys_menu_app',
    keyName: 'menuId',
    nodeName: 'menuName',
    fixHasChild: false,
    showOutsideNode: false,
    parentName: 'parentId',
    whereList: whereList, // 查询条件
    subWhereList: subWhereList, // 子集固定查询条件
    orderByList: orderByList, // 排序字段
    extendColumns: 'vueAuth',
  };

  let [err, res] = await to(postData(url, params));
  if (err) return;

  proxy.common.showMsg(res);
  if (res?.result) {
    state.menuAppList = res.data;
    const eachChildren = (children: any) => {
      children.forEach((item: any) => {
        item.permsList = getPermsApp(item);
        if (item.children) {
          eachChildren(item.children);
        }
      });
    };
    eachChildren(state.menuAppList);
    state.loading = false;
  }
};

// 权限点改变
const checkAuthNode = (row: any) => {
  selectedNode(row);

  // 自动勾选上父级菜单
  updateParentPermissions(state.menuList);
};

// 选择节点
const selectedNode = (row: any) => {
  const authValue: any[] = [];
  row.permsList.forEach((item: any, index: number) => {
    authValue.push(item.authName + '=' + item.value);
  });

  const node = {
    roleId: state.currentRoleInfo.roleId,
    menuId: row.menuId,
    authValue: authValue.join(','),
  };
  const existItem = state.saveMenuList.find((item) => {
    return item.menuId === node.menuId;
  });
  if (existItem) {
    existItem.authValue = node.authValue;
  } else {
    state.saveMenuList.push(node);
  }
};

// 自动勾选上父级菜单
const updateParentPermissions = (treeData: any[]) => {
  // 递归处理每个节点
  function processNode(node: any): boolean {
    let hasChildWithPermission = false;

    // 如果有子节点，先处理子节点
    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        const childHasPermission = processNode(child);
        hasChildWithPermission = hasChildWithPermission || childHasPermission;
      }
    }

    // 处理当前节点的权限
    if (node.permsList && node.permsList.length > 0) {
      // 如果是叶子节点，检查自身是否有权限
      if (!node.children || node.children.length === 0) {
        const hasPermission = node.permsList.some((perm: any) => perm.value === 1);
        return hasPermission;
      }
      // 如果是非叶子节点，根据子节点情况设置第一个权限项
      else {
        if (hasChildWithPermission) {
          node.permsList[0].value = 1;
        } else {
          node.permsList[0].value = 0;
        }
        selectedNode(node);
        return hasChildWithPermission;
      }
    }

    return false;
  }

  // 处理整个树
  for (const node of treeData) {
    processNode(node);
  }

  return treeData;
};

// 全选
const selectAll = (selection: any[]) => {
  if (selection.length > 0) {
    state.allMenuList = selection;
  }
  for (let row of state.allMenuList) {
    rowSelected(selection, row);
  }
  if (!selection.length) {
    rowSelected([], state.menuList[0]);
  }
};

// 树前面复选框选中
const rowSelected = (selection: any[], row: any) => {
  let isSelected = selection.some((item) => item.menuId === row.menuId);
  const setValue = (permsList: any) => {
    permsList.forEach((item: any) => {
      item.value = isSelected ? 1 : 0;
    });
  };

  const eachChildren = (children: any) => {
    if (children) {
      children.forEach((item: any) => {
        setValue(item.permsList);
        eachChildren(item.children);

        // 改变保存数据集合
        checkAuthNode(item);
      });
    }
  };
  setValue(row.permsList);
  eachChildren(row.children);

  // 改变保存数据集合
  checkAuthNode(row);
  // 选中左侧复选框
  setTimeout(() => {
    const eachChildrenSelected = (children: any) => {
      if (children) {
        children.forEach((item: any) => {
          roleTreeTableRef.value!.toggleRowSelection(item, isSelected);
          eachChildrenSelected(item.children);
        });
      }
    };
    roleTreeTableRef.value!.toggleRowSelection(row, isSelected);
    eachChildrenSelected(row.children);
  }, 100);
};

// 保存数据
const saveAuth = async () => {
  if (!state.saveMenuList.length) {
    proxy.$message.error(proxy.$tt('没有可保存的数据！'));
    return;
  }
  let roleType;
  if (state.currentTab === 'user') {
    roleType = 1;
  } else if (state.currentTab === 'xcx') {
    roleType = 3;
  } else if (state.currentTab === 'app') {
    roleType = 4;
  }
  const url = '/system/permission/roleAuth/saveAuthMenu';
  const params = {
    menuList: state.saveMenuList,
    roleType: roleType,
  };
  let [err, res] = await to(postData(url, params));
  if (err) return;

  proxy.common.showMsg(res);
  if (res?.result) {
    state.saveMenuList = [];
    await getRoleAuth(); // 获取角色权限集合
  }
};

// 头部切换
const handleClick = async (tab: any, event: any) => {
  state.saveMenuList = [];
  if (tab.props.label === '角色权限设置') {
    if (state.roleId) {
      await getRoleAuth(); // 获取角色权限集合
      await getRoleAuthMenu();
    }
  } else if (tab.props.label === '模块权限设置') {
    if (state.roleId) {
      await getRoleAuthApp(); // 获取角色权限集合
      await getRoleAuthMenuApp(); // 获取角色APP权限集合
    }
  }
};

// 获取根目录集合
const getRootMenu = async () => {
  const url = '/system/core/menu/getRootMenu';
  let [err, res] = await to(postData(url));
  if (err) return;

  if (res?.result) {
    state.rootMenuList = res.data;
    state.rootMenuId = state.rootMenuList[0].menuId;
    getRoleAuthMenu(); // 初始化
  }
};

// 获取角色权限集合
const getRoleAuth = async (count?: number) => {
  let queryBoList: Array<QueryBo> = []; // 查询条件
  queryBoList.push({
    column: 'roleId',
    values: count ? count : state.roleId,
    queryType: QueryType.EQ,
    dataType: DataType.INT,
  });

  const url = '/system/permission/roleAuth/selectList';
  let [err, res] = await to(postData(url, queryBoList));
  if (err) return;

  if (res?.result) {
    state.roleAuthList = res.data;
  }
};

// 获取角色App权限集合
const getRoleAuthApp = async (count?: number) => {
  let queryBoList: Array<QueryBo> = []; // 查询条件
  queryBoList.push({
    column: 'roleId',
    values: count ? count : state.roleId,
    queryType: QueryType.EQ,
    dataType: DataType.INT,
  });
  queryBoList.push({
    column: 'moduleId',
    values: 8,
    queryType: QueryType.EQ,
    dataType: DataType.INT,
  });

  const url = '/system/permission/roleAuthData/selectList';
  let [err, res] = await to(postData(url, queryBoList));
  if (err) return;

  if (res?.result) {
    state.roleAuthAppList = res.data;
  }
};
</script>

<style lang="scss" scoped>
.left-aside {
  .left-role-title {
    padding: 10px;
    border-bottom: 1px solid #ebeef5;
    background-color: #66b1ff;
    color: white;
  }

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
  ::v-deep .el-checkbox {
    height: 18px;
    margin-right: 10px;
  }
  ::v-deep .el-checkbox__label {
    padding-left: 2px;
  }
  ::v-deep .el-card__body {
    padding: 5px;
  }
}
</style>
