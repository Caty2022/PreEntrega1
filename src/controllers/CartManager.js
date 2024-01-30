import { promises as fs } from "fs";
const cartsPath = ".src/models/carts.json";
const productsPath = ".src/models/productos.json";


class CartManager {
  constructor(cartsPath, productsPath) {
    this.carts = [];
    this.cartsPath = cartsPath;
    this.productsPath = productsPath;
  }

  async createCart() {
    this.carts = JSON.parse(await this.leerArchivo(this.cartsPath, "utf-8"));
    const newCart = { id: this.carts.length + 1, products: [] };
    this.carts.push(newCart);
    const writeCarts = JSON.stringify(this.carts);
    await this.guardarArchivo(this.cartsPath, writeCarts);
  }

  async getProductsFromCart(id) {
    this.carts = JSON.parse(await this.leerArchivo(this.cartsPath, "utf-8"));
    const cart = this.carts.find((cart) => cart.id === id);

    if (cart) {
      return cart.products;
    } else {
      return false;
    }
  }
  async addProductToCart(cid, pid) {
    this.carts = JSON.parse(await this.leerArchivo(this.cartsPath, "utf-8"));
    const cart = this.carts.find((cart) => cart.id === cid);

    const products = JSON.parse(
      await this.leerArchivo(this.productsPath, "utf-8")
    );
    const product = products.find((prod) => prod.id === pid);

    if (!product) {
      return false;
    }

    if (cart) {
      const productExist = cart.products.find((prod) => prod.id === pid);
      productExist
        ? productExist.quantity++
        : cart.products.push({ id: product.id, quantity: 1 });
      const writeCarts = JSON.stringify(this.carts);
      await this.guardarArchivo(this.cartsPath, writeCarts);
      return true;
    } else {
      return false;
    }
  }

  async guardarArchivo(path, arrayProductos) {
    try {
      await fs.writeFile(path, JSON.stringify(arrayProductos, null, 2));
    } catch (error) {
      console.error("Error al guardar el archivo");
    }
  }
  async leerArchivo(path) {
    try {
      const respuesta = await fs.readFile(path, "utf-8");
      if (respuesta.trim() === "") {
        return null; // Devuelve null en lugar de un array vacío
      }
      const arrayProductos = JSON.parse(respuesta);
      return arrayProductos;
    } catch (error) {
      console.error("Error al leer el archivo:", error.message);
      return null; // Devuelve null en caso de error
    }
  }
}

const cartManager = new CartManager(cartsPath, productsPath);
cartManager.createCart();


export default CartManager;