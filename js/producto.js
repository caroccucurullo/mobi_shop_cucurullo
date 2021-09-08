//DECLARACIÓN DE CLASE PRODUCTO
class Mueble {
    constructor(id, nombre, img, categoria, material, medidas, precio, cantidad) {
        this.id = parseInt(id);
        this.nombre = nombre;
        this.img = img; 
        this.categoria = categoria;
        this.material = material;
        this.medidas = medidas;
        this.precio = parseFloat(precio);
        this.cantidad = cantidad || 1;
    }

    agregarCantidad(valor){
        this.cantidad += valor; 
    }

    subtotal() {
        return this.cantidad * this.precio;
    }
}