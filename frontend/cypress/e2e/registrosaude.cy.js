describe('Registro de Saúde - fluxo completo', () => {

  beforeEach(() => {
    cy.visit('http://localhost:5173');
    cy.get('#email').type('cjeferson@gmail.com');
    cy.get('#password').type('Games157');

    cy.contains('button', 'Entrar').click();

    cy.url().should('include', '/dashboard');
    cy.contains('span', 'Registrar').click();
    cy.contains('Salvar Registro Clínico')
    .should('be.visible');
  });

  it('deve salvar registro clínico com sucesso', () => {

    cy.intercept('POST', 'http://localhost:3000/api/registros', {
      statusCode: 201,
      body: { message: 'Registro salvo com sucesso' }
    }).as('salvarRegistro');

    cy.get('#pressao').type('12/8');
    cy.get('#glicemia').type('95');
    cy.get('#batimentos').type('72');
    cy.get('#peso').type('74.2');

    cy.get('select').eq(0).select('Não possuo');
    cy.get('select').eq(1).select('Não possuo');
    cy.get('select').eq(2).select('Sim, tomei todos corretamente');
    cy.get('select').eq(3).select('Boa');

    cy.contains('button', 'Salvar Registro Clínico').click();

    cy.wait('@salvarRegistro');

    cy.contains('Tudo certo! Registro salvo com sucesso.')
      .should('be.visible');
  });

  it('deve impedir envio com campos obrigatórios vazios', () => {

  cy.contains('button', 'Salvar Registro Clínico').click();

  cy.get('#pressao')
    .then(($input) => {
      expect($input[0].validationMessage).to.eq('Preencha este campo.');
    });

  });

  it('deve bloquear envio quando não há token', () => {

    cy.window().then((win) => {
      win.localStorage.removeItem('tokenBemViver');
    });

    cy.get('#pressao').type('12/8');
    cy.get('#glicemia').type('95');
    cy.get('#batimentos').type('72');
    cy.get('#peso').type('74.2');

    cy.get('select').eq(0).select('Não possuo');
    cy.get('select').eq(1).select('Não possuo');
    cy.get('select').eq(2).select('Sim, tomei todos corretamente');
    cy.get('select').eq(3).select('Boa');

    cy.contains('button', 'Salvar Registro Clínico').click();

    cy.contains('Sessão inválida. Por favor, faça login novamente.')
      .should('be.visible');
  });

  it('deve exibir campos extras quando usuário tem diabetes', () => {

    cy.get('#pressao').type('12/8');
    cy.get('#glicemia').type('110');
    cy.get('#batimentos').type('80');
    cy.get('#peso').type('75');

    cy.get('select').eq(0).select('Sim, possuo');

    cy.contains('Detalhes sobre sua Glicemia')
      .should('be.visible');

    cy.get('select').eq(1).select('Sim, possuo');

    cy.contains('Como você está se sentindo?')
      .should('be.visible');
  });
});