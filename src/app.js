import express from "express";
import ProductManager from "./controllers/ProductManager.js";

const app = express();
const PORT = 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const productManager = new ProductManager("./src/models/productos.json");

//Listar todos los productos

app.get("/api/products", async (req, res) => {
  try {
    const limit = req.query.limit;
    const productos = await productManager.getProducts();

    if (limit) {
      res.json(productos.slice(0, limit));
    } else {
      res.json(productos);
    }
  } catch (error) {
    console.log("Error al obtener los productos", error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

//Traer un solo producto por id:

app.get("/api/products/:pid", async (req, res) => {
  let id = req.params.pid;

  try {
    const producto = await productManager.getProductById(parseInt(id));
    if (!producto) {
      res.json({
        error: "Producto no encontrado",
      });
    } else {
      res.json(producto);
    }
  } catch (error) {
    console.log("Error al obtener el producto", error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

//Agregar un nuevo producto por post:

app.post("/api/products", async (req, res) => {
  const nuevoProducto = req.body;
 
  try {
    await productManager.addProduct(nuevoProducto);
    res.status(201).json({ message: "Producto agregado exitosamente" });
  } catch (error) {
    console.log("error al agregar un producto ", error);
    res.status(500).json({ error: "error del servidor" });
  }
});

//Actualizamos producto por id:

app.put("/api/products/:pid", async (req, res) => {
  let id = req.params.pid;
  const productoActualizado = req.body;

  try {
    await productManager.updateProduct(parseInt(id), productoActualizado);
    res.json({ message: "Producto actualizado correctamente" });
  } catch (error) {
    console.log("No pudimos actualizar, vamos a morir ", error);
    res.status(500).json({ error: "Error del server" });
  }
});

// Borrar producto
app.delete("/api/products/:pid", async (req, res) => {
  try {
    // Obtiene el ID de los parámetros de la solicitud
    let id = req.params.pid;

    // Llama al método deleteProduct del productManager para eliminar el producto
    await productManager.deleteProduct(parseInt(id));

    // Envia una respuesta JSON indicando que el producto se ha eliminado correctamente
    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    // En caso de error, imprime el error en la consola y envía una respuesta de error al cliente
    console.log("No pudimos eliminar el producto, ", error);
    res.status(500).json({ error: "Error del server" });
  }
});

app.listen(PORT);
