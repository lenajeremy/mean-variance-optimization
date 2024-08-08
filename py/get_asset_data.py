import requests
import re
import json
from datetime import datetime
import os


def fetch_asset_data(asset):
    url = f'https://afx.kwayisi.org/chart/ngx/{asset}'
    response = requests.get(url)
    response.raise_for_status()

    asset_price = parse_asset_price(response.text)
    asset_price_json = json.dumps(asset_price, default=str)
    write_data(asset_price_json, asset)


def parse_asset_price(text):
    regex = re.compile(r'd\("(\d{4}-\d{2}-\d{2})"\),(\d+(\.\d+)?)')
    matches = regex.findall(text)
    
    parsed_data = [
        {
            'date': datetime.strptime(match[0], '%Y-%m-%d'),
            'price': float(match[1])
        }
        for match in matches
    ]

    return parsed_data


def write_data(data, asset):
    os.makedirs('./data', exist_ok=True)
    file_path = f'./data/{asset.lower()}.json'
    with open(file_path, 'w') as file:
        file.write(data)


def get_asset_data(asset, from_date, to_date, interval, get_price_only=False):
    today = datetime.today()
    from_date = datetime.strptime(from_date, '%Y-%m-%d')
    to_date = datetime.strptime(to_date, '%Y-%m-%d')

    if from_date > today:
        raise ValueError("From date must be before today")

    if to_date > today:
        raise ValueError("To date must be before today")

    file_path = f'./data/{asset.lower()}.json'
    
    if not os.path.exists(file_path):
        print(f"Could not find data for {asset}. Now fetching...")
        fetch_asset_data(asset)
    
    with open(file_path, 'r') as file:
        data = json.load(file)
        
    filtered_data = [
        (d['price'] if get_price_only else d) for d in data
        if from_date <= parse_date(d['date']) <= to_date and
        (
            interval == '1d' or
            (interval == '1w' and parse_date(d['date']).weekday() == 0) or
            (interval == '1m' and parse_date(d['date']).day == 1)
        )
    ]

    return filtered_data


def parse_date(date_str):
    for fmt in ('%Y-%m-%d %H:%M:%S', '%Y-%m-%dT%H:%M:%S.%fZ', '%Y-%m-%d'):
        try:
            return datetime.strptime(date_str, fmt)
        except ValueError:
            continue
    raise ValueError(f"no valid date format found for date_str: {date_str}")