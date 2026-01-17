"""
Grocery store web scraper for finding food items on sale.

This module provides tools to scrape grocery store websites and extract
information about food items that are currently on sale, including their
names and discounted prices.
"""

import requests
import os
import redis
import json
import hashlib
from pprint import pprint

STORE_URLS = {
    "nofrills": "https://www.nofrills.ca/en",
    "costco": "https://www.costco.ca/?langId=-24"
}

# Redis configuration
REDIS_HOST = os.environ.get('REDIS_HOST', 'localhost')
REDIS_PORT = int(os.environ.get('REDIS_PORT', 6379))
REDIS_DB = int(os.environ.get('REDIS_DB', 0))
CACHE_TTL = int(os.environ.get('CACHE_TTL', 3600))  # 1 hour default


def get_redis_client():
    """Get Redis client instance."""
    try:
        client = redis.Redis(host=REDIS_HOST, port=REDIS_PORT,
                             db=REDIS_DB, decode_responses=True)
        client.ping()  # Test connection
        return client
    except redis.ConnectionError:
        print("Warning: Redis connection failed. Caching disabled.")
        return None


def get_cache_key(site_url: str) -> str:
    """Generate cache key for a site URL."""
    return f"scraper:{hashlib.md5(site_url.encode()).hexdigest()}"


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
        Results are cached for 1 hour by default (configurable via CACHE_TTL env var).
    """
    # Check cache first
    redis_client = get_redis_client()
    if redis_client:
        cache_key = get_cache_key(site_url)
        cached_data = redis_client.get(cache_key)
        if cached_data:
            print(f"Cache hit for {site_url}")
            return json.loads(cached_data)
        print(f"Cache miss for {site_url}")

    # Perform scraping
    scraped_data = _scrape_site(site_url)

    # Cache the results if Redis is available
    if redis_client and isinstance(scraped_data, list):
        try:
            redis_client.setex(cache_key, CACHE_TTL, json.dumps(scraped_data))
            print(f"Cached results for {site_url}")
        except Exception as e:
            print(f"Failed to cache results: {e}")

    return scraped_data


def _scrape_site(site_url: str) -> list[dict]:
    """
    Internal function to perform the actual web scraping.

    Args:
        site_url: The URL to scrape

    Returns:
        List of sale items or error dict
    """
    # Mock data for testing when API key is not available
    if 'YELLOW_CAKE_KEY' not in os.environ:
        print('Couldn\'t find Yellowcake API key - using mock data')
        return [{'item_name': 'Kraft Smooth Peanut Butter 2 kg', 'price': 14.99}, {'item_name': 'Minute Rice Premium Long Grain Rice 1.4 kg', 'price': 7}, {'item_name': 'Burnbrae Farms Naturegg Nest Laid White Eggs, Large 12 ea', 'price': 5}]

    REQUEST_PROMPT = """extract the name of the items
    that are on sale with their price"""

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
            return [{"error": "Authentication failed - check your API key"}]
        elif r.status_code == 429:
            return [{"error": "Rate limit exceeded"}]
        else:
            return [{
                "error": f"Request failed with status {r.status_code}",
                "details": r.text
            }]

    # Parse SSE stream to get only the 'complete' event
    try:
        content = r.text
        lines = content.split('\n')
        
        for i, line in enumerate(lines):
            if line.strip() == 'event: complete':
                # Look for the next data line
                for j in range(i + 1, len(lines)):
                    if lines[j].startswith('data: '):
                        try:
                            json_data = json.loads(lines[j][6:])  # Remove 'data: ' prefix
                            if json_data.get('success') and 'data' in json_data:
                                return json_data['data']
                        except json.JSONDecodeError:
                            continue
                        break
    except Exception as e:
        print(f"Error parsing response: {e}")
    
    return []


def clear_cache(site_url: str = None) -> bool:
    """
    Clear cached data for a specific site or all cached data.

    Args:
        site_url: Optional URL to clear cache for. If None, clears all scraper cache.

    Returns:
        True if cache was cleared successfully, False otherwise
    """
    redis_client = get_redis_client()
    if not redis_client:
        return False

    try:
        if site_url:
            cache_key = get_cache_key(site_url)
            result = redis_client.delete(cache_key)
            print(f"Cleared cache for {site_url}: {result > 0}")
            return result > 0
        else:
            # Clear all scraper cache keys
            keys = redis_client.keys("scraper:*")
            if keys:
                result = redis_client.delete(*keys)
                print(f"Cleared {result} cache entries")
                return result > 0
            return True
    except Exception as e:
        print(f"Failed to clear cache: {e}")
        return False
