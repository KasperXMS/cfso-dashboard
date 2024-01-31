"use client";

import axios from "axios";
import { use, useEffect, useState } from "react";
import "./mine.css";

axios.defaults.baseURL = "http://192.168.1.103:8082";

function refresh(setEnter, setExit) {
  axios
    .get("/cfso/getbyday", {
      params: {
        location: "CB3SCME",
        // obtain the current time, in the format of "dddd-MM-yy"
        date: new Date(new Date().setHours(new Date().getHours() + 8))
          .toISOString()
          .slice(0, 10),
      },
    })
    .then((res) => {
      setEnter(res.data.data.enter);
      setExit(res.data.data.exits);
    });
}

export default function General() {
  const [enter, setEnter] = useState(0);
  const [exit, setExit] = useState(0);
  const [count, setCount] = useState(0);
  refresh(setEnter, setExit);
  useEffect(() => {
    setInterval(() => {
      refresh(setEnter, setExit);
      setCount(count + 1);
    }, 5000);
  }, [count]);
  return (
    <div className="wrapper">
      <div>
        <div className="title">Enter</div>
        <div className="data">{enter}</div>
      </div>
      <div>
        <div className="title">Exit</div>
        <div className="data">{exit}</div>
      </div>
      <div>
        <div className="title">Serving</div>
        <div className="data">{enter - exit}</div>
      </div>
    </div>
  );
}
