// A simple table/2D array will store all the reagents. A dictionary would probably be a better choice for JS, though.
// Format: [ name, value, units]
// Example: ["Reagent A", 50, "uL"]
const reagentsTable = [];

// Removes all reagent entries from the page.
const removeOldGrid = () => {
    const grid = document.getElementById("grid");
    const cells = document.getElementsByClassName("cell");
    while(cells[0]) {
        grid.removeChild(cells[0]);
    };
};

// Removes a single reagent entry from the reagents table (2d array, then rebuild the html table to reflect the change.
const removeReagent = (index) => {
    if (typeof index !== 'undefined') {
        const removed = reagentsTable.splice(index, 1);
        rebuildHtmlGrid();
        console.log(`Removed reagent ${removed[0]} (index: ${index})`)
    }
    console.log("No reagent removed. Index was not defined.")
}

// Builds an html representation of the table of reagents.
// A table might have been a clearer way to represent this in code, but I haven't used grid yet and wanted to try!
// I dislike unnecessary libraries - sorry if this isn't as easy to read as the jquery version!
const buildNewGrid = () => {
    const grid = document.getElementById("grid");
    const inputRow = document.getElementById("input-row-begin");
    let i = 0; // Really only need this for the delete button to function, but 
    reagentsTable.forEach((reagent) => {
        reagent.forEach((cellValue) => {
            const newCell = document.createElement("DIV");
            newCell.className = `cell`;
            const text = document.createTextNode(cellValue);
            newCell.appendChild(text);
            grid.insertBefore(newCell, inputRow);
        })
        const deleteCell = document.createElement("DIV");
        deleteCell.className = "cell";
        deleteCell.innerHTML = `<button class="remove-button" data-index="${i}" onClick="removeReagent(this.dataset.index)">Remove</button>`
        grid.insertBefore(deleteCell, inputRow);
        ++i;
    })
}

const rebuildHtmlGrid = () => {
    removeOldGrid();
    buildNewGrid();
}

const addReagent = () => {
    reagent = document.getElementById("ra-name-input").value;
    amount = document.getElementById("ra-amount-input").value;
    unit = document.getElementById("ra-unit-input").value;

    // Don't allow null values
    if (reagent === "") {
        alert("Please fill in reagent name!")
    }
    else if (amount === "") {
        alert("Please fill in amount name!")
    }
    
    // Save the reagent to our local reagent table.
    reagentsTable.push([reagent, amount, unit]);
    rebuildHtmlGrid();

    // Clear inputs
    reagent.value = "";
    amount.value = "";
}



// ------------- INPUT VALIDATION -------------

// https://stackoverflow.com/questions/469357/html-text-input-allow-only-numeric-input
// I didn't write this function but I'll probably be copy pasta-ing some SO at some point. Why not in the FIO task? 🤷🏻‍♂️It's acceptable as long as it's understood, right?

// Parameters are a textbox element and a filter function, this will register an event
// listenter to allow only certain characters in the input field
// We should also validate input at the server's endpoints to prevent malicious abuse.
const setInputFilter = (textbox, inputFilter) => {
    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
        textbox.addEventListener(event, function() {
            if (inputFilter(this.value)) {
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            } else {
                this.value = "";
            }
        });
    });
}


// Register an event listener to validate input for reagent-amount and reagent-unit
setInputFilter(document.getElementById("ra-amount-input"), function(value) {
    return /^\d*\.?\d*$/.test(value); // Allow digits and '.' only (I also didn't write this RegEx)
});

// Allow alphanumeric and whitespace characters, must be at least 1 character to be valid.
// Out of scope, but - we could check that the text matches an entry in a database of available reagents. We could double the usefulness of that API call by providing auto-complete functionality from the results.
setInputFilter(document.getElementById("ra-name-input"), function(value) {
    return /^$|^[\w ]+$/.test(value); 
});

// I used a drop-down list for 'reagent-unit-input' which prevents unexpected input rather than validating.
// A text-field with suggestions might be preferable on a live system depending on the number of options.
