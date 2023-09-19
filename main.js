let myfrom = document.querySelector("form");
let myTabla =document.querySelector("#myData");
addEventListener("DOMContentLoaded" , async()=>{
    let res = await (await fecht("https://6509d042f6553137159c104a.mockapi.io/")).json();
for(let i=0; i < res.length; i++) {
    myTabla.insertAdjacentHTML("beforeend" , `
        <tr>
            <td>${res[i].id}</td>
            <td>${res[i].valor}</td>
            <td>${res[i].caja}</td>
        </tr>
    `);
    }
})

myfrom.addEventListener("submit", async(e)=>{ 
    e.preventDefault();
    const data =Object.fromEntries(new FormData(e.target));
    const {valor} = data;
    data.valor = (typeof valor ==="string") ? Number(valor) : null;
    let config ={
        method:"POST",
        headers:{"content-type": "application/json"},
        body: JSON.stringify(data)
    };
    let res = await (await fetch("https://6509d042f6553137159c104a.mockapi.io/"
    , config)).json();
    console.log(res);
    
})