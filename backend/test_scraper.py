#!/usr/bin/env python3
"""
Test script for the grocery scraper with Redis caching.
"""

import os
import sys
import time
from src.scraper import find_grocery_sale_items, get_grocery_store_url, clear_cache


def test_scraper():
    """Test the scraper functionality with timing."""

    # Test with NoFrills
    store_url = get_grocery_store_url("nofrills")
    print(f"Testing scraper with: {store_url}")

    # First run (should be cache miss)
    print("\n=== First run (cache miss) ===")
    start_time = time.time()
    results = find_grocery_sale_items(store_url)
    first_duration = time.time() - start_time

    print(f"Found {len(results)} items in {first_duration:.2f} seconds")
    if results:
        print("Sample items:")
        for item in results[:3]:
            if isinstance(item, dict):
                if 'item_name' in item and 'price' in item:
                    print(f"  - {item['item_name']}: ${item['price']}")
                elif 'raw_response' in item:
                    print(f"  - Raw API response: {item['raw_response'][:100]}...")
                elif 'error' in item:
                    print(f"  - Error: {item['error']}")
                else:
                    print(f"  - Unknown format: {item}")
            else:
                print(f"  - Unexpected type: {type(item)} - {item}")

    # Second run (should be cache hit if Redis is available)
    print("\n=== Second run (should be cache hit) ===")
    start_time = time.time()
    results2 = find_grocery_sale_items(store_url)
    second_duration = time.time() - start_time

    print(f"Found {len(results2)} items in {second_duration:.2f} seconds")

    # Compare results
    if results == results2:
        print("✓ Results are identical")
        if second_duration < first_duration:
            print(
                f"✓ Cache speedup: {first_duration/second_duration:.1f}x faster")
    else:
        print("✗ Results differ between runs")


def test_cache_clear():
    """Test cache clearing functionality."""
    print("\n=== Testing cache clear ===")
    store_url = get_grocery_store_url("nofrills")

    # Clear cache for this URL
    success = clear_cache(store_url)
    print(f"Cache clear result: {success}")


if __name__ == "__main__":
    print("Grocery Scraper Test")
    print("===================")

    # Check environment
    if 'YELLOW_CAKE_KEY' not in os.environ:
        print("⚠️  YELLOW_CAKE_KEY not set - will use mock data")

    # Run tests
    test_scraper()
    test_cache_clear()
