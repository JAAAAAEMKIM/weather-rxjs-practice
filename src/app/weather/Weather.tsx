'use client';

import { useCallback, useEffect, useState } from 'react';
import { toXY } from './coordinateUtil';

import {
  fetchCurrentWeather,
  fetchNearFutureWeather,
} from '@/front-api/weather';
import {
  WEATHER_CATEGORY,
  WEATHER_CATEGORY_LABEL_MAP,
  WeatherEntity,
} from '@/modules/WeatherApiModule';

const convertSkyCode = (code: string) =>
  code === '1'
    ? '맑음'
    : code === '3'
    ? '구름 많음'
    : code === '4'
    ? '흐림'
    : '정보 없음';

const Weather = () => {
  const [location, setLocation] = useState<{ nx: string; ny: string }>();
  const [currentWeather, setCurrentWeather] = useState<WeatherEntity[]>([]);
  const [nearFutureWeather, setNearFutureWeather] = useState<WeatherEntity[]>(
    []
  );

  const initialize = useCallback(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const xy = toXY(position.coords.latitude, position.coords.longitude);
      const params = {
        nx: Math.round(xy.x).toString(),
        ny: Math.round(xy.y).toString(),
      };
      const search = new URLSearchParams(params);

      setLocation(params);
      const [current, nearFuture] = await Promise.allSettled([
        fetchCurrentWeather(search.toString()),
        fetchNearFutureWeather(search.toString()),
      ]);

      if (current.status === 'fulfilled') {
        setCurrentWeather(current.value);
      }
      if (nearFuture.status === 'fulfilled') {
        setNearFutureWeather(nearFuture.value);
      }
    });
  }, []);

  const onClickRefresh = async () => {
    initialize();
  };

  useEffect(() => {
    initialize();
  }, [initialize]);

  const groupedFutureWeathers = nearFutureWeather.reduce<
    Record<string, string[]>
  >((acc, cur) => {
    const key = `${cur.date}_${cur.time}`;
    const value =
      cur.category === WEATHER_CATEGORY.SKY
        ? convertSkyCode(String(cur.value))
        : cur.value;

    const valueString = `${WEATHER_CATEGORY_LABEL_MAP[cur.category]}: ${value}`;

    if (acc[key]) {
      acc[key].push(valueString);
    } else {
      acc[key] = [valueString];
    }

    return acc;
  }, {});

  return (
    <div>
      <div>
        <h2>현재 위치</h2>
        <div>
          X: {location?.nx}
          Y: {location?.ny}
          <button onClick={onClickRefresh}>새로고침</button>
        </div>
      </div>
      <div>
        <div>
          <h2>
            {currentWeather[0]?.date} {currentWeather[0]?.time.substring(0, 2)}
            시 기준 현재 날씨
          </h2>
        </div>
        {currentWeather &&
          currentWeather.map((weather) => (
            <div key={weather.category}>{`${
              WEATHER_CATEGORY_LABEL_MAP[weather.category]
            }: ${weather.value}`}</div>
          ))}

        {nearFutureWeather && (
          <div>
            <h2>일기 예보</h2>
            {Object.entries(groupedFutureWeathers).map(([key, values]) => (
              <div key={key}>
                <h3>{key.split('_').join('일 ')}시</h3>
                <div>
                  {values.map((value) => (
                    <div key={value}>{value}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;
