import { TMatrix, TVector } from "./types";

interface PortfolioResult {
    weights: TVector;
    portfolioReturn: number;
    portfolioRisk: number;
}

type ObjectiveFunction = (x: TVector) => [number, TVector];
type NumericalSolver = (func: ObjectiveFunction, initialGuess: TVector, tolerance?: number, maxIterations?: number) => TVector;

const numericalSolver: NumericalSolver = (func, initialGuess, tolerance = 1e-6, maxIterations = 1_000_000) => {
    let x: TVector = [...initialGuess];
    let learningRate = 0.01;
    for (let i = 0; i < maxIterations; i++) {
        const [f, grad] = func(x);
        if (Math.abs(f) < tolerance) return x;

        let step = 1
        while (step > 1e-10) {
            const newX = x.map((xi, i) => Math.max(0, Math.min(1, xi - step * learningRate * grad[i])));
            // console.log(newX)
            const [newF] = func(newX);
            if (Math.abs(newF) < Math.abs(f)) {
                x = newX;
                break;
            }
            step *= 0.5;
        }
        if (step < 1e-10) throw new Error("Failed to converge step size too small");
    }
    throw new Error("Failed to converge max iterations reached");
};

export function optimizePortfolio(covMatrix: TMatrix, meanReturns: TVector, targetReturn: number): PortfolioResult {

    const numAssets = meanReturns.length;

    const objective: ObjectiveFunction = (x: TVector): [number, TVector] => {
        const weights = x.slice(0, numAssets);
        const [lambda1, lambda2] = x.slice(numAssets);

        let portfolioVariance = 0;
        for (let i = 0; i < numAssets; i++) {
            for (let j = 0; j < numAssets; j++) {
                portfolioVariance += weights[i] * weights[j] * covMatrix[i][j];
            }
        }

        const portfolioReturn = weights.reduce((sum, w, i) => sum + w * meanReturns[i], 0);

        const f = portfolioVariance
            - lambda1 * (portfolioReturn - targetReturn)
            - lambda2 * (weights.reduce((sum, w) => sum + w, 0) - 1);

        const grad: TVector = []

        for (let i = 0; i < numAssets; i++) {
            let gradI = 0;
            for (let j = 0; j < numAssets; j++) {
                gradI += 2 * weights[j] * covMatrix[i][j];
            }
            gradI -= lambda1 * meanReturns[i] - lambda2;
            grad.push(gradI);
        }

        grad.push(-(portfolioReturn - targetReturn));
        grad.push(-(weights.reduce((sum, w) => sum + w, 0) - 1));

        return [f, grad];
    };

    // const totalMeanReturn = meanReturns.reduce((a, b) => a + b, 0);
    const initialGuess = meanReturns.map(mean => 1 / numAssets).concat([0, 0]);

    const solution = numericalSolver(objective, initialGuess);

    const weights = solution.slice(0, numAssets);
    const portfolioReturn = weights.reduce((sum, w, i) => sum + w * meanReturns[i], 0);
    let portfolioRisk = 0;

    for (let i = 0; i < numAssets; i++) {
        for (let j = 0; j < numAssets; j++) {
            portfolioRisk += weights[i] * weights[j] * covMatrix[i][j];
        }
    }
    portfolioRisk = Math.sqrt(portfolioRisk);

    return {
        weights,
        portfolioReturn,
        portfolioRisk
    };
}
