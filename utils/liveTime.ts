import _ from "lodash";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { IVideoWithMember } from "@/query/vidoeQuery";

dayjs.extend(utc);
dayjs.extend(timezone);

const dateRange = 1;

const today = dayjs().format("YYYY-MM-DD");

const todayUtc = dayjs().utc().format("YYYY-MM-DD");

const prevDateUtc = dayjs()
  .utc()
  .subtract(dateRange + 1, "day")
  .format("YYYY-MM-DD");

const afterDateUtc = dayjs()
  .utc()
  .add(dateRange + 1, "day")
  .format("YYYY-MM-DD");

const expiredDateUtc = dayjs().utc().subtract(5, "day").format("YYYY-MM-DD");

const timeSection: { [key: string]: string } = {
  0: "00:00 - 06:00",
  1: "06:00 - 12:00",
  2: "12:00 - 18:00",
  3: "18:00 - 24:00",
};

const dateRangeArrayGenerate = () => {
  const ranges = [];
  let afterDate = dayjs().add(dateRange, "day").startOf("day");
  let prevDate = dayjs().subtract(dateRange, "day").startOf("day");

  while (prevDate.isBefore(afterDate) || prevDate.isSame(afterDate)) {
    ranges.push(prevDate.format("YYYY-MM-DD"));
    prevDate = prevDate.add(1, "day");
  }

  return ranges;
};

const dateRangeArray = _.map(dateRangeArrayGenerate(), (date) => {
  return {
    date: date,
    day: dayjs(date).format("ddd"),
  };
});

const timeGenerate = (liveData: IVideoWithMember[]) => {
  const dateRangeObj = _.map(dateRangeArrayGenerate(), (date) => {
    return {
      date: date,
      day: dayjs(date).format("ddd"),
      live: {},
    };
  });

  return _(liveData)
    .map((data) => {
      return {
        ...data,
        startTime: dayjs(data.startTime).tz(dayjs.tz.guess()).format(),
      };
    })
    .groupBy((data) => dayjs(data.startTime).startOf("d").format("YYYY-MM-DD"))
    .map((items, date) => {
      return {
        date: date,
        day: dayjs(date).format("ddd"),
        live: _(items)
          .groupBy((data) => {
            const hour = dayjs(data.startTime).hour();
            return Math.floor(hour / 6);
          })
          .value(),
      };
    })
    .push(...dateRangeObj)
    .uniqBy("date")
    .sortBy((data) => data.date)
    .value();
};

export {
  today,
  timeGenerate,
  timeSection,
  todayUtc,
  prevDateUtc,
  afterDateUtc,
  expiredDateUtc,
  dateRangeArray,
};
