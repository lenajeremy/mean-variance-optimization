import { Vector, Matrix } from "./stats";
import { getAssetData } from "./read-data-from-json";
import { optimizePortfolio } from "./optimize-portfolio";

// const tickers = [
//     "DANGCEM",
    // "MTNN",
    // "UBA",
    // "ACCESSCORP",
    // "DANGSUGAR",
    // "FIDELITYBK",
    // "SEPLAT",
    // "CONOIL",
    // "TOTAL",
    // "WAPCO",
    // "GTCO"
// ];

const tickers = [
    // "HONYFLOUR",
    // "FLOURMILL",
    // "GUINNESS",
    "CONOIL",
    "TOTAL",
    // "SEPLAT",
    // "WAPCO",
]

const assetsPrices = await Promise.all(tickers.map(asset => getAssetData({
    asset,
    from: "2022-01-01",
    to: "2024-07-03",
    interval: "1m"
}))).then(data => data.map(d => d.map(dd => dd.price)))


const assetsReturns = new Matrix(assetsPrices.map(d => new Vector(d).percentageChange()));
const meanReturns = assetsReturns.mean();
console.log(meanReturns.values);
const cov = assetsReturns.covMatrix();
const corr = assetsReturns.correlation();

console.log(JSON.stringify(cov.values, null, 2));
// console.log(JSON.stringify(corr.values, null, 2));

const solution = optimizePortfolio(cov.values, meanReturns.values, 0.055);
console.log(solution);