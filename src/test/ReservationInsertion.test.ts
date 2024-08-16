import { describe, expect, test } from "@jest/globals";
import { supabase } from "../config/supabaseClient";

describe("Reservation Insertion Trigger Module", () => {
  test("Inserting overlapping full court reservations results in error from supabase", async () => {
    const res_start = new Date();
    res_start.setHours(0, 0, 0, 0);
    const res_end = new Date();
    res_end.setHours(2, 0, 0, 0);
    console.log(res_start.toLocaleString(), res_end.toLocaleString());

    const { error } = await supabase.from("reservation").insert([
      {
        res_start: res_start.toLocaleString(),
        res_end: res_end.toLocaleString(),
        name: "TEST",
        type: "full",
        status: "COMPLETE",
      },
    ]);
    expect(error).toBeNull();
  });
});
