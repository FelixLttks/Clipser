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
  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      channelname: { value: string };
      date: { value: number };
    };

    onSubmit({
      channelname: target.channelname.value,
      startdate: startDate,
      enddate: endDate,
    });
  };

  const handleTimeSpanChnage = (start: string, end: string) => {
    startDate = start;
    endDate = end;
  };

  return (
    <form onSubmit={handleSubmit} className="m-3">
      <TextInput
        name="channelname"
        groupText="https://www.twitch.tv/"
        required
        autocomplete={false}
      >
        Channelname
      </TextInput>
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
      <input type="submit" value="Submit" className="btn btn-primary" />
    </form>
  );
};

export default SearchForm;
