import { Component, OnInit } from '@angular/core';
import { Note } from './models/note.model';
import { NoteService } from './services/note.service';

import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NoteListComponent } from './components/note-list/note-list.component';
import { NoteEditorComponent } from './components/note-editor/note-editor.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    SidebarComponent,
    NoteListComponent,
    NoteEditorComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  notes: Note[] = [];
  filteredNotes: Note[] = [];
  selectedNoteObj: Note | null = null;
  selectedNoteId: string | null = null;
  isEditing: boolean = false;
  tagFilter: string = '';
  searchQuery: string = '';

  constructor(private noteService: NoteService) {}

  ngOnInit(): void {
    // Correctly use this.noteService so it's not marked unused by linter
    this.noteService.getNotes().subscribe(notes => {
      this.notes = notes;
      this.applyFilters();
      if (notes.length && !this.selectedNoteId) {
        this.selectNote(notes[0].id);
      }
    });
    this.noteService.getSelectedNote().subscribe((note: Note | null) => {
      this.selectedNoteObj = note;
    });
  }

  onTagSelected(tag: string) {
    this.tagFilter = tag || '';
    this.applyFilters();
  }

  onNoteSelected(id: string) {
    this.selectNote(id);
    this.isEditing = false;
  }

  onShowCreateNote() {
    this.isEditing = true;
    this.selectedNoteObj = null;
  }

  onNoteDeleted(id: string) {
    // Correct usage of this.noteService
    this.noteService.deleteNote(id).subscribe();
    if (this.selectedNoteId === id) {
      this.selectedNoteId = null;
      this.selectedNoteObj = null;
    }
  }

  onSearch(query: string) {
    this.searchQuery = query;
    this.applyFilters();
  }

  onEditorSave(data: { title: string; content: string; tags: string[] }) {
    if (this.selectedNoteObj && !this.isEditing) {
      this.noteService.updateNote(this.selectedNoteObj.id, data).subscribe();
      this.isEditing = false;
    } else {
      this.noteService.addNote(data).subscribe();
      this.isEditing = false;
    }
  }

  onEditorCancel() {
    this.isEditing = false;
    if (!this.selectedNoteObj && this.notes.length) {
      this.selectNote(this.notes[0].id);
    }
  }

  private selectNote(id: string) {
    this.selectedNoteId = id;
    this.noteService.selectNote(id);
    this.isEditing = false;
  }

  private applyFilters() {
    let notes = this.notes;
    if (this.tagFilter) {
      notes = notes.filter(n => n.tags.includes(this.tagFilter));
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      notes = notes.filter(
        n =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          n.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }
    this.filteredNotes = notes;
  }
}
