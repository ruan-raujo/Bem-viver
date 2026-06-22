describe('Página de Login', () => {

  beforeEach(() => {
    cy.visit('http://localhost:5173');
  });

  it('deve realizar login com sucesso', () => {
    cy.get('#email').type('cjeferson@gmail.com');
    cy.get('#password').type('Games157');

    cy.contains('button', 'Entrar').click();

    cy.url().should('include', '/dashboard');

    cy.window().then((win) => {
      expect(win.localStorage.getItem('tokenBemViver')).to.not.be.null;
    });
  });

  it('deve exibir erro ao informar senha incorreta', () => {
    cy.get('#email').type('cjeferson@gmail.com');
    cy.get('#password').type('SenhaErrada123');

    cy.contains('button', 'Entrar').click();

    cy.on('window:alert', (mensagem) => {
      expect(mensagem).to.contain('Credenciais inválidas');
    });
  });

  it('deve impedir login com campos obrigatórios vazios', () => {
    cy.contains('button', 'Entrar').click();

    cy.get('#email:invalid').should('exist');
  });

  it('deve impedir login com e-mail inválido', () => {
    cy.get('#email').type('email-invalido');
    cy.get('#password').type('123456');

    cy.contains('button', 'Entrar').click();

    cy.get('#email:invalid').should('exist');
  });

});