import React from "react";
import PropTypes from "prop-types";
import { lottery } from "common/api";
import "./js/easing.min.js";
import snUtils from "common/utils/snUtils";
import { Toast } from "antd-mobile";
import { ToastInfo } from "common/utils";
import { AWARD_LIST } from "common/const";
import css from "./index.less";

const SLOT_LIST = [
  {
    url:
      "https://uimgproxy.suning.cn/uimg1/sop/commodity/SHIv7Bmhc_AkZ98XN3NnIQ.jpg"
  },
  {
    url:
      "https://uimgproxy.suning.cn/uimg1/sop/commodity/SHIv7Bmhc_AkZ98XN3NnIQ.jpg"
  },
  {
    url:
      "https://uimgproxy.suning.cn/uimg1/sop/commodity/SHIv7Bmhc_AkZ98XN3NnIQ.jpg"
  }
];
const lotteryNum = 100;

let isBegin = false;
const Draw = React.memo(({ user, onShowDrawResult, onGetUserInfo }) => {
  function getRandom(type, id) {
    const len = AWARD_LIST.length;
    let random = [];
    if (type === 0) {
      for (let i = 0; i < 3; i++) {
        let r = Math.floor(Math.random() * (len - 1));
        if (r === len - 1) r = 0;
        random.push(r);
      }

      if (random.every(a => a === random[0])) {
        return getRandom(type, id);
      }

      return random;
    }
    let m = AWARD_LIST.findIndex(item => item.id === id);
    if (m === len - 1) m = 0;
    return [m, m, m];
  }

  async function start() {
    if (isBegin) return; //游戏进行中，不能重复点击
    // if (user.point < lotteryNum) {
    //   ToastInfo("抱歉，您的积分不足", 2);
    //   return;
    // }
    try {
      isBegin = true;
      Toast.loading("即将开始抽奖", 10);
      // const { award, awardRecord } = await lottery({
      //   dfpToken: await snUtils.getDfpToken(),
      //   detect: await snUtils.getDetect(),
      //   termiSys: snUtils.systemModel()
      // });
      Toast.hide();
      onGetUserInfo();
      // const random = getRandom(award.type, award.id);
      const random = getRandom(0, 0);
      console.log("random", random);
      $("dl dd").slots({
        boxH: 130,
        num: AWARD_LIST.length - 1,
        random,
        circle: 30,
        end: () => {
          isBegin = false;
          // 0未中奖1实物3云钻

          // onShowDrawResult({ ...award, id: awardRecord.id });
        }
      });
    } catch (error) {
      console.log("error", error);
      isBegin = false;
      Toast.hide();
      ToastInfo(error.errorMessage, 2);
    }
  }

  return (
    <div className={css.container}>
      <dl className={css.area}>
        {SLOT_LIST.map((item, index) => {
          return (
            <dd
              style={{ backgroundImage: `url(${item.url})` }}
              key={`slot${index}`}
              className={css.item}
            />
          );
        })}
      </dl>

      <div className={css.bg}>我的超品积分：{user.point || 0}分</div>
      <div className={css.draw} onClick={start} />
    </div>
  );
});

Draw.propTypes = {
  user: PropTypes.object,
  onShowDrawResult: PropTypes.func,
  onGetUserInfo: PropTypes.func
};

Draw.defaultProps = {
  user: {},
  onShowDrawResult: () => {},
  onGetUserInfo: () => {}
};

export default Draw;
