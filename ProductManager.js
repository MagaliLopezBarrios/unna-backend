const fs = require('fs');

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    static id = 0;

    async addProduct(product) {
        if (!product.title || !product.description || !product.code || !product.stock || !product.thumbnail || !product.price) {
            return console.error('Datos incompletos');
        }
        ProductManager.id++;
        const products = await this.getProducts();
        const newProduct = {
            title: product.title,
            description: product.description,
            code: product.code,
            stock: product.stock,
            thumbnail: product.thumbnail,
            price: product.price,
            id: ProductManager.id
        }

        products.push(newProduct);

        await fs.promises.writeFile(this.path, JSON.stringify(products), 'utf-8');

    }

    async getProducts() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            const products = JSON.parse(data);
            return products;

        } catch (error) {
            return [];

        }


    }

    async getProductById(id) {
        const products = await this.getProducts();
        const product = products.find(p => p.id === id);
        if (!product) {
            return console.error('Producto no encontrado');
        }

        return product;
    }

    async deleteProduct(id) {
        const products = await this.getProducts();
        const productsDeleted = products.filter(product => product.id !== id);
        await fs.promises.writeFile(this.path, JSON.stringify(products.productsDeleted), 'utf-8');
    }

    async updateProduct(id, productToUpdate) {
        const products = await this.getProducts();
        const updatedProducts = products.map(product => {
            if (product.id === id) {
                return {
                    ...product,
                    ...productToUpdate,
                    id
                }

            }
            return product;
        });

        await fs.promises.writeFile(this.path, JSON.stringify(updatedProducts), 'utf-8');
    }
}

const test = async () => {
    const productManager = new ProductManager('./products.json');
    await productManager.addProduct({
        title: 'Mochila Footy carro',
        description: 'Mochila carro 18 pulgadas Pop It Heart lila con luz',
        code: 3500,
        stock: 2,
        thumbnail: './footy.jpg',
        price: 600,

    });

    await productManager.addProduct({
        title: 'Mochila Disney Princesas',
        description: 'Mochila Disney 12 pulgadas',
        code: 2700,
        stock: 3,
        thumbnail: './disney.jpg',
        price: 300,

    });

    await productManager.addProduct({
        title: 'Mochila Gadnic para niños jardin',
        description: 'Mochila Gadnic Hipopotamo 35L',
        code: 1900,
        stock: 5,
        thumbnail: './gadnic.jpg',
        price: 150,

    });
}

test();





