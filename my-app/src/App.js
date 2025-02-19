import './App.css';
import { useState, useEffect, useRef } from 'react';
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

  const [goals, setGoals] = useState([]);

  const [notes, setNotes] = useState('');

  const [isLoading, setIsLoading] = useState(true);

  function getDataFromDays() {
    let cvsrows = [];
    const daysOfWeek = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday'
    ];
    const header = 'Day,TaskDone,TaskNotDone';
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
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'tasks.csv';
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        const tasksDoc = await getDoc(doc(db, 'tasks', 'weekTasks'));
        const goalsDoc = await getDoc(doc(db, 'goal', 'allGoals'));

        if (tasksDoc.exists()) {
          setDays(tasksDoc.data());
        }
        if (goalsDoc.exists()) {
          const data = goalsDoc.data();
          let loadedGoals = [];
          if (Array.isArray(data)) {
            loadedGoals = data;
          } else if (Array.isArray(data.goals)) {
            loadedGoals = data.goals;
          }
          setGoals(loadedGoals);
        }
      } catch (error) {
        console.error('Error loading tasks/goals:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const notesDoc = await getDoc(doc(db, 'notes', 'generalNotes'));
        if (notesDoc.exists()) {
          const data = notesDoc.data();
          setNotes(data.text || '');
        }
      } catch (error) {
        console.error('Error loading notes:', error);
      }
    };
    loadNotes();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const saveTasksAndGoals = async () => {
        try {
          await setDoc(doc(db, 'tasks', 'weekTasks'), days);
          await setDoc(doc(db, 'goal', 'allGoals'), { goals });
        } catch (error) {
          console.error('Error saving tasks/goals:', error);
        }
      };
      saveTasksAndGoals();
    }
  }, [days, goals, isLoading]);

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
      return { ...prevDays, [day]: newTasks };
    });
  }

  function toggleComplete(day, index) {
    setDays(prevDays => {
      const newTasks = [...prevDays[day]];
      newTasks[index] = {
        ...newTasks[index],
        completed: !newTasks[index].completed
      };
      return { ...prevDays, [day]: newTasks };
    });
  }

  function addGoal(goalText) {
    setGoals(prevGoals => [
      ...prevGoals,
      { text: goalText, completed: false }
    ]);
  }

  function removeGoal(index) {
    setGoals(prevGoals => {
      const newGoals = [...prevGoals];
      newGoals.splice(index, 1);
      return newGoals;
    });
  }

  function toggleGoalComplete(index) {
    setGoals(prevGoals => {
      const newGoals = [...prevGoals];
      newGoals[index] = {
        ...newGoals[index],
        completed: !newGoals[index].completed
      };
      return newGoals;
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
                <span
                  style={{
                    textDecoration: task.completed ? 'line-through' : 'none'
                  }}
                >
                  {task.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div id="addTaskContainer" style={{ marginBottom: '25px' }}>
          <input
            type="text"
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            onKeyPress={e => {
              if (e.key === 'Enter' && newTask.trim() !== '') {
                addTask(day, newTask.trim());
                setNewTask('');
              }
            }}
            placeholder={`Add task for ${day}`}
            className="addTask"
          />
        </div>
      </div>
    );
  }

  function GeneralGoals() {
    const [newGoal, setNewGoal] = useState('');

    return (
      <div>
        <h1
          style={{
            justifyContent: 'center',
            textAlign: 'center',
            color: 'white',
            fontSize: '40px',
            textShadow: '1px 1px 2px black, 0 0 25px gray, 0 0 5px white',
            marginBottom: '37px'
          }}
        >
          Main Goals
        </h1>
        <div className="container" style={{ paddingTop: '10px' }}>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {goals.map((goal, index) => (
              <li
                key={index}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <button
                  onClick={() => toggleGoalComplete(index)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: goal.completed ? '#4CAF50' : '#000000',
                    fontSize: '20px',
                    marginRight: '4px'
                  }}
                >
                  &#x2713;
                </button>
                <button
                  onClick={() => removeGoal(index)}
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
                <span
                  style={{
                    textDecoration: goal.completed ? 'line-through' : 'none'
                  }}
                >
                  {goal.text}
                </span>
              </li>
            ))}
          </ul>
          <div id="addGoalContainer" style={{ marginBottom: '25px' }}>
            <input
              type="text"
              value={newGoal}
              onChange={e => setNewGoal(e.target.value)}
              onKeyPress={e => {
                if (e.key === 'Enter' && newGoal.trim() !== '') {
                  addGoal(newGoal.trim());
                  setNewGoal('');
                }
              }}
              placeholder="Add a new goal"
              className="addTask"
            />
          </div>
        </div>
      </div>
    );
  }

  function Notes() {
    const [localNotes, setLocalNotes] = useState(notes);
    const textAreaRef = useRef(null);

    useEffect(() => {
      setLocalNotes(notes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [notes]);

    useEffect(() => {
      if (textAreaRef.current) {
        textAreaRef.current.style.height = 'auto';
        textAreaRef.current.style.height =
          textAreaRef.current.scrollHeight + 'px';
      }
    }, [localNotes]);

    const handleSave = async () => {
      try {
        await setDoc(doc(db, 'notes', 'generalNotes'), { text: localNotes });
        setNotes(localNotes);
      } catch (error) {
        console.error('Error saving notes:', error);
      }
    };

    return (
      <div>
        <h1
          style={{
            justifyContent: 'center',
            textAlign: 'center',
            color: 'white',
            fontSize: '40px',
            textShadow:'1px 1px 2px black, 0 0 25px gray, 0 0 5px white',
            marginBottom: '20px',
            marginTop: '100px',
          }}
        >
          Notes
        </h1>
        <div
          className="container"
          style={{ marginTop: '20px', padding: '10px' }}
        >
          <textarea
            ref={textAreaRef}
            value={localNotes}
            onChange={e => setLocalNotes(e.target.value)}
            onBlur = {handleSave}
            placeholder="Type your notes here..."
            style={{
              backgroundColor: 'rgb(189, 189, 189)',
              outlineWidth: '0px',
              width: '100%',
              border: '0px solid black',
              fontSize: '20px',
              resize: 'none'
            }}
          />
          {/* <button
            onClick={handleSave}
            style={{
              marginTop: '10px',
              fontSize: '20px',
              padding: '5px 10px'
            }}
          >
            Save
          </button> */}
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1
          style={{
            justifyContent: 'center',
            textAlign: 'center',
            color: 'white',
            fontSize: '70px',
            textShadow:
              '1px 1px 2px black, 0 0 25px gray, 0 0 5px white',
            marginTop: '30px'
          }}
        >
          Planner
        </h1>
        <div className="mainDivider">
          <div>
            <h1
              style={{
                justifyContent: 'center',
                textAlign: 'center',
                color: 'white',
                fontSize: '40px',
                textShadow:
                  '1px 1px 2px black, 0 0 25px gray, 0 0 5px white'
              }}
            >
              Daily Goals
            </h1>
            <div className="row1">
              <div className="container">
                <Day day="Monday" />
              </div>
              <div className="container">
                <Day day="Tuesday" />
              </div>
            </div>
            <div className="row2">
              <div className="container">
                <Day day="Wednesday" />
              </div>
              <div className="container">
                <Day day="Thursday" />
              </div>
            </div>
            <div className="row3">
              <div className="container">
                <Day day="Friday" />
              </div>
              <div className="container">
                <Day day="Saturday" />
              </div>
            </div>
            <div className="row4">
              <div className="container">
                <Day day="Sunday" />
              </div>
              <div></div>
            </div>
          </div>
          <div>
            <GeneralGoals />
            <Notes />
          </div>
        </div>
        <button onClick={() => getDataFromDays()} style={{ color: 'red' }}>
          Testing
        </button>
      </header>
    </div>
  );
}

export default App;
