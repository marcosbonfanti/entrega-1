const socket = io();

socket.on('connect', () => {
  console.log("Conectado al servidor Socket.IO");
});

socket.on('productosActualizados', (productos) => {
  console.log("🔄 productosActualizados recibido:", productos);

  const lista = document.getElementById('productos-lista');
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

const form = document.getElementById('form-agregar');
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const producto = Object.fromEntries(formData.entries());
  producto.price = parseFloat(producto.price);
  producto.stock = parseInt(producto.stock);

  socket.emit('nuevoProducto', producto);
  form.reset();
});
