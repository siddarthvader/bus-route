import { useState } from "react";

interface RangeSliderProps {
  minValue: number;
  maxValue: number;
  step: number;

  labels: { value: number; label: string }[];
  onValueChange?: (value: string) => void;
}

function RangeSlider(props: RangeSliderProps) {
  const [value, setValue] = useState(props.minValue);

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(event.target.value));
    if (props.onValueChange) {
      props.onValueChange(event.target.value);
    }
  };

  return (
    <div className="flex items-center my-4">
      <div className="flex-1 pr-4">
        <div className="relative">
          {props.labels.map((label, index) => (
            <div
              key={index}
              className={`absolute top-0 left-0 text-xs ${
                value >= label.value ? "text-blue-500" : "text-gray-400"
              }`}
              style={{
                left: `${
                  ((label.value - props.minValue) /
                    (props.maxValue - props.minValue)) *
                  100
                }%`,
                transform: "translateX(-50%) translateY(-100%)",
              }}
            >
              {label.label}
            </div>
          ))}
          <input
            type="range"
            className="w-full -mt-1"
            min={props.minValue}
            max={props.maxValue}
            value={value}
            onChange={handleValueChange}
          />
        </div>
      </div>
    </div>
  );
}

export default RangeSlider;
