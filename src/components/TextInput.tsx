interface Props {
  children: string;
  groupText?: string;
  defaultValue?: string;
  name?: string;
  required?: boolean;
  autocomplete?: boolean;
}

const TextInput = ({
  children,
  groupText,
  defaultValue,
  name,
  required = false,
  autocomplete = true,
}: Props) => {
  return (
    <div className="input-group mb-3">
      {groupText != undefined && (
        <span className="input-group-text" id="twitchUrl">
          {groupText}
        </span>
      )}
      <input
        type="text"
        name={name}
        className="form-control"
        placeholder={children}
        aria-label={children}
        aria-describedby="basic-addon1"
        defaultValue={defaultValue}
        required={required}
        autoComplete={autocomplete ? "on" : "off"}
      ></input>
    </div>
  );
};

export default TextInput;
