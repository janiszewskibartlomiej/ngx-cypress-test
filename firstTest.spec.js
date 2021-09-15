/// <reference types="cypress" />

import { isFunctionOrConstructorTypeNode } from "typescript"


describe('Our first suite', () => {

    
    it('first test', () => {

        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        //by Tag name
        cy.get('input')

        //by ID
        cy.get('#inputEmail1')

        //by Class name
        cy.get('.input-full-width')

        //by Attribute name
        cy.get('[placeholder]')

        //by Attribute name and value
        cy.get('[placeholder="Email"]')

        //by Class value
        cy.get('[class="input-full-width size-medium shape-rectangle"]')

        //by Tag name and Attribute with value
        cy.get('input[placeholder="Email"]')

        //by two different attributes
        cy.get('[placeholder="Email"][type="email"]')

        //by tag name, Attribute with value, ID and Class name
        cy.get('input[placeholder="Email"]#inputEmail1.input-full-width')

        //The most recommended way by Cypress
        cy.get('[data-cy="imputEmail1"]')

    })

    it('second test', () => {

        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        cy.get('[data-cy="signInButton"]')

        cy.contains('Sign in')

        cy.contains('[status="warning"]', 'Sign in')

        cy.get('#inputEmail3')
        .parents('form')
        .find('button') //find dziala tylko na child element
        .should('contain', 'Sign in')
        .parents('form')
        .find('nb-checkbox')
        .click()

        cy.contains('nb-card', 'Horizontal form').find('[type="email"]') //w contains  w tej konstrukcji znajdujemy tag name nb-card ktory ma text 'Horizontal form'
    })

    it('then and wrap methods', () => {
        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        cy.contains('nb-card', 'Using the Grid')
            .find('[for="inputEmail1"]')
            .should('contain', 'Email')


        cy.contains('nb-card', 'Using the Grid')
            .find('[for="inputPassword2"]')
            .should('contain', 'Password')


        cy.contains('nb-card', 'Basic form')
            .find('[for="exampleInputEmail1"]')
            .should('contain', 'Email address')

        cy.contains('nb-card', 'Basic form')
            .find('[for="exampleInputPassword1"]')
            .should('contain', 'Password')

        // selenium - takie podejscie by dzialalo ale vvv
        // const firstElemnt = cy.contains('nb-card', 'Using the Grid')
        // firstElemnt.find('[for="inputEmail1"]')
        // .should('contain', 'Email')
        // firstElemnt.find('[for="inputPassword2"]')
        // .should('contain', 'Password')
        // Tak nie da rady bo cypress jest asynchroniczny i sie wysypie - nie da rady zapisac obiektu czy contextu

        //cypres style
        cy.contains('nb-card', 'Using the Grid').then( firstForm => {
        const emailLabelFirst = firstForm.find('[for="inputEmail1"]').text()
        const passwordLabelFirst = firstForm.find('[for="inputPassword2"]').text()

        expect(emailLabelFirst).to.equal('Email')
        expect(passwordLabelFirst).to.equal('Password')

        cy.contains('nb-card', 'Basic form').then(secondForm => { // secondForm to obiekt jQuery dlatego ma inne metody niz cypress
            const passwordLabelSecond = secondForm.find('[for="exampleInputPassword1"]').text() //ten find pochodzi jQuery dlatego wolamy text()
            cy.log(passwordLabelSecond)

            expect(passwordLabelFirst).to.equal(passwordLabelSecond) //mozemy uzyc pierwszej zmiennej bo jestesmy w tym samym bloku kodu

            // mozna zmienic obiekt na cypresowy i tedy kozystac z metody should
            cy.wrap(secondForm).find('[for="exampleInputPassword1"]').should('contain', passwordLabelFirst)
        })
    })

    })

    it('invoke command', () => {
        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        //1
        cy.get('[for="exampleInputEmail1"]').should('contain', 'Email address')

        //2
        cy.get('[for="exampleInputEmail1"]').then( label => {
            expect(label.text()).to.equal('Email address')

        //3
        cy.get('[for="exampleInputEmail1"]').invoke('text').then(text => {
            expect(text).to.equal('Email address')
        })
        
        cy.contains('nb-card', 'Basic form')
            .find('nb-checkbox')
            .click()
            .find('.custom-checkbox')
            .invoke('attr', 'class')
            // .should('contain', 'checked')  ,, to jest jeden sposob a drugi z z then
            .then(classValue => {
                expect(classValue).to.contain('checked')
        })
        })
    })

    it('assert property', () => {

        function selectDayFromCurrent(day) {

            let date = new Date()
            date.setDate(date.getDate() + day)
            let futureDay = date.getDate()
            let futureMonth = date.toLocaleString("en-us", {month: "short"})
            let dataAssert = futureMonth + " " + futureDay + ", " + date.getFullYear()
            console.log(futureDay, futureMonth, dataAssert) // printuje do konsoli

            cy.get("nb-calendar-navigation").invoke("attr", "ng-reflect-date").then( (dateAttribute) => {
                cy.log(futureMonth, dateAttribute)
                if (!dateAttribute.includes(futureMonth)) {
                    cy.get("[data-name='chevron-right']").click()
                    selectDayFromCurrent(day) // w js mozna wywolywac funkcje wewnatrz funkcji
                } else {
                    cy.get("nb-calendar-day-picker [class='day-cell ng-star-inserted']").contains(futureDay).click()
                }
            })
            return dataAssert
        }

        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Datepicker').click()

        cy.contains('nb-card', 'Common Datepicker').find('input').then( input => {
            cy.wrap(input).click()
            
            let dataAssert = selectDayFromCurrent(1)

            // cy.get('nb-calendar-day-picker').contains('17').click()
            cy.wrap(input).invoke('prop', 'value').should('contain', dataAssert)
        })
    })

    it('radio button', () => {
        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        cy.contains('nb-card', 'Using the Grid').find('[type="radio"]').then(radioButtons => {
            cy.wrap(radioButtons)
                .first()
                .check({force: true})
                .should('be.checked')

            cy.wrap(radioButtons)
                .eq(1)
                .check({force: true})

            cy.wrap(radioButtons)
                .eq(0)
                .should('not.be.checked')

            cy.wrap(radioButtons)
                .eq(2)
                .should('be.disabled')

        })
    })

    it('check boxes', () => {
        cy.visit('/')
        cy.contains('Modal & Overlays').click()
        cy.contains('Toastr').click()

        cy.get('[type="checkbox"]').check({force: true}) // ta metoda zaznaczy wszytskie checkboxy [bo ten selector znajdzie 3 elelmentty] ale nie mozna uzyc do uncheck
        cy.get('[type="checkbox"]').eq(0).click({force: true})
        cy.get('[type="checkbox"]').eq(1).click({force: true})

        cy.get('[type="checkbox"]').eq(1).check({force: true}) // rekomendowany do zaznaczania jest check anie click

    })

    it('list and dropdowns', () => {
        cy.visit('/')

        //1 
        // cy.get('nav nb-select').click()
        // cy.get('.options-list').contains('Dark').click()
        // cy.get('nav nb-select').should('contain', 'Dark')
        // cy.get('nb-layout-header nav').should('have.css', 'background-color', 'rgb(34, 43, 69)')

        //2
        cy.get('nav nb-select').then( dropdown => {
            cy.wrap(dropdown).click()
            cy.get('.options-list nb-option').each((listItem, index) => {
                const itemText = listItem.text().trim() //metoda trim w jquery czysci biale zanki

                const colors = {
                    "Light": "rgb(255, 255, 255)",
                    "Dark": "rgb(34, 43, 69)",
                    "Cosmic": "rgb(50, 50, 89)",
                    "Corporate": "rgb(255, 255, 255)"
                }

                cy.wrap(listItem).click()
                cy.wrap(dropdown).should('contain', itemText)
                cy.get('nb-layout-header nav').should('have.css', 'background-color', colors[itemText])

                if(index < 3){
                    cy.wrap(dropdown).click()
                }
            })
        })
    })

    it("Web table", () => {
        cy.visit('/')
        cy.contains('Tables & Data').click()
        cy.contains('Smart Table').click()
        // 1
        cy.get("tbody").contains("tr", "Larry").then( (tabeRow) => {
            cy.wrap(tabeRow).find(".nb-edit").click()
            cy.wrap(tabeRow).find("[placeholder='Age']").clear().type("25")
            cy.wrap(tabeRow).find(".nb-checkmark").click()
            cy.wrap(tabeRow).find("td").eq("6").should("contain", "25")
        })
        // 2
        cy.get("thead").find(".nb-plus").click()
        cy.get("thead").find("tr").eq("2").then( (tabeRow) => {
            cy.wrap(tabeRow).find("[placeholder='First Name']").type("Aron")
            cy.wrap(tabeRow).find("[placeholder='Last Name']").type("Bonifacy")
            cy.wrap(tabeRow).find(".nb-checkmark").click()

        })
        cy.get("tbody tr").first().find("td").then( (tableColumn) => {
            cy.wrap(tableColumn).eq("2").should("contain", "Aron")
            cy.wrap(tableColumn).eq("3").should("contain", "Bonifacy")
        })
        // 3
        const age = [20, 30, 40, 200]

        cy.wrap(age).each( (age) => {
            cy.get("thead [placeholder='Age']").clear().type(age)
            cy.wait(500)
            cy.get("tbody tr").each( (row) => {
                if (age == 200) {
                    cy.wrap(row).find("td").should("have.text", "No data found").should("be.visible")
                } else {
                    cy.wrap(row).find("td").eq("6").should("contain", age)
                }
            })
        })
       
    })

    it("tooltip", () => {
        cy.visit('/')
        cy.contains('Modal & Overlays').click()
        cy.contains('Tooltip').click()
        cy.contains("nb-card", "Colored Tooltips")
            .contains("Default")
            .click()
        cy.get("nb-tooltip").should("contain", "This is a tooltip")
    })

    it.only("dilog box", () => {
        cy.visit('/')
        cy.contains('Tables & Data').click()
        cy.contains('Smart Table').click()

        // 1 w tym wypadku test przejdzi enawet jak ni eznajdzi etego elelmntu
        // cy.get("tbody tr").first().find(".nb-trash").click()
        // cy.on("window:confirm", (confirm) => {
        //     expect(confirm).to.equal("Are you sure you want to delete?")
        // })

        // 2 leprza metoda od nr 1 poniewaz stub() przetrzymuje stan jak nie znajdzie tego elementu 'window:confirm' to bedzi emial wartosc none na call(0)
        const stub = cy.stub()
        cy.on("window:confirm", stub)
        cy.get("tbody tr").first().find(".nb-trash").click().then( () => {
            expect(stub.getCall(0)).to.be.calledWith("Are you sure you want to delete?")
        })

        // 3 - canceled alert - klink NO
        cy.get("tbody tr").first().find(".nb-trash").click()
        cy.on("window:confirm", () => false)
    })
})

