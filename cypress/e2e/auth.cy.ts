// cypress/e2e/auth.cy.ts
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

// cypress/e2e/products.cy.ts
describe("Products Page", () => {
  beforeEach(() => {
    // Load fixture data and intercept API calls
    cy.fixture("products.json").as("productsData");
    cy.intercept("GET", "/api/products*", { fixture: "products.json" }).as(
      "getProducts"
    );
    cy.visit("/products");
  });

  it("should display products correctly", () => {
    cy.wait("@getProducts");
    cy.get("@productsData").then((data: any) => {
      // Check if all products are displayed
      data.products.forEach((product: any) => {
        cy.contains(product.name).should("be.visible");
        cy.contains(product.price.toFixed(2)).should("be.visible");
      });
    });
  });

  it("should sort products by price", () => {
    cy.contains("button", "Price").click();
    cy.wait("@getProducts");

    // Check if URL contains sort parameters
    cy.url().should("include", "sortBy=price");
  });

  it("should sort products by name", () => {
    cy.contains("button", "Name").click();
    cy.wait("@getProducts");

    cy.url().should("include", "sortBy=name");
  });
});

// cypress/e2e/cart.cy.ts
describe("Shopping Cart", () => {
  beforeEach(() => {
    // Mock product data
    cy.intercept("GET", "/api/products*", { fixture: "products.json" }).as(
      "getProducts"
    );
    cy.visit("/products");
  });

  it("should add product to cart", () => {
    cy.wait("@getProducts");

    // Click add to cart button on first product
    cy.contains("button", "Add to Cart").first().click();

    // Verify cart count updated
    cy.get('[data-testid="cart-count"]').should("contain", "1");

    // Verify notification appears
    cy.contains("added to cart").should("be.visible");
  });

  it("should show cart summary", () => {
    // Add product to cart
    cy.wait("@getProducts");
    cy.contains("button", "Add to Cart").first().click();

    // Go to cart page
    cy.get('[href="/cart"]').click();

    // Verify product details in cart
    cy.contains("Classic Pearl Earrings").should("be.visible");
    cy.contains("$99.99").should("be.visible");
  });
});

// cypress/e2e/checkout.cy.ts
describe("Checkout Process", () => {
  beforeEach(() => {
    // Mock authenticated user
    cy.intercept("GET", "/api/auth/check", {
      statusCode: 200,
      body: { user: { id: 1, email: "test@example.com" } },
    });

    // Add item to cart and go to checkout
    cy.visit("/products");
    cy.contains("button", "Add to Cart").first().click();
    cy.visit("/checkout");
  });

  it("should complete checkout successfully", () => {
    // Mock successful checkout
    cy.intercept("POST", "/api/checkout", {
      statusCode: 200,
      body: { orderId: 123 },
    }).as("checkoutRequest");

    // Fill checkout form
    cy.get('input[name="name"]').type("John Doe");
    cy.get('input[name="email"]').type("john@example.com");
    cy.get('input[name="address"]').type("123 Main St");
    cy.get('input[name="city"]').type("New York");
    cy.get('input[name="postalCode"]').type("12345");
    cy.get('select[name="country"]').select("France");

    // Submit order
    cy.contains("button", "Pay").click();

    // Verify redirect to confirmation
    cy.wait("@checkoutRequest");
    cy.url().should("include", "/checkout/confirmation");
    cy.contains("Thank You for Your Order!").should("be.visible");
  });

  it("should validate form fields", () => {
    // Try to submit without filling form
    cy.contains("button", "Pay").click();

    // Check for validation messages
    cy.contains("Name is required").should("be.visible");
    cy.contains("Email is required").should("be.visible");
    cy.contains("Address is required").should("be.visible");
  });
});

// cypress/e2e/profile.cy.ts
describe("Profile Page", () => {
  beforeEach(() => {
    // Mock authenticated user
    cy.intercept("GET", "/api/auth/check", {
      statusCode: 200,
      body: { user: { id: 1, email: "test@example.com" } },
    });

    // Mock orders
    cy.intercept("GET", "/api/orders", { fixture: "orders.json" }).as(
      "getOrders"
    );

    cy.visit("/profile");
  });

  it("should display order history", () => {
    cy.wait("@getOrders");

    // Verify order details are displayed
    cy.contains("Order #1").should("be.visible");
    cy.contains("Classic Pearl Earrings").should("be.visible");
    cy.contains("completed").should("be.visible");
  });

  it("should redirect to login if not authenticated", () => {
    // Mock unauthenticated response
    cy.intercept("GET", "/api/auth/check", {
      statusCode: 401,
      body: { error: "Not authenticated" },
    });

    cy.visit("/profile");
    cy.url().should("include", "/login");
  });
});
