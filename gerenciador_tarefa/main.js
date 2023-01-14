const html = document.querySelector('html')
const body = document.querySelector('body')
const toggle = document.getElementById('toggle')

const search = document.querySelector("#close")
const filter = document.querySelector("#filter")

const form = document.getElementById("subscribe")
const addTask = document.querySelector("#add-task")
const button = document.querySelector(".modal-wrapper")
const btnClose = document.querySelector(".close")
const btnHover = document.getElementById("to-save")
const deleteModal = document.querySelector(".modal_delete")
const tituloModal = document.getElementById("titulo")
let currentTask = null
let posts = []
let valueTemp = true

function atribuiValor() {
    const inputs = document.querySelector("#number").value
    const input = document.querySelector("#description").value
  
    if(inputs && input != "") {
        colorirButton()
     } else {
        descolorir()
    }
}

function colorirButton() {
    let button = document.querySelector("#to-save")
    button.classList.add("open")
}

function descolorir() {
    let button = document.querySelector("#to-save")
    button.classList.remove("open")
}

search.onclick = () => {
    filter.classList.toggle("open")
}


addTask.onclick = () => {
    document.getElementById("number").value = ''
    document.getElementById("description").value = ''
    document.getElementById("date").value = ''
    document.getElementById("status").value = ''
    tituloModal.textContent = "Adicionar tarefa"
    button.classList.add("open")
}

btnClose.onclick = () => {
button.classList.remove("open")
}

function openModal ()  {
    button.classList.add("open")
} 

function abriModal (id) {
    deleteModal.classList.add("open")
    valueTemp = id
}

function fecharModal () {
    deleteModal.classList.remove("open")
}

const eddTask = async (id) => {
    currentTask = await getPost(id)
    document.getElementById("number").value = currentTask.number
    document.getElementById("description").value = currentTask.description
    document.getElementById("date").value = currentTask.date
    document.getElementById("status").value = currentTask.status
    tituloModal.textContent = "Editar tarefa"
    openModal()
    
}
 
const saveTask = async (post) => {
    if(currentTask === null) {
        await addPost(post) 
    } else {
        await updateQuestion(currentTask.id, post)
        currentTask = null
    }
    btnClose.onclick = () => {
        button.classList.remove("open")
    }
    window.location.reload();
    getPosts()
    
}

const getTask = async (id) => {
    const apiResponse = await fetch(`https://serverjson.herokuapp.com/posts/${id}`)
    const post = await apiResponse.json()
    return post
}

const getPosts = async () => {
    const apiResponse = await fetch("https://serverjson.herokuapp.com/posts")
    const posts = await apiResponse.json()
    const task = document.querySelector("#task-body")
    task.innerHTML = ''
    posts.forEach((posts) => {
        task.innerHTML = task.innerHTML + `
        <tr>
            <td>
                ${posts.number}
            </td>
            
            <td>
                ${posts.description}
            </td>

            <td >
             ${alterarData(posts.date)}
            </td>

            <td class="${posts.status}">
            ${posts.status} 
            </td>
            <td>
                <div id="figure">
                    <button id="edit" onclick="eddTask(${posts.id})">
                        <img  src="./edit.svg" alt="">
                    </button>
                    <button id="delete" onclick="abriModal(${posts.id})" >
                        <img src="./delete.svg" alt="">
                    </button>
                </div>
            </td>

        </tr>
            `
    })
}


const addPost = async (post) => {
    await fetch("https://serverjson.herokuapp.com/posts", {
        method: "post",
        headers: {
            "Accept": "application/json, text/plain */*",
            "content-type": "application/json"
        },
        body: JSON.stringify({
            "number": post.number,
            "description": post.description,
            "date": post.date,
            "status": post.status
        })
    });
} 



const getPost = async (id) => {
    const apiResponse = await fetch(`https://serverjson.herokuapp.com/posts/${id}`)
    const posts = await apiResponse.json()
    return posts 
}

const updateQuestion = async (id, post) => {
    await fetch(`https://serverjson.herokuapp.com/posts/${id}`, {
        method: "PUT",
        headers: {
            "Accept": "application/json, text/plain */*",
            "content-type": "application/json"
        },
        body: JSON.stringify({
            "number": post.number,
            "description": post.description,
            "date": post.date,
            "status": post.status
        })
    });
}

const deleteTask = async () => {
    await fetch(`https://serverjson.herokuapp.com/posts/${valueTemp}`, {
        method: "DELETE"
    })
     window.location.reload();
    getPosts()

}

if(form) {
    form.addEventListener("submit", (event) => {
        event.preventDefault()
    
        const number = form.elements["number"].value
        const description = form.elements["descricao"].value
        const date = form.elements["date"].value
        const status = form.elements["status"].value
     
        const task = {
            number,
            description,
            date,
            status
        }

        saveTask(task)


    })
}

function loadThame () {
    const dark = localStorage.getItem("active")

    if(dark) {
        toggleDarkMode()
    }
}

loadThame()



function toggleDarkMode() {
    toggle.classList.toggle('active')
    body.classList.toggle('active')
    html.classList.toggle("active")

    localStorage.removeItem("active")

    if(body.classList.contains("active")) {
        localStorage.setItem("active", 1)
    }
}


if (localStorage.getItem("token") == null) {
    alert("Você precisa estar logado para acessar essa página");
    window.location.href = "../index.html";
  }
  
/*   const userLogado = JSON.parse(localStorage.getItem("userLogado"));
  
  const logado = document.querySelector("#logado");
  logado.innerHTML = `Olá ${userLogado.nome}`; */
  
  function sair() {
    localStorage.removeItem("token");
    localStorage.removeItem("userLogado");
    window.location.href = "../index.html";
}

const busca = document.querySelector(".header input")

const buscar = document.querySelector("#task-body")


busca.addEventListener('input', filterElementos)

function filterElementos () {
    let key = busca.value.toLowerCase()
    let lines = buscar.getElementsByTagName('tr')
    

    for (let posicao in lines) {
        if (true === isNaN (posicao)){
            continue
        } 

        let conteudoLine = lines[posicao].innerHTML.toLowerCase();

        if (true === conteudoLine.includes(key)) {
            lines[posicao].style.display = ''
        }
        else {
            lines[posicao].style.display = 'none'
        }
    }
}

function alterarData(data){
    let dataTarefa = new Date(data.split('-'))/* .join('/')) */;
    return dataTarefa.toLocaleDateString('pt-BR');

}
