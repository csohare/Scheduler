import { timeInterval } from "./types/timeInterval";
export default function overlap(
  interval1: timeInterval,
  interval2: timeInterval,
): boolean {
  return (
    new Date(interval1.res_start).getTime() <=
      new Date(interval2.res_end).getTime() &&
    new Date(interval1.res_end).getTime() >=
      new Date(interval2.res_start).getTime()
  );
}
