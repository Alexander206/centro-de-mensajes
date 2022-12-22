// Importando dependencias
import fs from 'fs';
import path from 'path';
import { schema, normalize, denormalize } from 'normalizr';
import util from 'util';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class chatdb {
    constructor() {
        this.archivo = path.join(__dirname, './chat.json');
    }

    leerArchivo() {
        try {
            const data = fs.readFileSync(this.archivo, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.log('No se puede leer el archivo', error.message);
        }
    }

    verificarExistencia() {
        return this.leerArchivo().mensajes.length > 0;
    }

    // Método que obtiene todos los objetos

    async listarTodos() {
        try {
            if (this.verificarExistencia()) {
                let data = await this.leerArchivo();
                return normalizacion(data);
            } else {
                return { error: 'el archivo está vacio' };
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    // Método que crea un nuevo objeto

    async nuevo(objeto) {
        try {
            let data = await this.leerArchivo();
            const nuevoObjeto = {
                id: data.mensajes.length + 1,
                ...objeto,
            };
            data.mensajes.push(nuevoObjeto);
            fs.writeFileSync(this.archivo, JSON.stringify(data, '', 4), 'utf-8');
            return data[data.length - 1].id;
        } catch (error) {
            return { error: `No se pudo crear el objeto: ${error.message}` };
        }
    }
}

// Normalización y desnormalización

function normalizacion(archivo) {
    const autorScheme = new schema.Entity('author', {}, { idAttribute: 'id' });
    const mensajeScheme = new schema.Entity('mensajes', {
        author: autorScheme,
    });

    const mensajesScheme = new schema.Entity('mensajes', {
        mensajes: [mensajeScheme],
    });

    const dataNormalize = normalize(archivo, mensajesScheme);
    return dataNormalize;
}

export default chatdb;
