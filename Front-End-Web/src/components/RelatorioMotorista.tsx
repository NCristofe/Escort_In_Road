import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

interface KPI {
  label: string;
  valor: string;
  cor: string;
  icon: string;
}

interface DetalheReceita {
  data: string;
  fretesEntregues: number;
  receita: number;
  comissao: number;
  escrow: number;
}

interface RelatorioMotoristaProps {
  motoristaId: string;
}

export const RelatorioMotorista: React.FC<RelatorioMotoristaProps> = ({ motoristaId }) => {
  const [dataInicio, setDataInicio] = useState<string>('');
  const [dataFim, setDataFim] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [relatorio, setRelatorio] = useState<any>(null);
  const [erro, setErro] = useState<string>('');

  useEffect(() => {
    const agora = new Date();
    const mesPassado = new Date(agora.getFullYear(), agora.getMonth() - 1, agora.getDate());

    setDataFim(agora.toISOString().split('T')[0]);
    setDataInicio(mesPassado.toISOString().split('T')[0]);
  }, []);

  const carregarRelatorio = async () => {
    if (!dataInicio || !dataFim) {
      setErro('Selecione o período');
      return;
    }

    setLoading(true);
    setErro('');

    try {
      const response = await fetch(
        `/api/relatorios/motorista/receita?inicio=${dataInicio}&fim=${dataFim}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao carregar relatório');
      }

      const dados = await response.json();
      setRelatorio(dados);
    } catch (err) {
      setErro('Falha ao carregar relatório. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const exportarPDF = () => {
    window.location.href = `/api/relatorios/motorista/receita/export?formato=pdf&inicio=${dataInicio}&fim=${dataFim}`;
  };

  const exportarCSV = () => {
    window.location.href = `/api/relatorios/motorista/receita/export?formato=csv&inicio=${dataInicio}&fim=${dataFim}`;
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const kpis: KPI[] = relatorio ? [
    {
      label: 'Receita Total',
      valor: formatarMoeda(relatorio.resumo.recebidoTotal),
      cor: '#ff6600',
      icon: '💰'
    },
    {
      label: 'Em Escrow',
      valor: formatarMoeda(relatorio.resumo.emEscrow),
      cor: '#1a237e',
      icon: '🔒'
    },
    {
      label: 'Disponível',
      valor: formatarMoeda(relatorio.resumo.disponivel),
      cor: '#4caf50',
      icon: '✅'
    },
    {
      label: 'Comissão',
      valor: formatarMoeda(relatorio.resumo.comissaoGeral),
      cor: '#ff9800',
      icon: '📊'
    }
  ] : [];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Meu Desempenho</h1>
          <p className="text-gray-600">Acompanhe sua receita e estatísticas</p>
        </div>

        {/* Seletor de Período */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Inicial
              </label>
              <input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Final
              </label>
              <input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={carregarRelatorio}
                disabled={loading}
                className="w-full bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 disabled:opacity-50 transition"
              >
                {loading ? 'Carregando...' : 'Gerar Relatório'}
              </button>
            </div>

            <div className="flex items-end gap-2">
              <button
                onClick={exportarPDF}
                disabled={!relatorio}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 transition text-sm"
                title="Exportar em PDF"
              >
                📄 PDF
              </button>
              <button
                onClick={exportarCSV}
                disabled={!relatorio}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition text-sm"
                title="Exportar em CSV"
              >
                📊 CSV
              </button>
            </div>
          </div>

          {erro && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {erro}
            </div>
          )}
        </div>

        {/* KPIs */}
        {relatorio && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {kpis.map((kpi, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg shadow p-6 border-l-4"
                  style={{ borderColor: kpi.cor }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">{kpi.icon}</span>
                    <span className="text-xs font-semibold text-gray-500 uppercase">
                      {kpi.label}
                    </span>
                  </div>
                  <p className="text-2xl font-bold" style={{ color: kpi.cor }}>
                    {kpi.valor}
                  </p>
                </div>
              ))}
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

              {/* Gráfico de Receita */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Receita por Dia</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={relatorio.detalhes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="data" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatarMoeda(Number(value))} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="receita"
                      stroke="#ff6600"
                      strokeWidth={2}
                      name="Receita"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Gráfico de Fretes */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Fretes Entregues por Dia</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={relatorio.detalhes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="data" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="fretesEntregues" fill="#1a237e" name="Fretes" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Gráfico de Comissão */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Comissão Descontada</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={relatorio.detalhes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="data" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatarMoeda(Number(value))} />
                    <Legend />
                    <Bar dataKey="comissao" fill="#ff9800" name="Comissão (7%)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Resumo */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Resumo Executivo</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600">Receita Bruta</span>
                    <span className="font-bold text-gray-900">
                      {formatarMoeda(relatorio.resumo.recebidoTotal)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600">Comissão (7%)</span>
                    <span className="font-bold text-gray-900">
                      -{formatarMoeda(relatorio.resumo.comissaoGeral)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600">Em Escrow</span>
                    <span className="font-bold text-gray-900">
                      -{formatarMoeda(relatorio.resumo.emEscrow)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 bg-green-50 px-3 rounded-lg">
                    <span className="font-bold text-gray-900">Disponível para Sacar</span>
                    <span className="text-2xl font-bold text-green-600">
                      {formatarMoeda(relatorio.resumo.disponivel)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabela de Detalhes */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b">
                <h3 className="text-lg font-bold text-gray-900">Detalhes por Dia</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Data</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Fretes</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Receita</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Comissão</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Escrow</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {relatorio.detalhes.map((detalhe: DetalheReceita, idx: number) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-6 py-3 text-sm text-gray-900">
                          {format(new Date(detalhe.data), 'dd/MM/yyyy', { locale: pt })}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-900 text-center">
                          {detalhe.fretesEntregues}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-900 text-right font-semibold">
                          {formatarMoeda(detalhe.receita)}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-900 text-right">
                          -{formatarMoeda(detalhe.comissao)}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-900 text-right">
                          -{formatarMoeda(detalhe.escrow)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {!relatorio && !loading && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 mb-4">Selecione um período e clique em "Gerar Relatório" para começar</p>
            <p className="text-gray-500 text-sm">📊 Seus dados apareçarão aqui</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RelatorioMotorista;
