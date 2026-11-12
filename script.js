
// Niz u koji smjestamo sve transakcije
let transactions = [];

// Uzimamo podatke koje smo ranije sacuvali
let savedTransactions = localStorage.getItem("transactions");

if (savedTransactions) {
    transactions = JSON.parse(savedTransactions);
}

// Povezujemo JavaScript sa HTML elementima
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");

const addButton = document.getElementById("addButton");
const clearButton = document.getElementById("clearButton");

const searchInput = document.getElementById("searchInput");
const filterCategory = document.getElementById("filterCategory");
const sortTransactions = document.getElementById("sortTransactions");

const transactionList = document.getElementById("transactionList");

const balanceDisplay = document.getElementById("balance");
const incomeDisplay = document.getElementById("income");
const expensesDisplay = document.getElementById("expenses");
const transactionCountDisplay = document.getElementById("transactionCount");


// Automatski postavljamo danasnji datum
function setTodayDate() {

    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    dateInput.value = year + "-" + month + "-" + day;
}

setTodayDate();


// Cuvamo sve transakcije u localStorage
function saveTransactions() {

    localStorage.setItem("transactions", JSON.stringify(transactions));

}


// Racunamo stanje na racunu, prihode i rashode
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
    expensesDisplay.textContent = "€" + expenses.toFixed(2);

    transactionCountDisplay.textContent = transactions.length;

}


// Prikazujemo transakcije na stranici
function displayTransactions() {

    transactionList.innerHTML = "";

    const searchText = searchInput.value.toLowerCase();
    const selectedCategory = filterCategory.value;

    // Pravimo kopiju niza da ne mijenjamo originalne podatke
    const sortedTransactions = [...transactions];

    // Sortiramo transakcije prema izabranoj opciji
    if (sortTransactions.value === "newest") {

        sortedTransactions.sort((a, b) =>
            new Date(b.date) - new Date(a.date)
        );

    }

    else if (sortTransactions.value === "oldest") {

        sortedTransactions.sort((a, b) =>
            new Date(a.date) - new Date(b.date)
        );

    }

    else if (sortTransactions.value === "highest") {

        sortedTransactions.sort((a, b) =>
            b.amount - a.amount
        );

    }

    else if (sortTransactions.value === "lowest") {

        sortedTransactions.sort((a, b) =>
            a.amount - b.amount
        );

    }


    // Prolazimo kroz sve sortirane transakcije
    for (let transaction of sortedTransactions) {

        // Provjeravamo da li opis odgovara pretrazi
        if (!transaction.description.toLowerCase().includes(searchText)) {
            continue;
        }

        // Provjeravamo izabranu kategoriju
        const category = transaction.category || "Other";

        if (selectedCategory !== "all" && category !== selectedCategory) {
            continue;
        }


        const listItem = document.createElement("li");

        const transactionInfo = document.createElement("div");
        transactionInfo.className = "transaction-info";

        const descriptionText = document.createElement("strong");
        descriptionText.textContent = transaction.description;

        const detailsText = document.createElement("span");
        detailsText.className = "transaction-details";

        detailsText.textContent =
            "€" + transaction.amount.toFixed(2) +
            " | " + transaction.type +
            " | " + category +
            " | " + (transaction.date || "");


        // Razlikujemo prihode i rashode bojom
        if (transaction.type === "income") {

            detailsText.classList.add("income-text");

        } else {

            detailsText.classList.add("expense-text");

        }


        transactionInfo.appendChild(descriptionText);
        transactionInfo.appendChild(detailsText);


        // Pravimo dugmad za izmjenu i brisanje
        const buttonsDiv = document.createElement("div");
        buttonsDiv.className = "transaction-buttons";

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "edit-button";

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button";


        // Omogucavamo izmjenu postojece transakcije
        editButton.addEventListener("click", function() {

            const newDescription = prompt(
                "Enter new description:",
                transaction.description
            );

            if (newDescription === null) {
                return;
            }

            if (newDescription.trim() === "") {

                alert("Description cannot be empty!");
                return;

            }


            const newAmount = prompt(
                "Enter new amount:",
                transaction.amount
            );

            if (newAmount === null) {
                return;
            }

            const amountNumber = Number(newAmount);

            if (!Number.isFinite(amountNumber) || amountNumber <= 0) {

                alert("Enter a valid amount!");
                return;

            }


            transaction.description = newDescription.trim();
            transaction.amount = amountNumber;

            saveTransactions();
            updateBalance();
            displayTransactions();

        });


        // Brisemo pojedinacnu transakciju
        deleteButton.addEventListener("click", function() {

            const confirmation = confirm(
                "Are you sure you want to delete this transaction?"
            );

            if (!confirmation) {
                return;
            }

            const index = transactions.indexOf(transaction);

            transactions.splice(index, 1);

            saveTransactions();
            updateBalance();
            displayTransactions();

        });


        buttonsDiv.appendChild(editButton);
        buttonsDiv.appendChild(deleteButton);

        listItem.appendChild(transactionInfo);
        listItem.appendChild(buttonsDiv);

        transactionList.appendChild(listItem);

    }

}


// Dodavanje nove transakcije
addButton.addEventListener("click", function() {

    const description = descriptionInput.value.trim();
    const amount = Number(amountInput.value);
    const type = typeInput.value;

    // Provjeravamo da li je opis unesen
    if (description === "") {

        alert("Enter a description!");
        return;

    }

    // Provjeravamo da li je iznos ispravan
    if (!Number.isFinite(amount) || amount <= 0) {

        alert("Enter a valid amount!");
        return;

    }

    // Provjeravamo da li je izabran datum
    if (dateInput.value === "") {

        alert("Select a date!");
        return;

    }


    // Pravim objekat sa podacima nove transakcije
    const transaction = {

        description: description,
        amount: amount,
        type: type,
        category: categoryInput.value,
        date: dateInput.value

    };


    // Dodajemo novu transakciju u niz
    transactions.push(transaction);

    saveTransactions();
    updateBalance();
    displayTransactions();


    // Cistimo polja nakon dodavanja
    descriptionInput.value = "";
    amountInput.value = "";

    setTodayDate();

});


// Pretrazujemo transakcije po opisu
searchInput.addEventListener("input", function() {

    displayTransactions();

});


// Filtriramo transakcije po kategoriji
filterCategory.addEventListener("change", function() {

    displayTransactions();

});


// Mijenjamo redosljed transakcija
sortTransactions.addEventListener("change", function() {

    displayTransactions();

});


// Brisemo sve transakcije odjednom
clearButton.addEventListener("click", function() {

    if (transactions.length === 0) {
        return;
    }

    const confirmation = confirm(
        "Are you sure you want to delete all transactions?"
    );

    if (confirmation) {

        transactions = [];

        localStorage.removeItem("transactions");

        updateBalance();
        displayTransactions();

    }

});


// Prikazujemo podatke odmah nakon otvaranja stranice
updateBalance();
displayTransactions();
