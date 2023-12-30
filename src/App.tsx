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

  // timespan as short version of selected
  const handleSubmit = (data: searchData, timespan: string) => {
    setSearchData(data);
    setHasMoreClips(true);
    setError(false);
    setClips([]);

    document.title = data.channelname + " - Clipser";

    // update url params
    const url = new URL(window.location.toString());
    url.searchParams.set("q", data.channelname);
    url.searchParams.set("c", data.clipscount);
    url.searchParams.set("t", timespan);

    if (timespan == "custom") {
      url.searchParams.set("tstart", data.startdate);
      url.searchParams.set("tend", data.enddate);
    } else {
      url.searchParams.delete("tstart");
      url.searchParams.delete("tend");
    }

    window.history.pushState({}, "", url);

    // get clips
    TwitchAPI.fetchData(data).then((data) => {
      setError(data.error);
      setClips(data.clips);
      setHasMoreClips(data.clips.length != 0 && data.hasMore);
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

      <a
        className="btn btn-primary rounded-circle p-1 position-fixed"
        href="https://github.com/FelixLttks/Clipser"
        target="_blank"
        style={{
          width: 38,
          height: 38,
          bottom: 38,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          className="bi bi-github"
          viewBox="0 0 16 16"
        >
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8" />
        </svg>
      </a>
    </div>
  );
}

export default App;
