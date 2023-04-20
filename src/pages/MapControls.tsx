import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStepBackward,
  faStepForward,
  faPlay,
  faPause,
} from "@fortawesome/free-solid-svg-icons";
import RangeSlider from "./RangeSlider";

type Label = {
  label: string;
  value: number;
};
const Labels: Label[] = [
  {
    label: "1",
    value: 1,
  },
  {
    label: "2",
    value: 2,
  },
  {
    label: "3",
    value: 3,
  },
  {
    label: "4",
    value: 4,
  },
  {
    label: "5",
    value: 5,
  },
  {
    label: "6",
    value: 6,
  },
];

export default function MapControls() {
  function goBack() {}
  function goForward() {}
  function togglePlay() {}

  return (
    <div className="  rounded-lg bg-white shadow-lg z-[1000] absolute bottom-2 left-[30%] py-2 px-4">
      <div className="flex items-center justify-between">
        <div className="mr-4 font-semibold text-zinc-600">
          Apr 18, 2023 @ 23:59:13.364 - Apr 18, 2023 @ 23:59:13.364
        </div>
        <div className="flex flex-1">
          <BackwardButton onClick={() => goBack()} />
          <PlayPauseButton onClick={() => togglePlay()} isPlaying={false} />
          <ForwardButton onClick={() => goForward()} />
        </div>
      </div>
      <RangeSlider labels={Labels} maxValue={6} minValue={1} step={1} />
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
