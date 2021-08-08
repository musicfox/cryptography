"""test_setup.py 

# Test config & setup items

This file outlines `pytest` functions to cover important project 
assumptions related to configuration and setup items. 

## Usage 

Running a `pytest` script is simple. Here's how:
```python 
python -m pytest -vv --cov --cov-branch test/test_setup.py
```
"""
import mfcrypt

def test_package_version():
    """Test that the package version is a string and has at least two periods"""
    assert isinstance(mfcrypt.__version__, str)
