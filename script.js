//Niz transakcija
let transactions = [];

//uzimanje elementaa sa html
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const addButton = document.getElementById("addButton");
const transactionList = document.getElementById("transactionList");
const balanceDisplay = document.getElementById("balance");

//upodate balance
function updateBalance() {

    let balance = 0;

    for (let transaction of transactions) {

        if (transaction.type === "income") {
            balance += transaction.amount;
        } else {
            balance -= transaction.amount;
        }
    }

    balanceDisplay.textContent = "€" + balance;
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

    //Pravljenje premdemta ili ti stavke u listi
    const listItem = document.createElement("li");

    listItem.textContent = description + " - €" + amount + " (" + type + ")";

    //dugme za brisanje
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";

    listItem.appendChild(deleteButton);
    
    //Brisanje transakcije
    deleteButton.addEventListener("click", function() {

        const index = transactions.indexOf(transaction);

        transactions.splice(index, 1);

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
