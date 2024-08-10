import { supabase } from "../config/supabaseClient";

export default async function findOverlappingReservations(
  res_start: string,
  res_end: string,
) {
  const { data, error } = await supabase
    .from("reservation")
    .select()
    .lt("res_start", res_end)
    .gt("res_end", res_start);

  if (error) throw new Error(error.message);
  return data;
}
