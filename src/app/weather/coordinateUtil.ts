// 원본 소스 - https://gist.github.com/fronteer-kr/14d7f779d52a21ac2f16
// LCC DFS 좌표변환을 위한 기초 자료
//
const RE = 6371.00877; // 지구 반경(km)
const GRID = 5.0; // 격자 간격(km)
const SLAT1 = 30.0; // 투영 위도1(degree)
const SLAT2 = 60.0; // 투영 위도2(degree)
const OLON = 126.0; // 기준점 경도(degree)
const OLAT = 38.0; // 기준점 위도(degree)
const XO = 43; // 기준점 X좌표(GRID)
const YO = 136; // 기1준점 Y좌표(GRID)

const DEGRAD = Math.PI / 180.0;
const RADDEG = 180.0 / Math.PI;

const re = RE / GRID;
const slat1 = SLAT1 * DEGRAD;
const slat2 = SLAT2 * DEGRAD;
const olon = OLON * DEGRAD;
const olat = OLAT * DEGRAD;

const _sn =
  Math.tan(Math.PI * 0.25 + slat2 * 0.5) /
  Math.tan(Math.PI * 0.25 + slat1 * 0.5);
const sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(_sn);
const _sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
const sf = (Math.pow(_sf, sn) * Math.cos(slat1)) / sn;
const _ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
const ro = (re * sf) / Math.pow(_ro, sn);

export const toXY = (latitude: number, longitude: number) => {
  let ra = Math.tan(Math.PI * 0.25 + latitude * DEGRAD * 0.5);
  ra = (re * sf) / Math.pow(ra, sn);
  let theta = longitude * DEGRAD - olon;
  if (theta > Math.PI) theta -= 2.0 * Math.PI;
  if (theta < -Math.PI) theta += 2.0 * Math.PI;
  theta *= sn;

  return {
    x: Math.floor(ra * Math.sin(theta) + XO + 0.5),
    y: Math.floor(ro - ra * Math.cos(theta) + YO + 0.5),
  };
};

export const toLL = (x: number, y: number) => {
  const xn = x - XO;
  const yn = ro - y + YO;
  let ra = Math.sqrt(xn * xn + yn * yn);
  if (sn < 0.0) {
    ra = -ra;
  }
  let alat = Math.pow((re * sf) / ra, 1.0 / sn);
  alat = 2.0 * Math.atan(alat) - Math.PI * 0.5;
  let theta = 0.0;

  if (Math.abs(yn) <= 0.0) {
    theta = Math.PI * 0.5;
    if (xn < 0.0) {
      theta = -theta;
    }
  } else {
    theta = Math.atan2(xn, yn);
  }

  const alon = theta / sn + olon;

  return { latitude: alat * RADDEG, longitude: alon * RADDEG };
};
