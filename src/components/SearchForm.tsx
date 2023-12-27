import { SyntheticEvent } from "react";
import TextInput from "./TextInput";
import TimeSpanInput from "./TimeSpanInput";

interface Props {
  onSubmit: (data: {
    channelname: string;
    startdate: string;
    enddate: string;
  }) => void;
}

let startDate = "";
let endDate = "";

const SearchForm = ({ onSubmit }: Props) => {
  // handleSubmit is called when user submits form
  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      channelname: { value: string };
    };

    // give search data back
    onSubmit({
      channelname: target.channelname.value,
      startdate: startDate,
      enddate: endDate,
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

      {/* submit button */}
      <input type="submit" value="Search" className="btn btn-primary" />
    </form>
  );
};

export default SearchForm;
