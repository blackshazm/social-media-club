# 🛠️ Guia das Extensões Instaladas

## 📋 Extensões Instaladas com Sucesso

Foram instaladas **15 extensões essenciais** para otimizar seu desenvolvimento:

### 🚀 **Desenvolvimento & Live Server**

#### 1. **Live Server** - `ritwickdey.LiveServer`
- **Função**: Servidor local com auto-reload
- **Como usar**: 
  - Clique direito no `index.html` → "Open with Live Server"
  - Ou use `Ctrl+Shift+L` (atalho personalizado)
  - Servidor roda em: `http://localhost:3000`

#### 2. **Prettier** - `esbenp.prettier-vscode`
- **Função**: Formatação automática de código
- **Como usar**:
  - Salvar arquivo (`Ctrl+S`) = formata automaticamente
  - `Alt+Shift+F` = formatar documento
  - `Shift+Alt+F` = formatar seleção

### 📝 **HTML & CSS**

#### 3. **Auto Rename Tag** - `formulahendry.auto-rename-tag`
- **Função**: Renomeia tags HTML automaticamente
- **Como usar**: Edite uma tag de abertura, a de fechamento muda junto

#### 4. **HTML CSS Support** - `ecmel.vscode-html-css`
- **Função**: IntelliSense de CSS no HTML
- **Como usar**: Digite classes CSS no HTML e veja sugestões

#### 5. **CSS Peek** - `pranaygp.vscode-css-peek`
- **Função**: Visualizar CSS sem sair do HTML
- **Como usar**: 
  - `Ctrl+Click` em classe CSS
  - `F12` = ir para definição
  - `Alt+F12` = peek definition

#### 6. **IntelliSense for CSS class names** - `zignd.html-css-class-completion`
- **Função**: Autocomplete de classes CSS
- **Como usar**: Digite `class=""` e veja sugestões das classes do projeto

### ⚡ **JavaScript**

#### 7. **JavaScript (ES6) code snippets** - `xabikos.JavaScriptSnippets`
- **Função**: Snippets para JavaScript moderno
- **Como usar**:
  - `clog` = console.log
  - `func` = function
  - `afunc` = arrow function
  - `class` = classe ES6

#### 8. **JavaScript and TypeScript Nightly** - `ms-vscode.vscode-typescript-next`
- **Função**: Suporte avançado para JS/TS
- **Como usar**: Automático, melhora IntelliSense

#### 9. **Quokka.js** - `wallabyjs.quokka-vscode`
- **Função**: Execução de JavaScript em tempo real
- **Como usar**: 
  - `Ctrl+Shift+P` → "Quokka: Start on Current File"
  - Veja resultados em tempo real no editor

### 🔧 **Utilitários**

#### 10. **Path Intellisense** - `christian-kohler.path-intellisense`
- **Função**: Autocomplete de caminhos de arquivos
- **Como usar**: Digite `./ ` ou `../` e veja sugestões de arquivos

#### 11. **Code Spell Checker** - `streetsidesoftware.code-spell-checker`
- **Função**: Corretor ortográfico para código
- **Como usar**: Palavras erradas aparecem sublinhadas
- **Configurado para**: Português e Inglês

### 🎨 **Git & GitHub**

#### 12. **GitLens** - `eamodio.gitlens`
- **Função**: Superpoderes para Git
- **Como usar**:
  - Veja autor de cada linha
  - Histórico de commits
  - Comparações de arquivos

#### 13. **GitHub Pull Requests** - `github.vscode-pull-request-github`
- **Função**: Gerenciar PRs direto no VS Code
- **Como usar**: Conecte sua conta GitHub

### 📖 **Documentação**

#### 14. **Markdown All in One** - `yzhang.markdown-all-in-one`
- **Função**: Melhor suporte para Markdown
- **Como usar**: 
  - `Ctrl+Shift+V` = preview
  - Autocomplete de links e imagens

### 🎨 **Interface**

#### 15. **Material Icon Theme** - `PKief.material-icon-theme`
- **Função**: Ícones bonitos para arquivos
- **Como usar**: Automático, ícones aparecem no Explorer

## ⌨️ **Atalhos Personalizados Criados**

| Atalho | Função |
|--------|--------|
| `Ctrl+Shift+L` | 🚀 Abrir Live Server |
| `Ctrl+Shift+K` | 🔥 Parar Live Server |
| `Ctrl+Shift+G` | 📋 Git Status |
| `Ctrl+Shift+A` | ➕ Git Add All |
| `Ctrl+Shift+P` | 📤 Git Push |
| `Ctrl+Shift+B` | 🌐 Abrir no Navegador |
| `Alt+Shift+F` | 🎨 Formatar Documento |

## 🔧 **Tarefas Automatizadas**

Acesse via `Ctrl+Shift+P` → "Run Task":

- **🚀 Abrir Live Server** - Inicia servidor local
- **🔥 Parar Live Server** - Para servidor
- **📋 Git Status** - Status do repositório
- **➕ Git Add All** - Adicionar todos os arquivos
- **📤 Git Push** - Enviar para GitHub
- **🌐 Abrir no Navegador** - Abrir index.html

## 📝 **Snippets Personalizados**

### HTML:
- `html5` = Template HTML5 completo
- `hero` = Seção hero
- `card` = Componente card
- `formgroup` = Grupo de formulário

### CSS:
- `csection` = Comentário de seção
- `mq` = Media query
- `flexcenter` = Flexbox centralizado
- `gridlayout` = Grid responsivo

### JavaScript:
- `clog` = Console.log
- `func` = Função
- `afunc` = Arrow function
- `async` = Função assíncrona
- `listen` = Event listener
- `class` = Classe ES6
- `webgl` = Contexto WebGL

## ⚙️ **Configurações Aplicadas**

- ✅ **Auto-save** a cada 1 segundo
- ✅ **Formatação automática** ao salvar
- ✅ **Font ligatures** habilitadas
- ✅ **Bracket pair colorization**
- ✅ **Mini-map** habilitado
- ✅ **Word wrap** ativado
- ✅ **Tab size**: 2 espaços
- ✅ **Live Server** na porta 3000
- ✅ **Prettier** como formatador padrão

## 🎯 **Como Usar no Dia a Dia**

### 1. **Iniciar Desenvolvimento**
```
1. Abrir projeto: Ctrl+K, Ctrl+O
2. Abrir Live Server: Ctrl+Shift+L
3. Começar a codificar!
```

### 2. **Durante o Desenvolvimento**
```
- Salvar = formatação automática
- Ctrl+Click = navegar pelo código
- F12 = ir para definição
- Alt+F12 = peek definition
```

### 3. **Commitar Mudanças**
```
1. Git Status: Ctrl+Shift+G
2. Git Add: Ctrl+Shift+A
3. Commit: Use interface do VS Code
4. Push: Ctrl+Shift+P
```

## 🚨 **Dicas Importantes**

1. **Live Server**: Sempre use para testar o site
2. **Prettier**: Deixe formatar automaticamente
3. **GitLens**: Explore o histórico de commits
4. **Snippets**: Use para acelerar o desenvolvimento
5. **IntelliSense**: Aproveite as sugestões automáticas

## 🎉 **Resultado**

Seu VS Code agora está **100% otimizado** para desenvolvimento web com:
- ⚡ **Produtividade máxima**
- 🎨 **Formatação automática**
- 🚀 **Servidor local integrado**
- 🔧 **Git integrado**
- 📝 **Snippets personalizados**
- ⌨️ **Atalhos rápidos**

**Agora você pode desenvolver de forma profissional e eficiente! 🚀**
