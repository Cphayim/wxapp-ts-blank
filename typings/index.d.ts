declare namespace wx {
  // 存储
  export function getStorageSync(key: string): any;
  export function setStorageSync(key: string, data: any): void;
  export function removeStorageSync(key: string): void;
  export function clearStorageSync(): void;


  export function login(args: any): void;
  export function getApp(): any;

  export function getSystemInfoSync(): any;
  export function getUserInfo(args: any): void;

  // 导航
  export function navigateTo(args: { url: string, success?: (res) => void, fail?: (err) => void }): void;
  export function redirectTo(args: { url: string, success?: (res) => void, fail?: (err) => void }): void;
  export function switchTab(args: { url: string, success?: (res) => void, fail?: (err) => void }): void;
  export function reLaunch(args: { url: string, success?: (res) => void, fail?: (err) => void }): void;
  export function navigateBack(args?: { delta?: number }): void;


  // 连接
  export function request(args: Object): void;

  // 弹框相关
  export function showToast(args: Object): void;
  export function hideToast(): void;
  export function showLoading(args: Object): void;
  export function showModal(args: Object): void;

  // 下拉刷新 
  export function stopPullDownRefresh(): void;

  // 元素
  export function createSelectorQuery(): any;

  export function setNavigationBarTitle(arg: any): void;

  // 调用系统
  export function makePhoneCall(arg: { phoneNumber: Number }): void;
}

declare interface Application {
  onLaunch(): void,
  globalData: any
}

declare interface Base {
  setData(data: Object): void
}

declare function App(app: Application): void;
declare function Page(page: Base): void;

declare function getApp(): Application;
declare function getCurrentPages(): Base[];

declare var global: {
  global: any,
  Object: any,
  clearTimeout: any,
}
