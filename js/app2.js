var productos = [
  {
    precio: 500,
    id: 1,
    title: "Café",
    image: "../assets/img/cafe.jpg",
  },
  {
    precio: 300,
    id: 2,
    title: "Pizza",
    image: "../assets/img/pizza.jpg",
  },
  {
    precio: 100,
    id: 3,
    title: "Agua",
    image: "../assets/img/agua.jpg",
  },
  {
    precio: 50,
    id: 4,
    title: "Sandía",
    image: "../assets/img/sandia.jpg",
  },
  {
    precio: 10,
    id: 5,
    title: "Mango",
    image: "../assets/img/mango.jpg",
  },
  {
    precio: 150,
    id: 6,
    title: "Tostadas",
    image: "../assets/img/chela.jpg",
  },
];

const cardsCard = document.querySelector(`#cards`);
const items2 = document.querySelector("#items");
const footer = document.querySelector("#footer");
const templateCard = document.querySelector(`#template-card`).content;
const templateFooter = document.querySelector("#template-footer").content;
const templateCarrito = document.querySelector("#template-carrito").content;
const fragment = document.createDocumentFragment();
let carrito = {};

const cargaInicial = () => {
  carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  if (carrito.length > 0) {
    carrito.forEach((carrito) => {
      pintarCarrito();
    });
  }
  if (localStorage.getItem("carrito")) {
    carrito = JSON.parse(localStorage.getItem("carrito"));
    pintarCarrito();
  }
};

cardsCard.addEventListener("click", (e) => {
  addCarrito(e);
});

items2.addEventListener("click", (e) => {
  btnAccion(e);
});

const pintarCards = () => {
  productos.forEach((producto, index) => {
    templateCard.querySelector(`h5`).textContent = producto.title;
    templateCard.querySelector("p").textContent = producto.precio;
    templateCard.querySelector("img").setAttribute("src", producto.image);
    templateCard.querySelector(".btn-primary").dataset.id = producto.id;
    const clone = templateCard.cloneNode(true);
    fragment.appendChild(clone);
  });
};

pintarCards();
cards.appendChild(fragment);

const addCarrito = (e) => {
  // console.log(e.target.classList.contains("btn-primary"));
  if (e.target.classList.contains("btn-primary")) {
    setCarrito(e.target.parentElement);
  }
  e.stopPropagation();
};

const setCarrito = (objeto) => {
  const producto = {
    id: objeto.querySelector(".btn-primary").dataset.id,
    title: objeto.querySelector("h5").textContent,
    precio: objeto.querySelector("p").textContent,
    cantidad: 1,
  };

  if (carrito.hasOwnProperty(producto.id)) {
    producto.cantidad = carrito[producto.id].cantidad + 1;
  }
  carrito[producto.id] = { ...producto };
  pintarCarrito();
};

const pintarCarrito = () => {
  // console.log(carrito);
  items2.innerHTML = "";
  Object.values(carrito).forEach((producto) => {
    templateCarrito.querySelector("th").textContent = producto.id;
    templateCarrito.querySelectorAll("td")[0].textContent = producto.title;
    templateCarrito.querySelectorAll("td")[1].textContent = producto.cantidad;
    templateCarrito.querySelector(".btn-info").dataset.id = producto.id;
    templateCarrito.querySelector(".btn-danger").dataset.id = producto.id;
    templateCarrito.querySelector("span").textContent =
      producto.cantidad * producto.precio;
    const clone = templateCarrito.cloneNode(true);
    fragment.appendChild(clone);
  });
  items2.appendChild(fragment);
  pintarFooter();
  localStorage.setItem("carrito", JSON.stringify(carrito));
};

const pintarFooter = () => {
  footer.innerHTML = "";
  if (Object.keys(carrito).length === 0) {
    footer.innerHTML = `<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`;
    return;
  }
  const nCantidad = Object.values(carrito).reduce(
    (acc, { cantidad }) => acc + cantidad,
    0
  );
  const nPrecio = Object.values(carrito).reduce(
    (acc, { cantidad, precio }) => acc + cantidad * precio,
    0
  );
  templateFooter.querySelectorAll("td")[0].textContent = nCantidad;
  templateFooter.querySelector("span").textContent = nPrecio;
  const clone = templateFooter.cloneNode(true);
  fragment.appendChild(clone);
  footer.appendChild(fragment);
  const btnVaciar = document.querySelector("#vaciar-carrito");
  btnVaciar.addEventListener("click", () => {
    carrito = {};
    pintarCarrito();
  });
};

const btnAccion = (e) => {
  if (e.target.classList.contains("btn-info")) {
    // console.log(carrito[e.target.dataset.id]);
    // carrito[e.target.dataset.id];
    const producto = carrito[e.target.dataset.id];
    producto.cantidad++;
    carrito[e.target.dataset.id] = { ...producto };
    pintarCarrito();
  }
  if (e.target.classList.contains("btn-danger")) {
    const producto = carrito[e.target.dataset.id];
    producto.cantidad--;
    if (producto.cantidad === 0) {
      delete carrito[e.target.dataset.id];
    }
    pintarCarrito();
  }
  e.stopPropagation;
};

cargaInicial();
