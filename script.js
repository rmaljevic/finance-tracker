
// Niz u koji smjestamo sve transakcije
let transactions = [];

// Pamtimo transakciju koju trenutno mijenjamo
let editingTransaction = null;

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
const cancelEditButton = document.getElementById("cancelEditButton");
const formTitle = document.getElementById("formTitle");

const clearButton = document.getElementById("clearButton");

const searchInput = document.getElementById("searchInput");
const filterCategory = document.getElementById("filterCategory");
const sortTransactions = document.getElementById("sortTransactions");

const transactionList = document.getElementById("transactionList");

const balanceDisplay = document.getElementById("balance");
const incomeDisplay = document.getElementById("income");
const expensesDisplay = document.getElementById("expenses");
const transactionCountDisplay = document.getElementById("transactionCount");

// Elementi za mjesecni pregled
const monthPicker = document.getElementById("monthPicker");
const monthlyIncomeDisplay = document.getElementById("monthlyIncome");
const monthlyExpensesDisplay = document.getElementById("monthlyExpenses");
const monthlyBalanceDisplay = document.getElementById("monthlyBalance");

const incomeChartValue = document.getElementById("incomeChartValue");
const expensesChartValue = document.getElementById("expensesChartValue");

const incomeBar = document.getElementById("incomeBar");
const expensesBar = document.getElementById("expensesBar");


// Automatski postavljamo danasnji datum
function setTodayDate() {

    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    dateInput.value = year + "-" + month + "-" + day;
}

setTodayDate();


// Postavljamo trenutni mjesec u mjesecnom pregledu
function setCurrentMonth() {

    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");

    monthPicker.value = year + "-" + month;

}

setCurrentMonth();


// Cistimo formu i vracamo je u pocetno stanje
function resetForm() {

    descriptionInput.value = "";
    amountInput.value = "";
    typeInput.value = "income";
    categoryInput.value = "Food";

    setTodayDate();

    editingTransaction = null;

    formTitle.textContent = "Add Transaction";
    addButton.textContent = "Add Transaction";
    cancelEditButton.hidden = true;

}


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


// Racunamo prihode i rashode za izabrani mjesec
function updateMonthlyOverview() {

    let monthlyIncome = 0;
    let monthlyExpenses = 0;

    const selectedMonth = monthPicker.value;

    // Prolazimo kroz sve transakcije
    for (let transaction of transactions) {

        // Uzimamo samo transakcije iz izabranog mjeseca
        if (transaction.date && transaction.date.startsWith(selectedMonth)) {

            if (transaction.type === "income") {

                monthlyIncome += transaction.amount;

            } else {

                monthlyExpenses += transaction.amount;

            }

        }

    }

    // Racunamo mjesecni balans
    const monthlyBalance = monthlyIncome - monthlyExpenses;

    // Prikazujemo izracunate podatke
    monthlyIncomeDisplay.textContent = "€" + monthlyIncome.toFixed(2);
    monthlyExpensesDisplay.textContent = "€" + monthlyExpenses.toFixed(2);
    monthlyBalanceDisplay.textContent = "€" + monthlyBalance.toFixed(2);

    // Prikazujemo vrijednosti pored grafikona
    incomeChartValue.textContent = "€" + monthlyIncome.toFixed(2);
    expensesChartValue.textContent = "€" + monthlyExpenses.toFixed(2);

    // Pronalazimo veci iznos da bismo odredili velicinu grafikona
    const biggestAmount = Math.max(monthlyIncome, monthlyExpenses);

    let incomeWidth = 0;
    let expensesWidth = 0;

    // Racunamo koliko prostora zauzima svaki iznos
    if (biggestAmount > 0) {

        incomeWidth = (monthlyIncome / biggestAmount) * 100;
        expensesWidth = (monthlyExpenses / biggestAmount) * 100;

    }

    // Postavljamo sirinu grafikona
    incomeBar.style.width = incomeWidth + "%";
    expensesBar.style.width = expensesWidth + "%";

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


        // Ucitavamo podatke transakcije u formu za izmjenu
        editButton.addEventListener("click", function() {

            editingTransaction = transaction;

            descriptionInput.value = transaction.description;
            amountInput.value = transaction.amount;
            dateInput.value = transaction.date;
            typeInput.value = transaction.type;
            categoryInput.value = transaction.category || "Other";

            formTitle.textContent = "Edit Transaction";
            addButton.textContent = "Save Changes";
            cancelEditButton.hidden = false;

            // Vracamo korisnika na formu
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });


        // Brisemo pojedinacnu transakciju
        deleteButton.addEventListener("click", function() {

            const confirmation = confirm(
                "Are you sure you want to delete this transaction?"
            );

            if (!confirmation) {
                return;
            }

            // Ako brisemo transakciju koju mijenjamo, zatvaramo Edit
            if (editingTransaction === transaction) {
                resetForm();
            }

            const index = transactions.indexOf(transaction);

            transactions.splice(index, 1);

            saveTransactions();
            updateBalance();
            updateMonthlyOverview();
            displayTransactions();

        });


        buttonsDiv.appendChild(editButton);
        buttonsDiv.appendChild(deleteButton);

        listItem.appendChild(transactionInfo);
        listItem.appendChild(buttonsDiv);

        transactionList.appendChild(listItem);

    }

}


// Dodavanje nove transakcije ili cuvanje izmjena
addButton.addEventListener("click", function() {

    const description = descriptionInput.value.trim();
    const amount = Number(amountInput.value);
    const type = typeInput.value;
    const category = categoryInput.value;
    const date = dateInput.value;

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
    if (date === "") {

        alert("Select a date!");
        return;

    }


    // Ako mijenjamo postojecu transakciju
    if (editingTransaction !== null) {

        editingTransaction.description = description;
        editingTransaction.amount = amount;
        editingTransaction.date = date;
        editingTransaction.type = type;
        editingTransaction.category = category;

    }

    // Ako dodajemo novu transakciju
    else {

        const transaction = {

            description: description,
            amount: amount,
            type: type,
            category: category,
            date: date

        };

        transactions.push(transaction);

    }


    saveTransactions();
    updateBalance();
    updateMonthlyOverview();
    displayTransactions();

    resetForm();

});


// Otkazujemo izmjenu i vracamo formu u pocetno stanje
cancelEditButton.addEventListener("click", function() {

    resetForm();

});


// Kada izaberemo drugi mjesec, osvjezavamo pregled
monthPicker.addEventListener("change", function() {

    updateMonthlyOverview();

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

        resetForm();
        updateBalance();
        updateMonthlyOverview();
        displayTransactions();

    }

});


// Prikazujemo podatke odmah nakon otvaranja stranice
updateBalance();
updateMonthlyOverview();
displayTransactions();
