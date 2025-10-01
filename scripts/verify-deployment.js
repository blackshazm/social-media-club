#!/usr/bin/env node

/**
 * Script para verificar se o deployment foi bem-sucedido
 * Testa a disponibilidade e performance do site
 */

const https = require('https');
const http = require('http');

// Configurações
const SITE_URL = process.env.VERCEL_URL || process.env.SITE_URL || 'https://social-media-club.vercel.app';
const TIMEOUT = 10000; // 10 segundos

console.log('🚀 Verificando deployment...');
console.log(`🌐 URL: ${SITE_URL}`);

/**
 * Faz uma requisição HTTP/HTTPS
 */
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const startTime = Date.now();
    
    const req = client.get(url, (res) => {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data,
          responseTime: responseTime
        });
      });
    });
    
    req.on('error', reject);
    req.setTimeout(TIMEOUT, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

/**
 * Verifica se o site está acessível
 */
async function checkSiteAvailability() {
  console.log('\n📡 Testando disponibilidade...');
  
  try {
    const response = await makeRequest(SITE_URL);
    
    if (response.statusCode === 200) {
      console.log(`✅ Site acessível (${response.responseTime}ms)`);
      
      // Verificar conteúdo básico
      if (response.data.includes('<title>') && response.data.includes('Social Media Club')) {
        console.log('✅ Conteúdo carregado corretamente');
      } else {
        console.log('⚠️  Conteúdo pode estar incompleto');
      }
      
      // Verificar headers de segurança
      const headers = response.headers;
      if (headers['x-frame-options']) {
        console.log('✅ X-Frame-Options configurado');
      }
      if (headers['x-content-type-options']) {
        console.log('✅ X-Content-Type-Options configurado');
      }
      if (headers['referrer-policy']) {
        console.log('✅ Referrer-Policy configurado');
      }
      
      return true;
    } else {
      console.log(`❌ Site retornou status ${response.statusCode}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Erro ao acessar site: ${error.message}`);
    return false;
  }
}

/**
 * Verifica recursos críticos
 */
async function checkCriticalResources() {
  console.log('\n🔍 Verificando recursos críticos...');
  
  const resources = [
    '/style.css',
    '/script.js',
    '/manifest.json',
    '/robots.txt',
    '/sitemap.xml'
  ];
  
  let allGood = true;
  
  for (const resource of resources) {
    try {
      const url = SITE_URL + resource;
      const response = await makeRequest(url);
      
      if (response.statusCode === 200) {
        console.log(`✅ ${resource} (${response.responseTime}ms)`);
      } else {
        console.log(`⚠️  ${resource} - Status ${response.statusCode}`);
        if (resource === '/style.css' || resource === '/script.js') {
          allGood = false;
        }
      }
    } catch (error) {
      console.log(`❌ ${resource} - ${error.message}`);
      if (resource === '/style.css' || resource === '/script.js') {
        allGood = false;
      }
    }
  }
  
  return allGood;
}

/**
 * Verifica performance básica
 */
async function checkPerformance() {
  console.log('\n⚡ Verificando performance...');
  
  try {
    const response = await makeRequest(SITE_URL);
    
    if (response.responseTime < 1000) {
      console.log(`✅ Tempo de resposta excelente: ${response.responseTime}ms`);
    } else if (response.responseTime < 3000) {
      console.log(`⚠️  Tempo de resposta aceitável: ${response.responseTime}ms`);
    } else {
      console.log(`❌ Tempo de resposta lento: ${response.responseTime}ms`);
      return false;
    }
    
    // Verificar tamanho da página
    const sizeKB = Math.round(response.data.length / 1024);
    console.log(`📊 Tamanho da página: ${sizeKB}KB`);
    
    if (sizeKB < 500) {
      console.log('✅ Tamanho da página otimizado');
    } else {
      console.log('⚠️  Página pode ser otimizada');
    }
    
    return true;
  } catch (error) {
    console.log(`❌ Erro na verificação de performance: ${error.message}`);
    return false;
  }
}

/**
 * Função principal
 */
async function main() {
  let allChecks = true;
  
  // Verificar disponibilidade
  const isAvailable = await checkSiteAvailability();
  if (!isAvailable) allChecks = false;
  
  // Verificar recursos críticos
  const resourcesOk = await checkCriticalResources();
  if (!resourcesOk) allChecks = false;
  
  // Verificar performance
  const performanceOk = await checkPerformance();
  if (!performanceOk) allChecks = false;
  
  // Relatório final
  console.log('\n📊 RELATÓRIO DE DEPLOYMENT');
  console.log('='.repeat(50));
  
  if (allChecks) {
    console.log('🎉 Deployment verificado com sucesso!');
    console.log(`✅ Site disponível em: ${SITE_URL}`);
    process.exit(0);
  } else {
    console.log('🚨 Problemas encontrados no deployment!');
    console.log('❌ Verifique os logs acima para mais detalhes');
    process.exit(1);
  }
}

// Executar verificação
main().catch(error => {
  console.error('💥 Erro fatal:', error.message);
  process.exit(1);
});