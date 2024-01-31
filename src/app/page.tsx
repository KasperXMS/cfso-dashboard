import General from "./general";
import HourlyData from "./hourlydata";
import MinuteData from "./minutedata";

export default function Page() {
  return (
    <div>
        <div style={{ height: "30px" }}></div>
      <General />
      <HourlyData />
      <MinuteData />
    </div>
  );
}