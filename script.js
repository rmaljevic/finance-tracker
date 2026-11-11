
// Niz transakcija
let transactions = [];

// Ucitavanje sacuvanih transakcija
let savedTransactions = localStorage.getItem("transactions");

if (savedTransactions) {
    transactions = JSON.parse(savedTransactions);
}

// Uzimanje elemenata sa HTML-a
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");

const addButton = document.getElementById("addButton");
const clearButton = document.getElementById("clearButton");

const searchInput = document.getElementById("searchInput");
const filterCategory = document.getElementById("filterCategory");

const transactionList = document.getElementById("transactionList");

const balanceDisplay = document.getElementById("balance");
const incomeDisplay = document.getElementById("income");
const expensesDisplay = document.getElementById("expenses");
const transactionCountDisplay = document.getElementById("transactionCount");

// Postavljanje danasnjeg datuma
function setTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    dateInput.value = year + "-" + month + "-" + day;
}

setTodayDate();

// Cuvanje transakcija
function saveTransactions() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Update balance
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

// Prikaz transakcija
function displayTransactions() {
    transactionList.innerHTML = "";

    const searchText = searchInput.value.toLowerCase();
    const selectedCategory = filterCategory.value;

    for (let transaction of transactions) {

        // Provjera pretrage
        if (!transaction.description.toLowerCase().includes(searchText)) {
            continue;
        }

        // Provjera kategorije
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

        if (transaction.type === "income") {
            detailsText.classList.add("income-text");
        } else {
            detailsText.classList.add("expense-text");
        }

        transactionInfo.appendChild(descriptionText);
        transactionInfo.appendChild(detailsText);

        // Dugmad za izmjenu i brisanje
        const buttonsDiv = document.createElement("div");
        buttonsDiv.className = "transaction-buttons";

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "edit-button";

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button";

        // Izmjena transakcije
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

        // Brisanje transakcije
        deleteButton.addEventListener("click", function() {

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

    // Provjera unosa
    if (description === "") {
        alert("Enter a description!");
        return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
        alert("Enter a valid amount!");
        return;
    }

    if (dateInput.value === "") {
        alert("Select a date!");
        return;
    }

    // Pravljenje objekta transakcije
    const transaction = {
        description: description,
        amount: amount,
        type: type,
        category: categoryInput.value,
        date: dateInput.value
    };

    transactions.push(transaction);

    saveTransactions();
    updateBalance();
    displayTransactions();

    // Brisanje inputa nakon dodavanja
    descriptionInput.value = "";
    amountInput.value = "";

    setTodayDate();
});

// Pretraga transakcija
searchInput.addEventListener("input", function() {
    displayTransactions();
});

// Filtriranje po kategoriji
filterCategory.addEventListener("change", function() {
    displayTransactions();
});

// Brisanje svih transakcija
clearButton.addEventListener("click", function() {

    if (transactions.length === 0) {
        return;
    }

    const confirmation = confirm("Are you sure you want to delete all transactions?");

    if (confirmation) {
        transactions = [];

        localStorage.removeItem("transactions");

        updateBalance();
        displayTransactions();
    }
});

// Pocetni prikaz
updateBalance();
displayTransactions();
