import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import css from './index.less';

export default class WheelDraw extends React.Component {
  static propTypes = {};

  static defaultProps = {
    rotTimes: 1, // 抽奖机会次数
    count: 10, //奖品个数（包含未中奖，一般等于prizeList.length）
    prizeList: [], // 奖品列表
    prizeId: '', // 获奖项id
    circle: 6, //旋转圈数
    bgImg:
      'https://uimgproxy.suning.cn/uimg1/sop/commodity/K1vJDOY8EXtBcnUpvfhIew.png', // 背景图
    btnImg:
      'https://uimgproxy.suning.cn/uimg1/sop/commodity/7UR4AYCZ8tkHBUtpW1P5RA.png', // 按钮图
    onStart: () => {}, // 开始回调
    onFinish: () => {}, // 结束回调
    onTimesUp: () => {}, // 次数用尽的回调
  };

  constructor(props) {
    super(props);
    this.state = {
      degValue: 0, // 旋转角度
    };
  }

  componentDidMount() {
    this.init();
  }

  //初始化
  init() {
    const { prizeList, count } = this.props;
    this.count = prizeList.length != 0 ? prizeList.length : count; // 奖品个数
    this.rotNum = 0; // 当前是第几次抽奖
    this.onRunning = false; // 是否正在抽奖
  }

  start() {
    const { circle, prizeId, prizeList } = this.props;

    if (this.onRunning) return;

    if (this.rotNum >= this.props.rotTimes) {
      console.warn('转盘次数用尽');
      this.props.onTimesUp();
      return;
    }
    if (!prizeId) {
      console.warn('未获取到中奖prizeId将指向奖品列表最后一项');
    }

    const index = prizeId
      ? prizeList.findIndex((item) => prizeId === item.id)
      : prizeList.length - 1; //prizeId为空时指向最后一个奖品，这里为未中奖

    this.rotNum += 1;
    this.onRunning = true;

    const degree = (360 * (this.count - index + 1 + 0.5)) / this.count;
    let degValue = 360 * circle + degree;

    if (degValue === this.state.degValue) degValue = degValue + 360 * circle;

    this.setState({ degValue: degValue });
    this.props.onStart(this.props.prizeId, this.rotNum);
    setTimeout(() => {
      this.done();
    }, 8000);
  }

  done() {
    this.onRunning = false;
    this.props.onFinish(this.props.prizeId, this.rotNum);
  }

  render() {
    const { bgImg, btnImg, prizeList } = this.props;
    const { degValue } = this.state;

    return (
      <div className={css.wheelContainer}>
        <div
          className={classNames(css.wheelList, { [css.close]: degValue === 0 })}
          style={{
            background: `url(${bgImg}) 0% 0% / 100% 100% no-repeat`,
            transform: `rotate(${degValue}deg)`,
          }}
        >
          {prizeList.map((item, i) => {
            return (
              <div className={css.wheelItem} key={`item_${i}`}>
                <div
                  className={css.wheelImg}
                  style={{
                    transform: `rotate(${(i + 1) / prizeList.length}turn)`,
                  }}
                >
                  <img src={item.img} />
                </div>
              </div>
            );
          })}
        </div>
        <div className={css.wheelBtn}>
          <img
            src={btnImg}
            className={css.img}
            onClick={this.start.bind(this)}
          />
        </div>
      </div>
    );
  }
}
