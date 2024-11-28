import React, { useState, useEffect } from 'react';
import './Servicos.css';

const CadastroServicos = () => {
  const [tipoServico, setTipoServico] = useState('');
  const [valorHora, setValorHora] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [servicos, setServicos] = useState([]);

  const carregarServicos = async () => {
    try {
      const response = await fetch('http://localhost:8000/servicos');
      if (response.ok) {
        const data = await response.json();
        setServicos(data);
      } else {
        setMensagem('Erro ao carregar a lista de serviços.');
      }
    } catch (err) {
      setMensagem('Erro ao conectar com a API.');
    }
  };

  const handleCadastro = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/servicos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tipo_servico: tipoServico,
          valor_hora: parseFloat(valorHora),
        }),
      });

      if (response.ok) {
        setMensagem('Serviço cadastrado com sucesso!');
        setTipoServico('');
        setValorHora('');
        carregarServicos();
      } else {
        const error = await response.json();
        setMensagem(`Erro: ${error.detail}`);
      }
    } catch (err) {
      setMensagem('Erro ao conectar com a API.');
    }
  };

  const handleLimpar = () => {
    setTipoServico('');
    setValorHora('');
    setMensagem('');
  };

  useEffect(() => {
    carregarServicos();
  }, []);

  return (
    <div className="content">
      <div className="formulario-cadastro">
        <h2>Cadastro de Serviços</h2>
        <form onSubmit={handleCadastro}>
          <div className="input-group">
            <label>Serviços</label>
            <input
              type="text"
              placeholder="Nome do serviço"
              value={tipoServico}
              onChange={(e) => setTipoServico(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Custo por Hora (R$)</label>
            <input
              type="number"
              placeholder="0.00"
              value={valorHora}
              onChange={(e) => setValorHora(e.target.value)}
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
      <div className="lista-servicos">
        <h3>Lista de Serviços</h3>
        {servicos.length > 0 ? (
          <div className="quadro">
            <ul>
              {servicos.map((servico) => (
                <li key={servico.id}>
                  {servico.tipo_servico} - R$ {servico.valor_hora.toFixed(2)}/hora
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="mensagem-vazia">Nenhum serviço adicionado.</p>
        )}
      </div>
    </div>
  );
};

export default CadastroServicos;
