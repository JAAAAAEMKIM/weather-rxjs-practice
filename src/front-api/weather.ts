export const fetchCurrentWeather = (params: string) =>
  fetch(`/api/weather?${params}`).then((res) => res.json());

export const fetchNearFutureWeather = (params: string) =>
  fetch(`/api/weather/nearFuture?${params}`).then((res) => res.json());
