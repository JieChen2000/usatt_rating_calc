# usatt_rating_calc
This is a simple calculator to get player's USATT rating change after a tournament. 
### user input 
User needs put in player name, current rating and a result csv file with format 
rating,lastname,firstname,winorlose(w/l) which contains win or loss against other players in the tournament. 
### unit/coverage test 
coverage run tests/test_rating_calc.py 
coverage report -m --omit tests/test_rating_calc.py

### run the program 
python rating_calc.py --player_name Kaye --current_rating 1776 --results_csv hittaopen.csv
