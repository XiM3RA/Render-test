const NewEntry = ({
  onSubmit,
  nameValue,
  changeName,
  numbValue,
  changeNumb,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        name:{" "}
        <input
          id="fname"
          name="fname"
          value={nameValue}
          onChange={changeName}
        />
      </div>
      <div>
        number:{" "}
        <input
          id="number"
          name="number"
          value={numbValue}
          onChange={changeNumb}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default NewEntry;
