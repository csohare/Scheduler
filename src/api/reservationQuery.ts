import { supabase } from "../config/supabaseClient";

export const fetchReservations = async (startTime: Date, endTime: Date) => {
  const formattedToday = startTime.toISOString().split("T")[0];
  const formattedWeek = endTime.toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("reservation")
    .select()
    .order("res_start", { ascending: true })
    .gte("res_end", formattedToday)
    .lte("res_start", formattedWeek);

  if (data) {
    return data;
  } else if (error) {
    throw new Error("Error fetching reservation data, please try again");
  }
};
