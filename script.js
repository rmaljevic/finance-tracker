let transactions = [];

const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const addButton = document.getElementById("addButton");

addButton.addEventListener("click", function() {

    const description = descriptionInput.value;
    const amount = Number(amountInput.value);
    const type = typeInput.value;

    const transaction = {
        description: description,
        amount: amount,
        type: type
    };

    transactions.push(transaction);

    console.log(transactions);
});
