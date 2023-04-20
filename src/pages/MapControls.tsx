import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStepBackward,
  faStepForward,
  faPlay,
  faPause,
} from "@fortawesome/free-solid-svg-icons";
import RangeSlider from "./RangeSlider";
import { useSpatialStore } from "./store";
import { useState } from "react";

type Label = {
  label: string;
  value: number;
};

export default function MapControls() {
  const increaseActiveSpatial = useSpatialStore().increaseActiveSpatial;

  const [isPlaying, setPlaying] = useState(false);

  const setActiveSpatial = useSpatialStore().setActiveSpatial;
  const activeSpatial = useSpatialStore().activeSpatial;
  const isLastSpatial = useSpatialStore().isLastSpatial;
  function goBack() {
    if (activeSpatial >= 1) {
      setActiveSpatial(activeSpatial - 1);
    }
  }
  function goForward() {
    if (!isLastSpatial()) {
      setActiveSpatial(activeSpatial + 1);
    }
  }
  function togglePlay() {
    let interval;
    if (isPlaying && isLastSpatial()) {
      clearInterval(interval);
    } else {
      interval = setInterval(() => {
        increaseActiveSpatial();
      }, 500);
    }

    setPlaying((prev) => !prev);
  }

  const rangeValues = useSpatialStore().getRangeLabel();

  return (
    <div className="  rounded-lg bg-white shadow-lg z-[1000] absolute bottom-2 left-[30%] py-2 px-4">
      <div className="flex items-center justify-between">
        <div className="mr-4 font-semibold text-zinc-600">
          Apr 18, 2023 @ 23:59:13.364 - Apr 18, 2023 @ 23:59:13.364
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
          setPlaying(false);
          console.log("val");
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
