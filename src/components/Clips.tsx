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
}

const Clips = ({ clips, setClips, searchForm }: Props) => {
  const [multiSelectEnabled, setMultiSelectEnabled] = useState(false);
  const [selectionMode, setSelectionMode] = useState(0);
  const [selected, setSelected] = useState<boolean[]>([]);

  useEffect(() => {
    setSelected([...Array(clips.length).fill(false)]);
  }, [multiSelectEnabled, selectionMode]);
  return (
    <>
      <ClipsForm
        multiSelectEnabled={multiSelectEnabled}
        setMultiSelectEnabled={setMultiSelectEnabled}
        selectionMode={selectionMode}
        setSelectionMode={setSelectionMode}
      ></ClipsForm>
      <ClipsGrid
        clips={clips}
        setClips={setClips}
        searchForm={searchForm}
        multiSelectEnabled={multiSelectEnabled}
        selectionMode={selectionMode}
        selected={selected}
        setSelected={setSelected}
      ></ClipsGrid>
    </>
  );
};

export default Clips;
