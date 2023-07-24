class Skin {
    constructor(id, nombre, precio, categoria, imagen = false) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.categoria = categoria;
        this.imagen = imagen;
    }
}

class BaseDeDatos {
    constructor() {
        this.Skins = [];
    }

    async traerRegistros() {
        const response = await fetch("productos.json");
        this.Skins = await response.json();
        return this.Skins;
    }

    registroporId(id) {
        return this.Skins.find((Skin) => Skin.id === id);
    }

    registrosPorNombre(palabra) {
        return this.Skins.filter((Skin) => Skin.nombre.toLowerCase().includes(palabra));
    }
    
    SkinsPorCategoria(categoria) {
        return this.Skins.filter((Skin) => Skin.categoria == categoria);
    }
}

class Carrito {
    constructor () {
        const carritoStorage = JSON.parse(localStorage.getItem("carrito"));
        this.carrito = carritoStorage || [];
        this.total = 0;
        this.totalSkins = 0;
        this.listar();
    }

    estaEnCarrito({ id }) {
        return this.carrito.find((Skin) => Skin.id === id);
    }

    agregar(Skin) {
        const SkinEnCarrito = this.estaEnCarrito(Skin);
        if (SkinEnCarrito) {
            SkinEnCarrito.cantidad++;
        } else {
            this.carrito.push({ ...Skin, cantidad: 1});
        }

        localStorage.setItem("carrito", JSON.stringify(this.carrito));
        this.listar();
    }

    quitar(id) {
        const indice = this.carrito.findIndex((Skin) => Skin.id === id);
        if (this.carrito[indice].cantidad > 1) {
            this.carrito[indice].cantidad--;
        } else {
            this.carrito.splice(indice, 1);
        }
        this.listar();
        localStorage.setItem("carrito", JSON.stringify(this.carrito));
    }
    
    listar() {
        this.total = 0;
        this.totalSkins = 0;
        divCarrito.innerHTML = "";
        for (const Skin of this.carrito) {
            divCarrito.innerHTML += `
            <div class="SkinCarrito">
            <h2>${Skin.nombre}</h2>
            <p>$${Skin.precio}</p>
            <p>Cantidad: ${Skin.cantidad}</p>
            <a href="#" data-id="${Skin.id}" class="btnQuitar"> Eliminar</a>
            </div>
            `;

            this.total += Skin.precio * Skin.cantidad;
            this.totalSkins += Skin.cantidad;
        }

        const botonesQuitar = document.querySelectorAll(".btnQuitar");
        for (const boton of botonesQuitar) {
            boton.onclick = (event) => {
                event.preventDefault();
                this.quitar(Number(boton.dataset.id));
            }
        }

        spanCantidadSkins.innerText = this.totalSkins;
        spanTotalCarrito.innerText = this.total;
    }
}

const bd = new BaseDeDatos();


const divSkins = document.querySelector("#Skins");
const divCarrito = document.querySelector("#carrito");
const spanCantidadSkins = document.querySelector("#cantidadSkins");
const spanTotalCarrito = document.querySelector("#totalCarrito");
const inputBuscar = document.querySelector("#inputBuscar")
const botonCarrito = document.querySelector("section h1");
const botonesCategorias = document.querySelectorAll(".btnCategoria");


inputBuscar.addEventListener("keyup", () => {
    const palabra = inputBuscar.value;
    const SkinsEncontrados = bd.registrosPorNombre(palabra.toLowerCase());
    cargarSkins(SkinsEncontrados);
  });

botonesCategorias.forEach((boton) => {
    boton.addEventListener("click", (event) => {
        event.preventDefault();
        const SkinsPorCategoria = bd.SkinsPorCategoria(boton.innerText);
        cargarSkins(SkinsPorCategoria)
    });
});

document.querySelector("#btnTodos").addEventListener("click", (event) => {
    event.preventDefault();
        cargarSkins(bd.Skins)
});
bd.traerRegistros().then(
    (Skins) => cargarSkins(Skins));

function cargarSkins(Skins) {
    divSkins.innerHTML = "";

    for (const Skin of Skins) {
        divSkins.innerHTML += `
        <div class="Skin"> 
        <h2>${Skin.nombre}</h2>
        <p class="precio">$${Skin.precio}</p>
        <div class="imagen">
            <img src="img/${Skin.imagen}" />
        </div>
            <a href="#" class="btnAgregar" data-id="${Skin.id}"> Agregar</a>
        </div>
        `;
    }

    const botonesAgregar = document.querySelectorAll(".btnAgregar");
    for (const boton of botonesAgregar) {
        boton.addEventListener("click", event => {
            event.preventDefault();
            const id = Number(boton.dataset.id);
            const Skin = bd.registroporId(id);
            carrito.agregar(Skin);
        });
    }
}

botonComprar.addEventListener("click", () => {
    Swal.fire({
        title: 'Compra Completada',
        text: 'Gracias por comprar en Cs Vault!',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      })
})

//ocultar/mostrar el carrito
botonCarrito.addEventListener("click", (event) => {
    document.querySelector("section").classList.toggle("ocultar");
});

const carrito = new Carrito;
