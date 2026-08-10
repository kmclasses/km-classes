const express=require("express");
const path=require("path");
const fs=require("fs");
const app=express();
const PORT=process.env.PORT||3000;
const DATA=path.join(__dirname,"data.json");
const ADMIN_USER=process.env.ADMIN_USER||"admin";
const ADMIN_PASS=process.env.ADMIN_PASS||"change-me";

if(!fs.existsSync(DATA)) fs.writeFileSync(DATA,JSON.stringify({
  mcqs:[],notes:[],classes:[]
},null,2));

app.use(express.json());
app.use(express.static(path.join(__dirname,"public")));

function read(){return JSON.parse(fs.readFileSync(DATA,"utf8"))}
function write(d){fs.writeFileSync(DATA,JSON.stringify(d,null,2))}

app.post("/api/admin/login",(req,res)=>{
  const {username,password}=req.body||{};
  if(username===ADMIN_USER && password===ADMIN_PASS) return res.json({ok:true});
  res.status(401).json({ok:false,message:"Invalid admin credentials"});
});
app.get("/api/content",(req,res)=>res.json(read()));

app.post("/api/mcqs",(req,res)=>{
  const q=req.body||{};
  if(!q.question||!q.a||!q.b||!q.c||!q.d||!q.answer) return res.status(400).json({message:"Required fields missing"});
  const d=read(); q.id=Date.now().toString(); d.mcqs.push(q); write(d); res.json(q);
});
app.delete("/api/mcqs/:id",(req,res)=>{
  const d=read(); d.mcqs=d.mcqs.filter(q=>q.id!==req.params.id); write(d); res.json({ok:true});
});
app.post("/api/notes",(req,res)=>{
  const n=req.body||{}; if(!n.title) return res.status(400).json({message:"Title required"});
  const d=read(); n.id=Date.now().toString(); d.notes.push(n); write(d); res.json(n);
});
app.delete("/api/notes/:id",(req,res)=>{
  const d=read(); d.notes=d.notes.filter(n=>n.id!==req.params.id); write(d); res.json({ok:true});
});
app.listen(PORT,()=>console.log(`KM CLASSES running on http://localhost:${PORT}`));
