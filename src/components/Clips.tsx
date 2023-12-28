import { useEffect, useState } from "react";
import { searchData } from "../App";
import ClipsForm from "./ClipsForm";
import ClipsGrid from "./ClipsGrid";

export type clip = {
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
  hasError?: boolean;
}

const Clips = ({ clips, setClips, searchForm, hasError }: Props) => {
  const [multiSelectEnabled, setMultiSelectEnabled] = useState(false);
  const [selectionMode, setSelectionMode] = useState(0);
  const [selected, setSelected] = useState<boolean[]>([]);
  const [openInVODMode, setOpenInVODMode] = useState(true);

  useEffect(() => {
    setSelected([...Array(clips.length).fill(false)]);
  }, [multiSelectEnabled, selectionMode, searchForm]);

  const openClip = (index: number) => {
    let clip = clips[index];
    if (openInVODMode) {
      window.open(
        "https://www.twitch.tv/" + clip.broadcaster_name + "/clip/" + clip.id,
        "_blank"
      );
    } else {
      window.open(clip.url, "_blank");
    }
    console.log(clips[index].title);
  };

  const handleOpenSelectedClick = () => {
    for (let i = selected.length - 1; i >= 0; i--) {
      selected[i] && openClip(i);
    }

    console.log("handleOpenSelectedClick");
  };

  return (
    <>
      {searchForm != undefined && (
        <ClipsForm
          multiSelectEnabled={multiSelectEnabled}
          setMultiSelectEnabled={setMultiSelectEnabled}
          selectionMode={selectionMode}
          setSelectionMode={setSelectionMode}
          openInVODMode={openInVODMode}
          setOpenInVODMode={setOpenInVODMode}
          onOpenSelectedClick={handleOpenSelectedClick}
        ></ClipsForm>
      )}
      <ClipsGrid
        clips={clips}
        setClips={setClips}
        searchForm={hasError ? undefined : searchForm}
        multiSelectEnabled={multiSelectEnabled}
        selectionMode={selectionMode}
        selected={selected}
        setSelected={setSelected}
        openInVODMode={openInVODMode}
      ></ClipsGrid>
      {hasError && (
        <div className="d-flex justify-content-center m-5">
          <p>Error. Maybe you made a typo?</p>
        </div>
      )}
    </>
  );
};

export default Clips;
