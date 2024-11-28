import React, { useState, useEffect } from 'react';
import './Produtos.css'; // Arquivo de estilos separado

const CadastroProdutos = () => {
  const [nomeProduto, setNomeProduto] = useState('');
  const [valorCusto, setValorCusto] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [produtos, setProdutos] = useState([]);

  // Função para carregar a lista de produtos
  const carregarProdutos = async () => {
    try {
      const response = await fetch('http://localhost:8000/produtos');
      if (response.ok) {
        const data = await response.json();
        setProdutos(data);
      } else {
        setMensagem('Erro ao carregar a lista de produtos.');
      }
    } catch (err) {
      setMensagem('Erro ao conectar com a API.');
    }
  };

  // Função para cadastrar um produto
  const handleCadastro = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/produtos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: nomeProduto,
          valor_custo: parseFloat(valorCusto),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMensagem('Produto cadastrado com sucesso!');
        setNomeProduto('');
        setValorCusto('');
        carregarProdutos(); // Atualiza a lista de produtos
      } else {
        const error = await response.json();
        setMensagem(`Erro: ${error.detail}`);
      }
    } catch (err) {
      setMensagem('Erro ao conectar com a API.');
    }
  };

  const handleLimpar = () => {
    setNomeProduto('');
    setValorCusto('');
    setMensagem('');
  };

  // Carregar a lista de produtos ao montar o componente
  useEffect(() => {
    carregarProdutos();
  }, []);

  return (
    <div className="content">
      <div className="formulario-cadastro">
        <h2>Cadastro de Produtos</h2>
        <form onSubmit={handleCadastro}>
          <div className="input-group">
            <label>Produto</label>
            <input
              type="text"
              placeholder="Nome do produto"
              value={nomeProduto}
              onChange={(e) => setNomeProduto(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Custo (R$)</label>
            <input
              type="number"
              placeholder="0.00"
              value={valorCusto}
              onChange={(e) => setValorCusto(e.target.value)}
              required
              step="0.01"
            />
          </div>
          <div className="button-group">
            <button type="submit">Cadastrar</button>
            <button type="button" onClick={handleLimpar}>
              Limpar
            </button>
          </div>
        </form>
        {mensagem && <p className="mensagem">{mensagem}</p>}
      </div>
      <div className="lista-produtos">
        <h3>Lista de Produtos</h3>
        {produtos.length > 0 ? (
          <div className="quadro">
          <ul>
            {produtos.map((produto) => (
              <li key={produto.id}>
                {produto.nome} - R$ {produto.valor_custo.toFixed(2)}
              </li>
            ))}
          </ul>
          </div>
        ) : (
          <p>Nenhum produto adicionado</p>
        )}
      </div>
    </div>
  );
};

export default CadastroProdutos;
