'use strict'

const buttonForm = document.querySelector(`.Button-form`)
const textForms = document.querySelectorAll(`.Text-form`)

const body = document.querySelector(`body`)
const tableWrapper = document.querySelector(`.Table-wrapper`)

// console.log(buttonForm)
// console.log(textForm.innerHTML)

let tablas = []
let combinedTables = []

const handleButtonClick = () => {
    textForms.forEach((textForm) => {
        let tabla = []
        const tablaData = textForm.value.split(`\n`)

        tablaData.forEach((row) => {
            // let rows = []
            // rows = row.split(`\t`)
            // tabla = [...tabla, rows]

            // let rows = {}
            let x = []
            x = row.split(`\t`)
            const rows = {
                "code": `${x[0]}`,
                "description": `${x[1]}`,
                "units": `${x[2]}`
            }
            tabla = [...tabla, rows]

            // console.log(tabla)
        })
        textForm.value = ""
        tablas = [...tablas, tabla]
    })

    // console.log(tablas)
}

const sortTable = () => {
    tablas.forEach((tabla) => {
        tabla.sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true, sensitivity: `base` }))
    })
}

const formatTable = () => {
    tablas.forEach((tabla) => {
        let row = 0
        while (row < tabla.length) {
            if (tabla[row].code == "") {
                tabla.splice(row, 1)
            }
            row++
        }

    })
}

const compareCodes = (codeTable_1, codeTable_2) => {
    return codeTable_1.localeCompare(codeTable_2, undefined, { numeric: true, sensitivity: `base` })
}

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

const compareTable = (row) => {
    let index_t1 = 0
    let index_t2 = 0

    while (true) {

        const codeTable_1 = tablas[0][index_t1].code
        const codeTable_2 = tablas[1][index_t2].code

        if (index_t1 == tablas[0].length - 1 || index_t2 == tablas[1].length - 1) {
            return
        }

        if (compareCodes(codeTable_1, codeTable_2) == 0) {
            console.log(`son iguales`)
            console.log(codeTable_1)
            console.log(codeTable_2)
            addRow(tablas[0][index_t1], tablas[1][index_t2])

            index_t1++
            index_t2++

        } else if (compareCodes(codeTable_1, codeTable_2) < 0) {
            console.log(`${codeTable_1} es menor que ${codeTable_2}`)
            addRow(tablas[0][index_t1], rowMissing())

            index_t1++
        } else {
            console.log(`${codeTable_1} es mayor que ${codeTable_2}`)
            addRow(rowMissing(), tablas[1][index_t2])

            index_t2++
        }
    }
}
const rowMissing = () => {
    return { "code": "missing", "description": "missing", "units": "missing" }
}

const printTable = () => {

    const tablaBodyDOM = document.querySelector(`.tablaBodyDOM`)

    combinedTables.forEach((row) => {

        const tablaRowDOM = document.createElement(`tr`)

        tablaRowDOM.innerHTML = `
                <td>${row.code_1}</td>
                <td>${row.description_1}</td>
                <td>${row.units_1}</td>
                <td>${row.code_2}</td>
                <td>${row.description_2}</td>
                <td>${row.units_2}</td>
            `
            console.log(tablaRowDOM)
        tablaBodyDOM.appendChild(tablaRowDOM)


    })
}

const inputsAreEmpty = () =>{
    let empty = false
    textForms.forEach((textForm)=>{
        if(textForm.value.length === 0 && tablas.length === 0){
            empty = true
        }
    })
    return empty
}

buttonForm.addEventListener(`click`, ()=>{

    // Coprueba que haya contenido en los inputs
    // Sale si estan vacios
    if(inputsAreEmpty()){
        return
    }

    const tablaBodyDOM = document.querySelector(`.tablaBodyDOM`)
    tablaBodyDOM.innerHTML = ``
    combinedTables = []

    handleButtonClick()
    sortTable()
    formatTable()

    // let row = 1
    compareTable()
    printTable()

    console.log(combinedTables)
})
