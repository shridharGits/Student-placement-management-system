const express = require('express')
require('./mongoose')
// const mongodb = require('mongodb')
const hbs = require('hbs')
const port = process.env.port || 3000
const User = require('./employeesModel')
const path = require('path')
const bodyParser = require('body-parser')

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json())
// app.use(employeeapp)

const publicDirectoryPath = path.join(__dirname, './public')
const viewsPath = path.join(__dirname, './templates/views')
const partialsPath = path.join(__dirname, './templates/partials')

app.set('view engine', 'hbs')
app.set('views', viewsPath)
app.use(express.static(publicDirectoryPath))
hbs.registerPartials(partialsPath)

// home page
app.get('', (req, res)=>{ 
   res.render('index', {})
})

// user form
app.get('/createUser', (req, res)=>{
    try{
        res.render('createUser', {})
    }
    catch(e){
        res.render('404', {})
    }
})

// to create user
app.post('/createUser/create', async(req, res)=>{
    try{

        const user = new User(req.body)
        user.name = req.body.name;
        await user.save()
        res.render('create', {
            name: user.name,
            email: user.email,
            age: user.age,
            cgpa: user.cgpa,
            password: user.password,
            id: user.id
        })
    }
    catch(e){
        res.status(500).send()
        console.log(e);
    }
})

// to read all users
app.get('/users/read', async(req, res)=>{
    try{
        const user = await User.find({});
        res.send(user);
    }
    catch(e){
        res.status(500).send()
    }
})

// to read single user
app.get('/users/read/:id', async(req, res)=>{
    const id = req.params.id;
    try{
        const user = await User.findOne({_id: id})

        if (!user){
            return res.status(404).send()
        }

        res.send(user);
    }
    catch(e){
        res.status(500).send()
    }
}) 

// to edit user
app.patch('/users/edit/:id', async(req, res)=>{
    const id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'age', 'password', 'cgpa']
    const isValidOperation = updates.every((update)=>{
        return allowedUpdates.includes(update)
    })
    if (!isValidOperation){
        res.status(400).send({error: 'invalid updates'})
    }
    try{
        const user = await User.findOne({_id: id})

        if (!user){
            return res.status(404).send()
        }

        updates.forEach((update)=>{
            user[update] = req.body[update]
        })

        await user.save();
        res.status(200).send(user)
    }
    catch(e){
        res.status(500).send()
    }
})

// to delete user by id
app.delete('/users/delete/:id', async(req, res)=>{
    const id  = req.params.id
    try{
        const user = await User.findByIdAndDelete({_id: id})

        if (!user){
            return res.status(404).send()
        }

        res.send(user)
    }
    catch(e){
        res.status(500).send()
    }
})

app.listen(port, ()=>{
    console.log(`Server is running on ${port}`);
})
