import numpy as np
from cvxopt import matrix, solvers
import matplotlib.pyplot as plt
import mplcursors
from stats_utils import daily_to_annual

def optimize_portfolio(cov_matrix, mean_returns, target_return):
    n = len(mean_returns)
    
    # Convert inputs to cvxopt matrices
    P = matrix(cov_matrix)
    q = matrix(np.zeros(n))

    # Existing constraints
    G_existing = matrix(np.zeros((0, n)))  # No inequality constraints
    h_existing = matrix(np.zeros(0))
    A = matrix(np.vstack((np.ones(n), mean_returns)))
    b = matrix([1.0, target_return])
    
    # Additional constraints: weights >= 0
    G_nonneg = matrix(-np.eye(n))  # Nonnegativity constraint
    h_nonneg = matrix(np.zeros(n))
    
    # Combine constraints
    G = matrix(np.vstack((G_existing, G_nonneg)))
    h = matrix(np.vstack((h_existing, h_nonneg)))

    # Solve the QP problem
    solvers.options['show_progress'] = False
    solution = solvers.qp(P, q, G, h, A, b)

    # Extract the optimized weights
    weights = np.array(solution['x']).flatten()

    # Calculate portfolio return and risk
    portfolio_return = np.dot(weights, mean_returns)
    portfolio_risk = np.sqrt(np.dot(weights.T, np.dot(cov_matrix, weights)))
    
    result = {
        'weights': weights.round(3).tolist(),
        'portfolioReturn': portfolio_return,
        'portfolioRisk': portfolio_risk
    }
    
    return result


def construct_efficient_frontier(cov_matrix, mean_returns, assets, mode = "daily"):
    max_returns = max(mean_returns)
    min_returns = min(mean_returns)
    target_returns = np.linspace(min_returns, max_returns, 1000)
    risks = []
    returns = []
    weights_list = []

    for target in target_returns:
        portfolio_details = optimize_portfolio(cov_matrix, mean_returns, target)
        risks.append(portfolio_details['portfolioRisk'])
        returns.append(portfolio_details['portfolioReturn'])
        weights_list.append(portfolio_details['weights'])

    plt.figure(figsize=(10, 6))
    # plt.plot(risks, returns, label='Efficient Frontier')
    scatter = plt.scatter(risks, returns, c=returns, cmap='viridis', label='Efficient Frontier')
    plt.xlabel('Portfolio Risk (Standard Deviation)')
    plt.ylabel('Portfolio Return')
    plt.title('Efficient Frontier')
    plt.legend()
    plt.grid(True)

    # Add cursor interaction
    cursor = mplcursors.cursor(scatter, hover=True)


    @cursor.connect("add")
    def on_add(sel):
        index = sel.index
        weight_info = "\n".join([f"{assets[i].capitalize()}: {w:.2%}" for i, w in enumerate(weights_list[index])])
        if mode == "daily":
            sharpe_ratio = (returns[index] / risks[index])
            sel.annotation.set(text=f"Return: {returns[index]/100:.2%}\nRisk: {risks[index]/100:.2%}\nSharpe Ratio: {sharpe_ratio:.2}\n\nWeights:\n{weight_info}",
                           fontsize=8)
        else:
            daily_returns = returns[index]
            daily_risk = risks[index]
            annual_returns = daily_to_annual(daily_returns)
            annual_risk = daily_to_annual(daily_risk)
            sharpe_ratio = annual_returns/annual_risk

            sel.annotation.set(text=f"Return: {annual_returns/100:.2%}\nRisk: {annual_risk/100:.2%}\nSharpe Ratio: {sharpe_ratio:.2}\n\nWeights:\n{weight_info}",
                           fontsize=8)


    plt.show()

