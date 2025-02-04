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

    // Verify total price
    cy.contains("Total:").should("be.visible");
    cy.contains("$99.99").should("be.visible"); // Assuming only one product is added
  });

  it("should update product quantity in cart", () => {
    // Add product to cart
    cy.wait("@getProducts");
    cy.contains("button", "Add to Cart").first().click();

    // Go to cart page
    cy.get('[href="/cart"]').click();

    // Verify initial quantity
    cy.contains("Classic Pearl Earrings")
      .parent()
      .parent()
      .within(() => {
        cy.get("span").contains("1").should("be.visible"); // Initial quantity
      });

    // Increase quantity
    cy.contains("Classic Pearl Earrings")
      .parent()
      .parent()
      .within(() => {
        cy.get('[data-testid="increase-quantity"]').click(); // Click the plus button
      });

    // Verify updated quantity
    cy.contains("Classic Pearl Earrings")
      .parent()
      .parent()
      .within(() => {
        cy.get("span").contains("2").should("be.visible"); // Updated quantity
      });

    // Verify total price updates
    cy.contains("Total:").should("be.visible");
    cy.contains("$199.98").should("be.visible"); // 2 x $99.99
  });
});
