<template>
  <div ref="container" class="page-list-container">
    <split-pane :max-width="500" :default-width="260" split="vertical">
      <template #paneL>
        <div class="left-container">
          <el-form class="form-tool">
            <el-form-item>
              <el-input v-model="filterText" placeholder="搜索名称" class="search-input margin-right-5">
                <template #prefix>
                  <el-icon class="el-input__icon">
                    <search />
                  </el-icon>
                </template>
              </el-input>
              <el-button title="刷新" class="btn-refresh" @click="treeRefresh">
                <i class="el-icon-yrt-shuaxin"></i>
              </el-button>
            </el-form-item>
            <el-form-item class="align-center">
              <!--数据tree-->
              <el-tree
                ref="tree"
                :load="
                  (node, resolve) => {
                    loadTreeNode(node, resolve);
                  }
                "
                :expand-on-click-node="false"
                :filter-node-method="filterTreeNode"
                :props="props"
                :default-expand-all="false"
                node-key="treeKey"
                highlight-current
                lazy
                @node-click="nodeClick"
              >
                <template #default="{ node, data }">
                  <span class="custom-tree-node" @mouseover="() => treeNodeOver(node, data)" @mouseout="() => treeNodeOut(node, data)">
                    <span>
                      <i v-if="data.hasChild" class="el-icon-menu"></i>
                      <i v-else class="el-icon-tickets"></i>
                      {{ node.label }}
                    </span>
                    <span v-show="data.value == treeNodeOverId">
                      <el-button link size="small" @click="() => treeNodeAppend(node, data)">
                        <i class="el-icon-circle-plus-outline"></i>
                      </el-button>
                      <el-button link size="small" @click="() => treeNodeEdit(node, data)">
                        <i class="el-icon-edit-outline"></i>
                      </el-button>
                      <el-button link size="small" @click="() => treeNodeRemove(node, data)">
                        <i class="el-icon-delete"></i>
                      </el-button>
                    </span>
                  </span>
                </template>
              </el-tree>
              <el-button v-if="!hasDataTree" link @click="treeNodeAppend">添加类别</el-button>
            </el-form-item>
          </el-form>
        </div>
      </template>
      <!--右侧主区-->
      <template #paneR>
        <div class="right-container">
          <!--数据Table-->
          <yrt-data-list :ref="dataListRef" v-model:fields="dataListOptions.fields" v-model:data-list-selections="dataListSelections" :editor-ref="editorRef" :data-options="dataOptions" :buttons="dataListOptions.buttons" :button-click="buttonClick" :auth-nodes="authNodes" :fixed-where="fixedWhere">
            <template #common-column-slot="{ row, col }">
              <template v-if="col.prop === 'typeURL'">
                <el-image :src="getFirstImage(row[col.prop])" fit="cover" class="img" @click="showImages(row[col.prop])">
                  <template #placeholder>
                    <div class="image-slot">
                      <el-icon class="is-loading">
                        <loading />
                      </el-icon>
                    </div>
                  </template>
                  <template #error>
                    <div class="image-slot">
                      <i class="el-icon-yrt-guanbi" style="font-size: 30px"></i>
                    </div>
                  </template>
                </el-image>
              </template>
              <template v-else-if="col.prop == dataOptions.linkColumn">
                <el-link
                  type="primary"
                  @click="
                    () => {
                      linkEditor(row[dataOptions.idField]);
                    }
                  "
                >
                  <template v-if="['date', 'datetime'].indexOf(col.dataType) >= 0 && col.formatter">
                    {{ common.formatDate(row[col.prop], col.formatter) }}
                  </template>
                  <template v-else-if="['byte', 'int32', 'int64', 'decimal', 'double'].indexOf(col.dataType) >= 0 && col.formatter">
                    {{ common.formatNumber(row[col.prop], col.formatter) }}
                  </template>
                  <template v-else>
                    {{ row[col.prop] }}
                  </template>
                </el-link>
              </template>
              <template v-else>
                <!-- 通用标签颜色着色 -->
                <template v-if="col.tagColorList && col.tagColorList.length && row[col.prop]">
                  <el-tag :color="common.getTagBgColor(row, col, row[col.prop])" :style="common.getTagColor(row, col, row[col.prop])">
                    {{ common.formatData(row, col) }}
                  </el-tag>
                </template>
                <template v-else>
                  {{ common.formatData(row, col) }}
                </template>
              </template>
            </template>
          </yrt-data-list>
          <!--数据编辑器Editor-->
          <yrt-editor :ref="editorRef" v-model:action="editorOptions.action" v-model:visible="editorOptions.config.visible" :data-list-ref="dataListRef" :fields="editorOptions.fields" :config="editorOptions.config" :data-options="dataOptions" :detail-button-click="detailButtonClick" :auth-nodes="authNodes"> </yrt-editor>
        </div>
      </template>
    </split-pane>

    <!--显示图片弹出页面-->

    <el-dialog v-model="isShowImageDialog" top="5vh" width="920px" title="商品图片" append-to-body>
      <!--自定义对话框标题，可拖动-->
      <template #title>
        <div v-drag>商品图片</div>
      </template>
      <el-carousel height="600px" indicator-position="outside">
        <el-carousel-item v-for="item in imageList" :key="item">
          <el-image :src="item" fit="scale-down" class="img-big">
            <template #placeholder>
              <div class="image-slot">
                <i class="el-icon-loading ico"></i>
              </div>
            </template>
            <template #error>
              <div class="image-slot">暂无无图片</div>
            </template>
          </el-image>
        </el-carousel-item>
      </el-carousel>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="isShowImageDialog = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { toRefs, reactive, getCurrentInstance, ComponentInternalInstance } from 'vue';
