import React, { useEffect, useState } from 'react';
import './Orcamento.css'; // Arquivo de estilos separado

const Orcamento = () => {
  const [produtos, setProdutos] = useState([]);
  const [selectedProduto, setSelectedProduto] = useState('');
  const [valorCusto, setValorCusto] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [altura, setAltura] = useState('');
  const [largura, setLargura] = useState('');
  const [comprimento, setComprimento] = useState('');
  const [valorItem, setValorItem] = useState('');

  const [servicos, setServicos] = useState([]);
  const [selectedServico, setSelectedServico] = useState('');
  const [horasTrabalhadas, setHorasTrabalhadas] = useState('');
  const [valorHora, setValorHora] = useState('');
  const [custoServico, setCustoServico] = useState('');

  const [produtosAdicionados, setProdutosAdicionados] = useState([]);
  const [servicosAdicionados, setServicosAdicionados] = useState([]);

  // Fetch de produtos
  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await fetch('http://localhost:8000/produtos');
        if (!response.ok) {
          throw new Error('Erro ao buscar produtos');
        }
        const data = await response.json();
        setProdutos(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProdutos();
  }, []);

  // Fetch de serviços
  useEffect(() => {
    const fetchServicos = async () => {
      try {
        const response = await fetch('http://localhost:8000/servicos');
        if (!response.ok) {
          throw new Error('Erro ao buscar serviços');
        }
        const data = await response.json();
        setServicos(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchServicos();
  }, []);

  // Fetch detalhes do produto
  useEffect(() => {
    const fetchProdutoDetails = async () => {
      if (selectedProduto) {
        try {
          const response = await fetch(`http://localhost:8000/produtos/${selectedProduto}`);
          if (!response.ok) {
            throw new Error('Erro ao buscar detalhes do produto');
          }
          const data = await response.json();
          setValorCusto(data.valor_custo || '');
        } catch (error) {
          console.error(error);
        }
      } else {
        setValorCusto('');
      }
    };

    fetchProdutoDetails();
  }, [selectedProduto]);

  // Fetch detalhes do serviço
  useEffect(() => {
    const fetchServicoDetails = async () => {
      if (selectedServico) {
        try {
          const response = await fetch(`http://localhost:8000/servicos/${selectedServico}`);
          if (!response.ok) {
            throw new Error('Erro ao buscar detalhes do serviço');
          }
          const data = await response.json();
          setValorHora(data.valor_hora || ''); // Pega o valor por hora do serviço
        } catch (error) {
          console.error(error);
        }
      } else {
        setValorHora('');
      }
    };

    fetchServicoDetails();
  }, [selectedServico]);

  // Calcular o valor do item (produto)
  useEffect(() => {
    const calcularValorItem = () => {
      const valor =
        (quantidade && altura && largura && comprimento && valorCusto
          ? (quantidade * valorCusto * altura * largura * comprimento) / 10000
          : 0);
      setValorItem(valor);
    };

    calcularValorItem();
  }, [quantidade, valorCusto, altura, largura, comprimento]);

  // Calcular o custo do serviço
  useEffect(() => {
    const calcularCustoServico = () => {
      const custo =
        (horasTrabalhadas && valorHora ? horasTrabalhadas * valorHora : 0);
      setCustoServico(custo);
    };

    calcularCustoServico();
  }, [horasTrabalhadas, valorHora]);

  // Calcular o valor total dos produtos e serviços adicionados
  const calcularValorTotal = () => {
    const valorTotalProdutos = produtosAdicionados.reduce((acc, produto) => acc + produto.valorItem, 0);
    const valorTotalServicos = servicosAdicionados.reduce((acc, servico) => acc + servico.custoServico, 0);
    return (valorTotalProdutos + valorTotalServicos).toFixed(2);
  };

  const handleNumberInput = (value, setState) => {
    if (value === '') {
      setState(''); // Permite limpar o campo
    } else {
      const num = Number(value);
      if (!isNaN(num)) {
        setState(num); // Atualiza apenas se for um número válido
      }
    }
  };

  const handleAdicionarProduto = () => {
    const produtoSelecionado = produtos.find(
      (produto) => produto.id === Number(selectedProduto)
    );
    if (produtoSelecionado) {
      setProdutosAdicionados([
        ...produtosAdicionados,
        {
          id: produtoSelecionado.id,
          nome: produtoSelecionado.nome,
          quantidade,
          valorItem,
        },
      ]);
      // Resetar campos do produto
      handleLimparProduto();
    }
  };

  const handleAdicionarServico = () => {
    const servicoSelecionado = servicos.find(
      (servico) => servico.id === Number(selectedServico)
    );
    if (servicoSelecionado) {
      setServicosAdicionados([
        ...servicosAdicionados,
        {
          id: servicoSelecionado.id,
          nome: servicoSelecionado.tipo_servico,
          horasTrabalhadas,
          custoServico,
        },
      ]);
      // Resetar campos do serviço
      handleLimparServico();
    }
  };

  // Função para limpar campos de produto
  const handleLimparProduto = () => {
    setSelectedProduto('');
    setQuantidade('');
    setValorCusto('');
    setAltura('');
    setLargura('');
    setComprimento('');
    setValorItem('');
  };

  // Função para limpar campos de serviço
  const handleLimparServico = () => {
    setSelectedServico('');
    setHorasTrabalhadas('');
    setValorHora('');
    setCustoServico('');
  };

  // Função para remover um produto da lista de produtos adicionados
  const handleRemoverProduto = (id) => {
    setProdutosAdicionados(produtosAdicionados.filter(produto => produto.id !== id));
  };

  // Função para remover um serviço da lista de serviços adicionados
  const handleRemoverServico = (id) => {
    setServicosAdicionados(servicosAdicionados.filter(servico => servico.id !== id));
  };

  return (
    <div className="content">
      <div className="orcamento-container">
        <div className="top-row">
          <div className="produto-box quadro">
            <h2>Produto</h2>
            <div className="input-group">
              <label>Produto</label>
              <select
                value={selectedProduto}
                onChange={(e) => setSelectedProduto(e.target.value)}
                className='custom-select'
              >
                <option value="">Selecione um Produto</option>
                {produtos.map((produto) => (
                  <option key={produto.id} value={produto.id}>
                    {produto.nome}
                  </option>
                ))}
              </select>
            </div>
            <div className="produto-inputs">
              <div className="input-group">
                <label>Quantidade</label>
                <input
                  type="number"
                  placeholder="0"
                  value={quantidade}
                  onChange={(e) => handleNumberInput(e.target.value, setQuantidade)}
                />
              </div>
              <div className="input-group">
                <label>Valor de Custo (R$)</label>
                <input type="number" value={valorCusto} readOnly />
              </div>
              <div className="input-group">
                <label>Altura (cm)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={altura}
                  onChange={(e) => handleNumberInput(e.target.value, setAltura)}
                />
              </div>
              <div className="input-group">
                <label>Largura (cm)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={largura}
                  onChange={(e) => handleNumberInput(e.target.value, setLargura)}
                />
              </div>
              <div className="input-group">
                <label>Comprimento (m)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={comprimento}
                  onChange={(e) => handleNumberInput(e.target.value, setComprimento)}
                />
              </div>
              <div className="input-group">
                <label>Valor do Item (R$)</label>
                <input type="number" value={valorItem} readOnly />
              </div>
            </div>
            <div className="button-group">
              <button className="add-button" onClick={handleAdicionarProduto}>
                Adicionar Produto
              </button>
              <button className="save-button" onClick={handleLimparProduto}>
                Limpar
              </button>
            </div>
          </div>
          {/* Quadro de Serviços */}
          <div className="servicos-box quadro">
            <h2>Serviços</h2>
            <div className="input-group">
              <label>Serviço</label>
              <select
                value={selectedServico}
                onChange={(e) => setSelectedServico(e.target.value)}
                className='custom-select'
              >
                <option value="">Selecione um Serviço</option>
                {servicos.map((servico) => (
                  <option key={servico.id} value={servico.id}>
                    {servico.tipo_servico}
                  </option>
                ))}
              </select>
            </div>
            <div className="servico-inputs">
              <div className="input-group">
                <label>Horas Trabalhadas</label>
                <input
                  type="number"
                  placeholder="0"
                  value={horasTrabalhadas}
                  onChange={(e) => handleNumberInput(e.target.value, setHorasTrabalhadas)}
                />
              </div>
              <div className="input-group">
                <label>Custo do Serviço (R$)</label>
                <input type="number" value={custoServico} readOnly />
              </div>
            </div>
            <div className="button-group">
              <button className="add-button" onClick={handleAdicionarServico}>
                Adicionar Serviço
              </button>
              <button className="save-button" onClick={handleLimparServico}>
                Limpar
              </button>
            </div>
          </div>
        </div>

        {/* Produtos Adicionados */}
        <div className="produtos-adicionados-box quadro full-width">
          <h2>Produtos Adicionados</h2>
          <ul className="lista-produtos">
            {produtosAdicionados.map((produto) => (
              <li key={produto.id} className="produto-item " >
                {produto.nome} - Quantidade: {produto.quantidade} - R$ {produto.valorItem.toFixed(2)}
                <button className="delete-button" onClick={() => handleRemoverProduto(produto.id)}>Excluir</button>
              </li>
            ))}
          </ul>
        </div>

        {/* Serviços Adicionados */}
        <div className="servicos-adicionados-box quadro">
          <h2>Serviços Adicionados</h2>
          <ul className="lista-produtos">
            {servicosAdicionados.map((servico) => (
              <li key={servico.id} className="produto-item">
                {servico.nome} - Horas: {servico.horasTrabalhadas} - R$ {servico.custoServico.toFixed(2)}
                <button className="delete-button" onClick={() => handleRemoverServico(servico.id)}>Excluir</button>
              </li>
            ))}
          </ul>
        </div>

        {/* Quadro de Total */}
        <div className="total-box quadro">
          <h2>Valor de Custo Total (R$)</h2>
          <input type="number" placeholder={calcularValorTotal()} readOnly />
        </div>
      </div>
    </div>
  );
};

export default Orcamento;
