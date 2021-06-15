# usatt_rating_calc
This is a simple calculator to get player's USATT rating change after a tournament. 

### Running Enviroment Setup 
On Mac: 
* `git clone https://github.com/JieChen2000/usatt_rating_calc.git`
* `cd usatt_rating_calc;mkdir venv; cd venv` 
* `python3 -m venv rating-calc`
* `cd ..` 
* `source venv/rating-calc/bin/activate`
* `pip install --upgrade pip;pip install -r requirements.txt`


### user input 
User needs put in player name, current rating and a result csv file with format 
rating,lastname,firstname,winorlose(w/l) which contains win or loss against other players in the tournament. see `spartansopen.csv` as an example.

### run the program 
`python rating_calc.py --player_name Kaye --current_rating 2034 --results_csv spartansopen.csv`

### For developer: unit/coverage test for this repo
* `coverage run tests/test_rating_calc.py`
* `coverage report -m --omit tests/test_rating_calc.py`