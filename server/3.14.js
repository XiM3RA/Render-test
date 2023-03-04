const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

const Entry = require("./models/entry");
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
  /*  {
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
  }, */
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
  Entry.find({}).then((entries) => {
    res.json(entries);
  });
});

app.get("/api/persons/:id", (request, response, next) => {
    Entry.findById(request.params.id)
        .then((person) => {
            if (person) {
                response.json(person);
            } else {
                response.status(404).end();
            }
        })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  if (!body.name || !body.phoneNumber) {
    return response.status(400).json({
      error: "name or number missing",
    });
  }
  // Check if person already in DB
  //  if (persons.filter((i) => i.name == body.name).length > 0) {
  //    return response.status(400).json({
  //      error: "name already listed",
  //    });
  //  }

  const person = new Entry({
    name: body.name,
    phoneNumber: body.phoneNumber,
  });

  person.save().then((savedEntry) => {
    response.json(savedEntry);
  });
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

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unkown endpoint" });
};

const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === "CastError") {
        return response.status(400).send({ error: "malformed id" });
    } else if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message });
    }
    next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
