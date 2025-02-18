import matplotlib.pyplot as plt 
import numpy as np
import pandas as pd

todo_tasks = pd.read_csv("tasks.cv")

#Order of days
days_ordered = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
todo_tasks["Day"] = pd.Categorical(todo_tasks["Day"], categories=days_ordered, ordered = True)
todo_tasks = todo_tasks.sort_values(by=["Day", "Tasks_Done", "Taks_Not_Done"], ascending = [True, False, False] )
plt.bar(days_ordered)
plt.bar

plt.show()