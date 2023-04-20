import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStepBackward,
  faStepForward,
  faPlay,
  faPause,
} from "@fortawesome/free-solid-svg-icons";
import RangeSlider from "./RangeSlider";
import { useSpatialStore } from "./store";
import { useRef, useState } from "react";

type Label = {
  label: string;
  value: number;
};

export default function MapControls() {
  const [isPlaying, setPlaying] = useState(false);

  const setActiveSpatial = useSpatialStore().setActiveSpatial;
  const activeSpatial = useSpatialStore().activeSpatial;

  const increaseActiveSpatial = useSpatialStore().increaseActiveSpatial;
  function goBack() {
    setActiveSpatial(activeSpatial - 1);
  }
  function goForward() {
    setActiveSpatial(activeSpatial + 1);
  }
  const intervalRef = useRef(null);
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

  const rangeValues = useSpatialStore().getRangeLabel();

  const spatialData = useSpatialStore().spatialData;

  return (
    <div className="  rounded-lg bg-white shadow-lg z-[1000] absolute bottom-2 left-[30%] py-2 px-4">
      <div className="flex items-center justify-between">
        <div className="mr-4 font-semibold text-zinc-600">
          {spatialData[0]["@timestamp"]} -
          {spatialData[spatialData.length - 1]["@timestamp"]}
        </div>
        <div className="flex flex-1">
          <BackwardButton onClick={() => goBack()} />
          <PlayPauseButton onClick={() => togglePlay()} isPlaying={isPlaying} />
          <ForwardButton onClick={() => goForward()} />
        </div>
      </div>
      <RangeSlider
        rangeList={rangeValues}
        step={1}
        onValueChange={(val) => {
          setActiveSpatial(val);
        }}
      />
    </div>
  );
}

function ForwardButton(props) {
  return (
    <button onClick={props.onClick}>
      <FontAwesomeIcon icon={faStepForward} className="text-xl text-zinc-600" />
    </button>
  );
}

function BackwardButton(props) {
  return (
    <button onClick={props.onClick}>
      <FontAwesomeIcon
        icon={faStepBackward}
        className="text-xl text-zinc-600"
      />
    </button>
  );
}

function PlayPauseButton(props) {
  return (
    <button
      onClick={props.onClick}
      className={`rounded-full bg-blue-500 p-3 mx-4 w-12 h-12`}
    >
      {props.isPlaying ? (
        <FontAwesomeIcon icon={faPause} className="text-xl" />
      ) : (
        <FontAwesomeIcon icon={faPlay} className="text-xl" />
      )}
    </button>
  );
}
