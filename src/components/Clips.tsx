import { useState } from "react";
import { data } from "../services/TwitchAPIdump";
import ClipsForm from "./ClipsForm";
import ClipsGrid from "./ClipsGrid";

const Clips = () => {
  const [multiSelectEnabled, setMultiSelectEnabled] = useState(false);
  const [selectionMode, setSelectionMode] = useState(0);
  const [selected, setSelected] = useState<boolean[]>([]);
  return (
    <>
      <ClipsForm
        multiSelectEnabled={multiSelectEnabled}
        setMultiSelectEnabled={setMultiSelectEnabled}
        selectionMode={selectionMode}
        setSelectionMode={setSelectionMode}
      ></ClipsForm>
      <ClipsGrid
        clips={data}
        multiSelectEnabled={multiSelectEnabled}
        selectionMode={selectionMode}
        selected={selected}
        setSelected={setSelected}
      ></ClipsGrid>
    </>
  );
};

export default Clips;
