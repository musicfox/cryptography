#!/usr/bin/sh

echo "Running JavaScript and Python 3 test suites for the mfcrypt encryption utilities. JS First. Starting now."
echo
echo
echo "WARNING: Using the application Python environment to run all tests."
npx jest --coverage
echo
echo
echo "JavaScript testing completed. Starting Python tests now."
echo
echo
pipenv run python -m pytest -vv
echo
echo
echo "Python and JavaScript unit testing is complete."
echo

