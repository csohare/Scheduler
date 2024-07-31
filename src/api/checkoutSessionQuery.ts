export const fetchCheckoutSession = async (
  startTime: Date,
  endTime: string,
  resType: string,
) => {
  try {
    const response = await fetch(
      "https://fkwmyteahamhgaqsxetp.supabase.co/functions/v1/checkoutSession",
      //"http://localhost:54321/functions/v1/checkoutSession",
      {
        method: "POST",
        body: JSON.stringify({
          startTime: `${startTime?.toLocaleString()}`,
          endTime: `${new Date(endTime).toLocaleString()}`,
          resType,
        }),
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );
    return await response.json();
  } catch (error) {
    throw new Error("Error Fetching Checkout Session");
  }
};
