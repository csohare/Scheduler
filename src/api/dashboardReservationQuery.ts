import { supabase } from "../config/supabaseClient";

export const fetchDashboardReservations = async (startTime: Date) => {
  const formattedToday = startTime.toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("reservation")
    .select()
    .order("res_start", { ascending: true })
    .gte("res_start", formattedToday);

  if (data) {
    return data;
  } else if (error) {
    throw new Error("Error fetching reservation data, please try again");
  }
};