// import baseLayout from '/@/components/common/base-layout.ts';
import yrtDataList from '/@/components/common/yrtDataList.vue';
import yrtEditor from '/@/components/common/yrtEditor.vue';
import splitPane from '/@/components/splitPane/index.vue';
import { Search, Loading } from '@element-plus/icons-vue';
import { BaseProperties } from '/@/types/base-type';

interface CustomProperties extends BaseProperties {
  /**
   * 查询字符串
   */
  filterText: string;
  /**
   * 显示图片
   */
  isShowImageDialog: boolean;
  /**
   * 图片列表
   */
  imageList: Array<any>;
  /**
   * 鼠标滑过的ID
   */
  treeNodeOverId: number;
  /**
   * 编辑级联是否加载完毕
   */
  isTreeLoaded: boolean;
  /**
   * 是否子节点
   */
  hasDataTree: boolean;
  /**
   * 固定查询条件
   */
  fixedWhere: any;
  /**
   * 编辑框级联加载子集数据
   */
  cascaderLoadNode: (ref: any, val: any, field: any) => {};
  /**
   * 删除节点后刷新数据
   */
  treeRefresh: () => {};
  /**
   * 获得左侧类目导航节点数据
   */
  loadTreeNode: (node: any, resolve: any) => {};
}

export default {
  name: 'decorate-link-type',
  components: {
    yrtDataList, // 数据管理器
    yrtEditor, // 编辑页面
    splitPane,
    Search,
    Loading,
  },
  setup() {
    let ins = getCurrentInstance() as ComponentInternalInstance;
    let proxy: CustomProperties;
    if (ins.proxy) {
      proxy = ins.proxy as CustomProperties;
    }
    // const base = baseLayout();
    //#region 变量
    const state: any = reactive({
      filterText: '',
      hasDataTree: false,
      // 鼠标滑过的ID
      treeNodeOverId: 0,
      props: {
        label: 'label',
        children: 'children',
        isLeaf: 'isLeaf',
      },
      // 编辑级联是否加载完毕
      isTreeLoaded: false,
      // 显示图片
      isShowImageDialog: false,
      // 图片列表
      imageList: [],
      fixedWhere: {}, // 固定查询条件
    });
    //#endregion

    let method = {
      // 获得左侧类目导航节点数据
      loadTreeNode(node: any, resolve: any) {
        var the = proxy;
        the.$nextTick(() => {
          var userInfo = proxy.common.getUserInfo();
          let where: any = {};
          if (node.level === 0) {
            where = {
              parentId: 0,
              userProduct_Id: userInfo.userProduct_Id,
            };
          } else {
            where = {
              parentId: node.data.typeId,
              userProduct_Id: userInfo.userProduct_Id,
            };
          }

          var url = '/api/common/loadTreeNode';
          var params = {
            openNodeApi: true,
            folder: 'app/design',
            DBServer: 'Sys',
            tableName: 'app_LinkType',
            tableView: 'app_LinkType',
            keyName: 'typeId',
            nodeName: 'typeName',
            fixHasChild: false,
            isBreakWay: false,
            displayBreakWay: false,
            parentName: 'parentId',
            orderBy: 'orderNo desc, typeId',
            where: where,
            extendColumns: '',
          };
          the.common.ajax(
            url,
            params,
            (res: any) => {
              if (res.result) {
                res.data.forEach((element: any) => {
                  element.isLeaf = !element.hasChild;
                });
                resolve(res.data);

                // 判断根节点是否有数据
                if (node.level === 0) {
                  proxy.hasDataTree = res.data.length > 0;
                }
              } else {
                the.$message.error(res.msg);
              }
            },
            true
          );
        });
      },
      // 搜索导航
      filterTreeNode(value: any, data: any) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      // 点击tree导航节点
      nodeClick(data: any) {
        proxy.fixedWhere = {
          typeId: {
            operator: 'raw',
            value: 'typeId in(Select typeId from dbo.[GetLinkTypeTree](' + data.typeId + '))',
          },
        };
        window.setTimeout(() => {
          proxy.dataList.reload();
        }, 500);
      },
      // 刷新tree
      treeRefresh() {
        proxy.fixedWhere = {};
        window.setTimeout(() => {
          proxy.dataList.reload();
        }, 500);

        proxy.filterText = '';
        var root = proxy.$refs.tree.store.root;
        while (root.childNodes.length) {
          proxy.$refs.tree.remove(root.childNodes[0]);
        }
        proxy.loadTreeNode(root, (data: any) => {
          root.doCreateChildren(data);
        });
        proxy.isTreeLoaded = false;
      },
      // 新建节点
      treeNodeAppend() {
        proxy.editor.addData();
      },
      // 编辑节点
      treeNodeEdit(node: any, data: any) {
        proxy.editor.editData(data.typeId);
      },
      // 删除
      treeNodeRemove(node: any, data: any) {
        proxy.dataList.delete([data]);
      },
      treeNodeOver(node: any, data: any) {
        proxy.treeNodeOverId = data.value;
      },
      treeNodeOut() {
        proxy.treeNodeOverId = -1;
      },
      // 编辑获得焦点
      onFocus(ref: any, val: any, event: any, field: any) {
        if (!field.options.isLoaded && field.options.prop === 'fulltypeId') {
          field.options.isLoaded = proxy.isTreeLoaded;
          proxy.cascaderLoadNode(ref, 0, field);
          proxy.isTreeLoaded = true;
        }
      },
      // 编辑改变数据
      onChange(ref: any, val: any, field: any) {
        if (field.options.prop === 'fulltypeId') {
          var editor = proxy.editor;
          // 设置表单数据
          editor.formData.parentId = val[val.length - 1];
          setTimeout(() => {
            editor.formData.fullTypeName = ref.inputValue;
          }, 500);
        }
      },
      // 编辑框级联加载子集数据
      cascaderLoadNode(ref: any, val: any, field: any) {
        var the = proxy;
        var where = {
          parentId: 0,
          userProduct_Id: proxy.common.getUserInfo().userProduct_Id,
        };
        var url = '/api/common/loadTreeNodeAll';
        var params = {
          openNodeApi: true,
          folder: 'basicInfo/base',
          DBServer: 'Sys',
          tableName: 'app_LinkType',
          tableView: 'app_LinkType',
          keyName: 'typeId',
          nodeName: 'typeName',
          fixHasChild: false,
          isBreakWay: false,
          displayBreakWay: false,
          parentName: 'parentId',
          orderBy: 'orderNo desc, typeId',
          where: where,
          extendColumns: '',
        };
        the.common.ajax(
          url,
          params,
          (res: any) => {
            if (res.result) {
              var items = [
                {
                  value: 0,
                  label: '根',
                  children: res.data,
                },
              ];

              field.options.options = items;
            } else {
              the.$message.error(res.msg);
            }
          },
          true
        );
      },
      // 删除节点后刷新数据
      onDeleteAfter() {
        proxy.treeRefresh();
      },
      // 获得图片列表
      getFirstImage(url: any) {
        let imgUrl = '';
        if (!url) url = '';
        const imgs = url.split(',');
        if (imgs.length) {
          imgUrl = imgs[0] + '?x-oss-process=style/small';
        }
        return imgUrl;
      },
      // 显示图片
      showImages(url: any) {
        proxy.isShowImageDialog = true;
        if (!url) url = '';
        proxy.imageList = url.split(',');
      },
    };

    return {
      // ...base,
      ...toRefs(state),
      ...method,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '/@/theme/page.scss';
</style>
