import React from "react";

function Counter({ currentSide, triggerRandomHero }) {
  const [radiantReserveTime, setRadiantReserveTime] = React.useState({
    minute: 2,
    second: 10,
  });
  const [direReserveTime, setDireReserveTime] = React.useState({
    minute: 0,
    second: 0,
  });
  const [time, setTime] = React.useState({
    minute: 0,
    second: 30,
  });

  const tick = () => {
    if (time.second === 0 && currentSide === "RADIANT") {
      if (radiantReserveTime.minute === 0 && radiantReserveTime.second === 0) {
        triggerRandomHero();
      }
      if (radiantReserveTime.second === 0) {
        setRadiantReserveTime({
          minute: radiantReserveTime.minute - 1,
          second: 59,
        });
      } else {
        setRadiantReserveTime({
          minute: radiantReserveTime.minute,
          second: radiantReserveTime.second - 1,
        });
      }
    } else if (time.second === 0 && currentSide === "DIRE") {
      if (direReserveTime.minute === 0 && direReserveTime.second === 0) {
        triggerRandomHero();
      }
      if (direReserveTime.second === 0) {
        setDireReserveTime({
          minute: direReserveTime.minute - 1,
          second: 59,
        });
      } else {
        setDireReserveTime({
          minute: direReserveTime.minute,
          second: direReserveTime.second - 1,
        });
      }
    } else {
      setTime({
        minute: time.minute,
        second: time.second - 1,
      });
    }
  };

  React.useEffect(() => {
    let timerID = setInterval(() => tick(), 1000);
    return () => clearInterval(timerID);
  });

  React.useEffect(() => {
    setTime({
      minute: 0,
      second: 30,
    });
  }, [currentSide]);

  return (
    <div>
      {JSON.stringify(currentSide)}
      <p>{`${time.minute.toString().padStart(2, "0")}:${time.second
        .toString()
        .padStart(2, "0")}`}</p>
      {JSON.stringify(radiantReserveTime)}
      {JSON.stringify(direReserveTime)}
      {JSON.stringify(time)}
    </div>
  );
}

export default Counter;
