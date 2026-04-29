import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { SelectionService } from '../selection.service';

@Component({
  selector: 'app-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.css']
})
export class RadioButtonComponent implements OnInit {

  modalRef: MdbModalRef<ModalComponent> | null = null;

  constructor(private modalService: MdbModalService, private selectionService: SelectionService) { }

  ngOnInit(): void {
  }

  form = new FormGroup({
    gender: new FormControl('', Validators.required)
  });

  get f(){
    return this.form.controls;
  }

  submit(){
    console.log(this.form.value);
  }

  updateOnclickGen(e: { target: { value: any; }; }) {
    console.log(e.target.value);
  }

  openModal() {
    this.modalRef = this.modalService.open(ModalComponent);

    // Try to inject the current selection into the modal component instance
    try {
      const comp = (this.modalRef as any).componentInstance;
      if (comp) {
        comp.selection = this.form.value.gender;
      }
    } catch (e) {
      // ignore if the modal implementation doesn't expose componentInstance
    }

    // Handle result when modal closes
    try {
      const sub = (this.modalRef as any).onClose?.subscribe((res: any) => {
        if (res?.saved) {
          console.log('Saved selection from modal:', res.selection);
          // persist to localStorage as a quick fallback
          try { localStorage.setItem('radioSelection', res.selection ?? ''); } catch (e) {}
          // persist to backend
          this.selectionService.saveSelection(res.selection).subscribe((resp) => {
            if (resp && resp.error) {
              this.showSnackbar('Failed to save to server (saved locally)');
            } else {
              this.showSnackbar('Saved to server');
            }
          });
        }
        sub?.unsubscribe?.();
      });
    } catch (e) {
      // ignore if onClose isn't available
    }
  }

  // Snackbar state
  snackbarVisible = false;
  snackbarMessage = '';

  showSnackbar(message: string, duration = 2500) {
    this.snackbarMessage = message;
    this.snackbarVisible = true;
    setTimeout(() => this.snackbarVisible = false, duration);
  }


}
