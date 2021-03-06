/**
 * Created by Administrator on 2017/4/17.
 */

export const authApi = () => {
  return {
    confirmUser: '/server/auth/user/confirm',
    confirmAdministrator: '/server/auth/administrator/confirm',
    sendSMS: '/server/auth/send/sms',
  };
};

export const userApi = () => {
  return {
    registerUser: '/server/user/register',
    updateUser: '/server/user/update',
    getUser: '/server/user/get',
    addAdministrator: '/server/administrator/add',
    updateAdministrator: '/server/administrator/update',
    updateUserAddress: '/server/user/address/update',
    deleteUserAddress: '/server/user/address/delete',
    getUserAddressList: '/server/user/address/list/get',
  };
};

export const mallApi = () => {
  return {
    updateMallCart: '/server/mall/cart/update',
    deleteMallCart: '/server/mall/cart/delete',
    getMallCartList: '/server/mall/cart/list/get',
    updateMallItem: '/server/mall/item/update',
    getMallItemList: '/server/mall/item/list/get',
    getCategoryList: '/server/mall/category/list/get',
    getMallSetList: '/server/mall/set/list/get',
    updateMallSet: '/server/mall/set/update',
    getMallOrderList: '/server/mall/order/list/get',
    updateMallOrder: '/server/mall/order/update',
    getMallCommentList: '/server/mall/item/comment/list/get',
    updateMallComment: '/server/mall/item/comment/update',
    getMallReturnGoodsList: '/server/mall/return/goods/list/get',
    updateMallReturnGoods: '/server/mall/return/goods/update',

  };
};

export const fileApi = () => {
  return {
    singleFileUpload: 'https://www.unuseshared.cn/server/file/single/upload',
    multipleFileUpload: 'https://www.unuseshared.cn/server/file/multiple/upload',
  };
};

export const FileSource = () => {
  return {
    USER: 1000,
    ITEM: 2000,
    TEMP: 3000,
    ITEM_COMMENT: 4000,
    ITEM_REPLY: 5000,
    ITEM_RETURN_GOODS: 6000,
  };
};
