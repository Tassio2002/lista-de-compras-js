'use strict'

//Funções
const openModal = () => document.getElementById('modal')
    .classList.add('active');

const closeModal = () => {
    document.querySelector('#modal-title').textContent = "Adicionar item";
    clearFields();
    document.getElementById('modal').classList.remove('active');
}

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_item')) ?? [];
const setLocalStorage = (dbItem) => localStorage.setItem("db_item", JSON.stringify(dbItem));

/*Operações do CRUD*/
//Create
const createItem = (item) => {
    const dbItem = getLocalStorage();
    dbItem.push(item);
    setLocalStorage(dbItem);
}

//Read
const readItem = () => getLocalStorage()

//Update
const updateItem = (index, item) => {
    const dbItem = readItem();
    dbItem[index] = item;
    setLocalStorage(dbItem);
}

//Delete
const deleteItem = (index) => {
    const dbItem = readItem();
    dbItem.splice(index, 1);
    setLocalStorage(dbItem);
}

const deleteAllItems = (item) => {
    const response = confirm(`Tem certeza que deseja excluir todos os itens da tabela?`)
    if (response) {
        const dbItem = readItem();
        dbItem.splice(0, dbItem.length);
        setLocalStorage(dbItem);
        updateTable();
    }


}

/*Interações com o layout*/

//Verifca validade dos campos
const isValidFields = () => {
    const formValidity = document.querySelector('#modal-form').reportValidity();
    if (formValidity == true) {
        return true;
    } else {
        return false;
    }
}

//Limpa os campos após salvar um item
const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field');
    fields.forEach(field => field.value = "");
}

//Salva os dados digitados nos campos no localStorage
const saveItem = () => {
    if (isValidFields() == true) {
        const item = {
            nome: document.querySelector('#nome').value,
            email: document.querySelector('#email').value,
            item: document.querySelector('#nome-item').value,
            qtd: document.querySelector('#qtd-item').value
        }
        const index = document.getElementById('nome').dataset.index;
        if (index == 'new') {
            createItem(item);
            updateTable();
            closeModal();
        } else {
            updateItem(index, item);
            updateTable();
            closeModal();
        }

    }
}

//Atualiza a tabela
const createRow = (item, index) => {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
    <td>${item.nome}</td>
    <td>${item.email}</td>
    <td>${item.item}</td>
    <td>${item.qtd}</td>
    <td>
        <button type="button" id="edit-${index}" class="edit-btn" >Editar</button>
        <button type="button" id="delete-${index}" class="delete-btn">Excluir</button>
    </td>
    `
    document.querySelector('#items-table > tbody').appendChild(newRow);
}

const clearTable = () => {
    const rows = document.querySelectorAll('#items-table > tbody > tr');
    rows.forEach(row => row.parentNode.removeChild(row));
}

const updateTable = () => {
    const dbItem = readItem();
    clearTable();
    dbItem.forEach(createRow);
}

const fillFields = (item) => {
    document.querySelector('#nome').value = item.nome;
    document.querySelector('#email').value = item.email;
    document.querySelector('#nome-item').value = item.item;
    document.querySelector('#qtd-item').value = item.qtd;
    document.querySelector('#nome').dataset.index = item.index;

}

const editItem = (index) => {
    const item = readItem()[index];
    item.index = index;
    fillFields(item);
    document.querySelector('#modal-title').textContent = "Editar item";
    openModal();
}

const editDelete = (event) => {
    if (event.target.type == 'button') {
        const [action, index] = event.target.id.split('-');

        if (action == 'edit') {
            editItem(index);
        }
        else if (action == 'delete') {
            const item = readItem()[index];
            const response = confirm(`Tem certeza que deseja excluir o item ${item.item}?`);
            if (response) {
                deleteItem(index);
                updateTable();
            }

        }
    }

}

updateTable();

//Eventos a serem executados
document.getElementById('add-item')
    .addEventListener('click', openModal);

document.getElementById('delete-all')
    .addEventListener('click', deleteAllItems);

document.getElementById('modalClose')
    .addEventListener('click', closeModal);

document.getElementById('save-btn')
    .addEventListener('click', saveItem);

document.querySelector('#items-table > tbody')
    .addEventListener('click', editDelete);