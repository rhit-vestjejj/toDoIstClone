import matplotlib.pyplot as plt 
import numpy as np
import pandas as pd

data = {
    "Day": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    "Tasks_Done": [5, 7, 8, 6, 9, 4, 3],
    "Tasks_Not_Done": [2, 1, 3, 2, 1, 5, 6]
}


df_todo = pd.DataFrame(data)
df_todo.to_csv("tasks.csv", index = False)
todo_tasks = pd.read_csv("tasks.csv")
print("Columns Names", todo_tasks.columns)




#Order of days
days_ordered = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
tasks_done = todo_tasks["Tasks_Done"].values
tasks_not_done = todo_tasks["Tasks_Not_Done"].values  

todo_tasks["Day"] = pd.Categorical(todo_tasks["Day"], categories=days_ordered, ordered = True)
todo_tasks = todo_tasks.sort_values(by=["Day"], ascending = True )
plt.bar(days_ordered, tasks_done, width =0.45, label = "Complete", color = "blue",bottom = tasks_not_done)
plt.bar(days_ordered,tasks_done, width = 0.45, label = "Incomplete", color = "red" )
plt.ylabel("Total Tasks")
plt.xlabel("Day of the week")
plt.title("Daily Task Overview")
plt.legend()

plt.show()