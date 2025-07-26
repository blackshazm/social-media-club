#!/bin/bash

# 🚀 Social Media Club - Git Quick Commands
# Torna o script executável: chmod +x git-commands.sh

echo "🚀 Social Media Club - Git Quick Commands"
echo ""

show_menu() {
    echo "Escolha uma opção:"
    echo "[1] Status do repositório"
    echo "[2] Adicionar todos os arquivos"
    echo "[3] Commit rápido"
    echo "[4] Push para GitHub"
    echo "[5] Pull do GitHub"
    echo "[6] Ver histórico"
    echo "[7] Sair"
    echo ""
}

while true; do
    show_menu
    read -p "Digite sua opção (1-7): " choice
    
    case $choice in
        1)
            echo ""
            echo "📊 Status do repositório:"
            git status
            echo ""
            read -p "Pressione Enter para continuar..."
            ;;
        2)
            echo ""
            echo "➕ Adicionando todos os arquivos..."
            git add .
            echo "✅ Arquivos adicionados!"
            echo ""
            read -p "Pressione Enter para continuar..."
            ;;
        3)
            echo ""
            read -p "💬 Digite a mensagem do commit: " message
            git commit -m "$message"
            echo "✅ Commit realizado!"
            echo ""
            read -p "Pressione Enter para continuar..."
            ;;
        4)
            echo ""
            echo "📤 Enviando para GitHub..."
            if git push; then
                echo "✅ Push realizado com sucesso!"
            else
                echo "❌ Erro no push. Verifique sua conexão."
            fi
            echo ""
            read -p "Pressione Enter para continuar..."
            ;;
        5)
            echo ""
            echo "📥 Baixando do GitHub..."
            if git pull; then
                echo "✅ Pull realizado com sucesso!"
            else
                echo "❌ Erro no pull. Verifique sua conexão."
            fi
            echo ""
            read -p "Pressione Enter para continuar..."
            ;;
        6)
            echo ""
            echo "📖 Histórico de commits:"
            git log --oneline -10
            echo ""
            read -p "Pressione Enter para continuar..."
            ;;
        7)
            echo ""
            echo "👋 Até logo!"
            exit 0
            ;;
        *)
            echo "Opção inválida!"
            ;;
    esac
done
