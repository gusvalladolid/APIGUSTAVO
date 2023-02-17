const express = require('express');
const app = express();
const cors = require('cors');
const conf = require('./config'); 
const sql = require('mssql');
const bodyparser  = require('body-parser');
const bcrypt = require('bcrypt'); 




app.use(cors());
app.use(bodyparser());
app.all('*', function(res, req, next){

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
} );

async function sql_run(req, res, command){ 
    const pool = new sql.ConnectionPool(conf.databases[0]);
    pool.on('error', err => {
        console.log(err)
    });
    //pool.on("success", succ => {console.log(succ)})
    try{
        await pool.connect();
        let result = await pool.request().query(command);
        return {
            'success': result
        };
    }
    catch(err){
        console.log(err);
        
    }
    finally{
        pool.close();
    }
}

app.post('/insert', async(req, res)=>{
    let body = req.body;
    const hashPass = bcrypt.hash(body.pass, 10, async(err, hash)=>{
    const command = `INSERT INTO users(username, pass, email) VALUES ('${body.username}', '${hash}', '${body.email}')`;
        return await sql_run(req, res, command)
    }) 
    return res.send("si se envio");
})  

app.delete('/delete/:id', async(req, res) => {
    const command = `delete from users where id = ${req.params.id}`;
    await sql_run(req, res, command);
    return res.send("si se elimino");  
})

app.get('/get/:id', async(req, res) =>{
    const command = `select * from users where id = ${req.params.id};`;
    const result = await sql_run(req, res, command);
    return res.send(result.success.recordsets[0]);  
})

app.put('/update/:id', async(req, res) => {
    let body = req.body;
    const command = `update users set username='${body.username}', email='${body.email}' where id = ${req.params.id}`;
    await sql_run(req, res, command);
    return res.send("se se actualizo");
})

app.post('/register', async(req, res) =>{
    let body = req.body;
    bcrypt.hash(body.pass, 10, async function(err, hash){
        let command = `INSERT INTO users(username, pass, email) VALUES ('${body.username}', '${hash}', '${body.email}')`; 
        await sql_run(req, res, command);
    })
    return res.send('Se encrypto la contra')
})

app.post('/login', async(req,res) =>{
    let body = req.body
    const command =  `getUser '${body.email}'`;
    const userPassword = body.pass
    const result = await sql_run(req, res, command);
    const hashedPassword = result.success.recordset[0].pass
    const comp = await bcrypt.compare(userPassword, hashedPassword);
    console.log(comp)
    return res.send(comp)
})

const port = 3030 
app.listen(port, ()=>{

    console.log(`App is running on port: ${port}`);

});

