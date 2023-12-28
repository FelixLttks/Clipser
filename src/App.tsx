import { useState } from "react";
import "./App.css";
import Clips, { clip } from "./components/Clips";
import SearchForm from "./components/SearchForm";
import TwitchAPI from "./services/TwitchAPI";

export type searchData = {
  channelname: string;
  startdate: string;
  enddate: string;
  clipscount: string;
};

function App() {
  const [searchData, setSearchData] = useState<searchData | undefined>(
    undefined
  );
  const [clips, setClips] = useState<clip[]>([]);
  const [error, setError] = useState(false);
  const [hasMoreClips, setHasMoreClips] = useState(true);

  const handleSubmit = (data: searchData) => {
    setSearchData(data);
    setHasMoreClips(true);
    setError(false);
    setClips([]);
    TwitchAPI.fetchData(data).then((data) => {
      setError(data.error);
      setClips(data.clips);
      setHasMoreClips(data.clips.length != 0);
      return;
    });
  };

  return (
    <div className="container pt-4">
      <SearchForm onSubmit={handleSubmit}></SearchForm>
      <Clips
        clips={clips}
        setClips={setClips}
        searchForm={searchData}
        hasError={error}
        hasMoreClips={hasMoreClips}
      ></Clips>
    </div>
  );
}

export default App;
