describe('Seller edit product', () => {
  it('allows seller to edit their own product', () => {
    const email = `seller_${Date.now()}@test.com`;

    cy.request('POST', '/register', { email, password: 'password', role: 'seller' });
    cy.request('POST', '/login', { email, password: 'password' });

    cy.request('POST', '/products', { name: 'Original Product' }).then(res => {
      const productId = res.body.id;

      cy.request('PUT', `/products/${productId}`, { name: 'Updated Product' }).then(editRes => {
        expect(editRes.status).to.eq(200);
        expect(editRes.body.success).to.eq(true);
        expect(editRes.body.id).to.eq(productId);
      });
    });
  });
});
