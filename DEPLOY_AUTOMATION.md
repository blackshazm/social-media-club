# 🚀 Sistema de Deploy Automático

Este documento descreve o sistema de deploy contínuo implementado para o Social Media Club, integrando GitHub Actions com Vercel.

## 📋 Visão Geral

O sistema automatiza completamente o processo de deploy, desde a validação do código até a verificação pós-deploy, garantindo que todas as alterações sejam testadas e implantadas de forma segura.

## 🔄 Fluxo de Deploy

### 1. **Trigger Automático**
- **Push para `main`**: Deploy automático para produção
- **Pull Request**: Deploy de preview com comentário no PR
- **Commits em branches**: Validação sem deploy

### 2. **Pipeline de Validação**
```bash
# Validação HTML
htmlhint index.html --config .htmlhintrc

# Validação CSS
stylelint "*.css" --config .stylelintrc.json

# Validação JavaScript
node -c script.js && node -c error-filter.js && node -c sw.js

# Verificação de Assets
node scripts/check-assets.js
```

### 3. **Deploy Automático**
- **Preview**: Para Pull Requests
- **Produção**: Para branch `main`
- **Rollback**: Automático em caso de falha

### 4. **Verificação Pós-Deploy**
- Teste de disponibilidade
- Verificação de recursos críticos
- Análise de performance
- Relatório Lighthouse

## 🛠️ Comandos Disponíveis

### Desenvolvimento
```bash
npm run dev          # Servidor local (Python)
npm run serve        # Servidor local (Node.js)
npm run start        # Servidor na porta 3000
```

### Validação e Testes
```bash
npm run validate     # Validação completa
npm run lint         # Alias para validate
npm run test         # Testes + performance
npm run health       # Verificação de saúde
```

### Build e Deploy
```bash
npm run build        # Build completo com validação
npm run deploy       # Deploy para produção
npm run deploy:preview  # Deploy de preview
npm run deploy:local    # Build + deploy preview
```

### Utilitários
```bash
npm run clean        # Limpar dependências
npm run lighthouse   # Análise de performance
npm run precommit    # Validação pré-commit
```

## 📁 Estrutura de Arquivos

```
.github/workflows/
├── deploy.yml       # Pipeline principal de CI/CD
└── notify.yml       # Notificações de deploy

scripts/
├── check-assets.js  # Verificação de assets
└── verify-deployment.js  # Verificação pós-deploy

.htmlhintrc          # Configuração HTML
.stylelintrc.json    # Configuração CSS
lighthouserc.json    # Configuração Lighthouse
vercel.json          # Configuração Vercel
```

## 🔧 Configuração

### Variáveis de Ambiente (GitHub Secrets)
```bash
VERCEL_TOKEN         # Token do Vercel (obrigatório)
VERCEL_ORG_ID        # ID da organização Vercel
VERCEL_PROJECT_ID    # ID do projeto Vercel
WEBHOOK_URL          # URL para notificações (opcional)
```

### Configuração do Vercel
O arquivo `vercel.json` está configurado para:
- Deploy automático via GitHub
- Otimização de cache
- Headers de segurança
- Redirecionamentos
- Configurações de build

## 📊 Monitoramento

### GitHub Actions
- ✅ Status de builds em tempo real
- 📊 Relatórios de performance
- 🔍 Logs detalhados de deploy
- 📱 Notificações automáticas

### Lighthouse CI
- 🚀 Performance: > 80%
- ♿ Acessibilidade: > 90%
- 🛡️ Boas Práticas: > 80%
- 🔍 SEO: > 90%
- 📱 PWA: > 70%

### Verificações Automáticas
- Disponibilidade do site
- Recursos críticos (CSS, JS, imagens)
- Tempo de resposta
- Headers de segurança
- Integridade do conteúdo

## 🚨 Troubleshooting

### Deploy Falhou
1. Verificar logs no GitHub Actions
2. Executar `npm run validate` localmente
3. Verificar configuração do Vercel
4. Checar variáveis de ambiente

### Performance Baixa
1. Executar `npm run lighthouse`
2. Otimizar imagens e assets
3. Verificar cache headers
4. Analisar bundle size

### Assets Ausentes
1. Executar `npm run check:links`
2. Verificar paths relativos
3. Confirmar estrutura de diretórios
4. Validar manifest.json

## 🔄 Processo de Rollback

Em caso de problemas:
1. **Automático**: Falhas são detectadas e o deploy anterior é mantido
2. **Manual**: Reverter commit no GitHub ou usar Vercel Dashboard
3. **Hotfix**: Criar branch de correção e fazer PR

## 📈 Métricas e Relatórios

### Performance
- Tempo de carregamento < 1s
- First Contentful Paint < 1.5s
- Largest Contentful Paint < 2.5s
- Cumulative Layout Shift < 0.1

### Disponibilidade
- Uptime target: 99.9%
- Response time < 500ms
- Error rate < 0.1%

## 🔐 Segurança

### Headers Configurados
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Strict-Transport-Security: max-age=31536000`

### Validações
- Verificação de dependências
- Scan de vulnerabilidades
- Validação de conteúdo
- Verificação de links

## 📞 Suporte

Para problemas com o sistema de deploy:
1. Verificar documentação
2. Consultar logs do GitHub Actions
3. Executar diagnósticos locais
4. Contatar equipe de desenvolvimento

---

**Última atualização**: $(date)
**Versão do sistema**: 1.0.0