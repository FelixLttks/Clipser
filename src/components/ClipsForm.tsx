import ButtonGroup from "./ButtonGroup";

interface Props {
  multiSelectEnabled: boolean;
  setMultiSelectEnabled: (
    value: boolean | ((prevVar: boolean) => boolean)
  ) => void;
  selectionMode: number;
  setSelectionMode: (value: number | ((prevVar: number) => number)) => void;
}

const ClipsForm = ({
  multiSelectEnabled,
  setMultiSelectEnabled,
  selectionMode,
  setSelectionMode,
}: Props) => {
  return (
    <div className="row align-items-center m-3">
      <hr className="col m-0 me-3 mt-3"></hr>
      {multiSelectEnabled && (
        <div className="col-md-auto p-0 d-flex flex-column align-items-cente">
          <label className="form-label">Selection-Mode</label>
          <ButtonGroup
            items={["single", "end", "range"]}
            selected={selectionMode}
            onChange={(index) => setSelectionMode(index)}
          ></ButtonGroup>
        </div>
      )}
      <div className="col-md-auto p-0 d-flex flex-column align-items-cente">
        <label className="form-label">Mode</label>
        <ButtonGroup
          items={["multiselect", "direct select"]}
          selected={multiSelectEnabled ? 0 : 1}
          onChange={(index) => setMultiSelectEnabled(index != 1)}
        ></ButtonGroup>
      </div>
    </div>
  );
};

export default ClipsForm;
