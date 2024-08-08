import fs from "fs";

export async function fetchAssetData(asset: string) {
  const res = await fetch(`https://afx.kwayisi.org/chart/ngx/${asset}`);
  const text = await res.text();

  const assetPrice = parseAssetPrice(text);
  const assetPriceJSON = JSON.stringify(assetPrice);
  writeData(assetPriceJSON, asset);
}

function parseAssetPrice(text: string) {
  const regex = /d\("(\d{4}-\d{2}-\d{2})"\),(\d+(\.\d+)?)/g
  const matches = Array.from(text.matchAll(regex)).map(match => ({
    date: new Date(match[1]),
    price: parseFloat(match[2])
  }))

  return matches
}

function writeData(data: string, asset: string) {
  fs.writeFileSync(`./data/${asset.toLowerCase()}.json`, data);
}