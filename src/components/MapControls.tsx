import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStepBackward,
  faStepForward,
  faPlay,
  faPause,
} from "@fortawesome/free-solid-svg-icons";
import RangeSlider from "./RangeSlider";
import { useRouteStore } from "../store/store";
import { useRef, useState } from "react";
import {
  BackwardButtonProps,
  ForWardButtonProps,
  MapControlProps,
  PlayPauseButtonProps,
} from "@/helpers/types";
import { getHoursMinutes, getToday } from "@/helpers/util";

export default function MapControls(props: MapControlProps) {
  const { onTimeChange, rangeList } = props;
  const start_time = getHoursMinutes(new Date(rangeList[0]));
  const end_time = getHoursMinutes(new Date(rangeList[rangeList.length - 1]));

  const [isPlaying, setPlaying] = useState(false);

  const setActiveSpatial = useRouteStore().setActiveSpatial;
  const activeSpatial = useRouteStore().activeSpatial;

  const increaseActiveSpatial = useRouteStore().increaseActiveSpatial;

  const intervalRef = useRef(null);
  const now = useRef<Date>(getToday());

  function togglePlay() {
    if (isPlaying) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    } else {
      intervalRef.current = setInterval(() => {
        increaseActiveSpatial();
      }, 500);
    }
    setPlaying((prev) => !prev);
  }

  return (
    <div
      className=" rounded-lg bg-white shadow-lg z-[1000] absolute bottom-[10%] left-0 py-2 px-4"
      style={{ width: rangeList.length * 69 }}
    >
      <div className="flex items-center justify-between">
        <div className="mr-4 font-semibold text-zinc-600">
          {now.current.toDateString()} : {start_time} - {end_time}
        </div>
        <div className="flex ">
          <BackwardButton onClick={() => setActiveSpatial(activeSpatial - 1)} />
          <PlayPauseButton onClick={() => togglePlay()} isPlaying={isPlaying} />
          <ForwardButton onClick={() => increaseActiveSpatial()} />
        </div>
      </div>
      <RangeSlider
        rangeList={rangeList}
        step={1}
        onValueChange={(val) => {
          onTimeChange(val);
        }}
      />
    </div>
  );
}
function ForwardButton(props: ForWardButtonProps) {
  return (
    <button onClick={props.onClick}>
      <FontAwesomeIcon icon={faStepForward} className="text-xl text-zinc-600" />
    </button>
  );
}

function BackwardButton(props: BackwardButtonProps) {
  return (
    <button onClick={props.onClick}>
      <FontAwesomeIcon
        icon={faStepBackward}
        className="text-xl text-zinc-600"
      />
    </button>
  );
}

function PlayPauseButton(props: PlayPauseButtonProps) {
  const { onClick, isPlaying } = props;
  return (
    <button
      onClick={onClick}
      className={`rounded-full bg-blue-500 p-3 mx-4 w-12 h-12`}
    >
      {isPlaying ? (
        <FontAwesomeIcon icon={faPause} className="text-xl" />
      ) : (
        <FontAwesomeIcon icon={faPlay} className="text-xl" />
      )}
    </button>
  );
}
