//Niz transakcija
let transactions = [];

// Ucitavanje sacuvanih transakcija
let savedTransactions = localStorage.getItem("transactions");

if (savedTransactions) {
    transactions = JSON.parse(savedTransactions);
}

//uzimanje elementaa sa html
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const addButton = document.getElementById("addButton");
const transactionList = document.getElementById("transactionList");
const balanceDisplay = document.getElementById("balance");
const incomeDisplay = document.getElementById("income");

//upodate balance
function updateBalance() {

    let balance = 0;
    let income = 0;
    let expenses = 0;

    for (let transaction of transactions) {

        if (transaction.type === "income") {
            balance += transaction.amount;
             income += transaction.amount;
        } else {
            balance -= transaction.amount;
            expenses += transaction.amount;
        }
    }

    balanceDisplay.textContent = "€" + balance.toFixed(2);
    incomeDisplay.textContent = "€" + income.toFixed(2);
    const expensesDisplay = document.getElementById("expenses");
expensesDisplay.textContent = "€" + expenses.toFixed(2);
}
//Dodati novi transakciju
addButton.addEventListener("click", function() {

    const description = descriptionInput.value;
    const amount = Number(amountInput.value);
    const type = typeInput.value;

    //Pravljenje objekta transakcije
    const transaction = {
        description: description,
        amount: amount,
        type: type
    };

    transactions.push(transaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));

    //Pravljenje premdemta ili ti stavke u listi
    const listItem = document.createElement("li");

    listItem.textContent = description + " - €" + amount.toFixed(2) + " (" + type + ")";

    //dugme za brisanje
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";

    listItem.appendChild(deleteButton);
    
    //Brisanje transakcije
    deleteButton.addEventListener("click", function() {

        const index = transactions.indexOf(transaction);

        transactions.splice(index, 1);

        localStorage.setItem("transactions", JSON.stringify(transactions));

        listItem.remove();
        
    //Update posle brisanja
        updateBalance();
    });
//Dodavanje transakcije u listu
    transactionList.appendChild(listItem);
//Update stanja
    updateBalance();
//Brisanje iz inputa
    descriptionInput.value = "";
    amountInput.value = "";
});

// Prikaz sacuvanih transakcija nakon refresha
for (let transaction of transactions) {

    const listItem = document.createElement("li");

    listItem.textContent = transaction.description + " - €" + transaction.amount.toFixed(2) + " (" + transaction.type + ")";

    transactionList.appendChild(listItem);
}

updateBalance();
