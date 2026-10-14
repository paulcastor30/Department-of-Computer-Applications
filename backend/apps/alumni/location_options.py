from functools import lru_cache
import json
from pathlib import Path


@lru_cache(maxsize=1)
def location_options():
    return json.loads((Path(__file__).parent / "data" / "location-options.json").read_text())

