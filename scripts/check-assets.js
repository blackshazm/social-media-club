#!/usr/bin/env node

/**
 * Script para verificar links e assets do projeto
 * Valida se todos os recursos estão acessíveis
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando assets e links...');

// Lista de arquivos críticos que devem existir
const criticalFiles = [
  'index.html',
  'styles.css',
  'script.js',
  'sw.js',
  'manifest.json',
  'robots.txt',
  'sitemap.xml'
];

// Lista de diretórios críticos
const criticalDirs = [
  'icons',
  'images'
];

let errors = 0;
let warnings = 0;

// Verificar arquivos críticos
console.log('\n📁 Verificando arquivos críticos...');
criticalFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - ARQUIVO AUSENTE`);
    errors++;
  }
});

// Verificar diretórios críticos
console.log('\n📂 Verificando diretórios críticos...');
criticalDirs.forEach(dir => {
  if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
    const files = fs.readdirSync(dir);
    console.log(`✅ ${dir}/ (${files.length} arquivos)`);
  } else {
    console.log(`⚠️  ${dir}/ - DIRETÓRIO AUSENTE`);
    warnings++;
  }
});

// Verificar conteúdo do index.html
console.log('\n🔗 Verificando links no index.html...');
if (fs.existsSync('index.html')) {
  const htmlContent = fs.readFileSync('index.html', 'utf8');
  
  // Verificar links CSS
  const cssLinks = htmlContent.match(/href="([^"]*\.css[^"]*)"/g);
  if (cssLinks) {
    cssLinks.forEach(link => {
      const href = link.match(/href="([^"]*)"/)[1];
      if (!href.startsWith('http') && !fs.existsSync(href)) {
        console.log(`❌ CSS não encontrado: ${href}`);
        errors++;
      } else if (!href.startsWith('http')) {
        console.log(`✅ CSS: ${href}`);
      }
    });
  }
  
  // Verificar scripts JS
  const jsLinks = htmlContent.match(/src="([^"]*\.js[^"]*)"/g);
  if (jsLinks) {
    jsLinks.forEach(link => {
      const src = link.match(/src="([^"]*)"/)[1];
      if (!src.startsWith('http') && !fs.existsSync(src)) {
        console.log(`❌ JS não encontrado: ${src}`);
        errors++;
      } else if (!src.startsWith('http')) {
        console.log(`✅ JS: ${src}`);
      }
    });
  }
  
  // Verificar imagens
  const imgLinks = htmlContent.match(/src="([^"]*\.(jpg|jpeg|png|gif|svg|webp)[^"]*)"/gi);
  if (imgLinks) {
    imgLinks.forEach(link => {
      const src = link.match(/src="([^"]*)"/i)[1];
      if (!src.startsWith('http') && !src.startsWith('data:') && !fs.existsSync(src)) {
        console.log(`⚠️  Imagem não encontrada: ${src}`);
        warnings++;
      } else if (!src.startsWith('http') && !src.startsWith('data:')) {
        console.log(`✅ Imagem: ${src}`);
      }
    });
  }
}

// Verificar manifest.json
console.log('\n📱 Verificando manifest.json...');
if (fs.existsSync('manifest.json')) {
  try {
    const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
    
    // Verificar ícones do manifest
    if (manifest.icons) {
      manifest.icons.forEach(icon => {
        // Remover a barra inicial para verificação local
        const localPath = icon.src.startsWith('/') ? icon.src.substring(1) : icon.src;
        if (!fs.existsSync(localPath)) {
          console.log(`⚠️  Ícone do manifest não encontrado: ${icon.src}`);
          warnings++;
        } else {
          console.log(`✅ Ícone: ${icon.src} (${icon.sizes})`);
        }
      });
    }
    
    console.log(`✅ Manifest válido: ${manifest.name}`);
  } catch (e) {
    console.log(`❌ Manifest inválido: ${e.message}`);
    errors++;
  }
}

// Verificar service worker
console.log('\n⚙️  Verificando Service Worker...');
if (fs.existsSync('sw.js')) {
  const swContent = fs.readFileSync('sw.js', 'utf8');
  if (swContent.includes('install') && swContent.includes('fetch')) {
    console.log('✅ Service Worker configurado corretamente');
  } else {
    console.log('⚠️  Service Worker pode estar incompleto');
    warnings++;
  }
}

// Relatório final
console.log('\n📊 RELATÓRIO FINAL');
console.log('='.repeat(50));
console.log(`✅ Verificações concluídas`);
console.log(`❌ Erros: ${errors}`);
console.log(`⚠️  Avisos: ${warnings}`);

if (errors > 0) {
  console.log('\n🚨 ATENÇÃO: Foram encontrados erros críticos!');
  process.exit(1);
} else if (warnings > 0) {
  console.log('\n⚠️  Alguns avisos foram encontrados, mas o projeto está funcional.');
  process.exit(0);
} else {
  console.log('\n🎉 Todos os assets estão corretos!');
  process.exit(0);
}