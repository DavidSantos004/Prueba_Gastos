const myfrom = document.querySelector("form");
const myTabla = document.querySelector("#myData");
const input = document.querySelector(".form-control");
const button = document.querySelector("#boton_bsuqueda");
const api = "https://650c323b47af3fd22f673fc5.mockapi.io/tabla";
const datos = document.querySelector(".datos");
const ingreso = document.querySelector(".ingreso");
const egreso = document.querySelector(".egreso");
const total = document.querySelector(".total");
const modificar = document.querySelector(".editar");

addEventListener("DOMContentLoaded", async () => {
  let res = await (await fetch(api)).json();
  let totalIngresos = 0;
  let totalEgresos = 0;

  for (let i = 0; i < res.length; i++) {
    myTabla.insertAdjacentHTML(
      "beforeend",
      `
            <tr>
                <td>${res[i].id}</td>
                <td>${res[i].valor}</td>
                <td>${res[i].caja}</td>
                <td><button class="eliminar" data-id="${res[i].id}">Eliminar</button></td>
                <td><button class="editar" data-id="${res[i].id}">Modificar</button></td>

            </tr>`
    );

    if (res[i].caja === "ingreso") {
      totalIngresos = totalIngresos + res[i].valor;
    } else {
      totalEgresos = totalEgresos + res[i].valor;
    }
  }

  ingreso.textContent = `Ingresos: ${totalIngresos}`;
  egreso.textContent = `Egresos: ${totalEgresos}`;
  total.textContent = `Total: ${totalIngresos - totalEgresos}`;

  const editores = document.querySelectorAll(".editar");

  editores.forEach((i) => {
    i.addEventListener("click", async (e) => {
      const fila = i.closest("tr");

      const id = fila.querySelector("td:nth-child(1)").textContent;
      const valor = fila.querySelector("td:nth-child(2)").textContent;
      const tipo = fila.querySelector("td:nth-child(3)").textContent;

      document.querySelector("#monto").value = valor;
      document.querySelector(`input[value="${tipo}"]`).checked = true;

      const button = document.querySelector("#calcularr");
      button.value = "editar";  
      console.log(button);

      button.style.color = "green"

      button.setAttribute("data-edit", id)
    });
  });

});

myfrom.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  const { valor } = data;
  data.valor = typeof valor === "string" ? Number(valor) : null;
  let configRegister = {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(data),
  };

  let configEdit ={
  method: "PUT",
  headers: { "content-type": "application/json" },
  body: JSON.stringify(data),
  }


  
  const button = document.querySelector("#calcularr")
  const id = button.dataset.edit
  console.log(id)
  
  if(button.value==="calcular"){
    await fetch(`${api}`, configRegister); 
  }
  else{
    await fetch(`${api}/${id}`, configEdit);
  }
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
      myTabla.innerHTML = "";
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
});
