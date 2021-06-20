const initialData = require("./InitialData")


const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 8080
app.use(express.urlencoded());

const Joi = require('joi');

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

    const result = validateStudent(req.body);
    if(result.error){
        return res.status(400).send(result.error.details[0].message);
    }
    let count = 7

    const student = {
        id : ++count,
        name : req.body.name,
        currentClass : req.body.currentClass,
        division : req.body.division
    }
    initialData.push(student)
    res.set('content-type','application/json').send({id : `${student.id}`})
})


app.put('/api/student/:id',(req,res)=>{
    const student = initialData.find(s => s.id === parseInt(req.params.id))
    if(!student) return res.status(404).send("Invalid id")

    const result = validateStudent(req.body);
    if(result.error){
        return res.status(400).send(result.error.details[0].message);
    }

    student.name = req.body.name;
    student.currentClass = req.body.currentClass;
    student.division = req.body.division;

    res.set('content-type','application/json').send({name : `${student.name}`})

})

app.delete("/api/student/:id",(req,res)=>{
    const student = initialData.find(s => s.id === parseInt(req.params.id))
    if(!student) return res.status(404).send("Invalid id")

    const index = initialData.indexOf(student);
    initialData.splice(index,1);
    res.send("deleted")
})


function validateStudent(student){
    const schema = Joi.object({
        name: Joi.string().required(),
        currentClass: Joi.number().required(),
        division: Joi.string().required()
    })
    return schema.validate(student);
}



app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;   