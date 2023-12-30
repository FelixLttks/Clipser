import { useState } from "react";
import CookieConsent from "react-cookie-consent";
import "./App.css";
import Clips, { clip } from "./components/Clips";
import SearchForm from "./components/SearchForm";
import TwitchAPI from "./services/TwitchAPI";
import { initGA } from "./utils/ga-utils";

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

  initGA("abc");

  const handleSubmit = (data: searchData, timespan: string) => {
    setSearchData(data);
    setHasMoreClips(true);
    setError(false);
    setClips([]);

    document.title = data.channelname + " - Clipser";

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
      <CookieConsent enableDeclineButton>
        This website uses cookies to enhance the user experience.
      </CookieConsent>
    </div>
  );
}

export default App;
