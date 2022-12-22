import { faker } from '@faker-js/faker/locale/es_MX';

function generarProductoFake() {
    return {
        nombre: faker.commerce.product(),
        precio: faker.commerce.price(),
        thumbnail: faker.image.food(300, 300, true),
    };
}

export default generarProductoFake;
