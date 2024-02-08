import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setStatus, setID, setJWT } from "../../slice/identitySlice";
import { setDark, resetDark } from "../../slice/styleSlice";
import { Badge, Popover, Calendar, Notification } from "@douyinfe/semi-ui";
import {
  IconMoon,
  IconSun,
  IconUserSetting,
  IconHome,
  IconAppCenter,
  IconExit,
} from "@douyinfe/semi-icons";
import WeatherBar from "./weatherComponent";
import getTime from "../../utils/time";
import { getLiveWeather } from "../../utils/weather";
import "qweather-icons/font/qweather-icons.css";
import "../../assets/styles/navbar.css";
export default function NavBar() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const dark = useSelector((state) => state.style.dark);
  const id = useSelector((state) => state.identity.id);
  const [year, setYear] = useState("null");
  const [time, setTime] = useState("null");
  const [week, setWeek] = useState("null");
  const [weather, setLiveweather] = useState({});

  useEffect(() => {
    getLiveWeather().then((res) => {
      setLiveweather(res);
    });
    const timer = setInterval(() => {
      const currentTime = getTime();
      setYear(currentTime.year);
      setTime(currentTime.time);
      setWeek(currentTime.weekday);
    }, 1000);
    const weathertimer = setInterval(() => {
      getLiveWeather().catch((res) => {
        setLiveweather(res);
      });
    }, 900000);

    return () => {
      clearInterval(timer);
      clearInterval(weathertimer);
    };
  }, []);
  return (
    <div className={dark ? "dark-header" : "header"}>
      <Popover
        trigger="click"
        content={
          <Calendar
            mode="month"
            height={"18rem"}
            width={"19rem"}
            markWeekend={true}
            header={
              <div style={{ fontSize: "1.2rem", textAlign: "center" }}>
                {year}
              </div>
            }
            className={dark ? "dark-calender" : "calender"}
          ></Calendar>
        }
        position="right"
        style={{ marginTop: "15rem", width: "19rem", height: "18rem" }}
      >
        <div className={dark ? "dark-card" : "card"}>
          <p style={{ margin: 0 }}>{time}</p>
          <p style={{ margin: 0 }}>{week}</p>
        </div>
      </Popover>
      <Popover
        content={<WeatherBar />}
        position="right"
        style={{ marginTop: "17rem", borderRadius: "15px" }}
      >
        <button
          style={{ backgroundColor: "transparent", border: "none", padding: 0 }}
          className={dark ? "dark-link" : "link"}
          onDoubleClick={() => window.open(weather.fxLink, "_blank")}
        >
          <div className={dark ? "dark-card" : "card"}>
            <Badge
              count={weather.feelsLike}
              position="leftBottom"
              style={{ margin: "0 0 0.3rem 0", fontSize: "0.7rem" }}
            >
              <Badge
                count={weather.text}
                position="rightBottom"
                style={{ margin: "0 0 0.3rem 0", fontSize: "0.7rem" }}
              >
                <i
                  className={`qi-${weather.icon}`}
                  style={{ fontSize: "2.3rem" }}
                ></i>
              </Badge>
            </Badge>
          </div>
        </button>
      </Popover>
      <div
        onClick={() => {
          if (id === 0) {
            Notification.open({
              title: "验证失败",
              content: "请先登录",
              className: dark ? "dark-navNotification" : "navNotification",
            });
          } else {
            nav({ pathname: `/user/${id}/home` });
          }
        }}
        className={dark ? "dark-link" : "link"}
      >
        <div className={dark ? "dark-card" : "card"}>
          <IconHome style={{ fontSize: "1.8rem" }} />
        </div>
      </div>
      <div
        onClick={() => {
          if (id === 0) {
            Notification.open({
              title: "验证失败",
              content: "请先登录",
              className: dark ? "dark-navNotification" : "navNotification",
            });
          } else {
            nav({ pathname: `/user/${id}/collect` });
          }
        }}
        className={dark ? "dark-link" : "link"}
      >
        <div className={dark ? "dark-card" : "card"}>
          <IconAppCenter style={{ fontSize: "1.8rem" }} />
        </div>
      </div>
      <div
        onClick={() => {
          if (id === 0) {
            Notification.open({
              title: "验证失败",
              content: "请先登录",
              className: dark ? "dark-navNotification" : "navNotification",
            });
          } else {
            nav({ pathname: `/user/${id}/setting` });
          }
        }}
        className={dark ? "dark-link" : "link"}
      >
        <div className={dark ? "dark-card" : "card"}>
          <IconUserSetting style={{ fontSize: "1.8rem" }} />
        </div>
      </div>
      <div
        className={dark ? "dark-link" : "link"}
        onClick={() => {
          dispatch(resetDark());
          dispatch(setID(0));
          dispatch(setJWT(""));
          dispatch(setStatus(false));
          nav({ pathname: "/" });
        }}
      >
        <div className={dark ? "dark-card" : "card"}>
          <IconExit style={{ fontSize: "1.8rem" }} />
        </div>
      </div>
      <div
        className={dark ? "dark-card" : "card"}
        id="darkSwitch"
        onClick={() => {
          if (id === 0) {
            Notification.open({
              title: "验证失败",
              content: "请先登录",
              className: dark ? "dark-navNotification" : "navNotification",
            });
          } else {
            dispatch(setDark());
          }
        }}
      >
        {dark ? (
          <IconMoon style={{ fontSize: "1.8rem" }} />
        ) : (
          <IconSun style={{ fontSize: "1.8rem" }} />
        )}
      </div>
    </div>
  );
}
