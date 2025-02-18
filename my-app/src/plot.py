import matplotlib.pyplot as plt 
import numpy as np
import pandas as pd

todo_tasks = pd.read_csv("tasks.csv")

#Order of days
days_ordered = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
tasks_done = ["Tasks_Done"]
tasks_not_done = ["tasks_not_done"]

todo_tasks["Day"] = pd.Categorical(todo_tasks["Day"], categories=days_ordered, ordered = True)
todo_tasks = todo_tasks.sort_values(by=["Day"], acending = "False" )
plt.bar(days_ordered, tasks_done, width =0.45, label = "Complete", color = "blue",bottom = tasks_not_done)
plt.bar(days_ordered,tasks_done, width = 0.45, label = "Incomplete", color = "red" )
plt.ylabel("Total Tasks")
plt.xlabel("Day of the week")

plt.title("Daily Task Overview")
plt.legend()

plt.show()