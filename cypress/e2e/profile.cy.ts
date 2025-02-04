describe("Profile Page", () => {
  beforeEach(() => {
    // Clear previous state
    cy.clearCookies();
    cy.clearLocalStorage();

    // Mock authenticated user
    cy.intercept("GET", "/api/auth/check", {
      statusCode: 200,
      body: { user: { id: 1, email: "test@example.com" } },
    }).as("authCheck");

    // Mock orders with fixture
    cy.intercept("GET", "/api/orders", { fixture: "orders.json" }).as(
      "getOrders"
    );

    // Set up authentication in localStorage
    cy.window().then((win) => {
      win.localStorage.setItem(
        "auth",
        JSON.stringify({
          user: { id: 1, email: "test@example.com" },
          token: "fake-jwt-token",
        })
      );
    });

    // Set auth cookie
    cy.setCookie("token", "fake-jwt-token");

    // Visit profile page
    cy.visit("/profile");

    // Wait for initial auth check
    cy.wait("@authCheck");
  });

  it("should display order history", () => {
    // Wait for orders to load
    cy.wait("@getOrders");

    // Verify profile content is visible
    cy.contains("h1", "My Profile").should("be.visible");
    cy.contains("Account Details").should("be.visible");
    cy.contains("Order History").should("be.visible");

    // Check for the first order
    cy.get('[data-cy="order-item"]')
      .first()
      .within(() => {
        cy.contains("Order #17").should("be.visible");
        cy.contains("Bohemian Crystal Stud Earrings").should("be.visible");
        cy.contains("Pending").should("be.visible");
        cy.contains("$67.00").should("be.visible");
      });

    // Check for the order with multiple items
    cy.get('[data-cy="order-item"]')
      .last()
      .within(() => {
        cy.contains("Order #15").should("be.visible");
        cy.contains("Bohemian Topaz Statement Earrings").should("be.visible");
        cy.contains("Bohemian Crystal Stud Earrings").should("be.visible");
        cy.contains("$206.00").should("be.visible"); // 139 + 67
      });

    // Verify all orders are present
    cy.get('[data-cy="order-item"]').should("have.length", 3);
  });

  it("should redirect to login if not authenticated", () => {
    // Clear previous state
    cy.clearCookies();
    cy.clearLocalStorage();

    // Mock unauthenticated response
    cy.intercept("GET", "/api/auth/check", {
      statusCode: 401,
      body: { error: "Not authenticated" },
    }).as("authCheckFailed");

    // Visit profile page
    cy.visit("/profile");

    // Wait for auth check
    cy.wait("@authCheckFailed");

    // Should be redirected to login
    cy.url().should("include", "/login");
  });

  it("should display correct date format", () => {
    cy.wait("@getOrders");

    // Check date format for the first order
    cy.get('[data-cy="order-item"]')
      .first()
      .within(() => {
        const date = new Date("2025-01-26T20:47:58.521Z").toLocaleDateString();
        cy.contains(date).should("be.visible");
      });
  });

  it("should display correct order totals", () => {
    cy.wait("@getOrders");

    // Check total for order with multiple items
    cy.get('[data-cy="order-item"]')
      .last()
      .within(() => {
        cy.contains("Total").parent().contains("$206.00").should("be.visible");
      });
  });
});
