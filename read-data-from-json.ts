import fs from 'node:fs';
import { fetchAssetData } from './write-to-json';

type GetAssetDataOptions = {
    asset: string;
    from: string;
    to: string;
    interval: '1d' | '1w' | '1m';
}

export const getAssetData = async ({
    asset,
    from,
    to,
    interval
}: GetAssetDataOptions) => {
    const today = new Date();
    const fromDate = new Date(from);
    const toDate = new Date(to);

    if (fromDate > today) {
        throw new Error("From date must be before today");
    }

    if (toDate > today) {
        throw new Error("To date must be before today");
    }

    let file: string;

    try {
        file = await fs.promises.readFile(`./data/${asset.toLowerCase()}.json`, 'utf-8');    
    } catch (e) {
        console.warn(`Could not find data for ${asset}. Now fetching...`);
        await fetchAssetData(asset);
        file = await fs.promises.readFile(`./data/${asset.toLowerCase()}.json`, 'utf-8');
    }
    
    const data = JSON.parse(file) as { date: string, price: number }[];

    // filter the data to only include the dates we want
    const filteredData = data.filter(d => {
        const date = new Date(d.date);
        const datesInRage = date >= fromDate && date <= toDate;        
        if (interval === '1d') {
            return datesInRage;
        } else if (interval === '1w') {
            return datesInRage && date.getDay() === 1;
        } else if (interval === '1m') {
            return datesInRage && date.getDate() === 1;
        }
    });

    return filteredData;
}