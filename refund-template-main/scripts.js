// Seleciona elementos do formulario
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")

// Seleciona os elementos da lista

const expenseList = document.querySelector("ul")
const expensesQuantity = document.querySelector("aside header p span")
const expensesTotal = document.querySelector("aside header h2")

// Captura o evendo do input para formatar o valor
amount.oninput = () => {
    // Obtem o valor e remove os caracteres nao numericos
    let value = amount.value.replace(/\D/g, "")

    // Transformar o valor em centavos
    value = Number(value) / 100

    // Atualiza o valor do input
    amount.value = formatCurrency(value)
}

function formatCurrency(value) {
    // Formata o valor no padrao BRL
    value = value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })

    return value
}

form.onsubmit = (event) => {
    event.preventDefault()

    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date(),
    }

    console.log(newExpense)
    expenseAdd(newExpense)
}

// Adiciona uma nova despesa 
function expenseAdd(newExpense) {
    try {
        // Criou o elemento de li
        const expenseItem = document.createElement("li")
        expenseItem.classList.add("expense")

        // Cria o icone da categoria
        const expenseIcon = document.createElement("img")
        expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
        expenseIcon.setAttribute("alt", newExpense.category_name)

        // Cria a info da despesa
        const expenseInfo = document.createElement("div")
        expenseInfo.classList.add("expense-info")

        // Cria a strong e span
        const expenseName = document.createElement("strong")
        expenseName.textContent = newExpense.expense

        const expenseCategory = document.createElement("span")
        expenseCategory.textContent = newExpense.category_name

        // Cria o valor da despesa
        const expenseAmount = document.createElement("span")
        expenseAmount.classList.add("expense-amount")
        expenseAmount.innerHTML = `<small>R$</small> ${newExpense.amount.toUpperCase().replace("R$", "")}`

        // Cria o item de remover
        const expenseRemove = document.createElement("img")
        expenseRemove.classList.add("remove-icon")
        expenseRemove.setAttribute("src", "img/remove.svg")
        expenseRemove.setAttribute("alt", "remover")

        // Adiciona o span e o strong na div de info
        expenseInfo.append(expenseName, expenseCategory)

        // Adicionar as informacoes o item
        expenseItem.append(expenseIcon, expenseInfo, expenseAmount, expenseRemove)

        // Adiciona o item na lista
        expenseList.append(expenseItem)

        // Atualiza a quantidade de intens
        updateTotals()

        // Limpa os campos do formulario
        formClear()

    } catch (error) {
        alert("Nao foi possivel atualizar a lista de despensas.")
    }
}

// Calcula a quantidade de itens na lista

function updateTotals () {
    try {
        // Recupera os li da lista
        const items = expenseList.children

        // Atualiza a quantidade de items
        expensesQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despensa"}`

        // Variavel para incrementar o total
        let total = 0

        // Percorre cada item (li) da lista (ul)
        for(let item = 0; item < items.length; item++) {
            const itemAmount = items[item].querySelector(".expense-amount")

            // Remover caracteres nao numericos
            let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".")

            // Converte para float
            value = parseFloat(value)

            // Verificar se e um numero
            if(isNaN(value)) {
                return alert("Nao calcular o total")
            }

            // Incrementar o valor total

            total += Number(value)
        }

        // Cria span para add R$
        const symbolBRL = document.createElement("small")
        symbolBRL.textContent = "R$"

        // Formata o valor e remove o R$ que sera exibido pela small com estilo do css
        total = formatCurrency(total).toUpperCase().replace("R$", "")
        
        // Limpa o conteudo do HTML
        expensesTotal.innerHTML = ""

        // Add o simbulo da moeda e o total
        expensesTotal.append(symbolBRL, total)
    } catch (error) {
        console.log(error)
        alert("Nao foi possivel atualizar as despesas")
    }
}


// Evento que captura o clique nos items da lista

expenseList.addEventListener("click", function (event) {
    // Verifica se o elemento clicado e o icone de remover
    if (event.target.classList.contains("remove-icon")) {
        // Obtem a li pai do elemento clicado
        const item = event.target.closest(".expense")

        // Remove o item
        item.remove()
    }

    // Atualiza os totais
    updateTotals()
})

function formClear () {
    expense.value = ""
    category.value = ""
    amount.value = ""

    // Coloca o foco no input de amount
    expense.focus()
}