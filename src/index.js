const initialData = require("./InitialData")


const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 8080
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// your code goes here

app.get('/api/student',(req,res)=>{
    res.send(initialData);
})

app.get("/api/student/:id",(req,res)=>{
    const student = initialData.find(s => s.id === parseInt(req.params.id))
    if(!student) return res.status(404).send("Invalid id")
    res.send(student);
})

app.post("/api/student",(req,res) => {

    if(!req.body.name && !req.body.currentClass && !req.body.division){
        return res.status(400).send("enter valid details");
    }
    const student = {
        id : initialData.length+1,
        name : req.body.name,
        currentClass : parseInt(req.body.currentClass),
        division : req.body.division
    }
    initialData.push(student)
    res.set('content-type','application/json').send({id : student.id})
})


app.put('/api/student/:id',(req,res)=>{
    const student = initialData.find(s => s.id === parseInt(req.params.id))
    if(!student) return res.status(400).send("Invalid id")

    // if(!req.body.name || !req.body.currentClass || !req.body.division){
    //     return res.status(400).send(result.error.details[0].message);
    // }
    if(req.body.name){
        student.name = req.body.name;

    }
    else if(req.body.currentClass){
        student.currentClass = parseInt(req.body.currentClass);
    }
    else if(req.body.division){
        student.division = req.body.division;
    }
    else if(req.body.name || req.body.currentClass || req.body.division ){
        student.name = req.body.name;
        student.currentClass = req.body.currentClass;
        student.division = req.body.division;
    }
    else{
        return res.status(400).send("Invalid Data");
    }
    
    res.set('content-type','application/json').send({name : `${student.name}`})

})

app.delete("/api/student/:id",(req,res)=>{
    const student = initialData.find(s => s.id === parseInt(req.params.id))
    if(!student) return res.status(404).send("Invalid id")

    const index = initialData.indexOf(student);
    initialData.splice(index,1);
    res.send("deleted")
})




app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;   