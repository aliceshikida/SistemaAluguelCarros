import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/clientes';

function App() {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({ nome: '', login: '', senha: '', cpf: '', profissao: '' });

  // Buscar clientes ao carregar a página
  useEffect(() => {
    listarClientes();
  }, []);

  const listarClientes = async () => {
    try {
      const res = await axios.get(API_URL);
      setClientes(res.data);
    } catch (err) {
      console.error("Erro ao buscar clientes", err);
    }
  };

  const salvarCliente = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, form);
      setForm({ nome: '', login: '', senha: '', cpf: '', profissao: '' }); // Limpa o form
      listarClientes(); // Atualiza a lista
    } catch (err) {
      alert("Erro ao salvar! Verifique se o backend está rodando.");
    }
  };

  const deletarCliente = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    listarClientes();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans text-slate-900">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Formulário de Cadastro */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit">
          <h2 className="text-xl font-bold mb-6 text-indigo-600">Novo Cliente</h2>
          <form onSubmit={salvarCliente} className="flex flex-col gap-4">
            <input 
              type="text" placeholder="Nome" 
              className="p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} required
            />
            <div className="grid grid-cols-2 gap-2">
              <input 
                type="text" placeholder="Login" 
                className="p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                value={form.login} onChange={e => setForm({...form, login: e.target.value})} required
              />
              <input 
                type="password" placeholder="Senha" 
                className="p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                value={form.senha} onChange={e => setForm({...form, senha: e.target.value})} required
              />
            </div>
            <input 
              type="text" placeholder="CPF" 
              className="p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
              value={form.cpf} onChange={e => setForm({...form, cpf: e.target.value})} required
            />
            <input 
              type="text" placeholder="Profissão" 
              className="p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
              value={form.profissao} onChange={e => setForm({...form, profissao: e.target.value})}
            />
            <button type="submit" className="mt-2 bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-md active:scale-95">
              Cadastrar Cliente
            </button>
          </form>
        </div>

        {/* Lista de Clientes */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold mb-6 text-slate-800">Clientes Cadastrados</h2>
          <div className="flex flex-col gap-3">
            {clientes.length === 0 && <p className="text-slate-400 italic">Nenhum cliente na base de dados.</p>}
            {clientes.map(c => (
              <div key={c.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-200 transition-colors">
                <div>
                  <p className="font-bold text-slate-700">{c.nome}</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">{c.cpf} • {c.profissao}</p>
                </div>
                <button 
                  onClick={() => deletarCliente(c.id)}
                  className="text-rose-500 hover:bg-rose-50 p-2 rounded-full transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;