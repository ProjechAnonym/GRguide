import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { VChart } from "@visactor/react-vchart";
import { getForcastWeather } from "../../utils/weather";
import getTime from "../../utils/time";
import "../../assets/styles/headerweather.css";
import "qweather-icons/font/qweather-icons.css";

export default function WeatherBar() {
  const [futureWeather, setFutureWeather] = useState([]);
  const [chart, setChart] = useState({});
  const forecastContainer = useRef(null);
  const dark = useSelector((state) => state.style.dark);

  useEffect(() => {
    const timer = setInterval(() => {
      const currentTime = getTime();
      if (currentTime.onHour) {
        getForcastWeather().then((results) => {
          setFutureWeather(results);
          const tempArray = results.map((result) => {
            return { medalType: "温度", num: result.temp, time: result.time };
          });
          setChart(tempArray);
        });
      }
    }, 1000);

    getForcastWeather().then((results) => {
      setFutureWeather(results);
      const tempArray = results.map((result) => {
        return { medalType: "温度", num: result.temp, time: result.time };
      });
      setChart(tempArray);
    });
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className={dark ? "dark-headerWeather" : "headerWeather"}>
      <VChart
        style={{ height: "15rem" }}
        spec={{
          type: "line",
          data: { id: "weatherLine", values: chart },
          xField: "time",
          yField: "num",
          line: {
            style: {
              curveType: "monotone",
              stroke: {
                gradient: "linear",
                x0: 0,
                y0: 0,
                x1: 0,
                y1: 1,
                stops: [
                  {
                    offset: 0,
                    color: "orange", // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "darkcyan", // 100% 处的颜色
                  },
                ],
              },
            },
          },
          point: {
            style: {
              symbolType: "circle",
              size: 3,
              fill: {
                gradient: "linear",
                x0: 0,
                y0: 0,
                x1: 0,
                y1: 1,
                stops: [
                  {
                    offset: 0,
                    color: "orange", // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "darkcyan", // 100% 处的颜色
                  },
                ],
              },
            },
          },
          background: "transparent",
          seriesField: "medalType",
          legends: [{ visible: true, position: "middle", orient: "bottom" }],
        }}
      ></VChart>
      <div
        className={dark ? "dark-forcast" : "forcast"}
        ref={forecastContainer}
        onWheel={(eve) => {
          const container = forecastContainer.current;
          container.scrollLeft += eve.deltaY;
        }}
      >
        {futureWeather.map((weather, index) => {
          return (
            <div
              className={dark ? "dark-weatherCard" : "weatherCard"}
              key={`forcast-${index}`}
            >
              <p style={{ margin: 0 }}>{weather.time}时</p>
              <span style={{ margin: 0 }}>
                <i
                  className={`qi-${weather.icon}`}
                  style={{ fontSize: "2.5rem", margin: 0 }}
                ></i>
              </span>
              <span style={{ margin: 0 }}>{weather.pop}%</span>
              <p style={{ margin: 0 }}>{weather.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
