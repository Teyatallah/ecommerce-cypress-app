describe("Authentication", () => {
  beforeEach(() => {
    // Reset any previous session
    cy.clearLocalStorage();
  });

  it("should login successfully with correct credentials", () => {
    // Intercept the login API call and mock the response
    cy.intercept("POST", "/api/auth/login", {
      statusCode: 200,
      body: { user: { id: 1, email: "test@example.com" } },
    }).as("loginRequest");

    cy.visit("/login");

    // Fill in the login form
    cy.get('input[type="email"]').type("test@example.com");
    cy.get('input[type="password"]').type("password123");
    cy.get('button[type="submit"]').click();

    // Wait for login request and verify redirect
    cy.wait("@loginRequest");
    cy.url().should("eq", Cypress.config().baseUrl + "/");
  });

  it("should show error message with incorrect credentials", () => {
    cy.intercept("POST", "/api/auth/login", {
      statusCode: 401,
      body: { error: "Invalid credentials" },
    }).as("loginRequest");

    cy.visit("/login");

    cy.get('input[type="email"]').type("wrong@example.com");
    cy.get('input[type="password"]').type("wrongpassword");
    cy.get('button[type="submit"]').click();

    cy.wait("@loginRequest");
    cy.contains("Invalid credentials").should("be.visible");
  });
});
