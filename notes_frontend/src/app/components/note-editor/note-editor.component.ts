import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { Note } from '../../models/note.model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-note-editor',
  templateUrl: './note-editor.component.html',
  styleUrls: ['./note-editor.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePipe],
  providers: [DatePipe]
})
/**
 * Editor for creating and editing notes (title, content, tags).
 */
export class NoteEditorComponent implements OnChanges {
  @Input() note: Note | null = null;
  @Input() isEditing: boolean = false;
  @Output() save = new EventEmitter<{ title: string; content: string; tags: string[] }>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;

  constructor(fb: FormBuilder) {
    this.form = fb.group({
      title: [''],
      content: [''],
      tags: [''],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    // Update form if new note is loaded
    if (changes['note'] && this.note) {
      this.form.setValue({
        title: this.note.title,
        content: this.note.content,
        tags: this.note.tags.join(', '),
      });
    } else if (this.isEditing && !this.note) {
      this.form.reset();
    }
  }

  onSubmit() {
    const value = this.form.value;
    const tags = value.tags
      .split(',')
      .map((t: string) => t.trim())
      .filter((t: string) => !!t);
    this.save.emit({ title: value.title, content: value.content, tags });
  }
  onCancel() {
    this.cancel.emit();
  }
}
