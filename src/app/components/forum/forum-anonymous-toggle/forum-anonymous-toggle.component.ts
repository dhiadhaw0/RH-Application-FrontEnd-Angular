import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-forum-anonymous-toggle',
  templateUrl: './forum-anonymous-toggle.component.html',
  styleUrl: './forum-anonymous-toggle.component.scss'
})
export class ForumAnonymousToggleComponent {
  @Input() isAnonymous = false;
  @Input() disabled = false;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() showLabel = true;

  @Output() anonymousChange = new EventEmitter<boolean>();

  onToggle(): void {
    if (!this.disabled) {
      this.isAnonymous = !this.isAnonymous;
      this.anonymousChange.emit(this.isAnonymous);
    }
  }

  getToggleClasses(): string {
    let classes = `anonymous-toggle ${this.size}`;

    if (this.isAnonymous) {
      classes += ' active';
    }

    if (this.disabled) {
      classes += ' disabled';
    }

    return classes;
  }
}
