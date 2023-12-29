import { useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { searchData } from "../App";
import TwitchAPI from "../services/TwitchAPI";

type clip = {
  id: string;
  url: string;
  embed_url: string;
  broadcaster_id: string;
  broadcaster_name: string;
  creator_id: string;
  creator_name: string;
  video_id: string;
  game_id: string;
  language: string;
  title: string;
  view_count: number;
  created_at: string;
  thumbnail_url: string;
  duration: number;
  vod_offset: number;
  is_featured: boolean;
};

interface Props {
  clips: clip[];
  setClips: (value: clip[] | ((prevVar: clip[]) => clip[])) => void;
  searchForm?: searchData;
  multiSelectEnabled: boolean;
  selectionMode: number;
  selected: boolean[];
  setSelected: (value: boolean[] | ((prevVar: boolean[]) => boolean[])) => void;
  openInVODMode: boolean;
  hasMore: boolean;
}

let leftRangeIndex = 0;
let rightRangeIndex = 0;

const ClipsGrid = ({
  clips,
  setClips,
  searchForm,
  multiSelectEnabled,
  selectionMode,
  selected,
  setSelected,
  openInVODMode,
  hasMore,
}: Props) => {
  useEffect(() => {
    if (clips.length > selected.length)
      setSelected([
        ...selected,
        ...Array(clips.length - selected.length).fill(false),
      ]);
  }, []);

  useEffect(() => {
    leftRangeIndex = 0;
    rightRangeIndex = 0;
  }, [selectionMode]);

  const classNameCard = (index: number) => {
    let className = "card text-decoration-none card-overlay";
    if (!selected[index]) return className;
    return className + " selected";
  };

  const handleSelect = (index: number) => {
    if (!multiSelectEnabled) return;
    switch (selectionMode) {
      case 0:
        // single
        setSelected((prev) => [
          ...prev.slice(0, index),
          !selected[index],
          ...prev.slice(index + 1),
        ]);
        break;
      case 1:
        // single
        setSelected(() => [
          ...Array(index).fill(true),
          !selected[index] || selected[index + 1],
          ...Array(clips.length - index - 1).fill(false),
        ]);
        break;
      case 2:
        // implemented in extra handler
        break;
    }
  };

  const handleRangeSelect = (isAfterButton: boolean, index: number) => {
    // update indexes
    if (isAfterButton) leftRangeIndex = index;
    else rightRangeIndex = index;

    if (!isAfterButton && rightRangeIndex <= leftRangeIndex) leftRangeIndex = 0;

    rightRangeIndex = Math.max(rightRangeIndex, leftRangeIndex);
    leftRangeIndex = Math.min(leftRangeIndex, rightRangeIndex);

    setSelected(() => [
      ...Array(leftRangeIndex).fill(false),
      ...Array(rightRangeIndex - leftRangeIndex + 1).fill(true),
      ...Array(clips.length - rightRangeIndex - 1).fill(false),
    ]);
  };

  return (
    <>
      {searchForm != undefined && (
        <InfiniteScroll
          dataLength={clips.length}
          next={() => {
            console.log("next");
            searchForm &&
              TwitchAPI.fetchData(searchForm, false).then((data) => {
                setClips((prev) => [...prev, ...data.clips]);
              });
          }}
          // hasMore={searchForm != undefined}
          hasMore={hasMore}
          loader={
            <div className="d-flex justify-content-center">
              <div
                className="spinner-border text-primary center m-5"
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          }
          endMessage={
            <div className="d-flex justify-content-center m-5">
              <p>No clips found.</p>
            </div>
          }
        >
          <div className="container">
            <div className="row">
              {clips.map((clip, index) => (
                <div className="col-lg-3 col-md-6 mb-4" key={clip.id}>
                  <a
                    role="button"
                    className={classNameCard(index)}
                    href={
                      multiSelectEnabled
                        ? undefined
                        : openInVODMode
                        ? "https://www.twitch.tv/" +
                          clip.broadcaster_name +
                          "/clip/" +
                          clip.id
                        : clip.url
                    }
                    target="_blank"
                    onClick={() => handleSelect(index)}
                  >
                    <img
                      src={clip.thumbnail_url}
                      className="card-img-top"
                      alt="Clip Thumbnail"
                    ></img>
                    <div className="card-body">
                      <h5 className="card-title text-truncate">{clip.title}</h5>
                      <p className="card-text mb-0">
                        <small>
                          {new Date(clip.created_at).toLocaleString()}
                          <br></br>
                          {clip.created_at}
                        </small>
                      </p>
                      <p className="card-text mb-0">
                        <small>by {clip.creator_name}</small>
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <p className="card-text m-0">
                          <small>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-eye-fill"
                              viewBox="0 0 16 16"
                            >
                              <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                              <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
                            </svg>
                            <span className="m-2">{clip.view_count}</span>
                          </small>
                        </p>
                        <div
                          className={
                            multiSelectEnabled && selectionMode == 2
                              ? "row gap-2 rangeSelection-buttons"
                              : "row gap-2"
                          }
                        >
                          <button
                            type="button"
                            className="btn btn-primary col"
                            onClick={() => {
                              if (multiSelectEnabled && selectionMode == 2)
                                handleRangeSelect(false, index);
                            }}
                          >
                            {!multiSelectEnabled
                              ? "Watch"
                              : selectionMode == 2
                              ? "Before"
                              : "Select"}
                          </button>
                          {multiSelectEnabled && selectionMode == 2 && (
                            <button
                              type="button"
                              className="btn btn-primary col"
                              onClick={() => {
                                handleRangeSelect(true, index);
                              }}
                            >
                              After
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="checkmark">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        className="bi bi-check"
                        viewBox="0 0 16 16"
                      >
                        <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
                      </svg>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </InfiniteScroll>
      )}
    </>
  );
};

export default ClipsGrid;
