import WorkoutList from "./components/WorkoutList";
import WorkoutForm from "./components/WorkoutForm";

function App() {
  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-4xl font-bold mb-6 text-center">ActiveFlow</h1>
      <WorkoutForm />
      <hr className="my-6" />
      <WorkoutList />
    </div>
  );
}

export default App;
