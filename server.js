const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_FILE = path.join(__dirname, "data.json");

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(
    DATA_FILE,
    JSON.stringify(
      {
        mcqs: [],
        tests: [],
        notes: []
      },
      null,
      2
    )
  );
}

function readData() {
  const data = JSON.parse(
    fs.readFileSync(DATA_FILE, "utf8")
  );

  if (!Array.isArray(data.mcqs)) data.mcqs = [];
  if (!Array.isArray(data.tests)) data.tests = [];
  if (!Array.isArray(data.notes)) data.notes = [];

  return data;
}

function saveData(data) {
  fs.writeFileSync(
    DATA_FILE,
    JSON.stringify(data, null, 2)
  );
}

app.use(express.json({ limit: "2mb" }));

app.use(
  express.static(path.join(__dirname, "public"))
);


// HOME
app.get("/", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public", "index.html")
  );
});


// GET ALL CONTENT
app.get("/api/content", (req, res) => {
  const data = readData();
  res.json(data);
});


// ADMIN LOGIN
app.post("/api/admin/login", (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  const correctUsername =
    process.env.ADMIN_USER || "admin";

  const correctPassword =
    process.env.ADMIN_PASS || "1234";

  if (
    username === correctUsername &&
    password === correctPassword
  ) {
    return res.json({
      ok: true,
      message: "Login successful"
    });
  }

  res.status(401).json({
    ok: false,
    message: "Invalid username or password"
  });
});


// ADD MCQ
app.post("/api/mcqs", (req, res) => {

  const data = readData();
  const mcq = req.body;

  if (
    !mcq.exam ||
    !mcq.subject ||
    !mcq.question ||
    !mcq.a ||
    !mcq.b ||
    !mcq.c ||
    !mcq.d ||
    !mcq.answer
  ) {
    return res.status(400).json({
      error: "Please fill all required fields"
    });
  }

  mcq.id = Date.now().toString();

  data.mcqs.push(mcq);

  saveData(data);

  res.json({
    ok: true,
    message: "MCQ saved successfully",
    mcq: mcq
  });
});


// DELETE MCQ
app.delete("/api/mcqs/:id", (req, res) => {

  const data = readData();

  data.mcqs = data.mcqs.filter(
    q => q.id !== req.params.id
  );

  data.tests = data.tests.map(test => {

    test.questionIds =
      (test.questionIds || []).filter(
        id => id !== req.params.id
      );

    return test;
  });

  saveData(data);

  res.json({
    ok: true,
    message: "MCQ deleted"
  });
});


// CREATE TEST
app.post("/api/tests", (req, res) => {

  const data = readData();
  const test = req.body;

  if (
    !test.title ||
    !test.exam ||
    !test.subject ||
    !Array.isArray(test.questionIds) ||
    test.questionIds.length === 0
  ) {
    return res.status(400).json({
      error:
        "Test title, exam, subject and questions are required"
    });
  }

  test.id = Date.now().toString();

  data.tests.push(test);

  saveData(data);

  res.json({
    ok: true,
    message: "Test created successfully",
    test: test
  });
});


// DELETE TEST
app.delete("/api/tests/:id", (req, res) => {

  const data = readData();

  data.tests = data.tests.filter(
    test => test.id !== req.params.id
  );

  saveData(data);

  res.json({
    ok: true,
    message: "Test deleted"
  });
});


// ADD NOTE
app.post("/api/notes", (req, res) => {

  const data = readData();
  const note = req.body;

  if (!note.title || !note.content) {
    return res.status(400).json({
      error: "Note title and content are required"
    });
  }

  note.id = Date.now().toString();

  data.notes.push(note);

  saveData(data);

  res.json({
    ok: true,
    message: "Note saved successfully",
    note: note
  });
});


// DELETE NOTE
app.delete("/api/notes/:id", (req, res) => {

  const data = readData();

  data.notes = data.notes.filter(
    note => note.id !== req.params.id
  );

  saveData(data);

  res.json({
    ok: true,
    message: "Note deleted"
  });
});


// START SERVER
app.listen(
  PORT,
  "0.0.0.0",
  () => {
    console.log(
      "KM CLASSES server running on port " + PORT
    );
  }
);
