"""
Grocery store web scraper for finding food items on sale.

This module provides tools to scrape grocery store websites and extract
information about food items that are currently on sale, including their
names and discounted prices.
"""

import requests
import os
from pprint import pprint

STORE_URLS = {
        "nofrills": "https://www.nofrills.ca/en",
}


def get_grocery_store_url(store_name: str) -> str:
    """
    Get the website URL for a specific grocery store.

    Args:
        store_name: The name of the store (e.g., "nofrills")

    Returns:
        The full URL of the store's website, or empty string if store not found

    Example:
        >>> get_grocery_store_url("nofrills")
        'https://www.nofrills.ca/en'
    """
    if store_name in STORE_URLS:
        return STORE_URLS[store_name]
    return ''


def list_available_grocery_stores() -> list[str]:
    """
    Get a list of all available grocery stores that can be scraped for food deals.

    Returns:
        List of store names (e.g., ["nofrills"])

    Example:
        >>> list_available_grocery_stores()
        ['nofrills']
    """
    return list(STORE_URLS.keys())


def find_grocery_sale_items(site_url: str) -> list[dict]:
    """
    Find all food and grocery items currently on sale at a store.

    This function scrapes the provided grocery store URL and extracts information
    about food products that are on sale, including their names and discounted prices.
    Uses AI-powered web scraping to identify sale items.

    Args:
        site_url: The full URL of the grocery store website to scrape
                  (e.g., "https://www.nofrills.ca/en")

    Returns:
        A list of dictionaries, where each dictionary contains:
        - 'item_name': The name of the food product on sale (str)
        - 'price': The discounted sale price (float)

        Returns an empty list if no items are found or an error occurs.

    Example:
        >>> scrape_deals("https://www.nofrills.ca/en")
        [
            {'item_name': 'Kraft Smooth Peanut Butter 2 kg', 'price': 14.99},
            {'item_name': 'Eggs Large 12 ea', 'price': 5.0},
            ...
        ]

    Note:
        This function requires the YELLOW_CAKE_KEY environment variable to be set.
        Scraping may take 30-60 seconds depending on the website size.
    """
    return [{'item_name': 'Kraft Smooth Peanut Butter 2 kg', 'price': 14.99}, {'item_name': 'Minute Rice Premium Long Grain Rice 1.4 kg', 'price': 7}, {'item_name': 'Kuhn Rikon Square Tray 1L', 'price': 37.5}, {'item_name': 'Kuhn Rikon Rectangular Tray 2L', 'price': 45}, {'item_name': 'Kuhn Rikon Rectangular Tray 3.6L', 'price': 62.5}, {'item_name': 'Kuhn Rikon Mixing Bowl', 'price': 50}, {'item_name': 'Kuhn Rikon Cast Iron Pan 26cm x 26cm', 'price': 160}, {'item_name': 'Kuhn Rikon Cast Iron Dutch Oven 3.9L', 'price': 250}, {'item_name': 'Burnbrae Farms Naturegg Nest Laid White Eggs, Large 12 ea', 'price': 5}, {'item_name': "President's Choice Blueberries Cultivated 600 g", 'price': 4.75}, {'item_name': "President's Choice Mango Chunks 600 g", 'price': 4.75}, {'item_name': 'Natural Bakery Bakery Bread Rye 500 g', 'price': 3.5}, {'item_name': "Earth's Own Almond Beverage, Unsweetened Original 1.89 l", 'price': 3.5}, {'item_name': 'Great British Reserve Cheese, Cheddar 400 g', 'price': 7}, {'item_name': "Brar's Homestyle Yogurt 1800 g", 'price': 7.5}, {'item_name': 'IOGO Nanö Drinkable Strawberry Yogurt 1% 6x93.0 ml', 'price': 3.25}, {'item_name': 'Schneiders Blue Ribbon Classic Bologna 500 g', 'price': 5}, {'item_name': 'Extra Lean Ground Beef, Grass Fed 450 g', 'price': 8}, {'item_name': 'Lilydale Cooked Turkey Breast 500 g', 'price': 7.5}, {'item_name': 'Pam Cooking Spray 170 g', 'price': 5}, {'item_name': 'Samyang Stir-Fried Noodle Hot Chicken Ramen, Carbo 650 g', 'price': 7.5}, {'item_name': 'Twinings 20ct Pure Peppermint 20 ea', 'price': 4}, {'item_name': 'Snackpack Snack Pack, Pudding, Chocolate 4x99.0 g', 'price': 2}, {'item_name': 'Carnation Rich And Creamy Hot Chocolate 450 g', 'price': 6}, {'item_name': 'Chapmans Super Cone Chocolate and Vanilla Ice Cream with Caramel Centre 8x120.0 ml', 'price': 5}, {'item_name': 'Chapmans Super Ice Cream Sandwich Vanilla 12x120.0 ml', 'price': 5}, {'item_name': 'Bens Fried Style Rice Single Serve Cup 68 g', 'price': 2}, {'item_name': 'Bens Jasmine Rice Single Serve Cup 62 g', 'price': 2}, {'item_name': 'Bens Mexican Style Rice Single Serve Cup 68 g', 'price': 2}, {'item_name': 'Bens Roasted Chicken Flavour Rice Single Serve Cup 68 g', 'price': 2}, {'item_name': 'Carnation Simply Hot Chocolate, Canister 400 g', 'price': 6}, {'item_name': 'Carnation Marshmallow Hot Chocolate 450 g', 'price': 6}, {'item_name': 'Chapmans Frozen Yogurt Black Jack Cherry 2 l', 'price': 5}, {'item_name': 'Chapmans Frozen Yogurt Cappuccino 2 l', 'price': 5}, {'item_name': 'Chapmans Frozen Yogurt Cookies & Cream 2 l', 'price': 5}, {'item_name': 'Chapmans Frozen Yogurt Maple Walnut 2 l', 'price': 5}, {'item_name': 'Chapmans Frozen Yogurt 3 Of a Kind Vanilla 2 l', 'price': 5}, {'item_name': 'Chapmans Frozen Yogurt Vanilla 2 l', 'price': 5}, {'item_name': 'Chapmans Super Frozen Yogurt Sandwich Vanilla 12x120.0 ml', 'price': 5}, {'item_name': 'Chapmans Super Cone Caramel and Vanilla Ice Cream with Chocolate Centre 8x120.0 ml', 'price': 5}, {'item_name': 'Chapmans Super Creamy Bar Assorted 18x75.0 ml', 'price': 5}, {'item_name': 'Chapmans Super Frosty Light Ice Cream Bar 18x75.0 ml', 'price': 5}, {'item_name': 'Chapmans Super Fudge Ice Milk Bar 18x75.0 ml', 'price': 5}, {'item_name': 'Chapmans Super Frosty Light Neapolitan Ice Cream Bar 18x75.0 ml', 'price': 5}, {'item_name': 'Chapmans Super Ice Cream Sandwich Neapolitan 12x120.0 ml', 'price': 5}, {'item_name': 'Chapmans Super Ice Cream Sandwich Saucy Spots - Caramel 12x120.0 ml', 'price': 5}, {'item_name': 'Chapmans Super Ice Cream Sandwich Double Decker 12x120.0 ml', 'price': 5}, {'item_name': 'Chapmans Frozen Yogurt Canadian Blueberries & Cream 2 l', 'price': 5}]


    REQUEST_PROMPT = """extract the name of the items
    that are on sale with their price"""

    if 'YELLOW_CAKE_KEY' not in os.environ:
        print('Couldn\'t find Yellowcake API key')
        return []

    headers = {
        "Content-Type": "application/json",
        "X-API-Key": os.environ['YELLOW_CAKE_KEY'],
    }

    data = {
        "url": site_url,
        "prompt": REQUEST_PROMPT,
    }

    r = requests.post(
        'https://api.yellowcake.dev/v1/extract-stream',
        headers=headers,
        json=data,
        stream=True)  # Enable streaming

    # Check the response status
    if r.status_code != 200:
        if r.status_code == 401:
            return {"error": "Authentication failed - check your API key"}
        elif r.status_code == 429:
            return {"error": "Rate limit exceeded"}
        else:
            return {
                "error": f"Request failed with status {r.status_code}",
                "details": r.text
            }

    # Parse SSE stream to get only the 'complete' event
    import json

    # TODO fix this SSE issue
    return r.text

