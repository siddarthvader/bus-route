import { useMemo, useState } from "react";
import { getAxisLabelFromTime } from "./helper";

interface RangeSliderProps {
  step: number;
  rangeList: number[];
  onValueChange?: (value: number) => void;
}

function RangeSlider(props: RangeSliderProps) {
  const minValue = 0;
  const maxValue = props.rangeList.length - 1;

  const [value, setValue] = useState(minValue);

  const range: Date[] = useMemo(
    () => getAxisLabelFromTime(props.rangeList),
    [props.rangeList]
  );

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(event.target.value));
    if (props.onValueChange) {
      props.onValueChange(Number(event.target.value));
    }
  };

  return (
    <div className="flex items-center my-4">
      <div className="flex-1 pr-4">
        <div className="relative flex flex-col h-8">
          <input
            type="range"
            className="w-full -mt-1"
            min={minValue}
            max={maxValue}
            value={value}
            onChange={handleValueChange}
            step={1}
          />
          <div className="flex space-x-2">
            {range.map((label, index) => (
              <div
                key={index}
                className={`absolute bottom-[-20px] left-0 text-xs   ${
                  value >= label.getTime() ? "text-blue-500" : "text-zinc-600"
                }`}
                style={{
                  left: `${
                    ((label.getTime() - minValue) / (maxValue - minValue)) * 100
                  }%`,
                  transform: "translateX(-50%) translateY(-100%)",
                }}
              >
                {label.toLocaleTimeString()}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RangeSlider;
