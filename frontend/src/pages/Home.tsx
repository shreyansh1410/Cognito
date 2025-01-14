// Home.tsx
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { NoteCard } from "../components/NoteCard";
import { fetchContents } from "../store/contentSlice";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Loader2 } from "lucide-react";

export function Home() {
  const dispatch = useDispatch<AppDispatch>(); // Type the dispatch
  const notes = useSelector((state: RootState) => state.notes.notes);
  const {
    items: content,
    loading,
    error,
  } = useSelector((state: RootState) => state.content);

  useEffect(() => {
    dispatch(fetchContents());
  }, [dispatch]);

  return (
    <div>
      {loading === "pending" && (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <NoteCard key={note.id} {...note} />
        ))}
        {content.map((item) => (
          <NoteCard
            key={item.id}
            id={item.id}
            title={item.title}
            type={item.type as "document" | "tweet" | "video"}
            tags={item.tags}
            date={new Date().toLocaleDateString()}
            content={`Link: ${item.link}`}
          />
        ))}
      </div>
    </div>
  );
}
