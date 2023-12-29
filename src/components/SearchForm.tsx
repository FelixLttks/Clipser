import { SyntheticEvent } from "react";
import { searchData } from "../App";
import TextInput from "./TextInput";
import TimeSpanInput from "./TimeSpanInput";

interface Props {
  onSubmit: (searchData: searchData, timespan: string) => void;
}

const timeSpans = [
  { text: "24h", value: 24, short: "24h" },
  { text: "7 days", value: 168, short: "7d" },
  { text: "1 month", value: 720, short: "1m" },
  { text: "all time", value: 170880, short: "all" },
];

const queryParameters = new URLSearchParams(window.location.search);
const channelnameURL = queryParameters.get("q");
const timespanURL = queryParameters.get("t");
const clipsCountURL = queryParameters.get("c");

const getDefaultTimespan = (): {
  index: number;
  startdate: string;
  enddate: string;
} => {
  switch (timespanURL) {
    case "24h":
      return { index: 0, startdate: "", enddate: "" };
    case "7d":
      return { index: 1, startdate: "", enddate: "" };
    case "1m":
      return { index: 2, startdate: "", enddate: "" };
    case "all":
      return { index: 3, startdate: "", enddate: "" };
    case "custom":
      const startDateURL = queryParameters.get("tstart") || "";
      const startEndURL = queryParameters.get("tend") || "";

      return { index: 4, startdate: startDateURL, enddate: startEndURL };
    default:
      return { index: 1, startdate: "", enddate: "" };
  }
};

let startDate = "";
let endDate = "";
let spanIndex = getDefaultTimespan().index;

const SearchForm = ({ onSubmit }: Props) => {
  // handleSubmit is called when user submits form
  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      channelname: { value: string };
      ClipCount: { value: string };
    };

    console.log(spanIndex);
    if (spanIndex < timeSpans.length) {
      startDate = new Date(
        Date.now() - timeSpans[spanIndex].value * 60 * 60 * 1000
      )
        .toISOString()
        .slice(0, 16);
      endDate = new Date().toISOString().slice(0, 16);
    }

    // give search data back
    onSubmit(
      {
        channelname: target.channelname.value,
        startdate: startDate,
        enddate: endDate,
        clipscount: target.ClipCount.value,
      },
      spanIndex < timeSpans.length ? timeSpans[spanIndex].short : "custom"
    );
  };

  // handleTimeSpanChnage is called when user changes the selected time span
  const handleTimeSpanChnage = (start: string, end: string, index: number) => {
    startDate = start;
    endDate = end;
    spanIndex = index;
  };

  return (
    <form onSubmit={handleSubmit} className="m-3">
      {/* channel name input */}
      <TextInput
        name="channelname"
        groupText="https://www.twitch.tv/"
        required
        defaultValue={channelnameURL ? channelnameURL : ""}
        autocomplete={false}
      >
        Channelname
      </TextInput>

      {/* time span input with predefined buttons + custom selection */}
      <TimeSpanInput
        spans={timeSpans}
        defaultSpan={getDefaultTimespan()}
        hasCustom
        onChange={handleTimeSpanChnage}
      ></TimeSpanInput>

      <div className="row ms-0">
        {/* submit button */}
        <input
          type="submit"
          value="Search"
          className="btn btn-primary col-md-auto"
        />

        <select
          className="form-select col-md-auto w-auto ms-2"
          aria-label="select clips loading "
          name="ClipCount"
          onChange={(e) => console.log(e.target.value)}
          defaultValue={clipsCountURL != undefined ? clipsCountURL : "20"}
        >
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="75">75</option>
          <option value="100">100</option>
        </select>
        <label
          htmlFor="ClipCount"
          className="col-md-auto form-label m-0 d-flex align-items-center"
        >
          Clips
        </label>
      </div>
    </form>
  );
};

export default SearchForm;
