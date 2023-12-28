import { SyntheticEvent } from "react";
import { searchData } from "../App";
import TextInput from "./TextInput";
import TimeSpanInput from "./TimeSpanInput";

interface Props {
  onSubmit: (searchData: searchData) => void;
}

let startDate = "";
let endDate = "";

const SearchForm = ({ onSubmit }: Props) => {
  // handleSubmit is called when user submits form
  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      channelname: { value: string };
      ClipCount: { value: string };
    };

    // give search data back
    onSubmit({
      channelname: target.channelname.value,
      startdate: startDate,
      enddate: endDate,
      clipscount: target.ClipCount.value,
    });
  };

  // handleTimeSpanChnage is called when user changes the selected time span
  const handleTimeSpanChnage = (start: string, end: string) => {
    startDate = start;
    endDate = end;
  };

  return (
    <form onSubmit={handleSubmit} className="m-3">
      {/* channel name input */}
      <TextInput
        name="channelname"
        groupText="https://www.twitch.tv/"
        required
        autocomplete={false}
      >
        Channelname
      </TextInput>

      {/* time span input with predefined buttons + custom selection */}
      <TimeSpanInput
        spans={[
          { text: "24h", value: 24 },
          { text: "7 days", value: 168 },
          { text: "1 month", value: 720 },
          { text: "all time", value: 170880 },
        ]}
        defaultSpanIndex={1}
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
        >
          <option selected value="20">
            20
          </option>
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
