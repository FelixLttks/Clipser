import { useEffect, useState } from "react";
import ButtonGroup from "./ButtonGroup";
import DateInput from "./DateInput";

interface Props {
  spans: { text: string; value: number }[];
  defaultSpan?: { index: number; startdate: string; enddate: string };
  hasCustom?: boolean;
  onChange: (startDate: string, endDate: string, spanIndex: number) => void;
}

const getTimeByOffset = (hours: number) => {
  return new Date(Date.now() - hours * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 16);
};

const TimeSpanInput = ({
  spans,
  defaultSpan = { index: 1, startdate: "", enddate: "" },
  hasCustom = false,
  onChange,
}: Props) => {
  const [selected, setSelected] = useState(defaultSpan.index);

  let startDate = "";
  let endDate = "";

  if (defaultSpan.index < spans.length) {
    startDate = new Date(
      Date.now() -
        spans[defaultSpan.index].value * 60 * 60 * 1000 -
        new Date().getTimezoneOffset() * 60 * 1000
    )
      .toISOString()
      .slice(0, 16);

    endDate = new Date(Date.now() - new Date().getTimezoneOffset() * 60 * 1000)
      .toISOString()
      .slice(0, 16);
  } else {
    console.log("custom date", defaultSpan);
    console.log(startDate, defaultSpan.startdate);
    console.log(new Date(defaultSpan.startdate + ":00.000Z"));

    if (defaultSpan.startdate != "") startDate = defaultSpan.startdate;
    if (defaultSpan.enddate != "") endDate = defaultSpan.enddate;

    console.log(startDate);
  }

  // when rendered the fist time send default values back once
  useEffect(() => {
    onChange(startDate, endDate, defaultSpan.index);
  }, []);

  const handleChange = (index: number) => {
    setSelected(index);
    if (index < spans.length) {
      onChange(
        getTimeByOffset(spans[index].value),
        new Date().toISOString().slice(0, 16),
        index
      );
    } else {
      onChange(startDate, endDate, spans.length);
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
                  onChange(startDate, endDate, spans.length);
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
                  onChange(startDate, endDate, spans.length);
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
