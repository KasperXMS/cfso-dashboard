"use client";

import * as echarts from "echarts/core";
import ReactEcharts from "echarts-for-react";
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
} from "echarts/components";
import { LineChart } from "echarts/charts";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import React, { useEffect, useState } from "react";
import axios from "axios";

echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
]);

axios.defaults.baseURL = "http://192.168.1.103:8082";
const GET_HOURLY_DATA = "getbuhour";

var option;

option = {
  title: {
    text: "Hourly data from the start of the day",
    subtext: "CB student canteen",
  },
  tooltip: {
    trigger: "axis",
  },
  legend: {
    data: ["Enter", "Exit", "Serving"],
  },
  toolbox: {
    show: true,
    feature: {
      dataView: { show: true, readOnly: false },
      magicType: { show: true, type: ["line", "bar"] },
      restore: { show: true },
      saveAsImage: { show: true },
    },
  },
  lazyUpdate: true,
  calculable: true,
  xAxis: [
    {
      type: "category",
      // prettier-ignore
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
  ],
  yAxis: [
    {
      type: "value",
    },
  ],
  series: [
    {
      name: "Enter",
      type: "bar",
      data: [
        2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3,
      ],
    },
    {
      name: "Exit",
      type: "bar",
      data: [
        2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3,
      ],
    },
    {
      name: "Serving",
      type: "bar",
      data: [
        2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3,
      ],
    },
  ],
};

axios
  .get("/cfso/getbyhour", {
    params: {
      location: "CB3SCME",
      // obtain the start of the day, in the format of "2021-01-01 00:00:00", and add 8 hours to get the Singapore time
      startTime: new Date(new Date().setHours(0, 0, 0, 0) + 8 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 19)
        .replace("T", " "),
      // obtain the current time, in the format of "2021-01-01 00:00:00", and add 8 hours to get the current Singapore time
      endTime: new Date(new Date().setHours(new Date().getHours() + 8))
        .toISOString()
        .slice(0, 19)
        .replace("T", " "),
    },
  })
  .then(function (response) {
    var enters = [];
    var exits = [];
    var labels = [];
    var serving = [];
    var enter_sum = 0;
    var exit_sum = 0;
    for (var i = 0; i < response.data.data.length; i++) {
      enters.push(response.data.data[i].enter);
      exits.push(response.data.data[i].exits);
      labels.push(response.data.data[i].period);
      enter_sum += response.data.data[i].enter;
      exit_sum += response.data.data[i].exits;
      serving.push(enter_sum - exit_sum);
    }
    option.series[0].data = enters;
    option.series[1].data = exits;
    option.series[2].data = serving;
    option.xAxis[0].data = labels;
  })
  .catch(function (error) {
    console.log(error);
  });

export default function HourlyData() {
  const [count, setCount] = useState(0);
  var echartRef;
  useEffect(() => {
    const timer = setInterval(() => {
      axios
        .get("/cfso/getbyhour", {
          params: {
            location: "CB3SCME",
            // obtain the start of the day, in the format of "2021-01-01 00:00:00", and add 8 hours to get the Singapore time
            startTime: new Date(
              new Date().setHours(0, 0, 0, 0) + 8 * 60 * 60 * 1000
            )
              .toISOString()
              .slice(0, 19)
              .replace("T", " "),
            // obtain the current time, in the format of "2021-01-01 00:00:00", and add 8 hours to get the current Singapore time
            endTime: new Date(new Date().setHours(new Date().getHours() + 8))
              .toISOString()
              .slice(0, 19)
              .replace("T", " "),
          },
        })
        .then(function (response) {
          var enters = [];
          var exits = [];
          var labels = [];
          var serving = [];
          var enter_sum = 0;
          var exit_sum = 0;
          for (var i = 0; i < response.data.data.length; i++) {
            enters.push(response.data.data[i].enter);
            exits.push(response.data.data[i].exits);
            labels.push(response.data.data[i].period);
            enter_sum += response.data.data[i].enter;
            exit_sum += response.data.data[i].exits;
            serving.push(enter_sum - exit_sum);
          }
          const echartInstance = echartRef.getEchartsInstance();
          const newOpt = { ...echartInstance.getOption() };
          newOpt.series[0].data = enters;
          newOpt.series[1].data = exits;
          newOpt.series[2].data = serving;
          newOpt.xAxis[0].data = labels;
          echartInstance.setOption(newOpt);
          setCount(count + 1);
        })
        .catch(function (error) {
          console.log(error);
        });
    }, 5000);
    return () => clearInterval(timer); //清除定时器不要忘记
  }, [count]);
  return (
    <div>
      <div className="App">
        <ReactEcharts
          ref={(e) => {
            echartRef = e;
          }}
          option={option}
          className="react_for_echarts"
        />
      </div>
      <div>{count}</div>
    </div>
  );
}
