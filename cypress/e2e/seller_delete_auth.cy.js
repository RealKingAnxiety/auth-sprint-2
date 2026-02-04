describe('Seller delete product', () => {
  it('allows seller to delete their own product', () => {
    const email = `seller_${Date.now()}@test.com`;

    cy.request('POST', '/register', { email, password: 'password', role: 'seller' });
    cy.request('POST', '/login', { email, password: 'password' });

    cy.request('POST', '/products', { name: 'Product To Delete' }).then(res => {
      const productId = res.body.id;

      cy.request('DELETE', `/products/${productId}`).then(deleteRes => {
        expect(deleteRes.status).to.eq(200);
        expect(deleteRes.body.success).to.eq(true);
        expect(deleteRes.body.id).to.eq(productId);
      });
    });
  });
});
