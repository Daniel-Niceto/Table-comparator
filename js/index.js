'use strict'

const buttonForm = document.querySelector(`.Compare`)
const textForms = document.querySelectorAll(`.Inputs-textarea`)
const clearButton = document.querySelector(`.Clear`)



let tables = []
let combinedTables = []

// Takes the data from the inputs, splits it at \n and \t
// Creates an array of the tables, each table is an array of objects, each object is a row
const handleButtonClick = () => {
    textForms.forEach((textForm) => {
        let table = []
        const tableData = textForm.value.split(`\n`)

        tableData.forEach((row) => {
            let x = []
            x = row.split(`\t`)
            const rows = {
                "code": `${x[0]}`,
                "description": `${x[1]}`,
                "units": `${x[2]}`
            }
            table = [...table, rows]
        })
        textForm.value = ""
        tables = [...tables, table]
    })
}

// Sorts each table acording to the code
const sortTable = () => {
    tables.forEach((table) => {
        table.sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true, sensitivity: `base` }))
    })
}

// Deletes invalid data from the tables
const formatTable = () => {
    tables.forEach((table) => {
        let row = 0
        while (row < table.length) {
            if (table[row].code == "") {
                table.splice(row, 1)
            }
            row++
        }
    })
}

// Function that compares the codes from the tables
const compareCodes = (codeTable_1, codeTable_2) => {
    return codeTable_1.localeCompare(codeTable_2, undefined, { numeric: true, sensitivity: `base` })
}

// Function that adds a row to the combinedTables array
const addRow = (firstTable, secondTable) => {
    const newRow = {
        code_1: firstTable.code,
        description_1: firstTable.description,
        units_1: firstTable.units,
        code_2: secondTable.code,
        description_2: secondTable.description,
        units_2: secondTable.units,
    }
    combinedTables.push(newRow)
}

const compareTable = () => {
    let index_t1 = 0
    let index_t2 = 0

    while (true) {
        if (index_t1 == tables[0].length && index_t2 == tables[1].length) {
            return
        } else if (index_t1 == tables[0].length) {
            while (index_t2 < tables[1].length) {
                addRow(rowMissing(), tables[1][index_t2])
                index_t2++
            }
            return
        } else if (index_t2 === tables[1].length) {
            while (index_t1 < tables[0].length) {
                addRow(tables[0][index_t1], rowMissing())
                index_t1++
            }
            return
        }

        const codeTable_1 = tables[0][index_t1].code
        const codeTable_2 = tables[1][index_t2].code

        if (compareCodes(codeTable_1, codeTable_2) == 0) {
            addRow(tables[0][index_t1], tables[1][index_t2])
            index_t1++
            index_t2++

        } else if (compareCodes(codeTable_1, codeTable_2) < 0) {
            addRow(tables[0][index_t1], rowMissing())
            index_t1++
        } else {
            addRow(rowMissing(), tables[1][index_t2])
            index_t2++
        }
    }
}

const rowMissing = () => {
    return { "code": "", "description": "", "units": "" }
}

const printTable = () => {

    const table = document.createElement(`table`)
    const location = document.querySelector(`main`)
    table.classList.add(`Table`)
    table.innerHTML = `
    <thead class="Table-head Head">
        <tr class="Head-row">
            <th class="Head-data" colspan="3">Table 1</th>
            <th class="Head-data" colspan="3">Table 2</th>
        </tr>
        <tr class="Head-row">
            <th class="Head-data">Code table 1</th>
            <th class="Head-data">Description table 1</th>
            <th class="Head-data Head-units">Units table 1</th>
            <th class="Head-data">Code table 2</th>
            <th class="Head-data">Description table 2</th>
            <th class="Head-data">Units table 2</th>
        </tr>
    </thead>
    <tbody class="Table-body Body">
    </tbody>
    `

    location.appendChild(table)
    const tableBody = document.querySelector(`.Table-body`)

    combinedTables.forEach((row) => {
        const tableRow = document.createElement(`tr`)
        tableRow.classList.add(`Body-row`)

        tableRow.innerHTML = `
                <td class="Body-data Body-code">${row.code_1}</td>
                <td class="Body-data">${row.description_1}</td>
                <td class="Body-data Body-units Body-units--first">${row.units_1}</td>
                <td class="Body-data Body-code">${row.code_2}</td>
                <td class="Body-data">${row.description_2}</td>
                <td class="Body-data Body-units">${row.units_2}</td>
            `
        tableBody.appendChild(tableRow)
    })
}

const inputsAreEmpty = () => {
    let empty = false
    textForms.forEach((textForm) => {
        if (textForm.value.length === 0 && tables.length === 0) {
            empty = true
        }
    })
    return empty
}

const addStyles = () => {
    // const cells = document.querySelectorAll(`.Body-data`)
    // cells.forEach((cell) => {
    //     if (cell.innerHTML == "missing") {
    //         cell.classList.add(`isMissing`)
    //     }
    // })

    const rows = document.querySelectorAll(`.Body-row`)
    rows.forEach((row) => {
        if (row.children[0].innerHTML == "" || row.children[3].innerHTML == "") {
            row.classList.add(`isMissing`)
        }
    })
}

const checkUnits = () => {
    const rows = document.querySelectorAll(`.Body-row`)
    rows.forEach((row)=>{
        if(!row.classList.contains(`isMissing`) && row.children[2].innerHTML != row.children[5].innerHTML){
            row.children[2].classList.add(`notMatching`)
            row.children[5].classList.add(`notMatching`)
        }
    })
}

const handleClear= () => {
    tables = []
    combinedTables = []

    const table = document.querySelector(`.Table`)
    if (table) {
        table.remove()
    }

    textForms.forEach((textForm)=>{
        textForm.value = ""
    })
}

buttonForm.addEventListener(`click`, () => {

    // Check that there is content in the inputs
    // If the inputs are empty it returns
    if (inputsAreEmpty()) {
        return
    }

    // Cleans the array and the table shown in the window
    const table = document.querySelector(`.Table`)
    // console.log(table)
    
    if (table) {
        console.log(table)
        // table.innerHTML = ``

        table.remove()
    }

    tables = []
    combinedTables = []


    handleButtonClick()
    sortTable()
    formatTable()
    compareTable()
    printTable()
    addStyles()
    checkUnits()

    tables = []
    combinedTables = []
})



clearButton.addEventListener(`click`, ()=> handleClear())


