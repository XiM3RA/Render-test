const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");

app.use(express.json());
app.use(cors());
app.use(express.static("build"));

/* Middleware morgan software, for displaying HTML requests on the console */
morgan.token("post", function (req) {
  if (req.method === "POST") return JSON.stringify(req.body);
  else return "";
});

morgan.format(
  "postFormat",
  ":method :url :status :res[content-length] - :response-time ms :post"
);

app.use(morgan("postFormat"));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122",
  },
  {
    id: 5,
    name: "New Person",
    number: "555-5555",
  },
];

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
  return Math.floor(Math.random() * (1000000000 - maxId) + maxId);
};

app.get("/info", (req, res) => {
  res.send(`<p>Phonebook has info for ${persons.length}  people</p>
              <p>${new Date()}</p>`);
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number missing",
    });
  }

  if (persons.filter((i) => i.name == body.name).length > 0) {
    return response.status(400).json({
      error: "name already listed",
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);
  response.json(person);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

//app.delete("/api/persons/", (request, response) => {
//  const body = request.body;
//  if (body.id) {
//    let temp = persons.filter((i) => i.id != body.id);
//    persons = temp;
//    response.json(temp);
//  } else {
//    response.status(404).json({ error: "invalid id" });
//  }
//});
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  if (id) {
    let temp = persons.filter((i) => i.id != id);
    persons = temp;
    response.json(temp);
  } else {
    response.status(404).json({ error: "invalid id" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
