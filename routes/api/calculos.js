process.on('message', function (message) {
    console.log(`Message from app.js: ${message}`);
});

let count = parseInt(process.argv[2]);

console.log('numero', count);

function calculo(cantidad) {
    const numeros = [];
    const generador = (inicio, fin) => Math.floor(Math.random() * (fin - inicio + 1) + inicio);

    for (let i = 1; i <= cantidad; i++) {
        const num = generador(1, 1000);
        let numerito = { indice: i, valor: num };
        numeros.push(numerito);
    }

    return numeros;
}

console.log(calculo(count));

process.send(calculo(count));
