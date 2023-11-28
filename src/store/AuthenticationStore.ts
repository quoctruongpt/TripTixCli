import { observable, action, makeObservable } from "mobx";
import { getUserInfo } from "@httpClient/authentication.api";
import { storage } from "@storage/index";
import { StorageKeys } from "@constants/global";

class Authentication {
  isLogin = false;
  userInfo: Record<string, any> = {};

  constructor() {
    makeObservable(this, {
      isLogin: observable,
      userInfo: observable,
      setIsLogin: action,
      setUserInfo: action,
    });
  }

  setIsLogin = (value: boolean) => {
    this.isLogin = value;
  };

  setUserInfo = (value: any) => {
    this.userInfo = value;
  };

  synchUserInfo = async () => {
    try {
      const userId = this.userInfo.idUserSystem;

      if (!userId) return;

      const { data } = await getUserInfo(userId);
      this.userInfo = data.data;
      await storage.setItem(StorageKeys.userInfo, JSON.stringify(data.data));

      return data.data;
    } catch {}
  };
}

export { Authentication };
