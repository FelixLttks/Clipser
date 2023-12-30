import { useEffect, useState } from "react";
import ButtonGroup from "./ButtonGroup";
import DateInput from "./DateInput";

interface Props {
  spans: { text: string; value: number }[];
  defaultSpan?: { index: number; startdate: string; enddate: string };
  hasCustom?: boolean;
  onChange: (startDate: string, endDate: string, spanIndex: number) => void;
}

// return string formatted as yyyy-mm-ddThh:mm
const covertUTCLocalTime = (utc: string) => {
  // console.log("convering utc to local", utc);
  const utcDate = new Date(utc + "Z");
  const localDate = new Date(
    utcDate.getTime() - utcDate.getTimezoneOffset() * 60000
  );
  const localTimeString = localDate.toISOString().slice(0, 16);

  return localTimeString;
};

// return string formatted as yyyy-mm-ddThh:mm
const covertLocalUTCTime = (local: string) => {
  const utcTimeString = new Date(local).toISOString().slice(0, 16);
  return utcTimeString;
};

let startDate = ""; // UTC
let endDate = ""; // UTC

const TimeSpanInput = ({
  spans,
  defaultSpan = { index: 1, startdate: "", enddate: "" },
  hasCustom = false,
  onChange,
}: Props) => {
  const [selected, setSelected] = useState(defaultSpan.index); // index of selected timespan

  useEffect(() => {
    onChange(startDate, endDate, selected);
  }, []);

  if (startDate == "" || endDate == "") {
    if (defaultSpan.index >= spans.length) {
      // custom timespan and at least one date is not set
      if (defaultSpan.startdate != "") {
        startDate = defaultSpan.startdate;
      } else {
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days
          .toISOString()
          .slice(0, 16);
      }
      if (defaultSpan.enddate != "") {
        endDate = defaultSpan.enddate;
      } else {
        endDate = new Date().toISOString().slice(0, 16);
      }
    }
  }

  const handleIndexChange = (index: number) => {
    if (index < spans.length) {
      // do not calculate time here, search button may be triggered later
      onChange("", "", index);
    } else {
      startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days
        .toISOString()
        .slice(0, 16);
      endDate = new Date().toISOString().slice(0, 16);
      onChange(startDate, endDate, spans.length);
      console.log(startDate);
    }
    setSelected(index);
  };

  return (
    <div className="mb-3">
      <label htmlFor="btn-group" className="form-label">
        Select timespan
      </label>
      <div className="btn-toolbar">
        <ButtonGroup
          items={[
            ...spans.map((span) => span.text),
            ...(hasCustom ? ["Custom"] : []), // add custom button element when needed
          ]}
          selected={selected}
          onChange={handleIndexChange}
        ></ButtonGroup>

        {/* custom range */}
        {selected === spans.length && (
          <div className="input-group">
            <DateInput
              type="datetime-local"
              defaultValue={covertUTCLocalTime(startDate)}
              onChange={(local) => {
                startDate = covertLocalUTCTime(local);
                onChange(startDate, endDate, spans.length);
              }}
            ></DateInput>
            <span className="input-group-text" id="customRangeTo">
              to
            </span>
            <DateInput
              type="datetime-local"
              defaultValue={covertUTCLocalTime(endDate)}
              onChange={(local) => {
                endDate = covertLocalUTCTime(local);
                onChange(startDate, endDate, spans.length);
              }}
            ></DateInput>
          </div>
        )}
      </div>

      <div className="form-text" id="timespanHint">
        Choose from which period the clips should be loaded
      </div>
    </div>
  );
};

export default TimeSpanInput;
