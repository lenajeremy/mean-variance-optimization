import numpy as np
from optimize_portfolio import optimize_portfolio, construct_efficient_frontier
from get_asset_data import get_asset_data
from stats_utils import percentage_change, daily_to_annual, annual_to_daily

from_date = "2022-07-01"
to_date  = "2024-07-31"

portfolio_assets = [
    "dangcem", "airtelafri", "buafoods", "buacement", "mtnn", "geregu",
    "seplat", "gtco", "zenithbank", "fbnh", "transcohot", "uba", "nestle",
    "stanbic", "accesscorp", "wapco", "transcorp", "dangsugar", "eti", 
    "fidelitybk", "presco", "nb", "okomuoil", "ucap", "flourmill", "guinness",
    "fcmb", "jberger", "total", "sterlingng"
]


# portfolio_assets = ['dangcem', 'conoil', "buafoods", "ucap"]

print(len(portfolio_assets))

prices = [
    get_asset_data(
        asset, 
        from_date, 
        to_date, 
        '1d', 
        get_price_only=True
    ) for asset in portfolio_assets
]



number_of_days = len(prices[0])

percentage_returns = [percentage_change(prices[i]) for i in range(len(prices))]

mean_returns = np.mean(percentage_returns, axis=1)
print("MEAN RETURNS: ", mean_returns)

mean_risk = np.std(percentage_returns, axis=1)
print("MEAN RISK", mean_risk)

# print(mean_returns[0])

# print([{"asset": portfolio_assets[i], "ratio": mean_returns[i] / mean_risk[i]} for i in range(len(portfolio_assets))])

cov_matrix = np.cov(percentage_returns, ddof=1)
# print("\covariance matrix:\n", cov_matrix, "\n")

target_daily_return = 0.25
target_annual_return = daily_to_annual(target_daily_return)


result = optimize_portfolio(cov_matrix, mean_returns, target_daily_return)
print(result)

# investment_capital = 500_000

# amount_per_asset = []
# for (index, asset) in enumerate(portfolio_assets):
#     amount_per_asset.append(
#         {
#             "asset": asset,
#             "amount": investment_capital * result['weights'][index]
#         }
#     )

# print(amount_per_asset)


construct_efficient_frontier(cov_matrix, mean_returns, portfolio_assets, mode = "daily")