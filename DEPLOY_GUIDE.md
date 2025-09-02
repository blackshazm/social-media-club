# 🚀 Script de Deploy Automatizado - Social Media Club

## INSTRUÇÃO DE USO NO VS CODE

### Método 1: Usando as Tasks já configuradas
1. **Ctrl+Shift+P** (Abrir paleta de comandos)
2. Digite: **"Tasks: Run Task"**
3. Escolha: **"📋 Git Status"** (verificar status)
4. Escolha: **"➕ Git Add All"** (adicionar arquivos)
5. Faça commit manual: `git commit -m "Update SEO and fixes"`
6. Escolha: **"📤 Git Push"** (fazer push)

### Método 2: Comandos manuais no terminal
```bash
# Verificar status
git status

# Adicionar todos os arquivos
git add .

# Fazer commit
git commit -m "SEO optimization and accessibility fixes"

# Fazer push
git push origin main
```

### Método 3: Deploy automatizado no Vercel
1. **Conecte seu repositório no Vercel:**
   - Acesse: https://vercel.com
   - Conecte sua conta GitHub
   - Importe o repositório: `social-media-club`
   - Configure domínio: `socialmidiaclub.com.br`

2. **Auto-deploy:** Toda vez que fizer push, o site será atualizado automaticamente

## 🔧 CONFIGURAÇÃO DE DOMÍNIO PERSONALIZADO

### No Vercel:
1. **Project Settings** → **Domains**
2. Adicione: `socialmidiaclub.com.br`
3. Configure DNS no seu provedor:
   ```
   CNAME: www → cname.vercel-dns.com
   A Record: @ → 76.76.19.61
   ```

### No seu provedor de domínio:
- **Tipo:** CNAME
- **Nome:** www  
- **Valor:** cname.vercel-dns.com
- **TTL:** 3600

## 📊 MONITORAMENTO PÓS-DEPLOY

### 1. Verificar indexação:
```
site:socialmidiaclub.com.br
```

### 2. Testar performance:
- PageSpeed Insights: https://pagespeed.web.dev/
- GTmetrix: https://gtmetrix.com/

### 3. Verificar SEO:
- Google Search Console
- SEMrush (opcional)
- Ahrefs (opcional)

## 🎯 CHECKLIST PÓS-DEPLOY

- [ ] Site acessível no domínio
- [ ] HTTPS funcionando
- [ ] Sitemap.xml acessível
- [ ] Robots.txt funcionando
- [ ] Google Search Console configurado
- [ ] Google Analytics instalado
- [ ] Performance > 90 no PageSpeed
- [ ] Testes de responsividade
- [ ] Formulários funcionando
- [ ] Links internos funcionando

## 🚨 TROUBLESHOOTING

### Site não carrega:
1. Verificar DNS
2. Verificar certificado SSL
3. Check deployment logs no Vercel

### SEO não funciona:
1. Verificar robots.txt
2. Validar sitemap.xml
3. Conferir meta tags
4. Testar structured data

### Performance baixa:
1. Otimizar imagens
2. Minificar CSS/JS
3. Ativar compressão
4. Configurar cache
