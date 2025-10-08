# CONFIGURAÇÃO DE ANALYTICS - SOCIAL MEDIA CLUB

## 🎯 IDs de Tracking para Configurar

### Google Analytics 4
- **Measurement ID**: `G-XXXXXXXXXX`
- **Stream ID**: Configure no Google Analytics
- **Substitua em**: `index.html` linha ~508

### Google Tag Manager
- **Container ID**: `GTM-XXXXXXX`
- **Substitua em**: `index.html` linhas ~506 e ~522

### Facebook Pixel
- **Pixel ID**: `FACEBOOK_PIXEL_ID`
- **Substitua em**: `index.html` linhas ~540 e ~524
- **Configure eventos personalizados** no Facebook Events Manager

### LinkedIn Insight Tag
- **Partner ID**: `LINKEDIN_PARTNER_ID`
- **Conversion ID**: `LINKEDIN_CONVERSION_ID`
- **Lead Conversion ID**: `LINKEDIN_LEAD_CONVERSION`
- **Substitua em**: `index.html` linhas ~546-549 e `analytics-advanced.js`

## 📊 Eventos Personalizados Configurados

### Google Analytics 4 Events
- `page_view` - Visualizações de página
- `generate_lead` - Formulários enviados
- `cta_click` - Cliques em botões CTA
- `share` - Compartilhamentos sociais
- `scroll` - Profundidade de scroll (25%, 50%, 75%, 90%, 100%)
- `user_engagement` - Tempo na página (30s, 60s, 2min, 5min, 10min)
- `high_engagement` - Usuários muito ativos (50+ interações)
- `view_item` - Interesse em serviços específicos
- Core Web Vitals: `CLS`, `FID`, `FCP`, `LCP`, `TTFB`

### Facebook Pixel Events
- `ViewContent` - Visualização de página
- `Lead` - Formulário enviado (valor: R$ 150)
- `InitiateCheckout` - Clique em CTA
- `Share` - Compartilhamento social

### LinkedIn Events
- `PageView` - Visualização de página
- `Lead` - Conversão de lead
- `Conversion` - Eventos de conversão personalizados

## 🚀 Como Configurar

### 1. Google Analytics 4
1. Acesse [Google Analytics](https://analytics.google.com)
2. Crie uma propriedade GA4
3. Configure Enhanced Ecommerce
4. Copie o Measurement ID
5. Substitua `G-XXXXXXXXXX` no código

### 2. Google Tag Manager
1. Acesse [Google Tag Manager](https://tagmanager.google.com)
2. Crie um container
3. Configure tags para GA4, Facebook Pixel, LinkedIn
4. Copie o Container ID
5. Substitua `GTM-XXXXXXX` no código

### 3. Facebook Pixel
1. Acesse [Facebook Business Manager](https://business.facebook.com)
2. Vá em Ferramentas de Eventos → Pixels
3. Crie um pixel
4. Configure eventos personalizados
5. Copie o Pixel ID
6. Substitua `FACEBOOK_PIXEL_ID` no código

### 4. LinkedIn Insight Tag
1. Acesse [LinkedIn Campaign Manager](https://www.linkedin.com/campaignmanager)
2. Vá em Assets → Insight Tag
3. Crie um Insight Tag
4. Configure conversões
5. Copie os IDs
6. Substitua no código

## 📈 Métricas Importantes para Acompanhar

### Conversões
- **Taxa de Conversão**: Formulários enviados / Visitantes únicos
- **Custo por Lead (CPL)**: Gasto em anúncios / Leads gerados
- **Valor do Lead**: ROI baseado no valor médio do cliente
- **Taxa de Fechamento**: Leads que se tornaram clientes

### Engajamento
- **Tempo Médio na Página**: Indicador de interesse
- **Profundidade de Scroll**: Engajamento com conteúdo
- **Páginas por Sessão**: Navegação no site
- **Taxa de Rejeição**: Qualidade do tráfego

### Performance
- **Core Web Vitals**: LCP, FID, CLS para SEO
- **Velocidade de Carregamento**: Impacto na conversão
- **Mobile vs Desktop**: Otimização por dispositivo

### Campanhas
- **ROI por Canal**: Google Ads, Facebook Ads, Orgânico
- **Palavras-chave Top**: Termos que mais convertem
- **Demografia**: Idade, localização, interesses
- **Funil de Conversão**: Desde impressão até venda

## 🎯 Dashboard Recomendado

### KPIs Principais (Semanal)
1. **Leads Gerados**: Meta +20% mês a mês
2. **Taxa de Conversão**: Meta >3%
3. **CPL Médio**: Otimizar constantemente
4. **ROI Campanhas**: Meta >400%
5. **Tempo Médio Página**: Meta >2 minutos

### Alertas Automáticos
- Queda >30% em conversões
- Aumento >50% no CPL
- Core Web Vitals abaixo do ideal
- Erro em formulários de contato

## 🔧 Troubleshooting

### Analytics não aparece
1. Verifique os IDs de tracking
2. Teste com Google Analytics Debugger
3. Aguarde 24-48h para dados aparecerem

### Eventos não disparando
1. Abra Console do navegador
2. Procure por erros JavaScript
3. Teste com Facebook Pixel Helper
4. Verifique GTM Preview mode

### Conversões não rastreando
1. Teste envio de formulário
2. Verifique se analytics-advanced.js carregou
3. Confirme IDs de conversão corretos
4. Teste em dispositivos diferentes

---

**Importante**: Substitua todos os placeholder IDs pelos seus IDs reais antes de usar em produção!