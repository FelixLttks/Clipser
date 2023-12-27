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
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [searchData, setSearchData] = useState<searchData | undefined>(
    undefined
  );
  const [clips, setClips] = useState<clip[]>([]);

  const handleSubmit = (data: searchData) => {
    setSearchSubmitted(true);
    setSearchData(data);
    TwitchAPI.fetchData(data).then((data) => setClips(data.clips));
  };

  return (
    <div className="container">
      <SearchForm onSubmit={handleSubmit}></SearchForm>
      <Clips clips={clips} setClips={setClips} searchForm={searchData}></Clips>
    </div>
  );
}

export default App;
