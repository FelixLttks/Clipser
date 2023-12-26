interface Props {
  items: string[];
  selected: number;
  onChange: (index: number) => void;
}

const ButtonGroup = ({ items, selected, onChange }: Props) => {
  return (
    <div
      className="btn-group me-2 flex-wrap"
      role="group"
      data-toggle="buttons"
      id="btn-group"
    >
      {items.map((item, index) => (
        <button
          key={index}
          type="button"
          className={
            selected === index
              ? "btn btn-outline-secondary active"
              : "btn btn-outline-secondary"
          }
          onClick={() => onChange(index)}
        >
          {item}
        </button>
      ))}
    </div>
  );
};

export default ButtonGroup;
