import { supabase } from "../config/supabaseClient";

export default async function insertBusinessHours(
  startDate: Date,
  endDate: Date,
  openTime: Date,
  closeTime: Date,
) {
  const currentDate = new Date(startDate);
  const businessHoursIntervals = [];

  while (currentDate <= endDate) {
    const businessHoursEnd = new Date(currentDate);
    businessHoursEnd.setDate(currentDate.getDate() + 1);

    businessHoursIntervals.push({
      res_start: currentDate.toLocaleString(),
      res_end: openTime.toLocaleString(),
      name: "ADMIN",
      type: "full",
      status: "HOURS",
    });
    businessHoursIntervals.push({
      res_start: closeTime.toLocaleString(),
      res_end: businessHoursEnd.toLocaleString(),
      name: "ADMIN",
      type: "full",
      status: "HOURS",
    });

    currentDate.setDate(currentDate.getDate() + 1);
    openTime.setDate(currentDate.getDate());
    closeTime.setDate(currentDate.getDate());
  }
  console.log(businessHoursIntervals);

  endDate.setHours(24, 0, 0, 0);
  const { error } = await supabase.rpc("insert_business_hours", {
    reservation_array: businessHoursIntervals,
    start_date: startDate.toLocaleString(),
    end_date: endDate.toLocaleString(),
  });
  if (error) throw new Error(error.message);
}
