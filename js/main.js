//TIENDA DE MUEBLES

//FUNCION QUE SE EJECUTA CUANDO SE CARGA EL DOM
$(document).ready(function () {
    if ("CARRITO" in localStorage) {
        const arrayLiterales = JSON.parse(localStorage.getItem("CARRITO"));
        if (arrayLiterales.length > 0) {
            for (const literal of arrayLiterales) {
                carrito.push(new Mueble(literal.id,
                    literal.nombre,
                    literal.img,
                    literal.categoria,
                    literal.material,
                    literal.medidas,
                    literal.precio,
                    literal.cantidad));
            }
            carritoUI(carrito);
        }
    }
    $(".offcanvas").click(function (e) {
        e.stopPropagation();
    });

    $.get(GETPLOCAL, function (datos, estado) {
        console.log(datos);
        console.log(estado);
        if (estado == 'success') {
            for (const literal of datos) {
                muebles.push(new Mueble(literal.id,
                    literal.nombre,
                    literal.img,
                    literal.categoria,
                    literal.material,
                    literal.medidas,
                    literal.precio,
                    literal.cantidad));
            }
        }
        console.log(muebles);
        mueblesUI(muebles, '#mueblesContenedor');
        console.dir($('#mueblesContenedor'));
        
        
    });
});

window.addEventListener('load', () => {
    $('#mueblesContenedor').fadeIn("slow");
})

//FILTRO POR CATEGORIA
selectUI(categorias, "#filtroCategorias");
$('#filtroCategorias').click(function (e) {
    const value = e.target.innerHTML;
    console.log(e.target.innerHTML);
    console.log(e);
    $('#mueblesContenedor').fadeOut(600, function () {
        if (value == 'TODOS') {
            mueblesUI(muebles, '#mueblesContenedor');
        } else {
            const filtrados = muebles.filter(mueble => mueble.categoria == value);
            mueblesUI(filtrados, '#mueblesContenedor');
        }
        $('#mueblesContenedor').fadeIn();
    });
});

//BUSQUEDA DE PRODUCTOS
$("#busquedaProducto").keyup(function (e) {
    const criterio = this.value.toUpperCase();
    console.log(criterio);
    if (criterio != "") {
        const encontrados = muebles.filter(p => p.nombre.includes(criterio.toUpperCase()) 
                                            || p.categoria.includes(criterio.toUpperCase()));
        mueblesUI(encontrados, '#mueblesContenedor');
    }
});

//TEXTO ANIMADO DE INICIO
$("#textoAnimado").animate({
    margin: '30px',
    opacity: 0.4,
    fontSize: "2em",
    width: 1000
}, 3000).delay(2000).slideUp(2000);