/**
 * @description: 货位类型枚举
 */
export enum PositionTypeEnum {
  /**
   * 常规货位
   */
  NORMAL = 1, // 常规货位
  /**
   * 残品货位
   */
  SCRAP = 2, // 残品货位
  /**
   * 借入货位
   */
  BORROW_IN = 3, // 借入货位
  /**
   * 收货位
   */
  RECEIVING = 4, // 收货位
  /**
   * 下架理货位
   */
  UNLOADING = 5, // 下架理货位
  /**
   * 发货暂存货位
   */
  Temporary = 6, // 发货暂存货位
  /**
   * 虚拟货位
   */
  VIRTUAL = 7, // 虚拟货位
  /**
   * 次品货位
   */
  DEFECTIVE = 8, // 次品货位
  /**
   * 拣货车
   */
  PICKING_CAR = 9, // 拣货车
  /**
   * 配货位
   */
  ALLOCATION = 10, // 配货位
  /**
   * 灯光分拣位
   */
  LIGHT = 11, // 灯光分拣位
  /**
   * 高架货位
   */
  ELEVATED = 12, // 高架货位
  /**
   * 存储货位
   */
  STORAGE = 13, // 存储货位
  /**
   * 临期货位
   */
  EXPIRE = 14, // 临期货位
  /**
   * 在途货位
   */
  IN_TRANSIT = 15, // 在途货位
}
