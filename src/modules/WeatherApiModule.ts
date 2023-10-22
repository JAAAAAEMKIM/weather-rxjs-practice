import CustomDate from './CustomDate';

const BASE_URL = 'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0';
const serviceKey = process.env.API_KEY;

type WeatherParams = {
  serviceKey: string;
  dataType: 'JSON' | 'XML';
  pageNo: string;
  numOfRows: string;
  base_date: string;
  base_time: string;
  nx: string;
  ny: string;
};

export const WEATHER_CATEGORY_LABEL_MAP = {
  T1H: '기온(℃)',
  RN1: '1시간 강수량(범주(1 mm))',
  SKY: '하늘상태',
  UUU: '동서바람성분(m/s)',
  VVV: '남북바람성분(m/s)',
  REH: '습도(%)',
  PTY: '강수형태',
  LGT: '낙뢰',
  VEC: '풍향(deg)',
  WSD: '풍속(m/s)',
} as const;

export const WEATHER_CATEGORY = {
  T1H: 'T1H',
  RN1: 'RN1',
  SKY: 'SKY',
  UUU: 'UUU',
  VVV: 'VVV',
  REH: 'REH',
  PTY: 'PTY',
  LGT: 'LGT',
  VEC: 'VEC',
  WSD: 'WSD',
} as const;

type WeatherCategory = keyof typeof WEATHER_CATEGORY;

type WeatherItem = {
  baseDate: string;
  baseTime: string;
  category: WeatherCategory;
  nx: number;
  ny: number;
};

type NearFutureWeatherItem = {
  fcstValue: number | string;
  fcstTime: string;
  fcstDate: string;
} & WeatherItem;

type CurrentWeatherItem = {
  obsrValue: string;
} & WeatherItem;

type WeatherResult<T> = {
  response: {
    body: {
      items: { item: T[] };
    };
  };
};

export type WeatherEntity = {
  category: WeatherCategory;
  value: string | number;
  time: string;
  date: string;
};

type FetchCurrentWeatherOption = {
  nx: string;
  ny: string;
};

class WeatherApiModule {
  private getSearchParams(options: Partial<Omit<WeatherParams, 'serviceKey'>>) {
    if (!serviceKey) throw new Error('Empty serviceKey!');

    const currentDate = new CustomDate(new Date().valueOf() - 30 * 60 * 1000);
    const baseDate = currentDate.toApiFormat();
    const hour = `${currentDate.getHours()}00`.padStart(4, '0');

    return new URLSearchParams({
      serviceKey,
      dataType: 'JSON',
      pageNo: '1',
      numOfRows: '600',
      base_date: baseDate,
      base_time: hour,
      ...options,
    }).toString();
  }

  fetchCurrentWeather(
    options: FetchCurrentWeatherOption
  ): Promise<WeatherResult<CurrentWeatherItem>> {
    return fetch(
      `${BASE_URL}/getUltraSrtNcst?${this.getSearchParams(options)}`
    ).then((res) => res.json());
  }

  fetchNearFutureWeather(
    options: FetchCurrentWeatherOption
  ): Promise<WeatherResult<NearFutureWeatherItem>> {
    return fetch(
      `${BASE_URL}/getUltraSrtFcst?${this.getSearchParams(options)}`
    ).then((res) => res.json());
  }

  filterApiResult(item: WeatherItem) {
    return (
      item.category === WEATHER_CATEGORY.T1H ||
      item.category === WEATHER_CATEGORY.SKY ||
      item.category === WEATHER_CATEGORY.REH
    );
  }

  convertFutureWeatherItemToWeatherEntity({
    category,
    fcstValue,
    fcstTime,
    fcstDate,
  }: NearFutureWeatherItem): WeatherEntity {
    return {
      category,
      value: fcstValue,
      time: fcstTime,
      date: fcstDate,
    };
  }

  convertCurrentWeatherItemToWeatherEntity({
    category,
    obsrValue,
    baseDate,
    baseTime,
  }: CurrentWeatherItem): WeatherEntity {
    return {
      category,
      value: obsrValue,
      time: baseTime,
      date: baseDate,
    };
  }
}

const instance = new WeatherApiModule();
export default instance;
