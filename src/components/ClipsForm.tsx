import ButtonGroup from "./ButtonGroup";
import { Tooltip } from "./Tooltip";

interface Props {
  multiSelectEnabled: boolean;
  setMultiSelectEnabled: (
    value: boolean | ((prevVar: boolean) => boolean)
  ) => void;
  selectionMode: number;
  setSelectionMode: (value: number | ((prevVar: number) => number)) => void;
  openInVODMode: boolean;
  setOpenInVODMode: (value: boolean | ((prevVar: boolean) => boolean)) => void;
  onOpenSelectedClick: () => void;
  selectionCount: number;
}

const ClipsForm = ({
  multiSelectEnabled,
  setMultiSelectEnabled,
  selectionMode,
  setSelectionMode,
  openInVODMode,
  setOpenInVODMode,
  onOpenSelectedClick,
  selectionCount,
}: Props) => {
  return (
    <div className="row align-items-center m-3">
      <hr className="col m-0 me-3 mt-3"></hr>

      {multiSelectEnabled && (
        <>
          <div className="col-md-auto align-self-end">
            <Tooltip text="Pop-ups and redirects must be enabled for this site for this feature to work.">
              <button
                type="button"
                className="btn btn-primary"
                onClick={onOpenSelectedClick}
              >
                Open {selectionCount} Selected
              </button>
            </Tooltip>
          </div>
          <div className="col-md-auto p-0 d-flex flex-column align-items-cente">
            <label className="form-label">Selection-Mode</label>
            <ButtonGroup
              items={["single", "end", "range"]}
              selected={selectionMode}
              onChange={(index) => setSelectionMode(index)}
            ></ButtonGroup>
          </div>
        </>
      )}

      <div className="col-md-auto p-0 d-flex flex-column align-items-cente">
        <label className="form-label">Mode</label>
        <ButtonGroup
          items={["multiselect", "direct select"]}
          selected={multiSelectEnabled ? 0 : 1}
          onChange={(index) => setMultiSelectEnabled(index != 1)}
        ></ButtonGroup>
      </div>

      <div className="col-md-auto p-0 d-flex flex-column align-items-cente">
        <label className="form-label">Open</label>
        <ButtonGroup
          items={["Clip", "VOD"]}
          selected={openInVODMode ? 1 : 0}
          onChange={(index) => setOpenInVODMode(index == 1)}
        ></ButtonGroup>
      </div>
    </div>
  );
};

export default ClipsForm;
