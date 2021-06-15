"""
Unit Test.
"""
import unittest
import warnings
import os
import sys

module_path = os.path.abspath(os.path.join(".."))
if module_path not in sys.path:
    sys.path.append(module_path)
module_path = os.path.abspath(os.path.join("."))
if module_path not in sys.path:
    sys.path.append(module_path)

from utils.helper import *


class TestRatingCalc(unittest.TestCase):
    """
    drived unittest class
    """

    def setUp(self):
        """the setup method"""
        warnings.filterwarnings("ignore", category=ResourceWarning)

    def tearDown(self):
        """the tearDown method"""

    def test__true_validate_player_lastname(self):
        """test a case of good player lastname"""
        A = Player("Kaye Chen", 1551)
        self.assertEqual(A.last_name(), "Chen")

    def test__true_validate_player_rating(self):
        """test a case of good player name"""
        A = Player("Kaye Chen", 1551)
        self.assertEqual(A.rating, 1551)

    def test__true_validate_points_for_game(self):
        """test a case of good points for game"""
        A = Player("Kaye Chen", 1551)
        B = Player("Hove M", 1671)
        self.assertEqual(points_for_game(A, B, True), 25)

    def test__true_validate_points_for_games(self):
        """test a case of good points for games"""
        A = Player("Kaye Chen", 1551)
        fake_file_content = {
            "rating": [1234, 1671],
            "lastname": ["Chen", "Jing"],
            "firstname": ["Love", "Rachel"],
            "winorlose": ["w", "l"],
        }
        df = pd.DataFrame(data=fake_file_content)
        # print(points_for_games(A, df))
        self.assertEqual(points_for_games(A, df), -3)


if __name__ == "__main__":
    unittest.main(warnings="ignore")
