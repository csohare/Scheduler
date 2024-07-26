import { AvailableTimeslot } from "react-schedule-meeting";
import { timeInterval } from "./types/timeInterval";
import overlap from "./overlap";

export default function findHalfIntervals(
  intervals: any[],
): AvailableTimeslot[] {
  const ret: AvailableTimeslot[] = [];

  const filteredIntervals: timeInterval[] = intervals.reduce((acc, item) => {
    if (item.type === "full") {
      acc.push({
        res_start: new Date(item.res_start),
        res_end: new Date(item.res_end),
      });
    }
    return acc;
  }, []);

  const halfCourtIntervals: timeInterval[] = intervals.reduce((acc, item) => {
    if (item.type === "half") {
      acc.push({
        res_start: new Date(item.res_start),
        res_end: new Date(item.res_end),
      });
    }
    return acc;
  }, []);

  let currentInterval = halfCourtIntervals[0];
  for (let i = 1; i < halfCourtIntervals.length; i++) {
    const tmp = halfCourtIntervals[i];
    if (overlap(currentInterval, tmp)) {
      filteredIntervals.push({
        res_start: tmp.res_start,
        res_end: new Date(
          Math.min(
            new Date(currentInterval.res_end).getTime(),
            new Date(tmp.res_end).getTime(),
          ),
        ),
      });
    }
    if (
      new Date(tmp.res_end).getTime() >
      new Date(currentInterval.res_end).getTime()
    ) {
      currentInterval = tmp;
    }
  }
  filteredIntervals.sort(
    (interval1, interval2) =>
      interval1.res_start.getTime() - interval2.res_start.getTime(),
  );

  const finalDay = new Date();
  finalDay.setDate(finalDay.getDate() + 6);
  finalDay.setHours(24, 0, 0, 0);

  let currentTime = new Date(new Date().setHours(0, 0, 0, 0));
  let id = 1;
  for (let i = 0; i < filteredIntervals.length; i++) {
    const currentInterval = filteredIntervals[i];
    if (currentTime.getTime() === currentInterval.res_start.getTime()) {
      currentTime = currentInterval.res_end;
      continue;
    }
    ret.push({
      id,
      startTime: currentTime,
      endTime: currentInterval.res_start,
    });
    id++;
    currentTime = currentInterval.res_end;
  }
  if (currentTime.getTime() !== finalDay.getTime()) {
    ret.push({
      id,
      startTime: currentTime,
      endTime: finalDay,
    });
  }
  return ret;
}
