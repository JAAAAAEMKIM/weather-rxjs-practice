import WeatherApiModule from '@/modules/WeatherApiModule';
import { Subject, filter, map, pipe, switchMap, tap } from 'rxjs';

const sub = new Subject<Request>();

const op = pipe(
  map((x: Request) => new URL(x.url).searchParams),
  map((x) => ({ nx: x.get('nx') || '', ny: x.get('ny') || '' })),
  switchMap((x) => WeatherApiModule.fetchCurrentWeather(x)),
  map((x) => x.response.body.items.item),
  map((items) =>
    items
      .filter(WeatherApiModule.filterApiResult)
      .map(WeatherApiModule.convertCurrentWeatherItemToWeatherEntity)
  )
);

export async function GET(req: Request) {
  const res = await new Promise<any>((resolve) => {
    sub.pipe(op).subscribe({
      next: (v) => {
        resolve(v);
      },
    });
    sub.next(req);
  });

  return Response.json(res);
}
