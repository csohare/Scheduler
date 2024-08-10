import { supabase } from "../config/supabaseClient";

export default async function insertReservation(
  res_start: string,
  res_end: string,
  type: string,
  name: string,
): Promise<void> {
  const { error } = await supabase.from("reservation").insert([
    {
      res_start,
      res_end,
      type,
      name,
      status: "COMPLETE",
    },
  ]);

  if (error) throw new Error(error.message);
}
