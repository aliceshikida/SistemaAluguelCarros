# Modelagem de domínio (didática)

- `Usuario`: classe base conceitual para autenticação e identificação.
- `Cliente`: especialização de Usuario com dados financeiros (empregadores e rendimentos).
- `Agente`: especialização de Usuario para avaliação de pedidos.
- `Empresa` e `Banco`: especializações de Agente.
- `PedidoAluguel`: intenção de aluguel criada por Cliente e avaliada por Agente.
- `Contrato`: execução formal após aprovação do pedido.
- `ContratoCredito`: opcional, concedido apenas por Banco.
- `Automovel`: recurso alugável com registro de propriedade.
- `Empregador` e `Rendimento`: suporte à análise financeira do Cliente.
