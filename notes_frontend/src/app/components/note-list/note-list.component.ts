import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Note } from '../../models/note.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
/**
 * Displays a list of notes and supports note selection, search, and deletion.
 */
export class NoteListComponent {
  @Input() notes: Note[] = [];
  @Input() selectedNoteId: string | null = null;

  @Output() noteSelected = new EventEmitter<string>();
  @Output() noteDeleted = new EventEmitter<string>();
  @Output() search = new EventEmitter<string>();

  searchQuery = '';

  onNoteClick(id: string) {
    this.noteSelected.emit(id);
  }

  onDeleteClick(event: Event, id: string) {
    event.stopPropagation();
    this.noteDeleted.emit(id);
  }

  onSearchChange() {
    this.search.emit(this.searchQuery);
  }
}

