const myfrom = document.querySelector("form");
const myTabla = document.querySelector("#myData");
const input = document.querySelector(".form-control");
const button = document.querySelector("#boton_bsuqueda");
const api = "https://650c323b47af3fd22f673fc5.mockapi.io/tabla";

addEventListener("DOMContentLoaded", async () => {
  let res = await (await fetch(api)).json();
  for (let i = 0; i < res.length; i++) {
    myTabla.insertAdjacentHTML(
      "beforeend",
      `
            <tr>
                <td>${res[i].id}</td>
                <td>${res[i].valor}</td>
                <td>${res[i].caja}</td>
                <td><button class="eliminar" data-id="${res[i].id}">Eliminar</button></td>
            </tr>
        `
    );
  }
});

myfrom.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  const { valor } = data;
  data.valor = typeof valor === "string" ? Number(valor) : null;
  let config = {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(data),
  };
  let res = await fetch(api, config);
  console.log(res);
});

myTabla.addEventListener("click", async (e) => {
  if (e.target.classList.contains("eliminar")) {
    const id = e.target.getAttribute("data-id");

    try {
      const response = await fetch(`${api}/${id}`, { method: "DELETE" });

      if (response.ok) {
        console.log("Registro eliminado");

        const filaAEliminar = e.target.parentElement.parentElement;
        filaAEliminar.remove();
      } else {
        console.error("Error al eliminar el registro");
      }
    } catch (error) {
      console.error("Error al eliminar el registro:", error);
    }
  }
});

button.addEventListener("click", async (e) => {
  e.preventDefault();
  let valor = input.value;
  let res = await (await fetch(api + "/" + valor)).json();
  if (valor === res.id) {
    myTabla.innerHTML = `
            <tr>
                <td>${res.id}</td>
                <td>${res.valor}</td>
                <td>${res.caja}</td>
                <td><button class="eliminar" data-id="${res.id}">Eliminar</button></td>
            </tr>
        `;
  } else if (valor === "") {
    myTabla.innerHTML = ""
    for (let i = 0; i < res.length; i++) {
      myTabla.insertAdjacentHTML(
        "beforeend",
        `
                    <tr>
                        <td>${res[i].id}</td>
                        <td>${res[i].valor}</td>
                        <td>${res[i].caja}</td>
                        <td><button class="eliminar" data-id="${res[i].id}">Eliminar</button></td>
                    </tr>
                `
      );
    }
  } else {
    myTabla.innerHTML = "NO SE ENCONTRARON DATOS";
  }
});
