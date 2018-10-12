// https://docs.cypress.io/api/introduction/api.html

describe("Layout", () => {
  it("Has a ConfigEdit section", () => {
    cy.visit("/")
    cy.contains("h1", "Raw Configuration");
  });
  it("Has a QuickEdit section", () => {
    cy.contains("h1", "QuickEdit Section");
  });
})
