import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const CalculateTime = (date) => {
  const today = dayjs();
  const createdAt = dayjs(date);
  const diffInDays = today.diff(createdAt, "day");

  if (diffInDays > 6) {
    return createdAt.format("DD/MM/YYYY");
  } else {
    return today.to(createdAt);
  }
};

export default CalculateTime;
