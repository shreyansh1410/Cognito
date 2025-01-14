import { useSelector } from "react-redux";
import { RootState } from "../store";
import { NoteCard } from "../components/NoteCard";

export function Home() {
  const notes = useSelector((state: RootState) => state.notes.notes);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {notes.map((note) => (
        <NoteCard key={note.id} {...note} />
      ))}
    </div>
  );
}
