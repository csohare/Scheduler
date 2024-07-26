import { describe, expect, test } from "@jest/globals";
import findFullIntervals from "../util/intervals";
import { AvailableTimeslot } from "react-schedule-meeting";

describe("Interval Module", () => {
  const created_at = new Date().toISOString();
  const name = "colin";
  const type = "full";
  const id = 1;

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
    const res_start = "2024-07-26T00:00:00";
    const res_end = "2024-07-26T03:00:00";
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 6);
    endDate.setHours(24, 0, 0, 0);

    const intervals = [
      {
        id,
        created_at,
        type,
        res_start,
        res_end,
      },
    ];
    const expected: AvailableTimeslot[] = [];
    expected.push({
      id: 1,
      startTime: new Date(new Date().setHours(0, 0, 0, 0)),
      endTime: new Date(res_start),
    });
    expected.push({
      id: 2,
      startTime: new Date(res_end),
      endTime: endDate,
    });
    expect(findFullIntervals(intervals)).toEqual(expected);
  });
  test("Interval at end of day", () => {
    const res_start = "2024-07-31T10:00:00";
    const res_end = "2024-08-01T00:00:00";

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 6);
    endDate.setHours(24, 0, 0, 0);
    const intervals = [
      {
        id,
        created_at,
        type,
        res_start,
        res_end,
      },
    ];

    const expected: AvailableTimeslot[] = [];
    expected.push({
      id: 1,
      startTime: new Date(new Date().setHours(0, 0, 0, 0)),
      endTime: new Date(res_start),
    });
    expect(findFullIntervals(intervals)).toEqual(expected);
  });
  test("Test Interval Over Midnight", () => {
    const res_start = "2024-07-28T10:00:00";
    const res_end = "2024-08-29T02:00:00";
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 6);
    endDate.setHours(24, 0, 0, 0);

    const intervals = [
      {
        id,
        created_at,
        type,
        res_start,
        res_end,
      },
    ];
    const expected: AvailableTimeslot[] = [];
    expected.push({
      id: 1,
      startTime: new Date(new Date().setHours(0, 0, 0, 0)),
      endTime: new Date(res_start),
    });
    expected.push({
      id: 2,
      startTime: new Date(res_end),
      endTime: endDate,
    });
    expect(findFullIntervals(intervals)).toEqual(expected);
  });
  test("Interval at start of day", () => {
    const res_start = "2024-07-25T00:00:00";
    const res_end = "2024-07-25T03:00:00";
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 6);
    endDate.setHours(24, 0, 0, 0);

    const intervals = [
      {
        id,
        created_at,
        type,
        res_start,
        res_end,
      },
    ];
    const expected: AvailableTimeslot[] = [];
    expected.push({
      id: 1,
      startTime: new Date(res_end),
      endTime: endDate,
    });
    expect(findFullIntervals(intervals)).toEqual(expected);
  });
  test("Interval at start of day and interval at end of day", () => {
    const res_start1 = "2024-07-25T00:00:00";
    const res_end1 = "2024-07-25T03:00:00";
    const res_start2 = "2024-07-25T10:00:00";
    const res_end2 = "2024-07-26T02:00:00";

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 6);
    endDate.setHours(24, 0, 0, 0);

    const intervals = [
      {
        id,
        created_at,
        type,
        res_start: res_start1,
        res_end: res_end1,
      },
      {
        id,
        created_at,
        type,
        res_start: res_start2,
        res_end: res_end2,
      },
    ];
    const expected: AvailableTimeslot[] = [];
    expected.push({
      id: 1,
      startTime: new Date(res_end1),
      endTime: new Date(res_start2),
    });
    expected.push({
      id: 2,
      startTime: new Date(res_end2),
      endTime: endDate,
    });
    expect(findFullIntervals(intervals)).toEqual(expected);
  });
  test("Back 2 Back intervals", () => {
    const res_start1 = "2024-07-26T03:00:00";
    const res_end1 = "2024-07-26T05:00:00";
    const res_start2 = "2024-07-26T05:00:00";
    const res_end2 = "2024-07-26T07:00:00";

    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 6);
    endDate.setHours(24, 0, 0, 0);

    const intervals = [
      {
        id,
        created_at,
        type,
        res_start: res_start1,
        res_end: res_end1,
      },
      {
        id,
        created_at,
        type,
        res_start: res_start2,
        res_end: res_end2,
      },
    ];
    const expected: AvailableTimeslot[] = [];
    expected.push({
      id: 1,
      startTime: startDate,
      endTime: new Date(res_start1),
    });
    expected.push({
      id: 2,
      startTime: new Date(res_end2),
      endTime: endDate,
    });
    expect(findFullIntervals(intervals)).toEqual(expected);
  });
  test("Two Interval Generic", () => {
    const res_start1 = "2024-07-26T03:00:00";
    const res_end1 = "2024-07-26T05:00:00";
    const res_start2 = "2024-07-27T10:00:00";
    const res_end2 = "2024-07-27T11:00:00";

    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 6);
    endDate.setHours(24, 0, 0, 0);

    const intervals = [
      {
        id,
        created_at,
        type,
        res_start: res_start1,
        res_end: res_end1,
      },
      {
        id,
        created_at,
        type,
        res_start: res_start2,
        res_end: res_end2,
      },
    ];
    const expected: AvailableTimeslot[] = [];
    expected.push({
      id: 1,
      startTime: startDate,
      endTime: new Date(res_start1),
    });
    expected.push({
      id: 2,
      startTime: new Date(res_end1),
      endTime: new Date(res_start2),
    });
    expected.push({
      id: 3,
      startTime: new Date(res_end2),
      endTime: endDate,
    });
    expect(findFullIntervals(intervals)).toEqual(expected);
  });
  test("Interval overnight and back 2 back", () => {
    const res_start1 = "2024-07-25T23:00:00";
    const res_end1 = "2024-07-26T03:00:00";
    const res_start2 = "2024-07-26T03:00:00";
    const res_end2 = "2024-07-26T10:00:00";

    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 6);
    endDate.setHours(24, 0, 0, 0);

    const intervals = [
      {
        id,
        created_at,
        type,
        res_start: res_start1,
        res_end: res_end1,
      },
      {
        id,
        created_at,
        type,
        res_start: res_start2,
        res_end: res_end2,
      },
    ];
    const expected: AvailableTimeslot[] = [];
    expected.push({
      id: 1,
      startTime: startDate,
      endTime: new Date(res_start1),
    });
    expected.push({
      id: 2,
      startTime: new Date(res_end2),
      endTime: endDate,
    });
    expect(findFullIntervals(intervals)).toEqual(expected);
  });
  test("Interval at beginning of day back 2 back", () => {
    const res_start1 = "2024-07-25T00:00:00";
    const res_end1 = "2024-07-25T02:00:00";
    const res_start2 = "2024-07-25T02:00:00";
    const res_end2 = "2024-07-25T05:00:00";

    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 6);
    endDate.setHours(24, 0, 0, 0);

    const intervals = [
      {
        id,
        created_at,
        type,
        res_start: res_start1,
        res_end: res_end1,
      },
      {
        id,
        created_at,
        type,
        res_start: res_start2,
        res_end: res_end2,
      },
    ];
    const expected: AvailableTimeslot[] = [];
    expected.push({
      id: 1,
      startTime: new Date(res_end2),
      endTime: endDate,
    });
    expect(findFullIntervals(intervals)).toEqual(expected);
  });
  test("Final assurance test", () => {
    const res_start1 = "2024-07-25T00:00:00";
    const res_end1 = "2024-07-25T02:00:00";
    const res_start2 = "2024-07-25T02:00:00";
    const res_end2 = "2024-07-25T05:00:00";
    const res_start3 = "2024-07-27T10:00:00";
    const res_end3 = "2024-07-27T12:00:00";

    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 6);
    endDate.setHours(24, 0, 0, 0);

    const intervals = [
      {
        id,
        created_at,
        type,
        res_start: res_start1,
        res_end: res_end1,
      },
      {
        id,
        created_at,
        type,
        res_start: res_start2,
        res_end: res_end2,
      },
      {
        id,
        created_at,
        type,
        res_start: res_start3,
        res_end: res_end3,
      },
    ];
    const expected: AvailableTimeslot[] = [];
    expected.push({
      id: 1,
      startTime: new Date(res_end2),
      endTime: new Date(res_start3),
    });
    expected.push({
      id: 2,
      startTime: new Date(res_end3),
      endTime: endDate,
    });
    expect(findFullIntervals(intervals)).toEqual(expected);
  });
});
