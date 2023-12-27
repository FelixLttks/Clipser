import { useEffect, useState } from "react";
import ButtonGroup from "./ButtonGroup";
import DateInput from "./DateInput";

interface Props {
  spans: { text: string; value: number }[];
  defaultSpanIndex?: number;
  hasCustom?: boolean;
  onChange: (startDate: string, endDate: string) => void;
}

let startDate = new Date(
  Date.now() -
    7 * 24 * 60 * 60 * 1000 -
    new Date().getTimezoneOffset() * 60 * 1000
)
  .toISOString()
  .slice(0, 16);
let endDate = new Date(Date.now() - new Date().getTimezoneOffset() * 60 * 1000)
  .toISOString()
  .slice(0, 16);

const getTimeByOffset = (hours: number) => {
  return new Date(Date.now() - hours * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 16);
};

const TimeSpanInput = ({
  spans,
  defaultSpanIndex = 0,
  hasCustom = false,
  onChange,
}: Props) => {
  const [selected, setSelected] = useState(defaultSpanIndex);

  // when rendered the fist time send default values back once
  useEffect(() => {
    onChange(
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      new Date().toISOString().slice(0, 16)
    );
  }, []);

  const handleChange = (index: number) => {
    setSelected(index);
    if (index < spans.length) {
      onChange(
        getTimeByOffset(spans[index].value),
        new Date().toISOString().slice(0, 16)
      );
    }
  };

  return (
    <>
      <div className="mb-3">
        <label htmlFor="btn-group" className="form-label">
          Select timespan
        </label>
        <div className="btn-toolbar ">
          <ButtonGroup
            items={[
              ...spans.map((span) => span.text),
              ...(hasCustom ? ["Custom"] : []),
            ]}
            selected={selected}
            onChange={handleChange}
          ></ButtonGroup>
          {selected === spans.length && (
            <div className="input-group">
              <DateInput
                type="datetime-local"
                defaultValue={startDate}
                onChange={(e) => {
                  startDate = new Date(e).toISOString().slice(0, 16);
                  onChange(startDate, endDate);
                }}
              ></DateInput>
              <span className="input-group-text" id="basic-addon2">
                to
              </span>
              <DateInput
                type="datetime-local"
                defaultValue={endDate}
                onChange={(e) => {
                  endDate = new Date(e).toISOString().slice(0, 16);
                  onChange(startDate, endDate);
                }}
              ></DateInput>
            </div>
          )}
        </div>

        <div className="form-text" id="basic-addon4">
          Choose from which period the clips should be loaded
        </div>
      </div>
    </>
  );
};

export default TimeSpanInput;
