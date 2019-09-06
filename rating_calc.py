
#%%
import pandas as pd

class player:
    def __init__(self, name, rating):
        self.name = name
        self.rating = rating
    def last_name(self):
        return self.name.split(' ')[-1]
    def first_name(self):
        return self.name.split(' ')[:-1]


#%%
def points_for_game(A, B, win):
    points_for_player_a = 0 
    dif_points = abs(A.rating - B.rating)
    if A.rating >= B.rating and win:
        if dif_points <= 12:
            points_for_player_a += 8 
        elif dif_points <= 37:
            points_for_player_a += 7 
        elif dif_points <= 62:
            points_for_player_a += 6 
        elif dif_points <= 87:
            points_for_player_a += 5 
        elif dif_points <= 112:
            points_for_player_a += 4 
        elif dif_points <= 137:
            points_for_player_a += 3 
        elif dif_points <= 162:
            points_for_player_a += 2 
        elif dif_points <= 187:
            points_for_player_a += 2 
        elif dif_points <= 212:
            points_for_player_a += 1 
        elif dif_points <= 237:
            points_for_player_a += 1 
        else:
            points_for_player_a += 0                       
    elif A.rating >= B.rating and not win: 
        if dif_points <= 12:
            points_for_player_a -= 8 
        elif dif_points <= 37:
            points_for_player_a -= 10 
        elif dif_points <= 62:
            points_for_player_a -= 13
        elif dif_points <= 87:
            points_for_player_a -= 16
        elif dif_points <= 112:
            points_for_player_a -= 20 
        elif dif_points <= 137:
            points_for_player_a -= 25 
        elif dif_points <= 162:
            points_for_player_a -= 30 
        elif dif_points <= 187:
            points_for_player_a -= 35 
        elif dif_points <= 212:
            points_for_player_a -= 40 
        elif dif_points <= 237:
            points_for_player_a -= 45 
        else:
            points_for_player_a -= 50          
    elif A.rating < B.rating and not win: 
        if dif_points <= 12:
            points_for_player_a -= 8 
        elif dif_points <= 37:
            points_for_player_a -= 7 
        elif dif_points <= 62:
            points_for_player_a -= 6
        elif dif_points <= 87:
            points_for_player_a -= 5
        elif dif_points <= 112:
            points_for_player_a -= 4 
        elif dif_points <= 137:
            points_for_player_a -= 3 
        elif dif_points <= 162:
            points_for_player_a -= 2 
        elif dif_points <= 187:
            points_for_player_a -= 2 
        elif dif_points <= 212:
            points_for_player_a -= 1 
        elif dif_points <= 237:
            points_for_player_a -= 1 
        else:
            points_for_player_a -= 0            
    elif A.rating < B.rating and win: 
        if dif_points <= 12:
            points_for_player_a += 8 
        elif dif_points <= 37:
            points_for_player_a += 10 
        elif dif_points <= 62:
            points_for_player_a += 13
        elif dif_points <= 87:
            points_for_player_a += 16
        elif dif_points <= 112:
            points_for_player_a += 20 
        elif dif_points <= 137:
            points_for_player_a += 25 
        elif dif_points <= 162:
            points_for_player_a += 30 
        elif dif_points <= 187:
            points_for_player_a += 35 
        elif dif_points <= 212:
            points_for_player_a += 40 
        elif dif_points <= 237:
            points_for_player_a += 45 
        else:
            points_for_player_a += 50       
    else:
        print("such case is not valid: ", 
              A.name, A.rating, B.name, B.rating, dif_points, points_for_player_a)
    return points_for_player_a

#%%
def points_for_games(A, df_w_l_score):
    """
    points gain for a set of games results in a dataframe for player A
    """
    points_to_add = 0 
    for index, row in df_w_l_score.iterrows():
        name = row['firstname'] + ' ' + row['lastname']
        rating = row['rating']
        winorlose = row['winorlose'].strip(' ').lower()
        B = player(name, rating)
        if winorlose == 'w':
            points_to_add += points_for_game(A, B, True)
        elif winorlose == 'l':
            points_to_add += points_for_game(A, B, False)
    return points_to_add
#%%
# if __name__ == '__main__':
"""
key in player name and rating and provide game results file 
with format rating,lastname,firstname,winorlose(w/l)
"""
A = player('Kaye Chen', 1551)
df_w_l_score = pd.read_csv('laopen.csv')

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
    A_adj= player(A.name, A.rating + points_to_add)
#     need implement adjustments for all players against. 
#     df_w_l_score = pd.read_csv('laopen_adj.csv')  ##after all the other players' rating being adjusted
    points_to_add = points_for_games(A_adj, df_w_l_score)    
    print('Post Tournament Rating = ', points_to_add + A_adj.rating)
#%%