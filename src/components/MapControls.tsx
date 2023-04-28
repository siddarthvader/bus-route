import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStepBackward,
  faStepForward,
  faPlay,
  faPause,
} from "@fortawesome/free-solid-svg-icons";
import RangeSlider from "./RangeSlider";
import { useMovieStore, useRouteStore } from "../store/store";
import { useEffect, useRef, useState } from "react";
import {
  BackwardButtonProps,
  ForWardButtonProps,
  MapControlProps,
  PlayPauseButtonProps,
} from "@/helpers/types";
import {
  convertMiliSecondstoMinutes,
  convertToEpochMili,
  getHoursMinutes,
  getTimeInRange,
  getToday,
} from "@/helpers/util";
import { movieConstants } from "@/helpers/constants";

export default function MapControls(props: MapControlProps) {
  const setCurrentTimestamp = useMovieStore(
    (state) => state.setCurrentTimestamp
  );
  const { onTimeChange, rangeList } = props;
  const start_time = getHoursMinutes(new Date(rangeList[0]));
  const end_time = getHoursMinutes(new Date(rangeList[rangeList.length - 1]));

  const setActiveSpatial = useRouteStore().setActiveSpatial;
  const activeSpatial = useRouteStore().activeSpatial;

  const forward = useMovieStore((state) => state.forward);
  const backward = useMovieStore((state) => state.backward);
  const isPlaying = useMovieStore((state) => state.isPlaying);
  const setIsPlaying = useMovieStore((state) => state.setIsPlaying);

  const increaseActiveSpatial = useRouteStore().increaseActiveSpatial;

  const intervalRef = useRef(null);
  const now = getToday();

  const [currentTime] = useState(
    getTimeInRange(
      convertToEpochMili(movieConstants.start_time, now),
      convertToEpochMili(movieConstants.end_time, now),
      getToday().getTime()
    )
  );

  useEffect(() => {
    setCurrentTimestamp(convertMiliSecondstoMinutes(currentTime));
  }, [currentTime, setCurrentTimestamp]);

  function togglePlay() {
    if (isPlaying) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    } else {
      intervalRef.current = setInterval(() => {
        forward();
      }, 500);
    }
    setIsPlaying(!isPlaying);
  }

  return (
    <div
      className=" rounded-lg bg-white shadow-lg z-[1000] absolute bottom-[10%] left-0 py-2 px-4"
      style={{ width: rangeList.length * 69 }}
    >
      <div className="flex items-center justify-between">
        <div className="mr-4 font-semibold text-zinc-600">
          {now.toDateString()} : {start_time} - {end_time}
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
        currentValue={currentTime}
        onValueChange={(val) => {
          clearInterval(intervalRef.current);
          setIsPlaying(false);
          setCurrentTimestamp(convertMiliSecondstoMinutes(val));
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
