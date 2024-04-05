const express = require('express')
/* const app = express() */
const cluster = require('cluster')
const os = require('os')

const cpuInfo = os.cpus()

/* cluster.on('') */

const numeroDeProcesadores = cpuInfo.length
/* console.log(numeroDeProcesadores) */

if (cluster.isPrimary) {
    console.log("proceso primario, generando proceso trabajador");

    for (let i = 0; i < numeroDeProcesadores; i++) {
        cluster.fork()
    }

} else {
    console.log("Al ser un proceso forkeado, no cuento como primario, por lo tanto isPrimary=false. Entonces soy un worker!");
    console.log(`Me presento, soy un proceso worker con el id : ${process.pid}`);

    const app = express()

    app.get("/", (req, res) => {
        res.send({ status: "success", messagge: "Peticion atendida por un proceso worker" })
    })

    app.get('/operacionsencilla', (req, res) => {
        let sum = 0
        for (let i = 0; i < 1000000; i++) {
            sum += i
        }
        res.send({ status: 'successs', message: `El worker ${process.pid} ha atendido esta peticion, el resultado es ${sum}` })
    })

    app.get('/operacioncompleja', (req, res) => {
        let sum = 0
        for (let i = 0; i < 5e8; i++) {
            sum += i
        }
        res.send({ status: 'successs', message: `El worker ${process.pid} ha atendido esta peticion, el resultado es ${sum}` })
    })

    app.listen(8080, () => console.log("Listening on 8080"))
}


/* app.use(express.json()) */
/* app.listen(8080, console.log('Server online on port 8080')) */

/* 
app.get('/', (req, res) => {
    res.send('Hello world')
}) */




