import './App.css';
import { useState, useEffect } from 'react';
import { db } from './firebase-config';
import { doc, setDoc, getDoc } from 'firebase/firestore';

function App() {
  const [days, setDays] = useState({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: []
  });
  const [isLoading, setIsLoading] = useState(true);

  function getDataFromDays() {
    let cvsrows = [];
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    const header = "Day,TaskDone,TaskNotDone";
    cvsrows.push(header);
    
    daysOfWeek.forEach(day => {
      let totalTasks = days[day].length; 
      let doneTasks = 0;

      for (let i = 0; i < days[day].length; i++) {
          if (days[day][i]['completed'] === true) {
              doneTasks++;
          }
      }

      cvsrows.push(`${day},${doneTasks},${totalTasks - doneTasks}`);
    });
    

    const csvContent = cvsrows.join('\n');

    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = "tasks.csv";  // Name of the file
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const tasksDoc = await getDoc(doc(db, 'tasks', 'weekTasks'));
        if (tasksDoc.exists()) {
          setDays(tasksDoc.data());
        }
      } catch (error) {
        console.error("Error loading tasks:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTasks();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const saveTasks = async () => {
        try {
          await setDoc(doc(db, 'tasks', 'weekTasks'), days);
        } catch (error) {
          console.error("Error saving tasks:", error);
        }
      };
      saveTasks();
    }
  }, [days, isLoading]);

  function addTask(day, task) {
    setDays(prevDays => ({
      ...prevDays,
      [day]: [...prevDays[day], { text: task, completed: false }]
    }));
  }

  function removeTask(day, index) {
    setDays(prevDays => {
      const newTasks = [...prevDays[day]];
      newTasks.splice(index, 1);
      return {
        ...prevDays,
        [day]: newTasks
      };
    });
  }

  function toggleComplete(day, index) {
    setDays(prevDays => {
      const newTasks = [...prevDays[day]];
      newTasks[index] = {
        ...newTasks[index],
        completed: !newTasks[index].completed
      };
      return {
        ...prevDays,
        [day]: newTasks
      };
    });
  }

  function Day({ day }) {
    const [newTask, setNewTask] = useState('');
    
    return (
      <div>
        <h1>{day}</h1>
        <div className="list">
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {days[day].map((task, index) => (
              <li key={index} style={{ display: 'flex', alignItems: 'center' }}>
                <button
                  onClick={() => toggleComplete(day, index)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: task.completed ? '#4CAF50' : '#000000',
                    fontSize: '20px',
                    marginRight: '4px'
                  }}
                >
                  &#x2713;
                </button>
                <button 
                  onClick={() => removeTask(day, index)} 
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer', 
                    color: 'red', 
                    fontSize: '20px',
                    marginRight: '8px'
                  }}
                >
                  &#x2716;
                </button>
                <span style={{ 
                  textDecoration: task.completed ? 'line-through' : 'none'
                }}>
                  {task.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div id="addTaskContainer" style = {{
          marginBottom: '25px',
        }}>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && newTask.trim() !== '') {
                addTask(day, newTask.trim());
                setNewTask('');
              }
            }}
            placeholder={`Add task for ${day}`}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1 style = {{
          justifyContent: 'center',
          textAlign: 'center',
          color: 'white',
          fontSize: '70px',
          textShadow: '1px 1px 2px black, 0 0 25px gray, 0 0 5px white',
          marginTop: '30px',
        }}>Daily Planner</h1>
        <div className="row1">
          <div className="container">
            <Day day="Monday" />
          </div>
          <div className="container">
            <Day day="Tuesday" />
          </div>
          <div className="container">
            <Day day="Wednesday" />
          </div>
          <div className="container">
            <Day day="Thursday" />
          </div>
        </div>
        <div className="row2">
          <div className="container">
            <Day day="Friday" />
          </div>
          <div className="container">
            <Day day="Saturday" />
          </div>
          <div className="container">
            <Day day="Sunday" />
          </div>
        </div>
        <button onClick = {() => getDataFromDays()} style = {{
          color: 'red',
        }}>Testing</button>
      </header>
    </div>
  );
}

export default App;