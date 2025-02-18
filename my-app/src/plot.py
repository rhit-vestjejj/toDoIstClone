
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import matplotlib.animation as animation

#Test case
data = {
    "Day": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    "Tasks_Done": [5, 7, 8, 6, 9, 4, 3],
    "Tasks_Not_Done": [2, 1, 3, 2, 1, 5, 6]
}


df_todo = pd.DataFrame(data)


days_ordered = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
df_todo["Day"] = pd.Categorical(df_todo["Day"], categories=days_ordered, ordered=True)
df_todo = df_todo.sort_values(by=["Day"], ascending=True)


tasks_done = np.array(df_todo["Tasks_Done"])
tasks_not_done = np.array(df_todo["Tasks_Not_Done"])
x_axis = np.arange(len(days_ordered))


bar_width = 0.4


fig, ax = plt.subplots()
ax.set_title("Daily Task Overview", fontweight="bold")
ax.set_xlabel("Day of the Week", fontweight="bold")
ax.set_ylabel("Total Tasks", fontweight="bold")
ax.set_xticks(x_axis)
ax.set_xticklabels(days_ordered)
ax.set_ylim(0, max(max(tasks_done), max(tasks_not_done)) + 2)  


bars_done = ax.bar(x_axis - bar_width / 2, [0] * len(tasks_done), width=bar_width, label="Complete", color="blue")
bars_not_done = ax.bar(x_axis + bar_width / 2, [0] * len(tasks_not_done), width=bar_width, label="Incomplete", color="red")
ax.legend()


def update(frame):
    
    if frame >= 100:
        frame = 100
    progress = frame/100
    for i in range(len(tasks_done)):
        bars_done[i].set_height(tasks_done[i] * progress)
        bars_not_done[i].set_height(tasks_not_done[i] * progress)
    


ani = animation.FuncAnimation(fig, update, frames=100, interval=30, repeat = False)

plt.show()
