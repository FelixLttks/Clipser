import { useState } from "react";
import "./App.css";
import Clips, { clip } from "./components/Clips";
import SearchForm from "./components/SearchForm";
import TwitchAPI from "./services/TwitchAPI";

export type searchData = {
  channelname: string;
  startdate: string;
  enddate: string;
};

function App() {
  const [searchData, setSearchData] = useState<searchData | undefined>(
    undefined
  );
  const [clips, setClips] = useState<clip[]>([]);
  const [error, setError] = useState(false);

  const handleSubmit = (data: searchData) => {
    setSearchData(data);
    TwitchAPI.fetchData(data).then((data) => {
      setError(data.error);
      setClips(data.clips);
      return;
    });
  };

  return (
    <div className="container">
      <SearchForm onSubmit={handleSubmit}></SearchForm>
      <Clips
        clips={clips}
        setClips={setClips}
        searchForm={searchData}
        hasError={error}
      ></Clips>
    </div>
  );
}

export default App;
