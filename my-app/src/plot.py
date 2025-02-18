import matplotlib.pyplot as plt 
import numpy as np
import pandas as pd

#Order of days
days_order = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
fig, ax= plt.subplots()
todo_tasks = pd.read_csv("tasks.cv")
todo_tasks = todo_tasks.sort_values(by=["Day", "Tasks_Done", "Taks_Not_Done"], ascending = [True, False, False] )
plt.show()