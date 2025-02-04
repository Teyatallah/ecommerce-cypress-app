describe("Checkout Process", () => {
  beforeEach(() => {
    // Clear previous state
    cy.clearCookies();
    cy.clearLocalStorage();

    // Intercept cart RSC requests
    cy.intercept("GET", "/cart?_rsc=*", {
      statusCode: 200,
      body: null,
    }).as("cartRsc");

    // Intercept auth checks
    cy.intercept("GET", "/api/auth/check", {
      statusCode: 200,
      body: { user: { id: 1, email: "test@example.com" } },
    }).as("authCheck");

    cy.intercept("POST", "/api/auth/login", {
      statusCode: 200,
      body: {
        user: { id: 1, email: "test@example.com" },
        token: "fake-jwt-token",
      },
    }).as("loginRequest");

    // Setup cart items first
    const cartItems = [
      {
        id: 1,
        name: "Classic Pearl Earrings",
        price: 99.99,
        quantity: 1,
        image: "/earings/1.png",
      },
    ];

    // Set cart items in localStorage
    cy.window().then((win) => {
      win.localStorage.setItem("cart", JSON.stringify(cartItems));
    });

    // Visit login with redirect
    cy.visit("/login?redirect=/checkout");

    // Login
    cy.get('input[type="email"]').type("test@example.com");
    cy.get('input[type="password"]').type("password123");

    // Set auth cookie
    cy.setCookie("token", "fake-jwt-token");

    // Click login
    cy.get('button[type="submit"]').click();

    // Wait for login and verify we reach checkout
    cy.wait("@loginRequest");
    cy.url().should("include", "/checkout");

    // Re-set cart items to ensure they persist
    cy.window().then((win) => {
      win.localStorage.setItem("cart", JSON.stringify(cartItems));
    });

    // Wait for auth check
    cy.wait("@authCheck");

    // Verify checkout page loaded
    cy.get("h1").should("be.visible").and("contain", "Checkout");
  });

  it("should complete checkout successfully", () => {
    // Mock successful checkout response
    cy.intercept("POST", "/api/checkout", {
      statusCode: 200,
      body: { orderId: 123 },
    }).as("checkoutRequest");

    // Re-set cart items before form fill
    const cartItems = [
      {
        id: 1,
        name: "Classic Pearl Earrings",
        price: 99.99,
        quantity: 1,
        image: "/earings/1.png",
      },
    ];

    cy.window().then((win) => {
      win.localStorage.setItem("cart", JSON.stringify(cartItems));
    });

    // Fill form using aliases to handle page updates
    cy.get('input[name="name"]').as("nameInput");
    cy.get("@nameInput").type("John Doe", { force: true });

    cy.get('input[name="email"]').as("emailInput");
    cy.get("@emailInput").type("john@example.com", { force: true });

    cy.get('input[name="address"]').as("addressInput");
    cy.get("@addressInput").type("123 Main St", { force: true });

    cy.get('input[name="city"]').as("cityInput");
    cy.get("@cityInput").type("New York", { force: true });

    cy.get('input[name="postalCode"]').as("postalInput");
    cy.get("@postalInput").type("12345", { force: true });

    cy.get('select[name="country"]').as("countrySelect");
    cy.get("@countrySelect").select("France", { force: true });

    // Fill card details using aliases
    cy.get('input[value="card"]').as("cardRadio");
    cy.get("@cardRadio").click({ force: true });

    cy.get('input[name="cardNumber"]').as("cardNumber");
    cy.get("@cardNumber").type("4242424242424242", { force: true });

    cy.get('input[name="expiryDate"]').as("expiry");
    cy.get("@expiry").type("1225", { force: true });

    cy.get('input[name="cvv"]').as("cvv");
    cy.get("@cvv").type("123", { force: true });

    // Submit order
    cy.get('button[type="submit"]').click({ force: true });

    // Verify checkout completion
    cy.wait("@checkoutRequest");
    cy.url().should("include", "/checkout/confirmation");
    cy.contains("Thank You for Your Order!").should("be.visible");
    cy.contains("Order #123").should("be.visible");
  });
});
