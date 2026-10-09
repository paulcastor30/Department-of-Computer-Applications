MSU_IIT_NAME = "Mindanao State University - Iligan Institute of Technology"


def normalize_education_institution(value):
    """Normalize only known names for MSU-IIT, never other MSU campuses."""
    key = " ".join(value.replace("–", "-").replace("—", "-").split()).casefold()
    if key.endswith(", philippines"):
        key = key[:-len(", philippines")]
    key = key.replace(" - ", "-").replace("- ", "-").replace(" -", "-")
    if key in {
        "msu-iligan institute of technology",
        "mindanao state university-iligan institute of technology",
        "msu-iit",
    }:
        return MSU_IIT_NAME
    return value
