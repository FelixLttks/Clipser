import { useEffect, useState } from "react";
import ButtonGroup from "./ButtonGroup";

interface Props {
  spans: { text: string; value: number }[];
  defaultSpanIndex?: number;
  hasCustom?: boolean;
  onChange: (startDate: string, endDate: string) => void;
}

var now = new Date();
now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
const nowStr = now.toISOString().slice(0, 16);

const sevenDaysAgo: string = new Date(
  Date.now() -
    7 * 24 * 60 * 60 * 1000 -
    new Date().getTimezoneOffset() * 60 * 1000
)
  .toISOString()
  .slice(0, 16);

const getTimeByOffset = (hours: number) => {
  return new Date(Date.now() - hours * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 16);
};

console.log(getTimeByOffset(24));

const TimeSpanInput = ({
  spans,
  defaultSpanIndex = 0,
  hasCustom = false,
  onChange,
}: Props) => {
  const [selected, setSelected] = useState(defaultSpanIndex);

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
              <input
                id="startDate"
                className="form-control"
                type="datetime-local"
                defaultValue={sevenDaysAgo}
                onChange={(e) => console.log(e.target.value)}
              />
              <span className="input-group-text" id="basic-addon2">
                to
              </span>
              <input
                id="endDate"
                className="form-control"
                type="datetime-local"
                defaultValue={nowStr}
              />
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
