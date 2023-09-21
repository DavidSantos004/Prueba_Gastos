let myfrom = document.querySelector("form");
let myTabla =document.querySelector("#myData");

const API_URL= "https://650a69cadfd73d1fab0857b8.mockapi.io/id/valor/user"

addEventListener("DOMContentLoaded" , async ()=>{
    let res = await (await fetch(API_URL)).json();
    for(let i=0; i < res.length; i++) {
        myTabla.insertAdjacentHTML("beforeend" , `
            <tr>
                <td>${res[i].id}</td>
                <td>${res[i].valor}</td>
                <td>${res[i].caja}</td>
                <td><button class="eliminar" data-id="${res[i].id}">Eliminar</button></td>
            </tr>
        `);
        }
})

myfrom.addEventListener("submit", async(e)=>{ 
    e.preventDefault();
    const data =Object.fromEntries(new FormData(e.target));
    const { valor } = data;
    data.valor = (typeof valor ==="string") ? Number(valor) : null;
    let config ={
        method:"POST",
        headers:{"content-type": "application/json"},
        body: JSON.stringify(data)
    };
    let res = await fetch (API_URL, config)
    console.log(res)
})


myTabla.addEventListener("click", async (e) => {
    if (e.target.classList.contains("eliminar")) {
        const id = e.target.getAttribute("data-id");

        try {
            const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

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

