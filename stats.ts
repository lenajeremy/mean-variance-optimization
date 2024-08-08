import { FormatOptions, TMatrix, TVector } from "./types";
import { DEFAULT_FLOAT_PRECISION } from "./constants";

export class Vector {
    values: TVector;

    constructor(values: TVector) {
        this.values = values;
    }

    get length(): number {
        return this.values.length;
    }

    mean(formatOptions?: FormatOptions): number {
        const v = this.values;
        let sum = 0;
        for (let i = 0; i < v.length; i++) {
            sum += v[i];
        }
        return Number((sum / v.length).toFixed(formatOptions?.floatPrecision ?? DEFAULT_FLOAT_PRECISION));
    }

    percentageChange(formatOptions?: FormatOptions): Vector {
        const v = this.values;
        let percentageChange = Array.from({ length: v.length - 1 }, () => 0) as TVector;

        for (let i = 1; i < v.length; i++) {
            percentageChange[i - 1] = Number(((v[i] - v[i - 1]) / v[i - 1]).toFixed(formatOptions?.floatPrecision ?? DEFAULT_FLOAT_PRECISION));
        }

        return new Vector(percentageChange);
    }

    variance(formatOptions?: FormatOptions): number {
        const v = this.values;
        let m = this.mean();
        let sum = 0;
        for (let i = 0; i < v.length; i++) {
            sum += Math.pow(v[i] - m, 2);
        }
        return Number((sum / (v.length - 1)).toFixed(formatOptions?.floatPrecision ?? DEFAULT_FLOAT_PRECISION));
    }

    standardDeviation(formatOptions?: FormatOptions): number {
        return Number(Math.sqrt(this.variance(formatOptions)).toFixed(formatOptions?.floatPrecision ?? DEFAULT_FLOAT_PRECISION));
    }

    covariance(v: Vector, formatOptions?: FormatOptions): number {
        const v1 = this.values;
        const v2 = v.values;
        let m1 = this.mean();
        let m2 = v.mean();
        let product = 0;

        if (v1.length !== v2.length) {
            throw new Error("Vectors must be of the same length");
        }

        for (let i = 0; i < v1.length; i++) {
            product += (v1[i] - m1) * (v2[i] - m2);
        }

        return Number((product / (v1.length - 1)).toFixed(formatOptions?.floatPrecision ?? DEFAULT_FLOAT_PRECISION));
    }

    correlation(v: Vector, formatOptions?: FormatOptions): number {
        return this.covariance(v, formatOptions) / Math.sqrt(this.variance(formatOptions) * v.variance(formatOptions));
    }
}

export class Matrix {
    values: TMatrix;
    #vectorizedValues: Vector[]

    constructor(values: TMatrix | Vector[]) {
        if (values[0] instanceof Vector) {
            this.values = (values as Vector[]).map(v => v.values);
            this.#vectorizedValues = values as Vector[];
        } else {
            this.values = values as TMatrix;
            this.#vectorizedValues = this.values.map(v => new Vector(v));
        }
    }


    get length(): number {
        return this.values.length;
    }

    get width(): number {
        return this.values[0].length;
    }

    mean(formatOptions?: FormatOptions): Vector {
        return new Vector(this.#vectorizedValues.map(v => v.mean(formatOptions)));
    }

    variance(formatOptions?: FormatOptions): Vector {
        return new Vector(this.#vectorizedValues.map(v => v.variance(formatOptions)));
    }

    standardDeviation(formatOptions?: FormatOptions): Vector {
        return new Vector(this.#vectorizedValues.map(v => v.standardDeviation(formatOptions)));
    }

    correlation(formatOptions?: FormatOptions): Matrix {
        let n = this.length;
        let correlationMatrix: TMatrix = Array.from({ length: n }, () => Array.from({ length: n }, () => 0))

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                const vectorI = this.#vectorizedValues[i];
                const vectorJ = this.#vectorizedValues[j];
                correlationMatrix[i][j] = vectorI.correlation(vectorJ, formatOptions);
            }
        }

        return new Matrix(correlationMatrix);
    }

    covMatrix(formatOptions?: FormatOptions): Matrix {
        let n = this.length;
        let covMatrix: TMatrix = Array.from({ length: n }, () => Array.from({ length: n }, () => 0))

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                const vectorI = this.#vectorizedValues[i];
                const vectorJ = this.#vectorizedValues[j];
                covMatrix[i][j] = vectorI.covariance(vectorJ, formatOptions);
            }
        }

        return new Matrix(covMatrix);
    }
}