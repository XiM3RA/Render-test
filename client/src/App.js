import { useState, useEffect } from "react";
import Note from "./components/Note";
import Filter from "./components/Filter";
import NewEntry from "./components/NewEntry";
import noteService from "./services/notes.js";
import Notification from "./services/Notification.js";
import "./index.css";

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
  const [errorMessage, setErrorMessage] = useState(null);

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
    let temp;
    event.preventDefault();
    const noteObject = {
      name: newName,
      phoneNumber: newNumb,
    };
    if (persons.some((e) => e.name === newName)) {
      window.alert(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      );
      const target = persons.filter((person) => person.name === newName);
      noteService.update(target[0].id, noteObject).then((returnedNote) => {
        noteService.getAll().then((initialPersons) => {
          setPersons(initialPersons);
          setErrorMessage(`Updated ${newName}`);
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
        });
      });
      setNewName("");
      setNewNumb("");
    } else {
      noteService.create(noteObject).then((returnedNote) => {
        const newPersons = persons.concat(returnedNote);
        setPersons(newPersons);
        setNewName("");
        setNewNumb("");
        setErrorMessage(`Updated ${newName}`);
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      })
        .catch(error => {
            setErrorMessage(`${error.response.data.error}`);
            setTimeout(() => {
                setErrorMessage(null);
            }, 5000)
        })
       
    }
  };

  const removeName = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      noteService.removeEntry(id).then((reponse) => {
        const updatedPersons = persons.filter((person) => person.id !== id);
        setPersons(updatedPersons);
        setErrorMessage(`Removed ${name}`);
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
    }
  };

  const handleNoteChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumbChange = (event) => {
    setNewNumb(event.target.value);
  };

  const handleSearchFunc = (event) => {
    setSearchFunc(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} />
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
      <Note personsToShow={namesToShow} remove={removeName} />
    </div>
  );
};

export default App;
