import {observable, action, makeObservable} from 'mobx';

class Config {
  maxSeat = 5;
  hourCanNotCancel = 1;
  percentRefundOver1Hour = 0.95;
  percentRefundUnder1Hour = 0.85;
  timeRefund = 24;
  isModeTest = true;

  constructor() {
    makeObservable(this, {
      maxSeat: observable,
      hourCanNotCancel: observable,
      percentRefundOver1Hour: observable,
      percentRefundUnder1Hour: observable,
      timeRefund: observable,
      isModeTest: observable,

      setConfig: action,
    });
  }

  setConfig = (configs: any) => {
    console.log(1, configs);

    this.maxSeat = configs.max_seat;
    this.hourCanNotCancel = configs.hour_can_not_cancel;
    this.percentRefundOver1Hour = configs.percent_refund_over_1_hour / 100;
    this.percentRefundUnder1Hour = configs.percent_refund_under_1_hour / 100;
    this.timeRefund = configs.time_refund;
  };
}

export {Config};
