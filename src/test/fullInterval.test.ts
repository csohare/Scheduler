import { describe, expect, test } from "@jest/globals";
import findFullIntervals from "../util/fullCourtIntervals";
import { AvailableTimeslot } from "react-schedule-meeting";
import { Tables } from "../util/types/supabaseTypes";

describe("Interval Module", () => {
  const created_at = new Date().toISOString();
  const name = "colin";
  const type = "full";
  const id = 1;
  const startDate = new Date(new Date().setHours(0, 0, 0, 0));
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 6);
  endDate.setHours(24, 0, 0, 0);

  test("Check Empty Intervals", () => {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 6);
    endDate.setHours(24, 0, 0, 0);
    const expected: AvailableTimeslot[] = [];
    expected.push({
      id: 1,
      startTime: new Date(new Date().setHours(0, 0, 0, 0)),
      endTime: endDate,
    });
    expect(findFullIntervals([])).toEqual(expected);
  });
  test("One interval at beginning of day", () => {
    const res_start = new Date(new Date().setHours(0, 0, 0, 0));
    const res_end = new Date(new Date().setHours(3, 0, 0, 0));

    const intervals: Tables<"reservation">[] = [
      {
        id,
        created_at,
        type,
        res_start: res_start.toLocaleString(),
        res_end: res_end.toLocaleString(),
        name,
      },
    ];
    const expected: AvailableTimeslot[] = [];
    expected.push({
      id: 1,
      startTime: res_end,
      endTime: endDate,
    });
    expect(findFullIntervals(intervals)).toEqual(expected);
  });

  test("One half court interval", () => {
    const res_start = new Date(new Date().setHours(1, 0, 0, 0));
    const res_end = new Date(new Date().setHours(3, 0, 0, 0));
    const intervals = [
      {
        id,
        created_at,
        type: "half",
        res_start: res_start.toLocaleString(),
        res_end: res_end.toLocaleString(),
        name,
      },
    ];
    const expected: AvailableTimeslot[] = [];
    expected.push({
      id: 1,
      startTime: startDate,
      endTime: res_start,
    });
    expected.push({
      id: 2,
      startTime: res_end,
      endTime: endDate,
    });

    expect(findFullIntervals(intervals)).toEqual(expected);
  });

  test("Overlapping half court big + small", () => {
    const res_start1 = new Date(new Date().setHours(1, 0, 0, 0));
    const res_end1 = new Date(new Date().setHours(5, 0, 0, 0));
    const res_start2 = new Date(new Date().setHours(2, 0, 0, 0));
    const res_end2 = new Date(new Date().setHours(3, 0, 0, 0));

    const intervals: Tables<"reservation">[] = [
      {
        id,
        created_at,
        type: "half",
        res_start: res_start1.toLocaleString(),
        res_end: res_end1.toLocaleString(),
        name,
      },
      {
        id,
        created_at,
        type: "half",
        res_start: res_start2.toLocaleString(),
        res_end: res_end2.toLocaleString(),
        name,
      },
    ];
    const expected: AvailableTimeslot[] = [];
    expected.push({
      id: 1,
      startTime: startDate,
      endTime: res_start1,
    });
    expected.push({
      id: 2,
      startTime: res_end1,
      endTime: endDate,
    });

    expect(findFullIntervals(intervals)).toEqual(expected);
  });
});
