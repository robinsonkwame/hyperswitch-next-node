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


describe('Payment Workflow Test', () => {
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
      cy.get('#card-element').should('be.visible').type('4242424242424242');
      cy.get('#card-expiry').should('be.visible').type('4/44');
      cy.get('#card-cvc').should('be.visible').type('123');
      cy.get('#submit-button').should('be.visible').click();
    });

    cy.log('Test completed successfully');
  });
});