const socket = io();

const form = document.getElementById('form-agregar');
const lista = document.getElementById('productos-lista');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const producto = Object.fromEntries(formData.entries());
  producto.price = parseFloat(producto.price);
  producto.stock = parseInt(producto.stock);

  socket.emit('nuevoProducto', producto);
  form.reset();
});

socket.on('productosActualizados', (productos) => {
  lista.innerHTML = '';
  productos.forEach(p => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${p.title}</strong> - $${p.price} <br>
      ${p.description} <br>
      <img src="${p.thumbnail}" width="100" />
    `;
    lista.appendChild(li);
  });
});
