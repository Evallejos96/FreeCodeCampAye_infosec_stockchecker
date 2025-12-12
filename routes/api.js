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

let likesDB = {}; // { STOCK: { likes: number, ips: Set() } }

function hashIP(ip) {
  return crypto.createHash('md5').update(ip).digest('hex');
}

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(async (req, res) => {

      try {
        let { stock, like } = req.query;

        if (!stock) {
          return res.json({ error: 'missing stock' });
        }

        // Convertir stock a array siempre
        const stocks = Array.isArray(stock) ? stock : [stock];

        const ip = hashIP(req.ip);

        const results = await Promise.all(
          stocks.map(async ticker => {

            const symbol = ticker.toUpperCase();

            const apiRes = await fetch(
              `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${symbol}/quote`
            );

            const data = await apiRes.json();

            // si el stock no existe, prevenir que reviente
            const price = Number(data.latestPrice) || 0;

            if (!likesDB[symbol]) {
              likesDB[symbol] = { likes: 0, ips: new Set() };
            }

            const wantsLike = like === 'true' || like === true;

            if (wantsLike && !likesDB[symbol].ips.has(ip)) {
              likesDB[symbol].ips.add(ip);
              likesDB[symbol].likes++;
            }

            return {
              stock: symbol,
              price,
              likes: likesDB[symbol].likes
            };
          })
        );

        // 1 Stock
        if (results.length === 1) {
          return res.json({ stockData: results[0] });
        }

        // 2 Stocks
        if (results.length === 2) {
          const [a, b] = results;

          return res.json({
            stockData: [
              {
                stock: a.stock,
                price: a.price,
                rel_likes: a.likes - b.likes
              },
              {
                stock: b.stock,
                price: b.price,
                rel_likes: b.likes - a.likes
              }
            ]
          });
        }

      } catch (err) {
        console.error(err);
        return res.json({ error: 'external source error' });
      }

    });
};
