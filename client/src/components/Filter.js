const Filter = ({ value, onChange }) => {
  return (
    <form>
      <div>
        filter by name{" "}
        <input id="filter" name="filter" value={value} onChange={onChange} />
      </div>
    </form>
  );
};

export default Filter;
