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

    // Add another product to cart
    cy.get('button:contains("Add to Cart")').eq(1).click(); 

    // Verify updated quantity
    cy.get('[data-testid="cart-count"]').should("contain", "2");

    // Verify notification appears
    cy.contains("added to cart").should("be.visible");
    // Verify product details in cart

    // Go to cart page
    cy.get('[href="/cart"]').click();

    cy.contains("Classic Pearl Earrings").should("be.visible");
    cy.contains("Diamond Hoops").should("be.visible");

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

    // Verify updated quantity of the same product
    cy.contains("Classic Pearl Earrings")
      .parent()
      .parent()
      .within(() => {
        cy.get("span").contains("2").should("be.visible"); 
      });

    // Verify total price updates of 3 products 
    cy.get('[data-testid="cart-count"]').should("contain", "3");
    cy.contains("Total:").should("be.visible");
    cy.contains("$349.97").should("be.visible"); // 2 x $99.99+149.99

    
  });

  it("reduce the quantity of a product", () => {
    // Add product to cart
    cy.wait("@getProducts");
    cy.contains("button", "Add to Cart").first().click();

    // Go to cart page
    cy.get('[href="/cart"]').click();

    // Increase quantity
    cy.contains("Classic Pearl Earrings")
   .parent()
   .parent()
   .within(() => {
     cy.get('[data-testid="increase-quantity"]').click(); // Click the plus button
   });
   cy.get('[data-testid="cart-count"]').should("contain", "2");

   //Reduce quantity
   cy.contains("Classic Pearl Earrings")
   .parent()
   .parent()
   .within(() => {
     cy.get('[data-testid="decrease-quantity"]').click(); 
   });

    // Verify total price
    cy.get('[data-testid="cart-count"]').should("contain", "1");
    cy.contains("$99.99").should("be.visible"); 
  });



  it("remove a product from the cart", () => {
    // Add products to cart
    cy.wait("@getProducts");
    cy.contains("button", "Add to Cart").first().click();
    cy.get('button:contains("Add to Cart")').eq(1).click(); 
    // Go to cart page
    cy.get('[href="/cart"]').click();
    // remove a product from the cart
    cy.get('button').find('svg.lucide-trash2').eq(1).click();
    // Verify total price
    cy.get('[data-testid="cart-count"]').should("contain", "1");
    cy.contains("$149.99").should("be.visible"); 
  });


  it("should be clear whether the cart is empty after removing all items.", () => {
    // Add products to cart
    cy.wait("@getProducts");
    cy.contains("button", "Add to Cart").first().click();
    cy.get('button:contains("Add to Cart")').eq(1).click(); 
    cy.get('button:contains("Add to Cart")').eq(2).click(); 
    // Go to cart page
    cy.get('[href="/cart"]').click();
    // remove all product from the cart
    cy.get('button.text-rose-500').first().click();
    // Verify that the cart is empty
    cy.get('h2.text-2xl.font-bold.text-rose-900.mb-4')
  .should('be.visible')
  .and('contain', 'Your Cart is Empty');
  });
})

