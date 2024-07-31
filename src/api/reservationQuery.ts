import { supabase } from "../config/supabaseClient";

export const fetchReservations = async () => {
  const today = new Date();
  const week = new Date(today);
  week.setDate(today.getDate() + 6);

  const formattedToday = today.toISOString().split("T")[0];
  const formattedWeek = week.toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("reservation")
    .select()
    .order("res_start", { ascending: true })
    .gte("res_start", formattedToday)
    .lte("res_end", formattedWeek);

  if (data) {
    return data;
  } else if (error) {
    throw new Error(error.message);
  }
};
