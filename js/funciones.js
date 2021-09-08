//FUNCION PARA GENERAR LA INTERFAZ DE PRODUCTOS CON JQUERY
function mueblesUI(muebles, id) {
  $(id).empty()
  for (const mueble of muebles) {
    $(id).append(`<article class="col-md-4" data-aos="fade-up" data-aos-duration="1500">
                  <div class="card h-100 shadow rounded">
                  <img class="card-img-top w-100" src="${mueble.img}" alt="">
                  <div class="card-body">
                  <h6>${mueble.categoria}</h6>
                  <h5 class="fs-3">${mueble.nombre}</h5>
                  <p>${mueble.precio}.-</p>
                  <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button id='${mueble.id}' type="button" class="btn btn-outline-dark rounded btn-compra">Añadir al carrito</button>
                  </div>
                  </div>
                  </div>
                  </article>`);
  }
  $('.btn-compra').on("click", comprarMueble);
}

//MANEJADOR DE COMPRA DE PRODUCTOS
function comprarMueble(e) {
  e.preventDefault();
  e.stopPropagation();
  const idMueble = e.target.id;
  const seleccionado = carrito.find(mueble => mueble.id == idMueble);
  if (seleccionado == undefined) {
    carrito.push(muebles.find(mueble => mueble.id == idMueble));
  } else {
    seleccionado.agregarCantidad(1);
  }
  localStorage.setItem("CARRITO", JSON.stringify(carrito));
  carritoUI(carrito);
}

//FUNCION PARA RENDERIZAR LA INTERFAZ DEL CARRITO
function carritoUI(muebles) {
  $('#carritoCantidad').html(muebles.length);
  $('#carritoProductos').empty();
  for (const mueble of muebles) {
    $('#carritoProductos').append(registroCarrito(mueble));
  }
  $('#carritoProductos').append(`<p id="totalCarrito"> TOTAL ${totalCarrito(muebles)}</p>`);
  $('#carritoProductos').append('<div id="divConfirmar" class="text-center"><button id="btnConfimar" class="btn btn-dark rounded-pill">CONFIRMAR COMPRA</button></div>')
  $('.btn-delete').on('click', eliminarMueble);
  $('.btn-add').click(addCantidad);
  $('.btn-sub').click(subCantidad);
  $('#btnConfimar').click(confirmarCompra);
}

//FUNCION PARA GENERAR LA ESTRUCTURA DEL REGISTO HTML
function registroCarrito(mueble) {
  return `<p> ${mueble.nombre} 
          <span class="badge bg-dark"> ${mueble.precio}</span>
          <span class="badge bg-dark">${mueble.cantidad}</span>
          <span class="badge bg-dark"> $ ${mueble.subtotal()}</span>
          <a id="${mueble.id}" class="btn btn-secondary btn-sm rounded-circle btn-add">+</a>
          <a id="${mueble.id}" class="btn btn-secondary btn-sm rounded-circle btn-sub">-</a>
          <a id="${mueble.id}" class="btn btn-danger btn-sm rounded-circle btn-delete">x</a>
          </p>`
}

//ELIMINAR UN PRODUCTO DEL CARRITO
function eliminarMueble(e) {
  console.log(e.target.id);
  let posicion = carrito.findIndex(mueble => mueble.id == e.target.id);
  carrito.splice(posicion, 1);
  console.log(carrito);
  carritoUI(carrito);
  localStorage.setItem("CARRITO", JSON.stringify(carrito));
}

//AGREGAR CANTIDAD EN EL CARRITO
function addCantidad() {
  let mueble = carrito.find(p => p.id == this.id);
  mueble.agregarCantidad(1);
  $(this).parent().children()[1].innerHTML = mueble.cantidad;
  $(this).parent().children()[2].innerHTML = mueble.subtotal();
  $("#totalCarrito").html(`TOTAL ${totalCarrito(carrito)}`);
  localStorage.setItem("CARRITO", JSON.stringify(carrito));
}

//RESTAR CANTIDAD DEL CARRITO
function subCantidad() {
  let mueble = carrito.find(p => p.id == this.id);
  if (mueble.cantidad > 1) {
    mueble.agregarCantidad(-1);
    let registroUI = $(this).parent().children();
    registroUI[1].innerHTML = mueble.cantidad;
    registroUI[2].innerHTML = mueble.subtotal();
    $("#totalCarrito").html(`TOTAL ${totalCarrito(carrito)}`);
    localStorage.setItem("CARRITO", JSON.stringify(carrito));
  }
}

//PRECIO TOTAL DEL CARRITO
function totalCarrito(carrito) {
  console.log(carrito);
  let total = 0;
  carrito.forEach(p => total += p.subtotal());
  return total.toFixed(2);
}

//OPCIONES DE UN SELECT
function selectUI(categorias, boton) {
  $(boton).empty();
  categorias.forEach(element => {
    $(boton).append(`<button value='${element}' type="button" class="btn btn-outline-dark shadow rounded-pill">${element}</button>`)
  });
  $(boton).prepend(`<button value='TODOS' type="button" class="btn btn-outline-dark shadow rounded-pill">TODOS</button>`)
}

//FUNCION PARA ENVIAR AL BACKEND LA ORDEN DE PROCESAMIENTO DE COMPRA
function confirmarCompra() {
  $('#btnConfimar').hide();
  $('#divConfirmar').append(`<div class="spinner-border text-light" role="status">
  <span class="sr-only"></span>
</div>`);
  console.log("ENVIAR AL BACKEND");
  const URLPOST = 'https://jsonplaceholder.typicode.com/posts';
  const DATA = {
    muebles: JSON.stringify(carrito),
    total: totalCarrito(carrito)
  }
  $.post(URLPOST, DATA, function (respuesta, estado) {
    console.log(respuesta);
    console.log(estado);
    if (estado == 'success') {
      console.log(estado);
      $("#notificaciones").html(`<div class="card text-center border border-dark border-4 rounded-3" style="width: 30rem;">
      <img src="../img/shop/checked.png" class="card-img-top mx-auto w-50 pt-3" style="width: 200px;" alt="confirmación de compra">
      <div class="card-body w-auto">
      <p class="card-text h2">¡GRACIAS POR TU COMPRA!</p>
        <p class="card-text">Comprobante Nº ${respuesta.id}</p>
        <a href="#" class="btn btn-dark rounded-pill">PAGAR</a>
      </div>
    </div>`).fadeIn().delay(10000).fadeOut('');
      carrito.splice(0, carrito.length);
      localStorage.setItem("CARRITO", '[]');
      $('#carritoProductos').empty();
      $('#carritoCantidad').html(0);
    }
  });
}