import React from 'react';
import { Store } from 'api/interface/store';
import Utils from 'common/utils';
import css from './index.less';

export interface Props {
  data: Store[];
}

const StoreMap: React.FC<Props> = ({ data }) => {

  const containerRef = React.useRef<HTMLDivElement>();
  const mapRef = React.useRef<AMap.Map>();
  const markersRef = React.useRef<AMap.Marker<Store>[]>([]);
  const infoWindowRef = React.useRef<AMap.InfoWindow<Store>>();

  /**
   * 初始化，画地图
   */
  React.useEffect(() => {
    const map = new AMap.Map(containerRef.current, {
      mapStyle: 'amap://styles/1062dc3721995c5edecfab4c4468a935',
      resizeEnable: false,
      zoom: 5
    });

    mapRef.current = map;

    // 挂载地图插件
    const plugins = ['AMap.Geocoder'];
    plugins.push('AMap.ToolBar');
    AMap.plugin(plugins, () => {
      // 异步加载插件
      // this.geocoder = new AMap.Geocoder({ city: '' }); // 给地图加点标记
      
      // this.toolbar = new AMap.ToolBar(); // 显示地图放大控件
      map.addControl(new AMap.ToolBar());

    });

    return mapRef.current.destroy;
  }, []);

  /**
   * 数据改变时，重置地图上门店标记点
   */
  React.useEffect(() => {
    // 1.清除上一次的标记点
    markersRef.current.forEach(marker => {
      marker.setMap(null);
      marker = null;
    });
    // 2.重新设置标记点
    markersRef.current = data.map(setMarker);
  }, [data]);

  /**
   * 设置点位标记点
   * @param store
   */
  function setMarker(store: Store) {
    const lngLat = new AMap.LngLat(store.lng, store.lat);
    const marker = new AMap.Marker({
      position: lngLat,
      zooms: [0.5, 0.5],
      clickable: true,
      extData: store,
    });
    
    // mapRef.current.setCenter(lngLat);
    mapRef.current.add(marker);

    // 用户点击标记点时
    marker.on('click', function() {
      // 不存在 打开的提示窗口
      if (!infoWindowRef.current) {
        openInfo(store);
        return;
      }
      const infoWindow = infoWindowRef.current;
      const isOpen = infoWindow.getIsOpen();
      const extData = infoWindow.getExtData() as Store; // 上一次打开的store信息

      if (isOpen && extData.id === store.id) {
        infoWindow.close();
      } else {
        openInfo(store);
      }
    });

    return marker;
  }

  /**
   * 在指定位置打开门店信息
   * @param store 
   */
  function openInfo(store: Store) {

    if (!infoWindowRef.current) {
      infoWindowRef.current = new AMap.InfoWindow({
        offset: new AMap.Pixel(0, -30),
      });
    }

    const infoWindow = infoWindowRef.current;

    // 构建信息窗体中显示的内容
    const info = [];
    info.push(`<div style="padding:7px 0px 0px 0px;"><p class='input-item'>点位名称：${store.name}</p>`);
    info.push(`<p class='input-item'>点位地址：${Utils.getAddress(store.regionId, store.cityId, store.areaId)} ${store.detailAddress}</p>`);
    info.push(`<p class='input-item'>设备数量：${store.machineNum}台</p></div></div>`);

    infoWindow.setContent(info.join('')); // 设置弹窗内容
    infoWindow.setExtData(store); // 设置扩展数据
    infoWindow.open(mapRef.current, new AMap.LngLat(store.lng, store.lat));
  }

  return <div ref={containerRef} className={css.container} />;
};

export default StoreMap;
