import { Component, ElementRef, Renderer2 } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  // optional incoming selection from parent
  selection?: string | null = null;

  constructor(public modalRef: MdbModalRef<ModalComponent>, private el: ElementRef, private renderer: Renderer2) {}

  private waitForAnimationEnd(host: HTMLElement, timeout = 600) {
    return new Promise<void>((resolve) => {
      let finished = false;
      const onEnd = (ev: AnimationEvent) => {
        if (ev.target === host) {
          finished = true;
          host.removeEventListener('animationend', onEnd as any);
          resolve();
        }
      };
      host.addEventListener('animationend', onEnd as any);
      // safety fallback
      setTimeout(() => {
        if (!finished) resolve();
      }, timeout);
    });
  }

  private async closeWithAnimation(result?: any) {
    const host: HTMLElement | null = this.el.nativeElement.querySelector('.modal-custom');
    if (host) {
      this.renderer.addClass(host, 'closing');
      await this.waitForAnimationEnd(host, 600);
      this.modalRef.close(result);
    } else {
      this.modalRef.close(result);
    }
  }

  save() {
    this.closeWithAnimation({ saved: true, selection: this.selection });
  }

  cancel() {
    this.closeWithAnimation({ saved: false });
  }
}
