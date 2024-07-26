export type availableEnd = {
  endTime: Date;
  duration: string;
  endTimeString: string;
};

export default function allowedTimes(
  startTime: Date,
  duration: number,
): availableEnd[] {
  const ret: availableEnd[] = [];

  for (let i = 1; i <= duration && i <= 6; i++) {
    const endDate = new Date(startTime.getTime() + i * 60 * 60 * 1000);
    ret.push({
      endTime: endDate,
      duration: String(i),
      endTimeString: `${i} Hour: ${endDate.toDateString()} ${endDate.toLocaleTimeString()}`,
    });
  }

  return ret;
}
