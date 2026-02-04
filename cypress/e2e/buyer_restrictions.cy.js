describe('Buyer restrictions', () => {
  it('prevents buyer from creating or editing products', () => {
    const sellerEmail = `seller_${Date.now()}@test.com`;
    const buyerEmail = `buyer_${Date.now()}@test.com`;

    // seller register/login
    cy.request('POST', '/register', { email: sellerEmail, password: 'password', role: 'seller' });
    cy.request('POST', '/login', { email: sellerEmail, password: 'password' });

    // seller creates product
    cy.request('POST', '/products', { name: 'Seller Product' }).then(res => {
      const productId = res.body.id;

      // logout seller
      cy.request('POST', '/logout');

      // buyer register/login
      cy.request('POST', '/register', { email: buyerEmail, password: 'password', role: 'buyer' });
      cy.request('POST', '/login', { email: buyerEmail, password: 'password' });

      // buyer tries to edit seller product → 403
      cy.request({
        method: 'PUT',
        url: `/products/${productId}`,
        body: { name: 'Hack' },
        failOnStatusCode: false
      }).its('status').should('eq', 403);

      // buyer tries to create product → 403
      cy.request({
        method: 'POST',
        url: '/products',
        body: { name: 'New Buyer Product' },
        failOnStatusCode: false
      }).its('status').should('eq', 403);
    });
  });
});
