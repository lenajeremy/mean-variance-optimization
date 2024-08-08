import numpy as np

DEFAULT_FLOAT_PRECISION = 5

def percentage_change(values, float_precision=DEFAULT_FLOAT_PRECISION):
    values = np.array(values)
    changes = ((values[1:] - values[:-1]) / values[:-1]) * 100
    return np.round(changes, decimals=float_precision)

def sharpe_ratio(daily_returns, risk_free_rate=0, periods_per_year=252):
    # Convert annual risk-free rate to daily
    daily_risk_free_rate = risk_free_rate / periods_per_year
    
    # Calculate daily excess returns
    excess_daily_returns = daily_returns - daily_risk_free_rate
    
    # Annualize the excess return
    annual_excess_return = np.mean(excess_daily_returns) * periods_per_year
    
    # Annualize the volatility
    annual_volatility = np.std(daily_returns, ddof=1) * np.sqrt(periods_per_year)
    
    # Sharpe Ratio
    sharpe_ratio_value = annual_excess_return / annual_volatility
    
    return sharpe_ratio_value

def annual_to_daily(annual_return, periods_per_year=252):
    return ((1 + annual_return / 100) ** (1 / periods_per_year) - 1) * 100

def daily_to_annual(daily_return, periods_per_year=252):
    return (((1 + daily_return / 100) ** periods_per_year) - 1) * 100


print(daily_to_annual(0.3), daily_to_annual(-0.2))