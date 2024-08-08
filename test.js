const np = {
    float64: v => parseFloat(v)
}

const v = [
  { asset: "dangcem", ratio: np.float64(0.12021379428534783) },
  { asset: "airtelafri", ratio: np.float64(0.12553591240077547) },
  { asset: "buafoods", ratio: np.float64(0.24478782811620475) },
  { asset: "buacement", ratio: np.float64(0.07525630205485843) },
  { asset: "mtnn", ratio: np.float64(-0.03931459840051931) },
  { asset: "geregu", ratio: np.float64(0.22325211031726247) },
  { asset: "seplat", ratio: np.float64(0.17763473488140974) },
  { asset: "gtco", ratio: np.float64(0.038549711026380336) },
  { asset: "zenithbank", ratio: np.float64(0.0054050314699671574) },
  { asset: "fbnh", ratio: np.float64(0.033840842000659274) },
  { asset: "transcohot", ratio: np.float64(0.1937319516468949) },
  { asset: "uba", ratio: np.float64(0.061710180531130386) },
  { asset: "nestle", ratio: np.float64(-0.08098308908631403) },
  { asset: "stanbic", ratio: np.float64(0.0013082245966393713) },
  { asset: "accesscorp", ratio: np.float64(0.017194007070449692) },
  { asset: "wapco", ratio: np.float64(0.04442745676489211) },
  { asset: "transcorp", ratio: np.float64(0.11051573929570897) },
  { asset: "dangsugar", ratio: np.float64(0.05316199700535034) },
  { asset: "eti", ratio: np.float64(0.051797467261973706) },
  { asset: "fidelitybk", ratio: np.float64(0.05005113000356824) },
  { asset: "presco", ratio: np.float64(0.1484830587889557) },
  { asset: "nb", ratio: np.float64(-0.06169073101400994) },
  { asset: "okomuoil", ratio: np.float64(0.0582048671167984) },
  { asset: "ucap", ratio: np.float64(0.08217662966897867) },
  { asset: "flourmill", ratio: np.float64(0.0522567668662965) },
  { asset: "guinness", ratio: np.float64(-0.023160125818510506) },
  { asset: "fcmb", ratio: np.float64(0.05547131129460279) },
  { asset: "jberger", ratio: np.float64(0.1627637249106606) },
  { asset: "total", ratio: np.float64(0.03824581456265832) },
  { asset: "sterlingng", ratio: np.float64(0.02543926601559066) },
];

console.log(v.filter(a => a.ratio > 0).sort((a, b) => a.ratio - b.ratio))