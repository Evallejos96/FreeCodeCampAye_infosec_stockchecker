'use strict';

const fetch = require('node-fetch');
const crypto = require('crypto');

// Base de datos en memoria para likes
const stockDB = {};

function anonymizeIP(ip) {
  // Hash SHA256 de la IP para anonimizar
  return crypto.createHash('sha256').update(ip).digest('hex');
}

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(async function (req, res) {
      try {
        let { stock, like } = req.query;
        const ipHash = anonymizeIP(req.ip);
        const multiple = Array.isArray(stock);

        if (!multiple) stock = [stock];

        // Obtener info de cada stock
        const results = await Promise.all(stock.map(async (s) => {
          const response = await fetch(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${s}/quote`);
          const data = await response.json();

          // Inicializar en DB si no existe
          if (!stockDB[s]) stockDB[s] = { likes: 0, likedIPs: new Set() };

          // Contar like solo si no lo hizo esta IP
          if (like === 'true' && !stockDB[s].likedIPs.has(ipHash)) {
            stockDB[s].likes++;
            stockDB[s].likedIPs.add(ipHash);
          }

          return {
            stock: s.toUpperCase(),
            price: data.latestPrice,
            likes: stockDB[s].likes
          };
        }));

        // Respuesta según cantidad de stocks
        if (multiple) {
          const [a, b] = results;
          res.json({
            stockData: [
              { stock: a.stock, price: a.price, rel_likes: a.likes - b.likes },
              { stock: b.stock, price: b.price, rel_likes: b.likes - a.likes }
            ]
          });
        } else {
          res.json({ stockData: results[0] });
        }

      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener información del stock' });
      }
    });
};
