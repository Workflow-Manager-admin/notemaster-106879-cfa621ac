import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Note } from '../models/note.model';

// PUBLIC_INTERFACE
@Injectable({
  providedIn: 'root'
})
/**
 * NoteService handles all CRUD operations and in-memory note state.
 */
export class NoteService {
  private notes$ = new BehaviorSubject<Note[]>([]);
  private selectedNoteId$ = new BehaviorSubject<string | null>(null);

  constructor() {
    // Load dummy notes for initial testing
    const now = new Date();
    const sampleNotes: Note[] = [
      {
        id: '1',
        title: 'Welcome to NoteMaster',
        content: 'This is your first note. Edit or create more!',
        createdAt: now,
        updatedAt: now,
        tags: ['welcome'],
      },
      {
        id: '2',
        title: 'Shopping List',
        content: '- Milk\n- Bread\n- Eggs',
        createdAt: now,
        updatedAt: now,
        tags: ['personal', 'shopping'],
      }
    ];
    this.notes$.next(sampleNotes);
  }

  // PUBLIC_INTERFACE
  getNotes(): Observable<Note[]> {
    /** Returns the list of all notes. */
    return this.notes$.asObservable();
  }

  // PUBLIC_INTERFACE
  selectNote(id: string) {
    /** Selects a note by its id */
    this.selectedNoteId$.next(id);
  }

  // PUBLIC_INTERFACE
  getSelectedNote(): Observable<Note | null> {
    /** Gets the currently selected note as observable */
    return this.selectedNoteId$.pipe(
      map(id => {
        if (!id) return null;
        const notes = this.notes$.getValue();
        return notes.find(n => n.id === id) || null;
      }),
    );
  }

  // PUBLIC_INTERFACE
  addNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Observable<Note> {
    /** Creates a new note. */
    const id = String(Date.now()) + Math.floor(Math.random() * 10000);
    const now = new Date();
    const newNote: Note = {
      ...note,
      id,
      createdAt: now,
      updatedAt: now
    };
    const notes = [newNote, ...this.notes$.getValue()];
    this.notes$.next(notes);
    this.selectNote(newNote.id);
    return of(newNote);
  }

  // PUBLIC_INTERFACE
  updateNote(id: string, data: Partial<Omit<Note, 'id' | 'createdAt' | 'updatedAt'>>): Observable<Note | null> {
    /** Updates an existing note. */
    const notes = this.notes$.getValue().map(n =>
      n.id === id ? { ...n, ...data, updatedAt: new Date() } : n
    );
    const updated = notes.find(n => n.id === id) || null;
    this.notes$.next(notes);
    return of(updated);
  }

  // PUBLIC_INTERFACE
  deleteNote(id: string): Observable<boolean> {
    /** Deletes a note by its id. */
    const notes = this.notes$.getValue().filter(n => n.id !== id);
    this.notes$.next(notes);
    if (this.selectedNoteId$.getValue() === id) {
      this.selectedNoteId$.next(null);
    }
    return of(true);
  }

  // PUBLIC_INTERFACE
  searchNotes(query: string): Observable<Note[]> {
    /** Returns notes filtered by title or content matching the query. */
    const q = query.trim().toLowerCase();
    const matches = this.notes$.getValue().filter(
      n =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.tags.some(tag => tag.toLowerCase().includes(q))
    );
    return of(matches);
  }

  // PUBLIC_INTERFACE
  getAllTags(): Observable<string[]> {
    /** Returns a unique list of all tags from notes */
    const notes = this.notes$.getValue();
    const tags = Array.from(new Set(notes.flatMap(n => n.tags)));
    return of(tags);
  }
}
