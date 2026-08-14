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
        tests: []
      },
      null,
      2
    )
  );
}

function readData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function saveData(data) {
  fs.writeFileSync(
    DATA_FILE,
    JSON.stringify(data, null, 2)
  );
}

app.use(express.json({ limit: "2mb" }));

app.use(express.static(
  path.join(__dirname, "public")
));


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
    process.env.ADMIN_PASS || "change-me";

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

  data.mcqs =
    data.mcqs.filter(
      q => q.id !== req.params.id
    );

  data.tests =
    data.tests.map(test => {

      test.questionIds =
        (test.questionIds || [])
        .filter(
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

  data.tests =
    data.tests.filter(
      test => test.id !== req.params.id
    );

  saveData(data);

  res.json({
    ok: true,
    message: "Test deleted"
  });

});


// START SERVER
app.listen(
  PORT,
  "0.0.0.0",
  () => {

    console.log(
      "KM CLASSES server running on port " +
      PORT
    );

  }
);  const d=read(); n.id=Date.now().toString(); d.notes.push(n); write(d); res.json(n);
});
app.delete("/api/notes/:id",(req,res)=>{
  const d=read(); d.notes=d.notes.filter(n=>n.id!==req.params.id); write(d); res.json({ok:true});
});
app.listen(PORT,()=>console.log(`KM CLASSES running on http://localhost:${PORT}`));
