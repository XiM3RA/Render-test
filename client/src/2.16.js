import { useState, useEffect } from "react";
import Note from "./components/Note";
import Filter from "./components/Filter";
import NewEntry from "./components/NewEntry";
import noteService from "./services/notes.js";

const App = () => {
  /*  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456", id: 1 },
    { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
    { name: "Dan Abramov", number: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
  ]); */
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumb, setNewNumb] = useState("");
  const [searchFunc, setSearchFunc] = useState("");

  useEffect(() => {
    noteService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  // const namesToShow = persons
  const namesToShow =
    searchFunc === ""
      ? persons
      : persons.filter((name) =>
          name.name.toLowerCase().includes(searchFunc.toLowerCase())
        );

  const addName = (event) => {
    event.preventDefault();
    const noteObject = {
      name: newName,
      number: newNumb,
      id: persons.length + 1,
    };
    if (persons.some((e) => e.name === newName)) {
      window.alert(`${newName} is already added to phonebook`);
      setNewName("");
    } else {
      noteService.create(noteObject).then((returnedNote) => {
        setPersons(persons.concat(noteObject));
        setNewName("");
        setNewNumb("");
      });
    }
  };

  const handleNoteChange = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value);
  };

  const handleNumbChange = (event) => {
    console.log(event.target.value);
    setNewNumb(event.target.value);
  };

  const handleSearchFunc = (event) => {
    setSearchFunc(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={searchFunc} onChange={handleSearchFunc} />
      <h2>Add new entry</h2>
      <NewEntry
        onSubmit={addName}
        nameValue={newName}
        changeName={handleNoteChange}
        numbValue={newNumb}
        changeNumb={handleNumbChange}
      />
      <h2>Numbers</h2>
      {namesToShow.map((name) => (
        <Note key={name.id} name={name.name} number={name.number} />
      ))}
    </div>
  );
};

export default App;
