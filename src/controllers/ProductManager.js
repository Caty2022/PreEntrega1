import { promises as fs } from "fs";
const path = "./productos.json";

class ProductManager {
  constructor(path) {
    this.products = [];
    this.path = path;
  }

  static ultId = 0;

  async addProduct({
    title,
    description,
    price,
    image,
    code,
    stock,
    category,
    thumbnails,
  }) {
    if (!title || !description || !price || !image || !code || !stock) {
      return "Todos los campos son obligatorios";
    }

    // Validamos que el código sea único
    if (this.products.some((item) => item.code === code)) {
      return "El código debe ser único";
    }

    const newProduct = {
      id: ++ProductManager.ultId,
      title,
      description,
      price,
      image,
      code,
      stock,
      category,
      status: true,
      thumbnails: thumbnails || [],
    };

    // Lo agrego al array
    this.products.push(newProduct);

    // Acá, después de pushear el nuevo producto, tiene que guardar el array en el archivo.
    await this.guardarArchivo(this.products);
    // Retorna un mensaje indicando el éxito
    return "Producto agregado exitosamente";
  }

  async getProducts() {
    try {
      const arrayProductos = await this.leerArchivo();
      return arrayProductos;
    } catch (error) {
      console.error("Error al obtener los productos");
      return [];
    }
  }

  async getProductById(id) {
    try {
      const arrayProductos = await this.leerArchivo();
      const buscado = arrayProductos.find((item) => item.id === id);

      if (buscado) {
        return buscado;
      } else {
        return "Producto no encontrado";
      }
    } catch (error) {
      console.error("Error al buscar producto por ID");
    }
  }

  async updateProduct(id, updatedProduct) {
    try {
      const arrayProductos = await this.leerArchivo();
      const indice = arrayProductos.findIndex((item) => item.id === id);

      if (indice !== -1) {
        // Actualizar las propiedades del producto
        for (const key in updatedProduct) {
          // Verificar si la propiedad existe tanto en updatedProduct como en el objeto del array
          if (
            updatedProduct.hasOwnProperty(key) &&
            arrayProductos[indice].hasOwnProperty(key)
          ) {
            arrayProductos[indice][key] = updatedProduct[key];
          }
        }

        await this.guardarArchivo(arrayProductos);
        return "Producto actualizado correctamente";
      } else {
        return "Producto no encontrado";
      }
    } catch (error) {
      console.error("Error al actualizar producto");
    }
  }

  async deleteProduct(id) {
    try {
      const arrayProductos = await this.leerArchivo();
      const buscado = arrayProductos.find((item) => item.id === id);

      if (buscado) {
        await fs.writeFile(
          this.path,
          JSON.stringify(
            arrayProductos.filter((producto) => producto.id !== id),
            null,
            2
          )
        );
        return "Producto eliminado correctamente";
      } else {
        return "Producto no encontrado";
      }
    } catch (error) {
      console.error("Error al eliminar producto");
    }
  }

  async leerArchivo() {
    try {
      const respuesta = await fs.readFile(this.path, "utf-8");
      const arrayProductos = JSON.parse(respuesta);
      return arrayProductos;
    } catch (error) {
      return [];
    }
  }
  async guardarArchivo(arrayProductos) {
    try {
      await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2));
    } catch (error) {
      console.error("Error al guardar el archivo");
    }
  }
}



//Testing
//Se creará una instancia de la clase “ProductManager”
const productManager = new ProductManager(path);

//Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío []
//productManager.getProducts();

//Se llamará al método “addProduct” con los campos:
//title: “producto prueba”
//description:”Este es un producto prueba”
//price:200,
//image:”Sin imagen”
//code:”abc123”,
//stock:25
//productManager.addProduct({title:"Remera Mike", description:"Remera elaborada 100% en algodón pima, con cuello tipo t-shirt ",price:20000,image: "sin imagen", code:"abc123", stock:10, category:"Remera", status: true, thumbnails: []});
//productManager.addProduct({title: "Short Francis",description: "Short rayado para niño, con elástico en la cintura y cordón de algodón",price: 20800,image: "sin imagen",code: "abc124",stock: 15, category:"Short", status: true, thumbnails: []});
//productManager.addProduct({title: "Enterito Lix Dino",description: "Enterito de algodón pima estampado",price: 44500,image: "sin imagen",code: "abc125",stock: 8, category:"Pijama", status: true, thumbnails: []});
//productManager.addProduct({title: "Buzo Marley",description: "Buzo fabricado en waffle suave y de calidad",price: 40300,image: "sin imagen",code: "abc126",stock: 15, category:"Sweaters", status: true, thumbnails: []});
//productManager.addProduct({title: "Vestido Camile",description: "Vestido bretelero confeccionado en muselina de algodón ",price: 38900,image: "sin imagen",code: "abc127",stock: 15, category:"Vestidos", status: true, thumbnails: []});
//productManager.addProduct({title: "Body Fun",description: "Body estampado elaborado en algodón.",price: 19700,image: "sin imagen",code: "abc128",stock: 15, category:"Bodies", status: true, thumbnails: []});
//productManager.addProduct({title: "Boxer",description: "Bóxers confeccionados en suave algodón pima",price: 20800,image: "sin imagen",code: "abc129",stock: 15, category:"Ropa interior", status: true, thumbnails: []});
//productManager.addProduct({title: "Zueco Humms",description: "Zueco Humms Beach",price: 18000,image: "sin imagen",code: "abc130",stock: 15, category:"Calzado", status: true, thumbnails: []});
//productManager.addProduct({title: "Colonia Baby",description: "Colonia para bebes en frasco de vidrio con vaporizador",price: 21800,image: "sin imagen",code: "abc131",stock: 15, category:"Perfume", status: true, thumbnails: []});
//productManager.addProduct({title: "Manta Sol",description: "Manta de algodón pima",price: 44000,image: "sin imagen",code: "abc132",stock: 10, category:"Manta", status: true, thumbnails: []});

//4)El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE
//5)Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado
console.log(await productManager.getProducts());

//Se llamará al método “getProductById” y se corroborará que devuelva el producto con el id especificado, en caso de no existir, debe arrojar un error.
//console.log(await productManager.getProductById(4));

//Se llamará al método “updateProduct” y se intentará cambiar un campo de algún producto, se evaluará que no se elimine el id y que sí se haya hecho la actualización.
//productManager.updateProduct(1,{title: "remera"});

//Se llamará al método “deleteProduct”, se evaluará que realmente se elimine el producto o que arroje un error en caso de no existir.
//console.log( await productManager.deleteProduct(1));
export default ProductManager;