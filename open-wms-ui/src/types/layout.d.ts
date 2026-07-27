// aside
declare type AsideState = {
  menuList: RouteRecordRaw[];
  clientWidth: number;
  enterClass?: string;
  activeClassSub?: string;
  showSubMenu?: string;
  defaultActivePath?: string;
  activeItem?: any;
  activeItemSub?: any;
  rootPathList?: Array; // 查找到的层级路由，从根级到叶级
  otherMenuList?: Record<string, any>;
  showSubMenuGroupWidth?: string; //子菜单宽度
  showSubMenuGroupHeight?: string; //子菜单高度
  routeParams?: String;
};

// columnsAside
declare type ColumnsAsideState<T = any> = {
  columnsAsideList: T[];
  liIndex: number;
  liOldIndex: null | number;
  liHoverIndex: null | number;
  liOldPath: null | string;
  difference: number;
  routeSplit: string[];
};

// navBars breadcrumb
declare type BreadcrumbState<T = any> = {
  breadcrumbList: T[];
  routeSplit: string[];
  routeSplitFirst: string;
  routeSplitIndex: number;
  sysFullName?: string;
};

// navBars search
declare type SearchState<T = any> = {
  isShowSearch: boolean;
  menuQuery: string;
  tagsViewList: T[];
};

// navBars tagsView
declare type TagsViewState<T = any> = {
  routeActive: string | T;
  routePath: string | unknown;
  dropdown: {
    x: string | number;
    y: string | number;
  };
  sortable: T;
  tagsRefsIndex: number;
  tagsViewList: T[];
  tagsViewRoutesList: T[];
};

// navBars parent
declare type ParentViewState<T = any> = {
  refreshRouterViewKey: string;
  iframeRefreshKey: string;
  keepAliveNameList: string[];
  iframeList: T[];
};

// navBars link
declare type LinkViewState = {
  title: string;
  isLink: string;
};
