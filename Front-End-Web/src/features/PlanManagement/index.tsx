import React, { useEffect, useState } from 'react';
import { api } from '@/api';

export function PlanManagementPage() {
  const [planoAtual, setPlanoAtual] = useState<any>(null);
  const [faturas, setFaturas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    try {
      // Carregar plano atual
      const planoResponse = await api.get('/api/planos-saas/usuario/1');
      setPlanoAtual(planoResponse.data);

      // Carregar faturas
      const faturasResponse = await api.get('/api/faturas/usuario/1');
      setFaturas(faturasResponse.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelarPlano = async () => {
    if (window.confirm('Tem certeza que deseja cancelar o plano? Você perderá acesso aos recursos Premium.')) {
      try {
        await api.post('/api/planos-saas/cancelar', {
          usuario_id: 1
        });
        alert('Plano cancelado com sucesso');
        carregarDados();
      } catch (error) {
        alert('Erro ao cancelar plano');
      }
    }
  };

  const fazerDowngrade = async () => {
    if (window.confirm('Fazer downgrade para plano gratuito? Você perderá acesso aos recursos Premium.')) {
      try {
        await api.post('/api/planos-saas/downgrade', {
          usuario_id: 1,
          novo_plano: 'FREE'
        });
        alert('Downgrade realizado com sucesso');
        carregarDados();
      } catch (error) {
        alert('Erro ao fazer downgrade');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Cabeçalho */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestão de Plano</h1>
          <p className="text-gray-600">Visualize seu plano, faturas e histórico de pagamentos</p>
        </div>

        {/* Plano Atual */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Plano Atual</h2>
              <p className={`text-lg font-bold ${
                planoAtual?.tipoPlano === 'PREMIUM' ? 'text-indigo-600' : 'text-gray-600'
              }`}>
                {planoAtual?.tipoPlano === 'PREMIUM' ? 'Premium - R$ 99/mês' : 'Gratuito'}
              </p>
            </div>
            <div className={`px-4 py-2 rounded-full text-white font-bold ${
              planoAtual?.tipoPlano === 'PREMIUM' ? 'bg-indigo-600' : 'bg-gray-400'
            }`}>
              {planoAtual?.status || 'ATIVO'}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 mb-6">
            <p className="text-sm text-gray-600 mb-2">Data de Início</p>
            <p className="font-semibold text-gray-900">
              {new Date(planoAtual?.dataCriacao).toLocaleDateString('pt-BR')}
            </p>
          </div>

          {planoAtual?.dataProximoRenovacao && (
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">Próxima Renovação</p>
              <p className="font-semibold text-gray-900">
                {new Date(planoAtual.dataProximoRenovacao).toLocaleDateString('pt-BR')}
              </p>
            </div>
          )}

          <div className="flex gap-4">
            {planoAtual?.tipoPlano === 'PREMIUM' && (
              <>
                <button
                  onClick={fazerDowngrade}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-3 px-4 rounded-lg transition"
                >
                  Fazer Downgrade
                </button>
                <button
                  onClick={cancelarPlano}
                  className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 font-bold py-3 px-4 rounded-lg transition"
                >
                  Cancelar Plano
                </button>
              </>
            )}
            {planoAtual?.tipoPlano === 'FREE' && (
              <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition">
                Fazer Upgrade
              </button>
            )}
          </div>
        </div>

        {/* Recursos do Plano */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Recursos Inclusos</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {planoAtual?.tipoPlano === 'PREMIUM' ? (
              <>
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Viagens ilimitadas</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Dashboard avançado</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Relatórios detalhados</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Export PDF/CSV</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Integração com ERP</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Suporte 24/7</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Até 10 viagens/mês</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Rastreamento básico</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Histórico de Faturas */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Histórico de Faturas</h3>

          {faturas.length === 0 ? (
            <p className="text-gray-600">Nenhuma fatura disponível</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">Data</th>
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">Descrição</th>
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">Valor</th>
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {faturas.map((fatura: any) => (
                    <tr key={fatura.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-900">
                        {new Date(fatura.data).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-3 px-4 text-gray-700">{fatura.descricao}</td>
                      <td className="py-3 px-4 font-semibold text-gray-900">
                        R$ {(fatura.valor || 0).toFixed(2).replace('.', ',')}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                          fatura.status === 'PAGO'
                            ? 'bg-green-100 text-green-700'
                            : fatura.status === 'PENDENTE'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {fatura.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-blue-600 hover:underline font-semibold text-sm">
                          Baixar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
