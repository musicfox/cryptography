#!/usr/bin/env python
# -*- coding: utf-8 -*-

# Note: To use the 'upload' functionality of this file, you must:
#   $ pipenv install twine --dev

import io
import os
import sys
from shutil import rmtree
import mfcrypt
from setuptools import find_packages, setup, Command
from setuptools.command.egg_info import egg_info

# Package meta-data.
NAME = "mfcrypt"
DESCRIPTION = "Cryptographic utilities for Musicfox Python applications."
URL = "https://github.com/cryptography/"
EMAIL = "dev@musicfox.io"
LICENSE = "MIT"
AUTHOR = "Jason R. Stevens, CFA on behalf of Musicfox, Inc."
REQUIRES_PYTHON = ">=3.9"
VERSION = mfcrypt.__version__
GEMFURY = None  # f'twine upload dist/* --repository-url https://push.fury.io/musicfox -u {os.environ.get("TWINE_TOKEN")} -p ""'

# What packages are required for this module to be executed?
REQUIRED = [
    "pycryptodomex",
]

# What packages are optional?
EXTRAS = {
    # 'fancy feature': ['django'],
}

# The rest you shouldn't have to touch too much :)
# ------------------------------------------------
# Except, perhaps the License and Trove Classifiers!
# If you do change the License, remember to change the Trove Classifier for that!

here = os.path.abspath(os.path.dirname(__file__))

# Import the README and use it as the long-description.
# Note: this will only work if 'README.md' is present in your MANIFEST.in file!
try:
    with io.open(os.path.join(here, "README.md"), encoding="utf-8") as f:
        long_description = "\n" + f.read()
except FileNotFoundError:
    long_description = DESCRIPTION

# Load the package's __version__.py module as a dictionary.
about = {}
if not VERSION:
    project_slug = NAME.lower().replace("-", "_").replace(" ", "_")
    with open(os.path.join(here, project_slug, "__version__.py")) as f:
        exec(f.read(), about)
else:
    about["__version__"] = VERSION


class UploadCommand(Command):
    """Support setup.py upload."""

    description = "Build and publish the package."
    user_options = []

    @staticmethod
    def status(s):
        """Prints things in bold."""
        print("\033[1m{0}\033[0m".format(s))

    def initialize_options(self):
        pass

    def finalize_options(self):
        pass

    def run(self):
        try:
            self.status("Removing previous builds…")
            rmtree(os.path.join(here, "dist"))
        except OSError:
            pass

        self.status("Building Source and Wheel distribution…")
        os.system("{0} setup.py sdist bdist_wheel ".format(sys.executable))

        if GEMFURY:
            self.status("Uploading the package to Gemfury via Twine...")
            os.system(GEMFURY)

        else:
            self.status("Uploading the package to PyPI via Twine…")

            os.system("twine upload dist/*")

        sys.exit()


class egg_info_ex(egg_info):
    """Includes license file into `.egg-info` folder."""

    def run(self):
        # don't duplicate license into `.egg-info` when building a distribution
        if not self.distribution.have_run.get("install", True):
            # `install` command is in progress, copy license
            self.mkpath(self.egg_info)
            self.copy_file("LICENSE", self.egg_info)

        egg_info.run(self)


# Where the magic happens:
setup(
    name=NAME,
    version=about["__version__"],
    description=DESCRIPTION,
    long_description=long_description,
    long_description_content_type="text/markdown",
    author=AUTHOR,
    author_email=EMAIL,
    python_requires=REQUIRES_PYTHON,
    url=URL,
    # If your package is a single module, use this instead of 'packages':
    # py_modules=['mfcrypt'],
    packages=find_packages(
        exclude=["tests", "*.tests", "*.tests.*", "tests.*", "node_modules"]
    ),
    # entry_points={
    #     'console_scripts': ['mycli=mymodule:cli'],
    # },
    install_requires=REQUIRED,
    extras_require=EXTRAS,
    include_package_data=True,
    license=LICENSE,
    license_files=("LICENSE",),
    classifiers=[
        # Trove classifiers
        # Full list: https://pypi.python.org/pypi?%3Aaction=list_classifiers
    ],
    # $ setup.py publish support.
    cmdclass={"upload": UploadCommand, "egg_info": egg_info_ex},
)
