/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const fetch = require('node-fetch');
const crypto = require('crypto');

// Base de datos en memoria para likes
const stockDB = {};

// Función para anonimizar IP
function anonymizeIP(ip) {
  return crypto.createHash('sha256').update(ip).digest('hex');
}

module.exports = function (app) {
  app.route('/api/stock-prices')
    .get(async function (req, res) {
      try {
        let { stock, like } = req.query;

        if (!stock) return res.status(400).json({ error: 'Stock symbol required' });

        // Convertir a array si es solo uno y mantener orden
        if (!Array.isArray(stock)) stock = [stock];
        stock = stock.map(s => s.toUpperCase());

        const ipHash = anonymizeIP(req.ip);

        // Obtener información de cada stock
        const results = await Promise.all(stock.map(async s => {
          const response = await fetch(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${s}/quote`);
          const data = await response.json();

          if (!stockDB[s]) stockDB[s] = { likes: 0, likedIPs: new Set() };

          if (like === 'true' && !stockDB[s].likedIPs.has(ipHash)) {
            stockDB[s].likes++;
            stockDB[s].likedIPs.add(ipHash);
          }

          return {
            stock: s,
            price: data.latestPrice,
            likes: stockDB[s].likes
          };
        }));

        // Respuesta según cantidad de stocks
        if (results.length === 1) {
          res.json({ stockData: results[0] });
        } else if (results.length === 2) {
          const [a, b] = results;
          res.json({
            stockData: [
              { stock: a.stock, price: a.price, rel_likes: a.likes - b.likes },
              { stock: b.stock, price: b.price, rel_likes: b.likes - a.likes }
            ]
          });
        }

      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener información del stock' });
      }
    });
};
