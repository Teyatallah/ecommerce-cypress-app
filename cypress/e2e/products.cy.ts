describe("Products Page", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/api/products*", { fixture: "products.json" }).as(
      "getProducts"
    );
    cy.visit("/products");
    cy.wait("@getProducts");
  });

  it("should display products correctly", () => {
    // Check if products are loaded by verifying product elements
    cy.get(".font-semibold.text-gray-900").should("have.length.at.least", 1);

    // Verify product data
    cy.fixture("products.json").then((data) => {
      data.forEach((product) => {
        // Check product name
        cy.contains(".font-semibold.text-gray-900", product.name).should(
          "be.visible"
        );

        // Check product price
        cy.contains(
          ".text-lg.font-bold.text-rose-700",
          `$${product.price.toFixed(2)}`
        ).should("be.visible");

        // Check category
        cy.contains(".text-sm.text-rose-500", product.category.name).should(
          "be.visible"
        );
      });
    });
  });

  it("should sort products by name", () => {
    // Intercept the products request and return the sorted fixture
    cy.intercept("GET", "**/api/products*", {
      fixture: "sorted-products-name-asc.json",
    }).as("getSortedProducts");

    // Click the "Name" button to sort by name
    cy.contains("button", "Name").click();

    // Wait for the sorted products to be loaded
    cy.wait("@getSortedProducts");

    // Verify name order
    cy.get(".font-semibold.text-gray-900").then(($names) => {
      const names = [...$names].map((el) => el.innerText.trim());
      const sortedNames = [...names].sort((a, b) => a.localeCompare(b));

      expect(names).to.deep.equal(sortedNames);
    });

    // Check URL
    cy.url().should("include", "sortBy=name");
  });

  it("should sort products by price", () => {
    // Intercept the products request and return the sorted fixture
    cy.intercept("GET", "**/api/products*", {
      fixture: "sorted-products-price-asc.json",
    }).as("getSortedProducts");

    // Click the "Price" button to sort by price
    cy.contains("button", "Price").click();

    // Wait for the sorted products to be loaded
    cy.wait("@getSortedProducts");

    // Verify price order
    cy.get("span.text-lg.font-bold.text-rose-700").then(($prices) => {
      const prices = [...$prices].map((el) =>
        parseFloat(el.innerText.replace("$", ""))
      );

      // Check if prices are sorted in ascending order
      const isSorted = prices.every(
        (val, i) => i === 0 || val >= prices[i - 1]
      );
      expect(isSorted).to.be.true;
    });

    // Check URL
    cy.url().should("include", "sortBy=price");
  });

  it("should add product to cart and show toast", () => {
    // Click add to cart button
    cy.contains("button", "Add to Cart").first().click();

    // Verify toast appears with correct styling
    cy.get(".custom-toast") // Use the custom class
      .should("be.visible")
      .should("have.css", "background-color", "rgb(244, 63, 94)") // #f43f5e
      .should("have.css", "color", "rgb(255, 255, 255)");

    // Verify toast message
    cy.fixture("products.json").then((data) => {
      const firstProduct = data[0];
      cy.contains(`${firstProduct.name} added to cart!`).should("be.visible");
    });
  });

  it("should navigate to product details on click", () => {
    cy.fixture("products.json").then((data) => {
      const firstProduct = data[0];

      // Click on first product
      cy.contains(".font-semibold.text-gray-900", firstProduct.name)
        .parent()
        .parent()
        .parent()
        .click();

      // Verify navigation
      cy.url().should("include", `/products/${firstProduct.id}`);
    });
  });
});
