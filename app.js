class BaseDeDatos {
    constructor() {
        this.Skins = [];
        this.agregarSkin(1, "AK47 Headshot", 242, "Rifles", "ak 1.png");
        this.agregarSkin(2, "AK47 NightWish", 186, "Rifles", "ak 2.png");
        this.agregarSkin(3, "PP BIZON High Roller", 84, "Subfusiles", "biz 1.png");
        this.agregarSkin(4, "Desert Eagle Blaze", 504, "Pistolas", "dg 1.png");
        this.agregarSkin(5, "Desert Eagle Fennec Fox", 676, "Pistolas", "dg 2.png");
        this.agregarSkin(6, "Glock 18 Fade", 1600, "Pistolas", "glock 1.png");
        this.agregarSkin(7, "M4A1S HyperBeast", 192, "Rifles", "m4a1 1.png");
        this.agregarSkin(8, "M4A1S Knight", 1950, "Rifles", "m4a1 2.png");
        this.agregarSkin(9, "MAC 10 Stalker", 75, "Subfusiles", "mac 1.png");
        this.agregarSkin(10, "MP9 Wild Lily", 1700, "Subfusiles", "mp9 1.png");
        this.agregarSkin(11, "P90 Death by Kitty", 210, "Subfusiles", "p90 1.png");
        this.agregarSkin(12, "USP Kill Confirmed", 275, "Pistolas", "usp 1.png");
    }

    agregarSkin(id, nombre, precio, categoria, imagen) {
        const SkinItem = new Skin(id, nombre, precio, categoria, imagen);
        this.Skins.push(SkinItem);
    }

    traerRegistros() {
        return this.Skins;
    }

    registroporId(id) {
        return this.Skins.find((Skin) => Skin.id === id);
    }

    registrosPorNombre(palabra) {
        return this.Skins.filter((Skin) => Skin.nombre.toLowerCase().includes(palabra));
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

class Skin {
    constructor(id, nombre, precio, categoria, imagen = false) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.categoria = categoria;
        this.imagen = imagen;
    }
}

const bd = new BaseDeDatos();


const divSkins = document.querySelector("#Skins");
const divCarrito = document.querySelector("#carrito");
const spanCantidadSkins = document.querySelector("#cantidadSkins");
const spanTotalCarrito = document.querySelector("#totalCarrito");
const botonCarrito = document.querySelector("section h1");
const botonesCategorias = document.querySelectorAll(".btnCategoria");

cargarSkins(bd.traerRegistros());

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

//ocultar/mostrar el carrito
botonCarrito.addEventListener("click", (event) => {
    document.querySelector("section").classList.toggle("ocultar");
});

const carrito = new Carrito;
