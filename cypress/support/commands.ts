Cypress.Commands.add("login", (email: string, password: string) => {
  cy.intercept("POST", "/api/auth/login", {
    statusCode: 200,
    body: { user: { id: 1, email } },
  }).as("loginRequest");

  cy.visit("/login");
  cy.get('input[type="email"]').type(email);
  cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.wait("@loginRequest");
});
