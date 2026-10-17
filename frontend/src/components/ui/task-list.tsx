import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface Task {
  title: string;
  description?: string;
  href: string;
}

export function TaskList({ tasks }: { tasks: readonly Task[] }) {
  return <ul className="task-list">{tasks.map(task => <li key={task.href}>
    <Link to={task.href}>
      <div className="min-w-0">
        <h3 className="task-title">{task.title}</h3>
        {task.description && <p className="task-description">{task.description}</p>}
      </div>
      <ArrowRight size={20} aria-hidden="true" className="shrink-0 text-accent" />
    </Link>
  </li>)}</ul>;
}
