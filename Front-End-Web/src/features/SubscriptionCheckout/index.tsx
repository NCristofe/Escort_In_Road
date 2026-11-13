import React, { useState } from 'react';
import { api } from '@/api';

export function SubscriptionCheckoutPage() {
  const [planoSelecionado, setPlanoSelecionado] = useState<'FREE' | 'PREMIUM'>('PREMIUM');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const planos = {
    FREE: {
      nome: 'Plano Gratuito',
      preco: 'Grátis',
      features: [
        'Até 10 viagens por mês',
        'Rastreamento básico',
        'Suporte por email',
        'Relatórios simples'
      ]
    },
    PREMIUM: {
      nome: 'Plano Premium',
      preco: 'R$ 99/mês',
      features: [
        'Viagens ilimitadas',
        'Rastreamento avançado com GPS',
        'Dashboard com métricas',
        'Relatórios detalhados',
        'Export PDF/CSV',
        'Pontos de interesse avançados',
        'Suporte prioritário 24/7',
        'Integração com ERP',
        'API dedicada',
        'Métricas ESG'
      ]
    }
  };

  const processarPagamento = async () => {
    if (planoSelecionado === 'FREE') {
      // Free não precisa de pagamento
      setLoading(true);
      try {
        await api.post('/api/planos-saas/criar', {
          usuario_id: 1,
          tipo_plano: 'FREE'
        });
        alert('Plano gratuito ativado com sucesso!');
      } catch (error) {
        setErro('Erro ao ativar plano gratuito');
      } finally {
        setLoading(false);
      }
      return;
    }

    // Premium - Processar pagamento
    setLoading(true);
    setErro('');
    try {
      // 1. Criar pedido de upgrade
      const pedido = await api.post('/api/planos-saas/upgrade', {
        usuario_id: 1,
        novo_plano: 'PREMIUM'
      });

      // 2. Redirecionar para gateway de pagamento (Stripe/Pagar.me)
      const { payment_url } = pedido.data;
      if (payment_url) {
        window.location.href = payment_url;
      }
    } catch (error: any) {
      setErro(error.response?.data?.message || 'Erro ao processar pagamento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Cabeçalho */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Escolha Seu Plano</h1>
          <p className="text-lg text-gray-600">Selecione o plano ideal para sua empresa</p>
        </div>

        {/* Comparação de Planos */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* FREE */}
          <div
            className={`rounded-xl border-2 p-8 transition-all cursor-pointer ${
              planoSelecionado === 'FREE'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 bg-white hover:border-gray-400'
            }`}
            onClick={() => setPlanoSelecionado('FREE')}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{planos.FREE.nome}</h2>
              <p className="text-3xl font-bold text-green-600">{planos.FREE.preco}</p>
            </div>

            <div className="space-y-3 mb-8">
              {planos.FREE.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <button
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold transition ${
                planoSelecionado === 'FREE'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {planoSelecionado === 'FREE' ? 'Selecionado' : 'Selecionar'}
            </button>
          </div>

          {/* PREMIUM */}
          <div
            className={`rounded-xl border-2 p-8 transition-all cursor-pointer relative ${
              planoSelecionado === 'PREMIUM'
                ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-300'
                : 'border-gray-300 bg-white hover:border-gray-400'
            }`}
            onClick={() => setPlanoSelecionado('PREMIUM')}
          >
            <div className="absolute top-0 right-0 bg-indigo-600 text-white px-4 py-1 rounded-bl-xl text-sm font-bold">
              RECOMENDADO
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{planos.PREMIUM.nome}</h2>
              <p className="text-3xl font-bold text-indigo-600">{planos.PREMIUM.preco}</p>
              <p className="text-gray-600 text-sm mt-2">Cobrança mensal recorrente</p>
            </div>

            <div className="space-y-3 mb-8">
              {planos.PREMIUM.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <button
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold transition ${
                planoSelecionado === 'PREMIUM'
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {planoSelecionado === 'PREMIUM' ? 'Selecionado' : 'Selecionar'}
            </button>
          </div>
        </div>

        {/* Botão de Checkout */}
        <div className="text-center">
          <button
            onClick={processarPagamento}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processando...
              </div>
            ) : planoSelecionado === 'FREE' ? (
              'Ativar Plano Gratuito'
            ) : (
              'Prosseguir com Pagamento'
            )}
          </button>

          {erro && (
            <p className="text-red-600 mt-4 font-semibold">{erro}</p>
          )}

          <p className="text-gray-600 text-sm mt-6">
            Você poderá fazer downgrade ou cancelar sua assinatura a qualquer momento
          </p>
        </div>
      </div>
    </div>
  );
}
