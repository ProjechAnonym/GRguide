import moment from "moment";
export default function getTime() {
  const weekdaytable = {
    0: "星期天",
    1: "星期一",
    2: "星期二",
    3: "星期三",
    4: "星期四",
    5: "星期五",
    6: "星期六",
  };
  const year = moment().year();
  const month = moment().month();
  const day = moment().date();
  let hours;
  if (moment().hours() < 10) {
    hours = `0${moment().hours()}`;
  } else {
    hours = moment().hours();
  }
  let minutes;
  if (moment().minutes() < 10) {
    minutes = `0${moment().minutes()}`;
  } else {
    minutes = moment().minutes();
  }
  let seconds;
  if (moment().seconds() < 10) {
    seconds = `0${moment().seconds()}`;
  } else {
    seconds = moment().seconds();
  }
  const time = `${hours}:${minutes}:${seconds}`;
  const weekday = moment().weekday();
  if (moment().minutes() === 0) {
    return {
      year: year,
      month: month,
      day: day,
      time: time,
      weekday: weekdaytable[weekday],
      onHour: true,
    };
  } else {
    return {
      year: year,
      month: month,
      day: day,
      time: time,
      weekday: weekdaytable[weekday],
      onHour: false,
    };
  }
}
