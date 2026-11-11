import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL + 'producto';

class ProductoService {
  getProductos() {
    return axios.get(BASE_URL);
  }

  getProductoById(productoId) {
    return axios.get(BASE_URL + '/get/' + productoId);
  }

  getCategorias() {
    return axios.get(BASE_URL + '/categorias');
  }

  createProducto(producto) {
    return axios.post(BASE_URL + '/create', producto);
  }

  updateProducto(productoId, producto) {
    return axios.post(BASE_URL + '/update/' + productoId, producto);
  }

  guardarImagen(productoId, imagen) {
    const datos = new FormData();
    datos.append('imagen', imagen);

    return axios.post(
      BASE_URL + '/guardarImagen/' + productoId,
      datos
    );
  }

  deleteProducto(productoId) {
    return axios.delete(BASE_URL + '/delete/' + productoId);
  }
}

export default new ProductoService();
