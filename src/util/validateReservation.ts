import { Tables } from "./types/supabaseTypes";

export default function validateReservation(
  reservations: Tables<"reservation">[],
  res_type: string,
): boolean {
  if (res_type === "full" && reservations.length >= 1) return false;

  const fullCourtReservations = reservations.reduce((count, reservation) => {
    if (reservation.type === "full") {
      count++;
    }
    return count;
  }, 0);

  const halfCourtReservations = reservations.reduce((count, reservation) => {
    if (reservation.type === "half") {
      count++;
    }
    return count;
  }, 0);

  if (
    res_type === "half" &&
    (fullCourtReservations >= 1 || halfCourtReservations >= 2)
  )
    return false;

  return true;
}
