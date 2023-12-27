interface Props {
  type: string;
  defaultValue?: string;
  onChange: (value: string) => void;
}

const DateInput = ({ type, defaultValue, onChange }: Props) => {
  return (
    <input
      id="dateInput"
      className="form-control"
      type={type}
      defaultValue={defaultValue}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default DateInput;
