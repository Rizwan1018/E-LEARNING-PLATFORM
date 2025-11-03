
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AssessmentService } from '../../../services/assessment.service';
import { Assessment } from '../../../models/assessment';

@Component({
  selector: 'app-assessment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './assessment-form.component.html',
})
export class AssessmentFormComponent implements OnInit {
  submitted = false;

  // Build in ngOnInit (avoid "fb used before init" errors)
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: AssessmentService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  /** Convenience getters */
  get editing(): boolean {
    return !!this.form?.get('id')?.value;
  }
  get questions(): FormArray<FormGroup> {
    return this.form.get('questions') as FormArray<FormGroup>;
  }
  getOptions(i: number): FormArray {
    return this.questions.at(i).get('options') as FormArray;
  }

  ngOnInit() {
    // Root form
    this.form = this.fb.group({
      id: [null],
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      questions: this.fb.array<FormGroup>([]),
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.service.getAssessment(id).subscribe((a) => this.loadAssessment(a));
    } else {
      // Start with one question (4 options)
      this.addQuestion();
    }
  }

  /** Load for Edit */
  private loadAssessment(a: Assessment) {
    this.questions.clear();
    (a.questions || []).forEach((q) => this.questions.push(this.createQuestionGroup(q)));

    this.form.patchValue({
      id: (a as any).id ?? null,
      title: a.title ?? '',
      description: a.description ?? '',
    });
  }

  /** Build question group (STRICT: all options required; correctAnswer must be within range) */
  private createQuestionGroup(q?: { text: string; options: string[]; correctAnswer: number }): FormGroup {
    const optionsValues = q?.options?.length ? q.options : ['', '', '', ''];

    const group = this.fb.group(
      {
        text: [q?.text || '', [Validators.required, Validators.minLength(3)]],
        options: this.fb.array(
          optionsValues.map((opt) => this.fb.control(opt, [Validators.required]))
        ),
        correctAnswer: [q?.correctAnswer ?? 0, [Validators.required]],
      },
      { validators: [correctAnswerInRangeValidator] }
    );

    // Keep validator in sync when options change
    (group.get('options') as FormArray).valueChanges.subscribe(() => {
      group.get('correctAnswer')?.updateValueAndValidity({ onlySelf: true });
      group.updateValueAndValidity({ onlySelf: true });
    });

    return group;
  }

  /** Add/remove question */
  addQuestion() {
    this.questions.push(this.createQuestionGroup());
    this.form.updateValueAndValidity();
  }
  removeQuestion(i: number) {
    this.questions.removeAt(i);
    this.form.updateValueAndValidity();
  }

  /** Submit */
  onSubmit() {
    this.submitted = true;
    this.form.updateValueAndValidity({ onlySelf: false });

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      // Log which controls are invalid for quick debugging
      console.warn('Form invalid. Reasons:', this.collectErrors(this.form));
      // Optional UX: scroll to first error
      setTimeout(() => {
        const firstInvalid = document.querySelector('.is-invalid, .invalid-feedback.d-block');
        firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
      return;
    }

    const payload: Assessment = this.toAssessmentPayload();

    const obs = payload.id
      ? this.service.updateAssessment(payload)
      : this.service.addAssessment(payload);

    obs.subscribe({
      next: () => {
        this.submitted = false;
        this.router.navigate(['instructor/add-assessment']);
      },
      error: (err) => {
        console.error('Save failed:', err);
      }
    });
  }

  /** Normalize payload */
  private toAssessmentPayload(): Assessment {
    const raw = this.form.getRawValue();

    const cleanedQuestions = (raw.questions || []).map((q: any) => ({
      text: (q.text || '').trim(),
      options: (q.options || []).map((o: any) => String(o ?? '').trim()),
      correctAnswer: Number(q.correctAnswer),
    }));

    return {
      id: raw.id ?? undefined,
      title: (raw.title || '').trim(),
      description: (raw.description || '').trim(),
      questions: cleanedQuestions,
    } as Assessment;
  }

  /** Template helpers */
  ctrl(path: string | (string | number)[]): AbstractControl | null {
    return Array.isArray(path) ? this.form.get(path as any) : this.form.get(path);
  }
  showInvalid(c: AbstractControl | null): boolean {
    return !!c && c.invalid && (c.touched || c.dirty || this.submitted);
  }

  /** Debug: collect all errors */
  private collectErrors(control: AbstractControl, path: string[] = []): any[] {
    const out: any[] = [];
    if (control instanceof FormGroup) {
      Object.keys(control.controls).forEach((key) => {
        out.push(...this.collectErrors(control.get(key)!, [...path, key]));
      });
      if (control.errors) out.push({ path, errors: control.errors });
    } else if (control instanceof FormArray) {
      control.controls.forEach((c, i) => out.push(...this.collectErrors(c, [...path, String(i)])));
      if (control.errors) out.push({ path, errors: control.errors });
    } else {
      if (control.errors) out.push({ path, errors: control.errors });
    }
    return out;
  }
}

/** -------- Validator: correctAnswer must be 0..options.length-1 -------- */
function correctAnswerInRangeValidator(group: AbstractControl): ValidationErrors | null {
  const g = group as FormGroup;
  const optionsFA = g.get('options') as FormArray | null;
  const ansCtrl = g.get('correctAnswer');

  if (!optionsFA || !ansCtrl) return null;

  const len = optionsFA.length;
  const ans = Number(ansCtrl.value);

  if (Number.isNaN(ans)) return { answerNotNumber: true };
  if (ans < 0 || ans >= len) return { answerOutOfRange: { min: 0, max: len - 1 } };

  return null;
}
