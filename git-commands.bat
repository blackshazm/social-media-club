@echo off
echo 🚀 Social Media Club - Git Quick Commands
echo.

:menu
echo Escolha uma opcao:
echo [1] Status do repositorio
echo [2] Adicionar todos os arquivos
echo [3] Commit rapido
echo [4] Push para GitHub
echo [5] Pull do GitHub  
echo [6] Ver historico
echo [7] Sair
echo.

set /p choice="Digite sua opcao (1-7): "

if "%choice%"=="1" goto status
if "%choice%"=="2" goto add
if "%choice%"=="3" goto commit
if "%choice%"=="4" goto push
if "%choice%"=="5" goto pull
if "%choice%"=="6" goto log
if "%choice%"=="7" goto exit

echo Opcao invalida!
goto menu

:status
echo.
echo 📊 Status do repositorio:
git status
echo.
pause
goto menu

:add
echo.
echo ➕ Adicionando todos os arquivos...
git add .
echo ✅ Arquivos adicionados!
echo.
pause
goto menu

:commit
echo.
set /p message="💬 Digite a mensagem do commit: "
git commit -m "%message%"
echo ✅ Commit realizado!
echo.
pause
goto menu

:push
echo.
echo 📤 Enviando para GitHub...
git push
if %errorlevel%==0 (
    echo ✅ Push realizado com sucesso!
) else (
    echo ❌ Erro no push. Verifique sua conexao.
)
echo.
pause
goto menu

:pull
echo.
echo 📥 Baixando do GitHub...
git pull
if %errorlevel%==0 (
    echo ✅ Pull realizado com sucesso!
) else (
    echo ❌ Erro no pull. Verifique sua conexao.
)
echo.
pause
goto menu

:log
echo.
echo 📖 Historico de commits:
git log --oneline -10
echo.
pause
goto menu

:exit
echo.
echo 👋 Ate logo!
exit
