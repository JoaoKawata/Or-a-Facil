import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom'; // Adicionei 'Navigate'
import './App.css'; 
import {  FaClipboard, FaBox, FaServicestack } from 'react-icons/fa';
import Orcamento from './Orcamento';
import Produtos from './Produtos';
import Servicos from './Servicos';
import '@fortawesome/fontawesome-free/css/all.min.css';

const App = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <Router>
            <div className="App">
                {/* Sidebar */}
                <div className={`sidebar ${isSidebarOpen ? '' : 'closed'}`}>
                    <div className="menu-toggle" onClick={toggleSidebar}>
                        <i className="fas fa-bars"></i>
                    </div>

                    {/* Menu Items */}
                    <ul className="menu-items">
                        <li>
                            <Link to="/orcamento">
                                <FaClipboard />
                                {isSidebarOpen && <span>Orçamento</span>}
                            </Link>
                        </li>
                        <li>
                            <Link to="/produtos">
                                <FaBox />
                                {isSidebarOpen && <span>Cadastro de Produtos</span>}
                            </Link>
                        </li>
                        <li>
                            <Link to="/servicos">
                                <FaServicestack />
                                {isSidebarOpen && <span>Cadastro de Serviços</span>}
                            </Link>
                        </li>
                    </ul>

                    {/* Logo da empresa */}
                    <div className="logo-container">
                        <img src="logo.png" alt="Nome da Empresa" />
                    </div>
                </div>

                {/* Topbar */}
                <div className={`topbar ${isSidebarOpen ? '' : 'closed'}`}>
                    <span>Admin</span>
                    <i className="fas fa-user-circle"></i>
                </div>

                {/* Content Area */}
                <div className={`content ${isSidebarOpen ? '' : 'sidebar-closed'}`}>
                    <Routes>
                        {/* Redireciona a rota principal para Orçamento */}
                        <Route path="/" element={<Navigate to="/orcamento" />} />
                        <Route path="/orcamento" element={<Orcamento />} />
                        <Route path="/produtos" element={<Produtos />} />
                        <Route path="/servicos" element={<Servicos />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;
