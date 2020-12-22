import React from 'react';

export interface Props {
  children: (number: number) => React.ReactElement;
  end: number;
  duration?: number;
}

/**
 * 缓动函数
 * @param pos 
 */
function ease(pos: number): number {
  if ((pos/=0.5) < 1) return 0.5*Math.pow(pos, 4);
  return -0.5 * ((pos - 2) * Math.pow(pos - 2, 3) - 2);
}

const CountUp: React.FC<Props> = ({ children, end, duration }) => {
  
  const max = Math.ceil(duration / 16);
  if (end === 0) return children(0);

  const [point, setPoint] = React.useState(0);

  React.useEffect(() => {
    const frameAnimation = requestAnimationFrame(() => {
      if (point < max) {
        setPoint(point + 1);
      } else {
      }
    });
    return () => {
      cancelAnimationFrame(frameAnimation);
    };
  }, [end, point]);

  return children(Math.floor(ease(point / max) * end));
};

CountUp.defaultProps = {
  duration: 450,
};

export default CountUp;
