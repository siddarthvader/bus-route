import { useMemo, useState } from "react";
import { getAxisLabelFromTime, getHoursMinutes } from "../helpers/util";

interface RangeSliderProps {
  step: number;
  currentValue: number;
  onValueChange?: (value: number) => void;
  rangeList: number[];
}

function RangeSlider(props: RangeSliderProps) {
  const { rangeList, currentValue } = props;
  const minValue = Math.min(...rangeList);
  const maxValue = Math.max(...rangeList);

  const [rangeValue, setRangeValue] = useState(currentValue);

  const range: Date[] = useMemo(
    () => getAxisLabelFromTime(rangeList),
    [rangeList]
  );

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (props.onValueChange) {
      setRangeValue(Number(event.target.value));
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
            defaultValue={rangeValue}
            onChange={handleValueChange}
            step={1}
          />
          <div className="flex space-x-2">
            {range.map((label, index) => (
              <div
                key={index}
                className={`absolute bottom-[-20px] left-0 text-xs   ${
                  currentValue >= label.getTime()
                    ? "text-blue-500"
                    : "text-zinc-600"
                }`}
                style={{
                  left: `${
                    ((label.getTime() - minValue) / (maxValue - minValue)) * 100
                  }%`,
                  transform: "translateX(-50%) translateY(-100%)",
                }}
              >
                {getHoursMinutes(label)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RangeSlider;
