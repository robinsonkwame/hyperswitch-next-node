// cypress/integration/payment_workflow_spec.js

// Add this function at the top of your test file or in a separate utilities file
const getIframeBody = () => {
  return cy
    .get('iframe[name*="unified-checkout"]')
    .should('be.visible')
    .then(cy.wrap)
    .its('0.contentDocument.body').should('not.be.empty')
    .then(cy.wrap)
}

const typeIntoLabeledInput = (label: string, value: string) => {
  cy.contains('div', label)
    .next('div')
    .find('input')
    .should('be.visible')
    .type(value);
}

describe('Payment Workflow Test', () => {
  let consoleErrors = [];

  beforeEach(() => {
    // Ignore specific uncaught exceptions
    Cypress.on('uncaught:exception', (err) => {
      if (err.message.includes('Failed to execute \'attachShadow\' on \'Element\'')) {
        return false;
      }
    });
  });

  beforeEach(() => {
    // Capture console errors
    cy.on('window:before:load', (win) => {
      const originalConsoleError = win.console.error;
      win.console.error = function (...args) {
        consoleErrors.push(args);
        originalConsoleError.apply(win.console, args);
      };
    });
  });


  it('Completes a payment from intent creation to confirmation', () => {
    // Step 1: Add default billing address and proceed to next step
    cy.visit('http://localhost:3000');
    cy.get('#name').type('Jamal Jarad');
    cy.get('#street').type('123 Grand Avenue');
    cy.get('#city').type('Detroit');
    cy.get('#state').type('MI');
    cy.get('#zip').type('48201');
    cy.get('#email').type('jamal@example.com');
    cy.get('#phone').type('123-456-7890');
    cy.get('form').submit();

    // Wait for the iframe to load
    cy.get('iframe[name*="unified-checkout"]').should('be.visible');

    // Optional: Add an intercept to ensure the iframe content is fully loaded
    cy.intercept('GET', 'https://beta.hyperswitch.io/**').as('iframeLoaded');
    cy.wait('@iframeLoaded');

    // Interact with elements inside the iframe
    cy.wait(2000); // Add a wait before interacting with the iframe content
    getIframeBody().within(() => {
      typeIntoLabeledInput('Card Number', '4242424242424242');
      typeIntoLabeledInput('Expiry', '4/44');
      typeIntoLabeledInput('CVC', '123');
      typeIntoLabeledInput('Card Nickname', 'My Test Card');
    });
    
    cy.get('button').contains('Add Card').should('be.visible').click();

    // Wait for navigation or a specific element to appear after card addition
    cy.get('body', { timeout: 5000 }).should('not.contain', 'Add Card');

    // If there's a specific success message or element, wait for it
    cy.contains('Card added successfully', { timeout: 10000 }).should('be.visible');

    cy.log('Test completed successfully');
  });

  afterEach(() => {
    if (consoleErrors.length > 0) {
      consoleErrors.forEach((error) => {
        cy.log('Console Error:', error.join(' '));
      });
    } else {
      cy.log('No console errors captured.');
    }
    // Reset consoleErrors for the next test
    consoleErrors = [];
  });  
});