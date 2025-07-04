import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: true,
  imports: [CommonModule],
})
/**
 * Sidebar with tags and create note button
 */
export class SidebarComponent implements OnInit {
  tags: string[] = [];
  selectedTag: string | null = null;
  @Output() tagSelected = new EventEmitter<string>();
  @Output() createNote = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {
    // Place tag fetching logic here if needed
  }

  selectTag(tag: string) {
    this.selectedTag = tag;
    this.tagSelected.emit(tag);
  }

  clearTag() {
    this.selectedTag = null;
    this.tagSelected.emit('');
  }

  onCreateNote() {
    this.createNote.emit();
  }
}

