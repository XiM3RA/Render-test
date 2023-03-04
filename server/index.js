const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const Entry = require("./models/entry");
app.use(cors());
//app.use(express.static("build"));
app.use(express.json());

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

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
  return Math.floor(Math.random() * (1000000000 - maxId) + maxId);
};

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

app.get("/info", (request, response, next) => {
  Entry.find({})
    .then((entries) => {
      response.send(
        `<p>Phonebook has info for ${
          entries.length
        } people</p><p>${new Date()}</p>`
      );
    })
    .catch((error) => next(error));
});

//app.post("/api/persons", (request, response, next) => {
//  const body = request.body;
//
//  if (!body.name || !body.phoneNumber) {
//    return response.status(400).json({
//      error: "name or number missing",
//    });
//  }
//  // Check if person already in DB
//  //  if (persons.filter((i) => i.name == body.name).length > 0) {
//  //    return response.status(400).json({
//  //      error: "name already listed",
//  //    });
//  //  }
//
//  const person = new Entry({
//    name: body.name,
//    phoneNumber: body.phoneNumber,
//  });
//
//  person.save().then((savedEntry) => {
//    response.json(savedEntry);
//  });
//});
app.post("/api/persons", (request, response, next) => {
  const { name, phoneNumber } = request.body;

  const person = new Entry({
    name: name,
    phoneNumber: phoneNumber,
  });

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error));
});

//app.get("/api/persons/:id", (request, response) => {
//  const id = Number(request.params.id);
//  const person = persons.find((person) => person.id === id);
//
//  if (person) {
//    response.json(person);
//  } else {
//    response.status(404).end();
//  }
//});

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
app.delete("/api/persons/:id", (request, response, next) => {
  Entry.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const { name, phoneNumber } = request.body;

  Entry.findByIdAndUpdate(
    request.params.id,
    { name, phoneNumber },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Define our error handling middleware
const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
      return response.status(400).json({ error: error.message })
  }

  next(error);
};
app.use(errorHandler);
