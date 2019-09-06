
#%%
import argparse
#from utils import helper
from utils.helper import *
#%%
if __name__ == '__main__':
    """
    key in player name and rating and provide game results file 
    with format rating,lastname,firstname,winorlose(w/l)
    """
    # Parse input arguments
    parser = argparse.ArgumentParser()
    parser.add_argument(
        '--player_name',
        help='Player name',
        required=False,
        default='Kaye Chen'
    )
    parser.add_argument(
        '--current_rating',
        help='Player\'s current rating',
        required=False,
        type=int,
        default=1551
    )
    parser.add_argument(
        '--results_csv',
        help='Player\'s game results for the tournament',
        required=False,
        default='laopen.csv'
    )    
    args = parser.parse_args()
    arguments = args.__dict__    
    A = Player(arguments.pop('player_name'), arguments.pop('current_rating'))
    df_w_l_score = pd.read_csv(arguments.pop('results_csv'))

    # A= player('Hovik M', 1777)
    # df_w_l_score = pd.read_csv('laopen_hovik.csv')

    #%% [markdown]
    # ## output rating changes for the player

    #%%
    print("For Player:", A.name)
    print("Pre Tournament rating = ", A.rating)
    points_to_add = points_for_games(A, df_w_l_score)
    print("Net rating points gain = ", points_to_add)
    if points_to_add < 50:
        print('Post Tournament Rating = ', points_to_add + A.rating)
    else:
        print("Net rating gain > 50, pre tournament rating needs to be adjusted! ")
        ## tier pass1 rating adjustment method, used by USTTA
        print("Adjusted rating with tier pass1 method = ", A.rating + points_to_add)
        ## tier pass2 method: NOT USED by USTTA 
        ## Average of pre-tournament rating and average of  best win and worst loss.  
        ## e.g. int((1551+(1781+1608)/2.)/2)) 
        A_adj= Player(A.name, A.rating + points_to_add)
    #     need implement adjustments for all players against. 
    #     df_w_l_score = pd.read_csv('laopen_adj.csv')  ##after all the other players' rating being adjusted
        points_to_add = points_for_games(A_adj, df_w_l_score)    
        print('Post Tournament Rating = ', points_to_add + A_adj.rating)
#%%